app.LineDetailsView = app.BaseView.extend({
  className: 'lineDetailsView',

  templateId: '#tmpl-LineDetailsView',

  bindings: {
    '.name': 'name',
    '.speed': {
      observe: 'speed',
      onGet: function(val) {
        var map = this.model.collection.map;
        if (map.get('preferMetricUnits')) {
          return app.utils.milesToKilometers(val).toFixed(1) + ' km/h';
        } else {
          return val.toFixed(1) + ' mph';
        }
      },
      onSet: function(val) {
        var map = this.model.collection.map;
        if (map.get('preferMetricUnits')) {
          return app.utils.kilometersToMiles(parseFloat(val));
        } else {
          return parseFloat(val);
        }
      },
    },
    '.layover': {
      observe: 'layover',
      onGet: function(val) { return val*100 + '%'; },
      onSet: function(val) { return parseInt(val, 10) / 100; },
    },
    '.hourlyCost': {
      observe: 'hourlyCost',
      onGet: function(val) { return '$' + val; },
      onSet: function(val) { return parseInt(val.replace(/\D/g, ''), 10); },
    },
    '.weekdaysPerYear': 'weekdaysPerYear',
    '.saturdaysPerYear': 'saturdaysPerYear',
    '.sundaysPerYear': 'sundaysPerYear',
  },

  events: {
    'click .back': 'clearSelection',
    'click .add': 'addLine',
    'click .delete': 'deleteLine',
    'click .showMileageOutputs': 'showMileageOutputs',
    'click .showBusOutputs': 'showBusOutputs',
    'click .showCostOutputs': 'showCostOutputs',
    'mouseleave': 'hideOutputs',
    'keydown': 'preventNewline',
  },

  initialize: function() {
    var serviceWindows = this.model.get('serviceWindows');
    var map = this.model.collection.map;

    this.listenTo(map, 'change', this.updateCalculations);
    this.listenTo(this.model, 'change', this.updateCalculations);
    this.listenTo(serviceWindows, 'change', this.updateCalculations);
  },

  serialize: function() {
    var attrs = _.clone(this.model.attributes);
    
    return _.extend(attrs, {
      color2: app.utils.tweakColor(attrs.color, -22),
      color3: app.utils.tweakColor(attrs.color, -44),
    });
  },

  views: function() {
    var serviceWindowViews = new app.CollectionView({
      collection: this.model.get('serviceWindows'),
      view: app.ServiceWindowView,
    });

    return {
      '.windows': serviceWindowViews
    };
  },

  afterRender: function() {
    this.updateCalculations();
    this.stickit();

    var map = this.model.collection.map;
    if (map.get('preferServiceHours')) {
      this.$('.costWrapper').hide();
      this.$('.revenueHoursWrapper').show();
    }
  },

  updateCalculations: function() {
    var map = this.model.collection.map;
    var calcs = this.model.getCalculations();
    var cost = app.utils.formatCost(calcs.total.cost);
    var revenueHours = app.utils.addCommas(calcs.total.revenueHours);

    var distance, halfDistance;
    if (map.get('preferMetricUnits')) {
      distance = app.utils.milesToKilometers(calcs.distance).toFixed(2) + ' km';
      halfDistance = app.utils.milesToKilometers(calcs.distance / 2).toFixed(2) + ' km';
    } else {
      distance = calcs.distance.toFixed(2) + ' miles';
      halfDistance = (calcs.distance/2).toFixed(2) + ' miles';
    }

    this.$('.distance').html(distance);
    this.$('.halfDistance').html(halfDistance);    
    this.$('.buses').html(calcs.total.buses + ' buses');
    this.$('.cost').html(cost);
    this.$('.revenueHours').html(revenueHours);
    this.$('.bigRevenueHours').html(revenueHours + ' hrs');
  },

  save: function(model, options) {
    if (options.stickitChange) {
      this.model.save();
    }
  },

  clearSelection: function() {
    app.events.trigger('map:clearSelection');
  },

  preventNewline: function(event) {
    if (event.which === 13) {
      event.stopPropagation();
      event.preventDefault();
      event.target.blur();
    }
  },

  addLine: function() {
    app.events.trigger('map:addLine');
  },

  deleteLine: function() {
    app.events.trigger('map:deleteLine', this.model.id);
  },

  // TODO: DRY this up.
  showBusOutputs: function() {
    $('.busOutputs').toggle();
    $('.costOutputs').hide();
    $('.mileageOutputs').hide();
  },

  showCostOutputs: function() {
    $('.costOutputs').toggle();
    $('.busOutputs').hide();
    $('.mileageOutputs').hide();
  },

  showMileageOutputs: function() {
    $('.mileageOutputs').toggle();
    $('.busOutputs').hide();
    $('.costOutputs').hide();
  },

  hideOutputs: function() {
    $('.busOutputs').hide();
    $('.costOutputs').hide();
  },
});
