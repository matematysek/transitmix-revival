app.FeedbackView = app.BaseView.extend({
  className: 'feedbackView',

  templateId: '#tmpl-feedback-view',

  events: {
    'click': 'expandFeedback',
    'mouseleave': 'hideFeedback',
  },

  expandFeedback: function() {
    this.$('.feedbackExpansion').show();
    this.$el.addClass('expanded');
  },

  hideFeedback: function() {
    this.$('.feedbackExpansion').hide();
    this.$el.removeClass('expanded');
  },
});