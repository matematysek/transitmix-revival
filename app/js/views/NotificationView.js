app.NotificationView = Backbone.View.extend({
  className: 'NotificationView',

  initialize: function(options) {
    this.message = options.message;

    // remove the notification after 3 seconds
    _.delay(_.bind(this.fadeOut, this), 1500);
  },

  render: function() {
    this.$el.html(this.message);
    return this;
  },

  fadeOut: function() {
    this.$el.animate({ opacity: 0 }, 1000, _.bind(this.remove, this));
  }
});