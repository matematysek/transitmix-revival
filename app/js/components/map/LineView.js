app.LineView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'change:coordinates', this.render);

    this.line = L.multiPolyline({}, {
      color: this.model.get('color'),
      opacity: 0.5,
      weight: 5,
    }).addTo(app.leaflet);

    this.line.on('click', this.selectLine, this);
  },

  render: function() {
    this.line.setLatLngs(this.model.get('coordinates'));
    return this;
  },

  selectLine: function() {
    app.events.trigger('map:selectLine', this.model.id);
  },

  remove: function() {
    this.line.off('click', this.select, this);
    app.leaflet.removeLayer(this.line);
    Backbone.View.prototype.remove.apply(this, arguments);
  },
});
