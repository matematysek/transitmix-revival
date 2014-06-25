app.MapController = app.Controller.extend({
  initialize: function(options) {
    this.listenTo(app.events, 'map:selectLine',      this.selectLine);
    this.listenTo(app.events, 'map:clearSelection',  this.clearSelection);
    this.listenTo(app.events, 'map:addLine',         this.addLine);
    this.listenTo(app.events, 'map:deleteLine',      this.deleteLine);
    this.listenTo(app.events, 'map:toggleNearby',    this.toggleNearby);
    this.listenTo(app.events, 'map:addNearbyLine',   this.addNearbyLine);

    if (options.map) {
      this.map = options.map;
      this.setupViews(options.lineId);
    } else {
      var afterFetch = function(response) {
        this.map = new app.Map(response, { parse: true });
        this.setupViews(options.lineId);
      };
      $.getJSON('/api/maps/' + options.mapId, _.bind(afterFetch, this));
    }
  },

  setupViews: function(lineId) {
    app.leaflet.setView(this.map.get('center'), this.map.get('zoomLevel'));

    this.linesView = new app.CollectionView({
      collection: this.map.get('lines'),
      view: app.LeafletLineView,
    });
    this.linesView.render();

    // Tiny view for the 'New Map' button in the bottom left
    this.mapExtrasView = new app.MapExtrasView({ model: this.map });
    $('body').append(this.mapExtrasView.render().el);

    this.selectLine(lineId);
  },

  selectLine: function(lineId) {
    if (!lineId) {
      this.clearSelection();
      return;
    }

    this._teardownSelectionViews();

    var selectedLine = this.map.get('lines').get(lineId);
    this.editableLine = new app.LeafletEditableLineView({ model: selectedLine });
    this.editableLine.render();

    this.lineDetailsView = new app.LineDetailsView({ model: selectedLine });
    $('body').append(this.lineDetailsView.render().el);

    this.router.navigate('/map/' + this.map.id + '/line/' + lineId);
  },

  clearSelection: function() {
    this._teardownSelectionViews();

    this.mapDetailsView = new app.MapDetailsView({ model: this.map });
    $('body').append(this.mapDetailsView.render().el);

    this.router.navigate('/map/' + this.map.id);
  },

  _teardownSelectionViews: function() {
    if (this.editableLine) this.editableLine.remove();
    if (this.lineDetailsView) this.lineDetailsView.remove();
    if (this.mapDetailsView) this.mapDetailsView.remove();
  },

  addLine: function() {
    var afterSave = function(line) { app.events.trigger('map:selectLine', line.id); };
    var lines = this.map.get('lines');
    lines.create({ mapId: this.map.id }, { success: afterSave });
  },

  deleteLine: function(lineId) {
    var line = this.map.get('lines').get(lineId);
    line.destroy();
    this.clearSelection();
  },

  // Loads nearby agencies & lines, then creates an associated view for them.
  _cachedNearby: undefined,

  toggleNearby: function(center) {
    if (this.showingNearby) {
      this.hideNearby();
    } else {
      this.showNearby(center);
    }
    this.showingNearby = !this.showingNearby;
  },

  showNearby: function(latlng) {
    if (this._cachedNearby) {
      this._showNearby(this._cachedNearby);
      return;
    }

    app.utils.getNearbyGTFS(latlng, function(nearby) {
      this._cachedNearby = nearby;
      this._showNearby(nearby);
    }, this);
  },

  _showNearby: function(nearby) {
    var maps = new app.Maps(nearby, { parse: true });
    this.nearbyView = new app.NearbyView({ collection: maps });
    $('body').append(this.nearbyView.render().el);
  },

  hideNearby: function() {
    this.nearbyView.remove();
  },

  addNearbyLine: function(line) {
    app.utils.getNearbyCoordinates(line.get('mapId'), line.id, function(coordinates) {
      var lines = this.map.get('lines');
      var attrs = _.clone(line.attributes);
      delete attrs.id;

      _.extend(attrs, {
        mapId: this.map.id,
        coordinates: coordinates,
      });

      var afterCreate = function(line) {
        app.events.trigger('map:selectLine', line.id);
      };
      lines.create(attrs, { success: afterCreate });
    }, this);
  },


  teardownViews: function() {
    this._teardownSelectionViews();
    this.linesView.remove();
    if (this.nearbyView) this.nearbyView.remove();
    this.mapExtrasView.remove();
  },
});
