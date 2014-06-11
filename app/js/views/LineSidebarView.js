app.LineSidebarView = Backbone.View.extend({
  className: 'lineSidebarView',
  template: _.template($('#tmpl-LineSidebarView').html()),

  bindings: {
    '.name': 'name',
    '.speed': {
      observe: 'speed',
      onGet: function(val) { return val+ ' mph'; },
      onSet: function(val) { return parseInt(val, 10); },
    },
  },

  events: {
    'click .back': 'unselect',
    'click .add': 'addLine',
    'click .delete': 'delete',
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

    // Save references to the ServiceWindowViews for later cleanup
    this.subviews = [];
  },

  render: function() {
    // Compute several shades of color for the UI
    var color = this.model.get('color');
    var attrs = _.extend(this.model.attributes, {
      color2: app.utils.tweakColor(color, -22),
      color3: app.utils.tweakColor(color, -44),
    });

    this.$el.html(this.template(attrs));
    this.updateCalculations();
    this.stickit();

    // Bind to map-level attributes
    var map = this.model.collection.map;
    this.stickit(map, {
      '.layover': {
        observe: 'layover',
        onGet: function(val) { return val*100 + '%'; },
        onSet: function(val) { return parseInt(val, 10) / 100; },
      },
      '.hourlyCost': {
        observe: 'hourlyCost',
        onGet: function(val) { return '$' + val; },
        onSet: function(val) { return parseInt(val.replace(/\D/g, ''), 10); },
      }
    });

    // Render ServiceWindowsViews and insert into DOM
    var frag = document.createDocumentFragment();
    this.model.get('serviceWindows').each(function(serviceWindow) {
      var serviceWindowView = new app.ServiceWindowView({
        model: serviceWindow
      });

      this.subviews.push(serviceWindowView);
      frag.appendChild(serviceWindowView.render().el);
    }, this);
    this.$('.windows').html(frag);

    return this;
  },

  updateCalculations: function() {
    var calcs = this.model.getCalculations();
    var cost = app.utils.formatCost(calcs.total.cost);
    var revenueHours = app.utils.addCommas(calcs.total.revenueHours);

    this.$('.distance').html(calcs.distance.toFixed(2) + ' miles');
    this.$('.buses').html(calcs.total.buses + ' buses');
    this.$('.cost').html(cost);
    this.$('.revenueHours').html(revenueHours);
  },

  save: function(model, options) {
    if (options.stickitChange) {
      this.model.save();
    }
  },

  unselect: function() {
    app.router.navigate('map/' + this.model.get('mapId'), { trigger: true });
  },

  preventNewline: function(event) {
    if (event.which === 13) {
      event.stopPropagation();
      event.preventDefault();
      event.target.blur();
    }
  },

  addLine: function() {
    var viewLine = function(model) {
      var fragment = 'map/' + model.get('mapId') + '/line/' + model.id;
      app.router.navigate(fragment, { trigger: true });
    };

    var mapId = this.model.get('mapId');
    this.model.collection.create({ mapId: mapId }, { success: viewLine });
  },

  delete: function() {
    var fragment = 'map/' + this.model.get('mapId');
    this.model.destroy();
    app.router.navigate(fragment, { trigger: true });
  },

  showBusOutputs: function() {
    $('.busOutputs').toggle();
    $('.costOutputs').hide();
  },

  showCostOutputs: function() {
    $('.costOutputs').toggle();
    $('.busOutputs').hide();
  },

  hideOutputs: function() {
    $('.busOutputs').hide();
    $('.costOutputs').hide();
  },

  remove: function() {
    this.subviews.map(function(subview) { subview.remove(); });
    Backbone.View.prototype.remove.apply(this, arguments);
  },
});
