app.MapSidebarItemView = app.BaseView.extend({
  templateId: '#tmpl-MapSidebarItemView',

  events: {
    'click': 'selectLine',
  },

  serialize: function() {
    var attrs = _.clone(this.model.attributes);
    var calcs = this.model.getCalculations();
    calcs.distance = calcs.distance.toFixed(2);
    calcs.totalCost = app.utils.formatCost(calcs.total.cost);
    return _.extend(attrs, calcs);
  },

  selectLine: function() {
    app.events.trigger('map:selectLine', this.model.id);
  }
});