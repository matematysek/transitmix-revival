app.MapDetailsItemView = app.BaseView.extend({
  templateId: '#tmpl-MapDetailsItemView',

  events: {
    'click': 'selectLine',
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model.collection.map, 'change', this.render);
  },

  serialize: function() {
    var attrs = _.clone(this.model.attributes);
    var calcs = this.model.getCalculations();
    calcs.distance = calcs.distance.toFixed(2);
    calcs.totalCost = app.utils.formatCost(calcs.total.cost);
    if (this.model.collection.map.get('preferServiceHours')) {
      calcs.totalCost = app.utils.addCommas(calcs.total.revenueHours + ' hrs');
    }
    return _.extend(attrs, calcs);
  },

  selectLine: function() {
    app.events.trigger('map:selectLine', this.model.id);
  }
});