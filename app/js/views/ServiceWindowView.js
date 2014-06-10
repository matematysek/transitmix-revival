app.ServiceWindowView = Backbone.View.extend({
  template: $('#tmpl-ServiceWindowView').html(),

  bindings: {
    '.windowName': 'name',
    '.from': 'from',
    '.to': 'to',
    '.headway': {
      observe: 'headway',
      onGet: 'addMinutes',
      onSet: 'parseMinutes',
    },
  },

  events: {
    'keydown': 'modifyMinutes',
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.renderValid);
  },

  parseMinutes: function(val) {
    return parseInt(val, 10);
  },

  addMinutes: function(val) {
    if (!val) return '';
    return val + ' min';
  },

  modifyMinutes: function(event) {
    if (event.target.className !== 'headway') return;

    var model = this.model;
    if (event.which === 38) { // up key
      model.set('headway', parseInt(model.get('headway'), 10) + 1);
    } else if (event.which === 40) { // down key
      model.set('headway', parseInt(model.get('headway'), 10) - 1);
    }
  },

  render: function() {
    this.$el.html(this.template);
    this.renderValid();
    this.stickit();
    return this;
  },

  renderValid: function() {
    this.$el.toggleClass('isInvalid', !this.model.isValid());
  },
});
