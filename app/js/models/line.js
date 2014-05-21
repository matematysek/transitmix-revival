// A line is an always-routed set of latlngs, stored in a 'coordinates'
// field, using a GeoJSON multilinestring represntation. Just give it a set
// of waypoints to navigate through, and it'll handle the rest.
app.Line = Backbone.Model.extend({
  urlRoot: '/api/lines',

  defaults: function() {
    // For now, just randomly assign each line a color.
    // Colors are: red, green, purple, blue
    var colors = ['#AD0101', '#0D7215', '#4E0963', '#0071CA'];
    var randomColor = _.sample(colors);

    var names = app.DEFAULT_LINE_NAMES;
    var randomName = _.random(10, 99) + ' ' + _.sample(names);

    var serviceWindows = new app.ServiceWindows([
      { name: 'AM Peak', from: '7am', to: '10am', headway: '12' },
      { name: 'Midday', from: '10am', to: '4pm', headway: '20' },
      { name: 'PM Peak', from: '4pm', to: '8pm', headway: '12' },
      { name: 'Evening', from: '8pm', to: '11pm', headway: '30' },
      { name: 'Weekend', from: '8am', to: '11pm', headway: '30', isWeekend: true },
    ]);

    return {
      color: randomColor,
      coordinates: [], // A GeoJSON MultiLineString
      mapId: undefined,
      name: randomName,
      serviceWindows: serviceWindows,
      speed: 12,
    };
  },

  initialize: function() {
    // Automatically save after changes, at most once per second
    var debouncedSaved = _.debounce(function() { this.save(); }, 1000);
    this.on('change', debouncedSaved, this);
    this.get('serviceWindows').on('change', debouncedSaved, this);
  },

  parse: function(response) {
    // Use any existing nested models; create them otherwise.
    var serviceWindows = this.get('serviceWindows');
    if (!serviceWindows) {
      serviceWindows = new app.ServiceWindows(response.service_windows);
    }

    return {
      id: response.id,
      color: response.color,
      coordinates: response.coordinates,
      mapId: response.map_id,
      name: response.name,
      serviceWindows: serviceWindows,
      speed: response.speed,
    };
  },

  toJSON: function() {
    var attrs = this.attributes;
    var serviceWindows = attrs.serviceWindows.toJSON();

    return {
      id: attrs.id,
      color: attrs.color,
      coordinates: attrs.coordinates,
      map_id: attrs.mapId,
      name: attrs.name,
      service_windows: serviceWindows,
      speed: attrs.speed,
    };
  },

  // Extends the line to the given latlng, routing in-between
  addWaypoint: function(latlng) {
    latlng = _.values(latlng);
    var coordinates = _.clone(this.get('coordinates'));

    if (coordinates.length === 0) {
      coordinates.push([latlng]);
      this.save({ coordinates: coordinates });
      return;
    }

    app.utils.getRoute({
      from: _.last(this.getWaypoints()),
      to: latlng,
    }, function(route) {
      coordinates.push(route);
      this.save({ coordinates: coordinates });
    }, this);
  },

  updateWaypoint: function(latlng, index) {
    latlng = _.values(latlng);

    if (index === 0) {
      this._updateFirstWaypoint(latlng);
    } else if (index === this.get('coordinates').length - 1) {
      this._updateLastWaypoint(latlng);
    } else {
      this._updateMiddleWaypoint(latlng, index);
    }
  },

  _updateFirstWaypoint: function(latlng) {
    var coordinates = _.clone(this.get('coordinates'));
    var secondWaypoint = _.last(coordinates[1]);

    app.utils.getRoute({
      from: latlng,
      to: secondWaypoint,
    }, function(route) {
      coordinates[0] = [route[0]];
      coordinates[1] = route;
      this.save({ coordinates: coordinates });
    }, this);
  },

  _updateMiddleWaypoint: function(latlng, index) {
    var coordinates = _.clone(this.get('coordinates'));
    var prevWaypoint = _.last(coordinates[index - 1]);
    var nextWaypoint = _.last(coordinates[index + 1]);

    app.utils.getRoute({
      from: prevWaypoint,
      via: latlng,
      to: nextWaypoint,
    }, function(route) {
      var closest = app.utils.indexOfClosest(route, latlng);
      coordinates[index] = route.slice(0, closest + 1);
      coordinates[index + 1] = route.slice(closest);
      this.save({ coordinates: coordinates });
    }, this);
  },

  _updateLastWaypoint: function(latlng) {
    var coordinates = _.clone(this.get('coordinates'));
    var penultimateWaypoint = _.last(coordinates[coordinates.length - 2]);

    app.utils.getRoute({
      from: penultimateWaypoint,
      to: latlng
    }, function(route) {
      coordinates[coordinates.length - 1] = route;
      this.save({ coordinates: coordinates });
    }, this);
  },

  insertWaypoint: function(latlng, index) {
    var coordinates = _.clone(this.get('coordinates'));
    var prevWaypoint = _.last(coordinates[index - 1]);
    var newSegment = [prevWaypoint, latlng];

    coordinates.splice(index, 0, newSegment);
    this.set({ coordinates: coordinates }, { silent: true });
    this.updateWaypoint(latlng, index);
  },

  removeWaypoint: function(index) {
    var coordinates = _.clone(this.get('coordinates'));

    // If we only have one point, just reset coordinates to an empty array.
    if (coordinates.length === 1) {
      this.model.clearWaypoints();
      return;
    }

    // Drop the first segment, make the second segment just the last waypoint
    if (index === 0) {
      var secondWaypoint = _.last(coordinates[1]);
      coordinates.splice(0, 2, [secondWaypoint]);
      this.save({ coordinates: coordinates });
      return;
    }

    // Just drop the last segment
    if (index === coordinates.length - 1) {
      coordinates.splice(index, 1);
      this.save({ coordinates: coordinates });
      return;
    }

    // For middle waypoints, we drop the segment, then route 
    // the next waypoint, keep it's current location. 
    var nextWaypoint = _.last(coordinates[index + 1]);
    coordinates.splice(index, 1);
    this.set({ coordinates: coordinates }, { silent: true });
    this.updateWaypoint(nextWaypoint, index);
  },

  clearWaypoints: function() {
    // TODO: This fails in strange ways if we're in the middle of waiting
    // for the ajax call for a waypoint update. Need to figure out a
    // way to cancel existing ajax calls.
    this.save({ coordinates: [] });
  },

  getWaypoints: function() {
    var coordinates = this.get('coordinates');
    return _.map(coordinates, _.last);
  },

  getCalculations: function() {
    var attrs = this.attributes;
    var speed = attrs.speed;
    var latlngs = _.flatten(attrs.coordinates, true);
    var distance = app.utils.calculateDistance(latlngs);

    var map = this.collection.map;
    var layover = map.get('layover');
    var hourlyCost = map.get('hourlyCost');

    var calculate = function(sw) {
      var hoursPerDay = app.utils.diffTime(sw.get('from'), sw.get('to')) / 60;
      var roundTripTime = (distance / speed) * (1 + layover) * 60;
      var buses = Math.ceil(roundTripTime / sw.get('headway'));

      var daysPerYear = sw.isWeekend ? 110 : 255;
      var revenueHours = buses * hoursPerDay * daysPerYear;

      var costPerYear = revenueHours * hourlyCost;

      return {
        buses: buses,
        cost: costPerYear,
        revenueHours: revenueHours,
      };
    };

    var perWindow = attrs.serviceWindows.map(calculate);
    var total = _.reduce(perWindow, function(memo, sw) {
      return {
        buses: Math.max(memo.buses || 0, sw.buses),
        cost: (memo.cost || 0) + sw.cost,
        revenueHours: (memo.revenueHours || 0) + sw.revenueHours
      };
    });

    return {
      distance: distance,
      perWindow: perWindow,
      total: total
    };
  },
});
