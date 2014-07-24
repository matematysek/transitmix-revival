app.Lines = Backbone.Collection.extend({
  model: app.Line,
  url: '/api/lines',

  initialize: function() {
    this.on('change:name', this.sort, this);
  },

  comparator: function(a, b) {
    return app.utils.naturalSort(a.get('name'), b.get('name'));
  },
});
