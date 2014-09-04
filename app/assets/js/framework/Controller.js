app.Controller = function(options) {
  options = options || {};
  if (options.router) this.router = options.router;
  this.initialize.apply(this, arguments);
};

_.extend(app.Controller.prototype, Backbone.Events, {
  initialize: function() {
    this.setupViews();
  },

  setupViews: function(){},

  teardownViews: function(){},

  close: function() {
    this.teardownViews();
    this.stopListening();
  },
});

app.Controller.extend = Backbone.View.extend;
