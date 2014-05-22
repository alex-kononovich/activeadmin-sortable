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
        var position = ui.item.index() + 1;

        $.ajax({
          url: url,
          type: 'post',
          data: { position: position },
          success: function() {
            // repaint table
            container.find('tr').removeClass('odd').removeClass('even');
            container.find('tr:odd').addClass('even');
            container.find('tr:even').addClass('odd');

            // update positions
            container.find('tr .handle').each(function(element) {
              element = $(element);
              element.data('position', element.index());
            });
          }
        });
      }
    });

    this.disableSelection();
  }
})(jQuery);
