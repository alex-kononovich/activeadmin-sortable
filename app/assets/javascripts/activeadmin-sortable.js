(function($) {
  $(document).ready(function() {
    $('.handle').closest('tbody').activeAdminSortable();
  });

  $.fn.activeAdminSortable = function() {
    this.sortable({
      update: function(event, ui) {
        var url = ui.item.find('[data-sort-url]').data('sort-url');

        was_position = ui.item.find('[data-position]').data('position');

        next_position = ui.item.next().find('[data-position]').data('position');
        prev_position = ui.item.prev().find('[data-position]').data('position');

        if (next_position && was_position > next_position) {
          target_position = next_position;
        } else if (prev_position && was_position < prev_position) {
          target_position = prev_position;
        }

        if (target_position) {
          $.ajax({
            url: url,
            type: 'post',
            data: { position: target_position },
            success: function() { window.location.reload() }
          });
        }
      }
    });

    this.disableSelection();
  }
})(jQuery);
