app.MapController = app.Controller.extend({
  initialize: function(options) {
    this.listenTo(app.events, 'map:selectLine',      this.selectLine);
    this.listenTo(app.events, 'map:clearSelection',  this.clearSelection);
    this.listenTo(app.events, 'map:addLine',         this.addLine);
    this.listenTo(app.events, 'map:deleteLine',      this.deleteLine);

    if (options.map) {
      this.map = options.map;
      this.setupViews(options.lineId);
    } else {
      var afterFetch = function() { this.setupViews(options.lineId); };
      this.map = new app.Map({ id: options.mapId });
      this.map.fetch({ success: _.bind(afterFetch, this) });
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
    var HomeButtonView = app.BaseView.extend({
      template: _.template('<div class="showHome">New Map</div>'),
      events: { 'click': 'showHome' },
      showHome: function() { app.events.trigger('app:showHome'); }
    });
    this.homeButtonView = new HomeButtonView();
    $('body').append(this.homeButtonView.render().el);

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

  teardownViews: function() {
    this._teardownSelectionViews();
    this.linesView.remove();
    this.homeButtonView.remove();
  },
});
