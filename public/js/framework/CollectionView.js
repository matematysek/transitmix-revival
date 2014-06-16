// Quickly render a collection of items with a given view.
// Updates when items are added or removed. 
app.CollectionView = Backbone.View.extend({
  initialize: function(options) {
    this.itemView = options.view;

    this.views = [];
    this.byId = {};
    options.collection.each(this.addView, this);

    this.listenTo(options.collection, 'add', this.addOne);
    this.listenTo(options.collection, 'remove', this.removeOne);
  },

  addView: function(item) {
    var view = new this.itemView({ model: item });
    this.views.push(view);
    this.byId[item.id] = view;
    return view;
  },

  render: function() {
    var frag = document.createDocumentFragment();

    this.views.forEach(function(view) {
      if (view) frag.appendChild(view.render().el);
    });

    this.$el.html(frag);
    return this;
  },

  addOne: function(item) {
    var view = this.addView(item);
    this.$el.append(view.render().el);
  },

  removeOne: function(item) {
    this.byId[item.id].remove();
    delete this.byId[item.id];
  },

  remove: function() {
    this.views.forEach(function(view) {
      if (view) view.remove();
    });

    Backbone.View.prototype.remove.apply(this, arguments);
  },
});
