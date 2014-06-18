app.ServiceWindow = Backbone.Model.extend({
  // A simple model to store service windows for a line
  isValid: function() {
    var validTime = app.utils.diffTime(this.get('from'), this.get('to')) > 0;
    var validHeadway = this.get('headway') > 0;
    return validTime && validHeadway;
  },
});