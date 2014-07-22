// View that shows all the routes drawn, and lets you jump into any of them.
app.MapDetailsView = app.BaseView.extend({
  className: 'mapDetailsView',

  normalTemplate: _.template($('#tmpl-MapDetailsView').html()),
  emptyTemplate: _.template($('#tmpl-MapDetailsView-empty').html()),

  events: {
    'click .add': 'addLine',
    'click .remix': 'remix',
    'click .remixedFrom': 'remixedFrom',
    'click .share': 'showShare',
    'mouseleave': 'hideShare',
    'click .toggleSettings': 'toggleSettings',
    'click .toggleSettingsText': 'toggleSettings',
  },

  initialize: function() {
    this.listenTo(this.model.get('lines'), 'change', this.updateCalculations);
    this.listenTo(this.model, 'change', this.updateCalculations);
  },

  views: function() {
    var lineCollectionView = new app.CollectionView({
      collection: this.model.get('lines'),
      view: app.MapDetailsItemView,
    });

    return {
      '.lines': lineCollectionView,
    };
  },

  beforeRender: function() {
    var lines = this.model.get('lines');
    this.template = lines.length ? this.normalTemplate : this.emptyTemplate;
  },

  afterRender: function() {
    this.updateCalculations();
  },

  updateCalculations: function() {
    // TODO: Give the map model a function to compute it's summary statistics
    var lines = this.model.get('lines');

    var totalDistance = 0;
    var totalCost = 0;
    var totalBuses = 0;
    var totalHours = 0;

    lines.forEach(function(line) {
      var calcs = line.getCalculations();

      totalDistance += calcs.distance;
      totalCost += calcs.total.cost;
      totalBuses += calcs.total.buses;
      totalHours += calcs.total.revenueHours;
    });

    this.$('.lineCount').html(lines.length);
    this.$('.distance').html(totalDistance.toFixed(2));
    this.$('.buses').html(totalBuses);
    this.$('.cost').html(app.utils.formatCost(totalCost));
    this.$('.hours').html(app.utils.addCommas(totalHours));

    this.$('.costWrapper').toggle(!this.model.get('preferServiceHours'));
    this.$('.hoursWrapper').toggle(this.model.get('preferServiceHours'));
  },

  addLine: function() {
    app.events.trigger('map:addLine');
  },

  showShare: function() {
    var url = app.utils.getBaseUrl() + '/map/' + this.model.id;
    var $inputField = this.$('.sharebox>input');

    $inputField.val(url);
    this.$('.sharebox').show();
    $inputField.select();
  },

  hideShare: function() {
    this.$('.sharebox').hide();
  },

  remix: function() {
    app.events.trigger('app:remixMap', this.model.id);
  },

  remixedFrom: function() {
    app.events.trigger('app:showMap', this.model.get('remixedFromId'));
  },

  toggleSettings: function() {
    app.events.trigger('map:toggleSettings');
  },
});
