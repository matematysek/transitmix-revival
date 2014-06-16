app.HomeView = app.BaseView.extend({
  className: 'homeView',

  templateId: '#tmpl-home-view',
  
  events: {
    'click .homeStartButton': 'createMap',
    'keydown': 'captureEnter',
  },
  
  createMap: function() {
    var city = this.$('.homeCity').html();
    if (!city) return;

    app.events.trigger('home:createMap', city);
  },

  captureEnter: function (event) {
    if (event.which === 13) {
      event.stopPropagation();
      event.preventDefault();
      this.createMap();
    }
  }
});
