app.HomeController = app.Controller.extend({
  setupViews: function() {
    this.homeView = new app.HomeView();
    $('body').append(this.homeView.render().el);
  },

  teardownViews: function() {
    this.homeView.remove();
  },
});
