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
    var map = this.model.collection.map;
    var attrs = _.clone(this.model.attributes);
    var calcs = this.model.getCalculations();
    calcs.totalCost = app.utils.formatCost(calcs.total.cost);

    if (map.get('preferMetricUnits')) {
      calcs.distance = app.utils.milesToKilometers(calcs.distance).toFixed(2) + ' km';
    } else {
      calcs.distance = calcs.distance.toFixed(2) + ' miles';
    }

    if (map.get('preferServiceHours')) {
      calcs.totalCost = app.utils.addCommas(calcs.total.revenueHours + ' hrs');
    }

    return _.extend(attrs, calcs);
  },

  selectLine: function() {
    app.events.trigger('map:selectLine', this.model.id);
  }
});