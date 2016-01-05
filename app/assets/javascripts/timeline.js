$('.timelines.index').ready(function() {
    $('tr.inactive').css('opacity', '0.4');
    $('thead tr:first').css('background-color', '#f9f9f9');
    $('tr.inactive td').find('input').prop('disabled', true);
    $('input[name^="device-"]').change(function() {
      var icon = $('table').find('img#loader-' + $(this).attr('data-device-id'));
      icon.removeClass('hide');
      $.ajax({
          url: '/timelines/map',
          data: {
            device_id: $(this).attr('data-device-id'),
            calendar_id: $(this).attr('data-calendar-id'),
          },
          type: "POST",
          success: function(data) {
            icon.addClass('hide');
          }
      });
    });
});
