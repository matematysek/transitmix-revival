// Namespace for the application
var app = app || {};

// Use mustache-style syntax for underscore templates
_.templateSettings = {
  evaluate: /\{#(.+?)#\}/g,
  interpolate: /\{\{(.+?)\}\}/g
};

$(document).ready(function() {
  app.events = _.clone(Backbone.Events);
  new app.AppController({ router: new app.Router() });  
  Backbone.history.start({ pushState: true, root: '/' });
});
