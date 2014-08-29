app.MapSettingsView = app.BaseView.extend({
  templateId: '#tmpl-MapSettingsView',
  className: 'mapSettingsView',

  events: {
    'click .closeSettings': 'closeSettings',
    'click .applyToAll': 'applySettingsToAll',
    'click .serviceHoursToggle': 'toggleServiceHours',
    'click .metricUnitsToggle': 'toggleMetricUnits',
  },

  bindings: {
    '.speed': {
      observe: ['speed', 'preferMetricUnits'],
      onGet: function(values) {
        if (this.model.get('preferMetricUnits')) {
          return app.utils.milesToKilometers(values[0]).toFixed(1) + ' km/h';
        } else {
          return values[0].toFixed(1) + ' mph';
        }
      },
      onSet: function(val) {
        var distance;
        if (this.model.get('preferMetricUnits')) {
          distance = app.utils.kilometersToMiles(parseFloat(val));
        } else {
          distance = parseFloat(val);
        }
        return [distance, this.model.get('preferMetricUnits')];
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

  views: function() {
    var serviceWindows = this.model.get('serviceWindows');

    var weekdays = new app.CollectionView({
      collection: serviceWindows,
      view: app.ServiceWindowView,
      viewOptions: { showToggle: true, },
      filter: function(item) { return !item.get('isSaturday') && !item.get('isSunday'); },
    });

    var weekends = new app.CollectionView({
      collection: serviceWindows,
      view: app.ServiceWindowView,
      viewOptions: { showToggle: true },
      filter: function(item) { return item.get('isSaturday') || item.get('isSunday'); },
    });

    return {
      '.weekdayServiceWindows': weekdays,
      '.weekendServiceWindows': weekends,
    };
  },

  afterRender: function() {
    this.stickit();
    this.$('.serviceHoursToggle').toggleClass('enabled', this.model.get('preferServiceHours'));
    this.$('.metricUnitsToggle').toggleClass('enabled', this.model.get('preferMetricUnits'));
  },

  applySettingsToAll: function() {
    this.model.applyDefaultsToAll();
  },

  closeSettings: function() {
    app.events.trigger('map:toggleSettings');
  },

  toggleServiceHours: function() {
    this.model.set('preferServiceHours', !this.model.get('preferServiceHours'));
    this.$('.serviceHoursToggle').toggleClass('enabled', this.model.get('preferServiceHours'));
  },

  toggleMetricUnits: function() {
    this.model.set('preferMetricUnits', !this.model.get('preferMetricUnits'));
    this.$('.metricUnitsToggle').toggleClass('enabled', this.model.get('preferMetricUnits'));
  },
});