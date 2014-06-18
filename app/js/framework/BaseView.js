// BaseView is a simple extension of Backbone.View that automatically renders
// itself, manages and inserts child views, and cleans up everything on remove.
// Inspired by: https://github.com/tbranyen/backbone.layoutmanager
app.BaseView = Backbone.View.extend({
 constructor: function() {
   Backbone.View.apply(this, arguments);
   if (this.views) this.views = _.result(this, 'views');
   if (this.templateId) this.template = _.template($(this.templateId).html());
   return this;
 },

  serialize: function() {
    return this.model ? _.clone(this.model.attributes) : {};
  },

  render: function() {
    if (this.beforeRender) this.beforeRender();
    if (this.template) this.$el.html(this.template(this.serialize()));
    if (this.views) this._setViews(this.views);
    if (this.afterRender) this.afterRender();
    return this;
  },

  _setViews: function(views) {
    _.each(views, function (view, selector) {
      view.setElement(this.$(selector)).render();
    }, this);
  },

  _removeViews: function(views) {
    _.each(views, function (view) {
      view.remove();
    });
  },

  remove: function() {
    if (this.views) this._removeViews(this.views);
    Backbone.View.prototype.remove.apply(this, arguments);
  },
});
