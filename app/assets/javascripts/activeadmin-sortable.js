//= require jquery.ui.sortable

(function($) {
  $(document).ready(function() {
    $('.handle').closest('tbody').activeAdminSortable();
  });

  $.fn.activeAdminSortable = function() {
    var container = this;
    this.sortable({
      update: function(event, ui) {
        var url = ui.item.find('[data-sort-url]').data('sort-url');

        var was_position = ui.item.find('[data-position]').data('position');

        var next_position = ui.item.next().find('[data-position]').data('position');
        var prev_position = ui.item.prev().find('[data-position]').data('position');

        var target_position = ui.item.index() + 1;

        if (next_position && was_position > next_position) {
          target_position = next_position;
        } else if (prev_position && was_position < prev_position) {
          target_position = prev_position;
        }

        $.ajax({
          url: url,
          type: 'post',
          data: { position: target_position },
          success: function() {
            // repaint table
            container.find('tr').removeClass('odd').removeClass('even');
            container.find('tr:odd').addClass('even');
            container.find('tr:even').addClass('odd');
          }
        });
      }
    });

    this.disableSelection();
  }
})(jQuery);
