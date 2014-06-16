app.Router = Backbone.Router.extend({
  routes: {
    'map/:mapid/line/:lineid(/)': 'map',
    'map/:mapid(/)': 'map',
    '': 'home',
    '*default': 'error'
  },

  map: function(mapId, lineId) {
    mapId = parseInt(mapId, 10);
    app.events.trigger('app:showMap', mapId, lineId);
  },

  home: function() {
    app.events.trigger('app:showHome');
  },

  error: function() {
    console.log('Route not found. Mild moment of panic.');
  },

  // Override navigate to always send information to Google Analytics
  navigate: function(fragment) {
    var samePage = fragment === '/' + Backbone.history.getFragment();
    if (typeof ga !== 'undefined' && !samePage) {
      ga('send', 'pageview', { page: fragment });
    }
    Backbone.Router.prototype.navigate.apply(this, arguments);
  },
});
