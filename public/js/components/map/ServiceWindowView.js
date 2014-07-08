app.ServiceWindowView = app.BaseView.extend({
  templateId: '#tmpl-ServiceWindowView',
  className: 'serviceWindow toggleParent',

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
    'click .toggle': 'toggle',
  },

  initialize: function(options) {
    this.showToggle = options.showToggle;
    this.listenTo(this.model, 'change', this.renderState);
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

  afterRender: function() {
    this.renderState();
    if (this.showToggle) this.$('.toggle').css('display', 'inline-block');
    this.stickit();
  },

  renderState: function() {
    if (this.showToggle) {
      var enabled = !!this.model.get('enabled');
      this.$el.toggleClass('enabled', enabled);
    } else {
      this.$el.toggleClass('isInvalid', !this.model.isValid());
    }
  },

  toggle: function() {
    this.model.set('enabled', !this.model.get('enabled'));
  },
});
