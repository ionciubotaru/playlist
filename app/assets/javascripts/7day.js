$('.playlist.display_7_days').ready(function () {

    var calId = $('input#cal-id').val();
    var options = {
        contentHeight: 'auto',
        header: {
          left: 'prev,next',
          center: '',
          right: ''
        },
        slotDuration: '00:15:00',
        axisFormat: 'HH:mm',
        timeFormat: {
            agenda: 'HH:mm'
        },
        allDaySlot: false,
        defaultView: 'agendaDay',
        editable: false
    };

    var day1 = $('#calendars-1').find('td.calendars');
    $.each(day1, function() {
      var id = $(this).attr('id');
      var calType = $(this).attr('data-calendar-type');

      $('#' + id).fullCalendar(options);
      events = {
              url: '/events/get',
              type: 'GET',
              traditional: true,
              data: {
                calendar_id: calId,
                mediatype: calType
              },
      };
      $('#' + id).fullCalendar('addEventSource', events);
      $('#' + id).find('.fc-toolbar').remove(); 
      $('#' + id).find('thead.fc-head').addClass('hide');
    });

    var day2 = $('#calendars-2').find('td.calendars');
    $.each(day2, function() {
      var id = $(this).attr('id');
      var calType = $(this).attr('data-calendar-type');

      $('#' + id).fullCalendar(options);
      events = {
              url: '/events/get',
              type: 'GET',
              traditional: true,
              data: {
                calendar_id: calId,
                mediatype: calType
              },
      };
      $('#' + id).fullCalendar('addEventSource', events);
      $('#' + id).fullCalendar('next');
      $('#' + id).find('.fc-toolbar').remove(); 
      $('#' + id).find('thead.fc-head').addClass('hide');
    });

    var day3 = $('#calendars-3').find('td.calendars');
    $.each(day3, function() {
      var id = $(this).attr('id');
      var calType = $(this).attr('data-calendar-type');

      $('#' + id).fullCalendar(options);
      events = {
              url: '/events/get',
              type: 'GET',
              traditional: true,
              data: {
                calendar_id: calId,
                mediatype: calType
              },
      };
      $('#' + id).fullCalendar('addEventSource', events);
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).find('.fc-toolbar').remove(); 
      $('#' + id).find('thead.fc-head').addClass('hide');
    });

    var day4 = $('#calendars-4').find('td.calendars');
    $.each(day4, function() {
      var id = $(this).attr('id');
      var calType = $(this).attr('data-calendar-type');

      $('#' + id).fullCalendar(options);
      events = {
              url: '/events/get',
              type: 'GET',
              traditional: true,
              data: {
                calendar_id: calId,
                mediatype: calType
              },
      };
      $('#' + id).fullCalendar('addEventSource', events);
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).find('.fc-toolbar').remove(); 
      $('#' + id).find('thead.fc-head').addClass('hide');
    });

    var day5 = $('#calendars-5').find('td.calendars');
    $.each(day5, function() {
      var id = $(this).attr('id');
      var calType = $(this).attr('data-calendar-type');

      $('#' + id).fullCalendar(options);
      events = {
              url: '/events/get',
              type: 'GET',
              traditional: true,
              data: {
                calendar_id: calId,
                mediatype: calType
              },
      };
      $('#' + id).fullCalendar('addEventSource', events);
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).find('.fc-toolbar').remove(); 
      $('#' + id).find('thead.fc-head').addClass('hide');
    });

    var day6 = $('#calendars-6').find('td.calendars');
    $.each(day6, function() {
      var id = $(this).attr('id');
      var calType = $(this).attr('data-calendar-type');

      $('#' + id).fullCalendar(options);
      events = {
              url: '/events/get',
              type: 'GET',
              traditional: true,
              data: {
                calendar_id: calId,
                mediatype: calType
              },
      };
      $('#' + id).fullCalendar('addEventSource', events);
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).find('.fc-toolbar').remove(); 
      $('#' + id).find('thead.fc-head').addClass('hide');
    });

    var day7 = $('#calendars-7').find('td.calendars');
    $.each(day7, function() {
      var id = $(this).attr('id');
      var calType = $(this).attr('data-calendar-type');

      $('#' + id).fullCalendar(options);
      events = {
              url: '/events/get',
              type: 'GET',
              traditional: true,
              data: {
                calendar_id: calId,
                mediatype: calType
              },
      };
      $('#' + id).fullCalendar('addEventSource', events);
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).fullCalendar('next');
      $('#' + id).find('.fc-toolbar').remove(); 
      $('#' + id).find('thead.fc-head').addClass('hide');
    });

    $('#calendar-102 .fc-axis, #calendar-103 .fc-axis, #calendar-104 .fc-axis, #calendar-105 .fc-axis').addClass('hide');
    $('#calendar-202 .fc-axis, #calendar-203 .fc-axis, #calendar-204 .fc-axis, #calendar-205 .fc-axis').addClass('hide');
    $('#calendar-302 .fc-axis, #calendar-303 .fc-axis, #calendar-304 .fc-axis, #calendar-305 .fc-axis').addClass('hide');
    $('#calendar-402 .fc-axis, #calendar-403 .fc-axis, #calendar-404 .fc-axis, #calendar-405 .fc-axis').addClass('hide');
    $('#calendar-502 .fc-axis, #calendar-503 .fc-axis, #calendar-504 .fc-axis, #calendar-505 .fc-axis').addClass('hide');
    $('#calendar-602 .fc-axis, #calendar-603 .fc-axis, #calendar-604 .fc-axis, #calendar-605 .fc-axis').addClass('hide');
    $('#calendar-702 .fc-axis, #calendar-703 .fc-axis, #calendar-704 .fc-axis, #calendar-705 .fc-axis').addClass('hide');

    $('#label-1').html('<span class="label label-info">Day 1</span>&nbsp;&nbsp;<span class="day1 label label-default"></span>');
    $('#label-2').html('<span class="label label-info">Day 2</span>&nbsp;&nbsp;<span class="day2 label label-default"></span>');
    $('#label-3').html('<span class="label label-info">Day 3</span>&nbsp;&nbsp;<span class="day3 label label-default"></span>');
    $('#label-4').html('<span class="label label-info">Day 4</span>&nbsp;&nbsp;<span class="day4 label label-default"></span>');
    $('#label-5').html('<span class="label label-info">Day 5</span>&nbsp;&nbsp;<span class="day5 label label-default"></span>');
    $('#label-6').html('<span class="label label-info">Day 6</span>&nbsp;&nbsp;<span class="day6 label label-default"></span>');
    $('#label-7').html('<span class="label label-info">Day 7</span>&nbsp;&nbsp;<span class="day7 label label-default"></span>');

    $('.day1').text($('#calendar-101').fullCalendar('getView').start.format('YYYY-MM-DD'));
    $('.day2').text($('#calendar-201').fullCalendar('getView').start.format('YYYY-MM-DD'));
    $('.day3').text($('#calendar-301').fullCalendar('getView').start.format('YYYY-MM-DD'));
    $('.day4').text($('#calendar-401').fullCalendar('getView').start.format('YYYY-MM-DD'));
    $('.day5').text($('#calendar-501').fullCalendar('getView').start.format('YYYY-MM-DD'));
    $('.day6').text($('#calendar-601').fullCalendar('getView').start.format('YYYY-MM-DD'));
    $('.day7').text($('#calendar-701').fullCalendar('getView').start.format('YYYY-MM-DD'));

    $('.fc-axis').addClass('small');
});
