// Quickly render a collection of items with a given view.
// Updates when items are added or removed. 
app.CollectionView = Backbone.View.extend({
  initialize: function(options) {
    this.itemView = options.view;

    this.rendered = false;
    this.views = [];
    this.byId = {};
    options.collection.each(this.appendView, this);

    this.listenTo(options.collection, 'add', this.appendView);
    this.listenTo(options.collection, 'remove', this.removeView);
  },

  render: function() {
    var frag = document.createDocumentFragment();

    this.views.forEach(function(view) {
      if (view) frag.appendChild(view.render().el);
    });

    this.$el.html(frag);
    this.rendered = true;
    return this;
  },

  appendView: function(item) {
    var view = new this.itemView({ model: item });
    this.views.push(view);
    this.byId[item.cid] = view;
    if (this.rendered) this.$el.append(view.render().el);
    return view;
  },

  removeView: function(item) {
    this.byId[item.cid].remove();
    delete this.byId[item.id];
  },

  remove: function() {
    this.views.forEach(function(view) {
      if (view) view.remove();
    });

    Backbone.View.prototype.remove.apply(this, arguments);
  },
});
