app.MapView = Backbone.View.extend({
  initialize: function() {
    this.listenTo(this.model, 'select', this.renderSelect);
    this.listenTo(this.model, 'unselect', this.renderUnselect);
    this.listenTo(this.model.get('lines'), 'add', this.renderLines);

    app.leaflet.setView(this.model.get('center'), this.model.get('zoomLevel'));

    this.lines = [];
  },

  events: {
    'click .newMap': 'newMap',
  },

  render: function() {
    var lines = this.model.get('lines');
    lines.forEach(this.renderLines, this);

    if (this.model.getSelected()) {
      this.renderSelect();
    } else {
      this.renderUnselect();
    }

    return this;
  },

  renderLines: function(line) {
    var view = new app.LineView({ model: line });
    view.render();
    this.lines.push(view);
  },

  renderUnselect: function() {
    if (this.sidebar) this.sidebar.remove();
    this.sidebar = new app.MapSidebarView({ model: this.model });
    this.$el.html(this.sidebar.render().el);
    this.renderNewMap();

    if (this.selectedLine) this.selectedLine.remove();
  },

  renderSelect: function() {
    var line = this.model.getSelected();

    if (this.sidebar) this.sidebar.remove();
    this.sidebar = new app.LineSidebarView({ model: line });
    this.$el.html(this.sidebar.render().el);
    this.renderNewMap();

    if (this.selectedLine) this.selectedLine.remove();
    this.selectedLine = new app.SelectedLineView({ model: line });
    this.selectedLine.render();
  },

  renderNewMap: function() {
    this.$el.append('<div class="newMap">New Map</div>');
  },

  newMap: function() {
    app.router.navigate('/', { trigger: true });
  },

  remove: function() {
    this.lines.forEach(function(view) { view.remove(); });
    if (this.selectedLine) this.selectedLine.remove();
    if (this.sidebar) this.sidebar.remove();
    Backbone.View.prototype.remove.apply(this, arguments);
  }
});
