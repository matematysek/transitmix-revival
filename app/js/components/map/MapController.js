app.MapController = app.Controller.extend({
  initialize: function(options) {
    this.listenTo(app.events, 'map:selectLine',      this.selectLine);
    this.listenTo(app.events, 'map:clearSelection',  this.clearSelection);
    this.listenTo(app.events, 'map:addLine',         this.addLine);
    this.listenTo(app.events, 'map:deleteLine',      this.deleteLine);
    this.listenTo(app.events, 'map:remix',           this.remix);

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
      view: app.LineView,
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
    this.selectedLineView = new app.SelectedLineView({ model: selectedLine });
    this.selectedLineView.render();

    this.lineSidebarView = new app.LineSidebarView({ model: selectedLine });
    $('body').append(this.lineSidebarView.render().el);

    this.router.navigate('/map/' + this.map.id + '/line/' + lineId);
  },

  clearSelection: function() {
    this._teardownSelectionViews();

    this.mapSidebarView = new app.MapSidebarView({ model: this.map });
    $('body').append(this.mapSidebarView.render().el);

    this.router.navigate('/map/' + this.map.id);
  },

  _teardownSelectionViews: function() {
    if (this.selectedLineView) this.selectedLineView.remove();
    if (this.lineSidebarView) this.lineSidebarView.remove();
    if (this.mapSidebarView) this.mapSidebarView.remove();
  },

  addLine: function() {
    var afterSave = function(line) { this.selectLine(line.id); };
    var lines = this.map.get('lines');
    lines.create({ mapId: this.map.id }, { success: _.bind(afterSave, this) });
  },

  deleteLine: function(lineId) {
    var line = this.map.get('lines').get(lineId);
    line.destroy();
    this.clearSelection();
  },

  remix: function() {
    var url = '/api/maps/' + this.map.id + '/remix';
    $.post(url, _.bind(this._finishRemix, this));
  },

  _finishRemix: function(resp) {
    var message = 'Now editing a freshly-made duplicate of the original map.';
    app.events.trigger('app:showNotification', message);

    var map = new app.Map(resp, { parse: true });
    app.events.trigger('app:showPreloadedMap', map);
  },

  teardownViews: function() {
    this._teardownSelectionViews();
    this.linesView.remove();
    this.homeButtonView.remove();
  },
});
