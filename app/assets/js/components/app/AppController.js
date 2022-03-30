// Controls top-level logic for which views to show at any given time. 
app.AppController = app.Controller.extend({
  initialize: function() {
    this.listenTo(app.events, 'app:showMap',           this.showMap);
    this.listenTo(app.events, 'app:showHome',          this.showHome);
    this.listenTo(app.events, 'app:showNotification',  this.showNotification);
    this.listenTo(app.events, 'app:createMap',         this.createMap);
    this.listenTo(app.events, 'app:remixMap',          this.remixMap);

    this.setupViews();
  },

  setupViews: function() {
    var options = {
      tileLayer: { detectRetina: true },
      infoControl: false,
      boxZoom: false,
    };
    L.mapbox.accessToken = appConfig.mapboxId;
    app.leaflet = L.mapbox.map('map')
      .setView([40, -74.50], 9)
      .addLayer(L.mapbox.styleLayer('mapbox://styles/mapbox/outdoors-v11'));

    this.feedbackView = new app.FeedbackView();
    $('body').append(this.feedbackView.render().el);
  },

  showMap: function(mapId, lineId) {
    // If we're already viewing this map (i.e., back button), avoid loading it a second time
    var isLoaded = this.mapController && this.mapController.map.id === mapId;
    if (isLoaded) {
      this.mapController.selectLine(lineId);
      return;
    }

    this._closeControllers();
    this.mapController = new app.MapController({
      mapId: mapId,
      lineId: lineId,
      router: this.router
    });
    this.router.navigate('/map/' + mapId);
  },

  showHome: function() {
    this._closeControllers();
    this.homeController = new app.HomeController({ router: this });
    this.router.navigate('/');
  },

  remixMap: function(mapId) {
    var afterRemix = function(resp) {
      var message = 'Now editing a freshly-made duplicate of the original map.';
      app.events.trigger('app:showNotification', message);

      var map = new app.Map(resp, { parse: true });
      this._closeControllers();
      this.mapController = new app.MapController({ map: map, router: this.router });
    };

    var url = '/api/maps/' + mapId + '/remix';
    $.post(url, _.bind(afterRemix, this));
  },

  createMap: function(city) {
    var afterCreate = function(map) {
      this._closeControllers();
      this.mapController = new app.MapController({ map: map, router: this.router });
    };

    app.utils.geocode(city, function(latlng, name, preferMetricUnits) {
      var map = new app.Map({
        name: name,
        center: latlng,
        preferMetricUnits: preferMetricUnits
      });
      map.save({}, { success:  _.bind(afterCreate, this)});
    }, this);
  },

  // When switching between controllers, close the other ones
  _closeControllers: function() {
    if (this.mapController) {
      this.mapController.close();
      delete this.mapController;
    }
    if (this.homeController) {
      this.homeController.close();
      delete this.homeController;
    }
  },

  showNotification: function(message) {
    var notification = new app.NotificationView({ message: message });
    $('body').append(notification.render().el);
  },
});
