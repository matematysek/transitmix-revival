// View that shows all the routes drawn, and lets you jump into any of them.
// TODO: This view is a mess. Need to clean up, seperate into files, redo CSS.
app.MapSidebarView = Backbone.View.extend({
  className: 'mapSidebarView',

  template: _.template($('#tmpl-MapSidebarView').html()),

  emptyTemplate: _.template($('#tmpl-MapSidebarView-empty').html()),

  events: {
    'click .add': 'addLine',
    'click .remix': 'remix',
    'click .remixedFrom': 'remixedFrom',
    'click .share': 'showShare',
    'mouseleave': 'hideShare',
  },

  initialize: function() {
    this.subviews = [];
  },

  render: function() {
    // Create fragments for each individual line and
    // calculate total costs for the summary
    var lines = this.model.get('lines');
    if (lines.length === 0) {
      this.$el.html(this.emptyTemplate(this.model.attributes));
      return this;
    }

    var frag = document.createDocumentFragment();
    var totalDistance = 0;
    var totalCost = 0;

    lines.forEach(function(line) {
      var calcs = line.getCalculations();

      // TODO: Give the map model a function to compute it's summary statistics
      totalDistance += calcs.distance;
      totalCost += calcs.cost;

      var subview = new app.MapSidebarSubview({ model: line });
      this.subviews.push(subview);
      frag.appendChild(subview.render().el);
    }, this);

    var attrs = _.clone(this.model.attributes);
    _.extend(attrs, { 
      lineCount: lines.length,
      cost: app.utils.addCommas(totalCost),
      distance: totalDistance.toFixed(2),
    });
    this.$el.html(this.template(attrs));
    this.$('.lines').append(frag);

    return this;
  },

  addLine: function() {
    var line = new app.Line({
      mapId: this.model.get('id')
    });

    var viewLine = function(line) {
      this.model.get('lines').add(line);

      var fragment = 'map/' + this.model.id + '/line/' + line.id;
      app.router.navigate(fragment, { trigger: true });
    };

    line.save({}, { success: _.bind(viewLine, this) });
  },

  showShare: function() {
    var url = window.location.origin + '/map/' + this.model.id;
    var $inputField = this.$('.sharebox>input');

    $inputField.val(url);
    this.$('.sharebox').show();
    $inputField.select();
  },

  hideShare: function() {
    this.$('.sharebox').hide();
  },

  remix: function() {
    app.router.remix();
  },

  remixedFrom: function() {
    var frag = 'map/' + this.model.get('remixedFromId');
    app.router.navigate(frag, { trigger: true });
  },

  remove: function() {
    this.subviews.map(function(subview) { subview.remove(); });
    Backbone.View.prototype.remove.apply(this, arguments);
  },
});


app.MapSidebarSubview = Backbone.View.extend({
  className: 'mapSidebarSubview',

  template: _.template($('#tmpl-MapSidebarSubview').html()),

  events: {
    'click': 'select',
  },

  render: function() {
    var attrs = _.clone(this.model.toJSON());
    var calcs = this.model.getCalculations();
    
    calcs.distance = calcs.distance.toFixed(2);
    _.extend(attrs, calcs);

    this.$el.html(this.template(attrs));
    this.$el.css({ background: attrs.color });

    return this;
  },

  select: function() {
    var fragment = 'map/' + this.model.get('mapId') + '/line/' + this.model.id;
    app.router.navigate(fragment, { trigger: true });
  }
});
