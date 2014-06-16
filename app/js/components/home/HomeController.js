app.HomeController = app.Controller.extend({
  initialize: function() {
    this.listenTo(app.events, 'home:createMap', this.createMap);
    this.setupViews();
  },

  setupViews: function() {
    this.homeView = new app.HomeView();
    $('body').append(this.homeView.render().el);
  },

  createMap: function(city) {
    app.utils.geocode(city, function(latlng, name) {
      var map = new app.Map({ name: name, center: latlng });
      map.save({}, { success: _.bind(this.switchToMap, this) });
    }, this);
  },

  switchToMap: function(map) {
    app.events.trigger('app:showPreloadedMap', map);
  },

  teardownViews: function() {
    this.homeView.remove();
  },
});
