app.Map = Backbone.Model.extend({
  urlRoot: '/api/maps',

  defaults: function() {
    var serviceWindows = new app.ServiceWindows([
      { name: 'Morning',  from: '4am',  to: '6am',  headway: 30, enabled: false },
      { name: 'AM Peak',  from: '6am',  to: '9am',  headway: 10, enabled: true  },
      { name: 'Midday',   from: '9am',  to: '3pm',  headway: 15, enabled: true  },
      { name: 'PM Peak',  from: '3pm',  to: '6pm',  headway: 10, enabled: true  },
      { name: 'Evening',  from: '6pm',  to: '8pm',  headway: 15, enabled: true  },
      { name: 'Night',    from: '8pm',  to: '2am', headway: 30, enabled: false },

      { name: 'Sat. AM',  from: '4am',  to: '6am',  headway: 30, enabled: false, isSaturday: true },
      { name: 'Saturday', from: '6am',  to: '9pm',  headway: 15, enabled: true,  isSaturday: true },
      { name: 'Sat. PM',  from: '9pm',  to: '2am', headway: 30, enabled: false, isSaturday: true },
      { name: 'Sun. AM',  from: '4am',  to: '6am',  headway: 30, enabled: false, isSunday: true },
      { name: 'Sunday',   from: '6am',  to: '9pm',  headway: 15, enabled: true,  isSunday: true },
      { name: 'Sun. PM',  from: '9pm',  to: '2am', headway: 30, enabled: false, isSunday: true },
    ]);

    return {
      center: [],
      lines: undefined,
      name: '',
      remixedFromId: undefined,
      zoomLevel: 14,

      // Line-level settings
      serviceWindows: serviceWindows,
      hourlyCost: 120,
      layover: 0.10,
      speed: 10.0,
      weekdaysPerYear: 255,
      saturdaysPerYear: 55,
      sundaysPerYear: 55,

      // TODO: Move to user-settings, when we have users
      preferServiceHours: false,
    };
  },

  initialize: function() {
    // Automatically save after changes, at most once per second
    var debouncedSaved = _.debounce(function() { this.save(); }, 1000);
    this.on('change', debouncedSaved, this);
  },

  parse: function(response) {
    // Use any existing nested models; create them otherwise.
    var lines = this.get('lines');
    if (!lines && response.lines) {
      lines = new app.Lines(response.lines, { parse: true });
      lines.map = this;
    }

    var serviceWindows = this.get('serviceWindows');
    if (!serviceWindows && response.service_windows) {
      serviceWindows = new app.ServiceWindows(response.service_windows);
    }

    var attrs = {
      id: response.id,
      center: response.center,
      lines: lines,
      name: response.name,
      remixedFromId: response.remixed_from_id,
      zoomLevel: response.zoom_level,

      hourlyCost: response.hourly_cost,
      layover: response.layover,
      speed: response.speed,
      weekdaysPerYear: response.weekdays_per_year,
      saturdaysPerYear: response.saturdays_per_year,
      sundaysPerYear: response.sundays_per_year,

      preferServiceHours: response.prefer_service_hours,
    };

    return app.utils.removeUndefined(attrs);
  },

  toJSON: function() {
    // Everything except Lines, which are saved in their own models
    var attrs = this.attributes;
    return {
      id: attrs.id,
      center: attrs.center,
      name: attrs.name,
      remixed_from_id: attrs.remixedFromId,
      zoom_level: attrs.zoomLevel,

      service_windows: attrs.serviceWindows,
      hourly_cost: attrs.hourlyCost,
      layover: attrs.layover,
      speed: attrs.speed,

      weekdays_per_year: attrs.weekdaysPerYear,
      saturdays_per_year: attrs.saturdaysPerYear,
      sundays_per_year: attrs.sundaysPerYear,

      prefer_service_hours: attrs.preferServiceHours,
    };
  },

  getLineDefaults: function() {
    var enabled = this.get('serviceWindows').where({ enabled: true });
    var cloned = _.map(enabled, function(item) { return item.toJSON(); });
    var filteredWindows = new app.ServiceWindows(cloned);

    return {
      mapId: this.id,
      serviceWindows: filteredWindows,
      layover: this.get('layover'),
      speed: this.get('speed'),
      hourlyCost: this.get('hourlyCost'),
      weekdaysPerYear: this.get('weekdaysPerYear'),
      saturdaysPerYear: this.get('saturdaysPerYear'),
      sundaysPerYear: this.get('sundaysPerYear'),
    };
  },

  // Apply the defaults to all the lines
  applyDefaultsToAll: function() {
    this.get('lines').forEach(function(line) {
      line.set(this.getLineDefaults());
    }, this);
  },
});
