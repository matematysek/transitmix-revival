app.NearbyView = app.BaseView.extend({
  className: 'nearbyView',
  template: _.template('<div class="nearbyMaps"></div>'),

  views: function() {
    if (this.collection.length === 0)  {
      return { '.nearbyMaps': new app.NearbyEmptyView() };
    }

    var nearbyMapViews = new app.CollectionView({
      collection: this.collection,
      view: app.NearbyMapView,
    });

    return {
      '.nearbyMaps': nearbyMapViews,
    };
  },
});

app.NearbyMapView = app.BaseView.extend({
  className: 'nearbyMap',
  template: _.template('<h2>{{ name }}</h2><div class="nearbyLines"></div>'),

  views: function() {
    var nearbyLineViews = new app.CollectionView({
      collection: this.model.get('lines'),
      view: app.NearbyLineView,
    });

    return {
      '.nearbyLines': nearbyLineViews,
    };
  },
});

app.NearbyLineView = app.BaseView.extend({
  className: 'nearbyLine',
  template: _.template('<span>{{ name }}</span>'),

  events: {
    'click': 'addLine',
  },

  addLine: function() {
    app.events.trigger('map:addNearbyLine', this.model);
  },
});

app.NearbyEmptyView = app.BaseView.extend({
  templateId: '#tmpl-NearbyEmptyView',
  // template: _.template('<textarea></textarea><iframe height="377" allowTransparency="true" frameborder="0" scrolling="no" style="width:100%;border:none"  src="https://transitmix.wufoo.com/embed/zwhnrd40xiflgv/"><a href="https://transitmix.wufoo.com/forms/zwhnrd40xiflgv/">Fill out my Wufoo form!</a></iframe>'),
});

