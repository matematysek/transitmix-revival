app.Map = Backbone.Model.extend({
  urlRoot: '/api/maps',

  defaults: {
    center: [],
    hourlyCost: 120,
    layover: 0.10,
    lines: undefined,
    name: '',
    remixedFromId: undefined,
    zoomLevel: 14,
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

    var attrs = {
      id: response.id,
      center: response.center,
      hourlyCost: response.hourly_cost,
      layover: response.layover,
      lines: lines,
      name: response.name,
      remixedFromId: response.remixed_from_id,
      zoomLevel: response.zoom_level,
    };

    return app.utils.removeUndefined(attrs);
  },

  toJSON: function() {
    // Everything except Lines, which are saved in their own models
    var attrs = this.attributes;
    return {
      id: attrs.id,
      center: attrs.center,
      hourly_cost: attrs.hourlyCost,
      layover: attrs.layover,
      name: attrs.name,
      remixed_from_id: attrs.remixedFromId,
      zoom_level: attrs.zoomLevel,
    };
  },
});
