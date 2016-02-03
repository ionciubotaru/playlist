$('.playlist.index').ready(function() {

		getCalContext();

    function getElapsedDays(x, y) {
        var bb = x.clone();
        var days = y.diff(bb, 'days');
        var elDays = [];
        for (var i = 0; i <= days; i++) {
          elDays.push(bb.format('YYYY-MM-DD'));
          bb.add(1, 'days');
        }
        return (elDays);
    }

    function getPlistContent(id, callback) {
      $.ajax({
          url: '/playlist/content',
          data: { plist_id: id }, 
          type: "GET",
          async: true,
          success: function(data) {
            callback(data);
          }
      });
    }

		function getCalContext() {
				$('.cal-context').contextmenu({
					target:'#calendar-context-menu', 
					before: function(e, context) {
						// execute code before context menu if shown
					},
					onItem: function(context, e) {
						if(e.target.className == 'delete-calendar') {
							$('strong.calendar-name').html(context.find('label').text());
							$('input.cal-target-id').val(context.attr('data-calendar-id'));
							$('#delete-calendar-container').modal();
						} else if(e.target.className == 'update-calendar') {
							var calendar_id = context.attr('data-calendar-id')
							$('textarea#update-comments').text(context.attr('data-calendar-comment'));
							$('input.cal-target-id').val(calendar_id);
							$('input#update-cal-name').val(context.find('label').text().trim());
							$('#update-calendar-container').modal();
						} else if(e.target.className == 'attach-devices') {
							var calendar_id = context.attr('data-calendar-id')
							$('#calendar-devices-header').text(context.find('label').text());
							$('input.cal-target-id').val(calendar_id);
							$('input[name="device_id[]"]').prop('checked', false);
							$.ajax({
									url: '/calendar/get_devices',
									data: { calendar_id: calendar_id },
									type: "GET",
									traditional: true,
									success: function(data) {
										$.each(data, function (index, value) {
												if(value) {
													$('input[name="device_id[]"][value="'+ value.id +'"]').prop('checked', true);
												}
										});
									}
							});
							$('input#attach-all').click(function() {
								$('input[name="device_id[]"').prop('checked', true);
							});
							$('input#dettach-all').click(function() {
								$('input[name="device_id[]"').prop('checked', false);
							});
							$('#attach-devices-container').modal();
						} else if(e.target.className == '7-days') {
							var calendar_id = context.attr('data-calendar-id')
							window.location = '/calendar/show/' + calendar_id;
						}
					}
				})
		}
    $('.ap-context').contextmenu({
      target:'#ap-context-menu', 
      onItem: function(context, e) {
        if(e.target.className == 'delete-audio-playlist') {
          var clone = $(context).clone();
          //var title = $(clone).find('span').remove();
          $('strong.ap-name').html(context.text().slice(0, -1));
          $('input.audio-playlist-target-id').val(context.attr('data-selected-id'));
          $('#delete-audio-playlist-container').modal();
        } else if(e.target.className == 'update-audio-playlist') {
          var plist_id = context.attr('data-selected-id');
          $('.audio-playlist-color-picker').colorpicker();
          $('input#plist_id').val(plist_id);
          $('input#audio-playlist-name').val(context.text().slice(0, -1));
          $('.audio-playlist-color-picker').colorpicker('setValue', context.attr('data-selected-color'));
          $('textarea#audio-playlist-comment').text(context.attr('data-selected-comment'));
          $('#update-audio-playlist-container').modal();
        } else if(e.target.className == 'content-audio-playlist') {
          $('#audio-playlist-content-container').modal();
          var plist_id = context.attr('data-selected-id');
          $('input#plist_id').val(plist_id);
          $('#audio-plist-header').html(context.text().slice(0, -1));
          $('select[name="list[]"] option:selected').remove();
          getPlistContent(plist_id, function(res) {
            $.each(res, function(index, value) {
              $('select[name="list[]"]').append(
                $('<option></option>')
                .attr('value', value.id)
                .attr('selected', 'selected')
                .text(value.name)
              );
            });
            $('select[name="list[]"]').bootstrapDualListbox('refresh');
          });
          $('select[name="list[]"]').bootstrapDualListbox({
            selectorMinimalHeight: '300',
          });
          $('select[name^="list[]_helper"]').css('padding', '5px')
        } else if(e.target.className == 'order-audio-playlist') {
          var plist_id = context.attr('data-selected-id');
          getPlistContent(plist_id, function(res) {
            $('small#plist_name').html(context.text().slice(0, -1));
            $('ul.sortable-dragging').find('li').remove();
            $.each(res, function(index, value) {
              $('ul.sortable-dragging').append(
                $('<li data-song-id="'+ value.id +'" class="list-group-item"></li>')
                .html(value.name + '<span class="badge">'+ value.ext +'</span>')
              );
            });
            $(".sortable").sortable();
            $('button#order_submit').click(function() {
              var idsInOrder = [];
              $("ul.sortable-dragging li").each(function() { 
                idsInOrder.push($(this).attr('data-song-id')) 
              });
              $('input#songs-order').val(idsInOrder).toString();
              $('input#plist_id').val(plist_id);
            }); 
          });

          $('#order-playlist-container').modal();
        }
      }
    })
    $('.vp-context').contextmenu({
      target:'#vp-context-menu', 
      onItem: function(context, e) {
        if(e.target.className == 'delete-video-playlist') {
          $('strong.ap-name').html(context.text().slice(0, -1));
          $('input.video-playlist-target-id').val(context.attr('data-selected-id'));
          $('#delete-video-playlist-container').modal();
        } else if(e.target.className == 'update-video-playlist') {
          var plist_id = context.attr('data-selected-id');
          $('.video-playlist-color-picker').colorpicker();
          $('input#plist_id').val(plist_id);
          $('input#video-playlist-name').val(context.text().slice(0, -1));
          $('.video-playlist-color-picker').colorpicker('setValue', context.attr('data-selected-color'));
          $('textarea#video-playlist-comment').text(context.attr('data-selected-comment'));
          $('#update-video-playlist-container').modal();
        } else if(e.target.className == 'content-video-playlist') {
          $('#video-playlist-content-container').modal();
          var plist_id = context.attr('data-selected-id');
          $('input#plist_id').val(plist_id);
          $('#video-plist-header').html(context.text().slice(0, -1));
          $('select[name="list[]"] option:selected').remove();
          getPlistContent(plist_id, function(res) {
            $.each(res, function(index, value) {
              $('select[name="list[]"]').append(
                $('<option></option>')
                .attr('value', value.id)
                .attr('selected', 'selected')
                .text(value.name)
              );
            });
            $('select[name="list[]"]').bootstrapDualListbox('refresh');
          });
          $('select[name="list[]"]').bootstrapDualListbox({
            selectorMinimalHeight: '300',
          });
          $('select[name^="list[]_helper"]').css('padding', '5px')
        } else if(e.target.className == 'order-video-playlist') {
          var plist_id = context.attr('data-selected-id');
          getPlistContent(plist_id, function(res) {
            $('small#plist_name').html(context.text().slice(0, -1));
            $('ul.sortable-dragging').find('li').remove();
            $.each(res, function(index, value) {
              $('ul.sortable-dragging').append(
                $('<li data-song-id="'+ value.id +'" class="list-group-item"></li>')
                .html(value.name + '<span class="badge">'+ value.ext +'</span>')
              );
            });
            $(".sortable").sortable();
            $('button#order_submit').click(function() {
              var idsInOrder = [];
              $("ul.sortable-dragging li").each(function() { 
                idsInOrder.push($(this).attr('data-song-id')) 
              });
              $('input#songs-order').val(idsInOrder).toString();
              $('input#plist_id').val(plist_id);
            }); 
          });

          $('#order-playlist-container').modal();
        }
      }
    });
    $('.text-context').contextmenu({
      target:'#text-context-menu', 
      onItem: function(context, e) {
        if(e.target.className == 'delete-text') {
          var text_id = context.attr('data-selected-id');
          $('.text-target-id').val(text_id);
          $('.text-name').html(context.text());
          $('#delete-text-container').modal();
        } else if(e.target.className == 'update-text') {
          var text_id = context.attr('data-selected-id');
          $('textarea#update-text').text(context.attr('data-text'));
          $('input.text-target-id').val(text_id);
          $('input#update-text-label').val(context.text());
          $('#update-text-container').modal();
        }
      }
    });
    $('button#new-calendar').click(function(){
      $('form.new-calendar').find('input, textarea').val('');
      $('#new-calendar-container').modal();
    });
    $('button#new-audio-playlist').click(function(){
      $('form.new-audio-playlist').find('input, textarea').val('');
      $('.audio-playlist-color-picker').colorpicker();
      $('#new-audio-playlist-container').modal();
    });
    $('button#new-video-playlist').click(function(){
      $('form.new-video-playlist').find('input, textarea').val('');
      $('.video-playlist-color-picker').colorpicker();
      $('#new-video-playlist-container').modal();
    });
    $('button#new-text').click(function(){
      $('form.new-text').find('input, textarea').val('');
      $('#new-text-container').modal();
    });

    $('.external-event').each(function() {
        var eventObject = {
            title: $.trim($(this).text()),
            //type: $(this).find('span').attr('data-type')
        };
        $(this).data('eventObject', eventObject);
        $(this).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });
    });

    var calendars = $('#calendars').find('td.calendars');
    var calId;
    var events;
    $.each(calendars, function() {
      var calType = $(this).attr('data-calendar-type');

      $('input[type=radio][name=calendar-option]').change(function() {
        calId = $(this).val();
        events = {
                url: '/events/get',
                type: 'GET',
                traditional: true,
                data: {
                  calendar_id: calId,
                  mediatype: calType
                }
        };
        $('#calendar-' + calType).fullCalendar('removeEventSource', events);
        $('#calendar-' + calType).fullCalendar('addEventSource', events);
        $('strong#calendar_name').text($('input[type=radio][name=calendar-option]:checked').parent().text());
      });

      $('input:radio[name=calendar-option]:first').attr('checked', true); // check first option
      calId = $('input[type=radio][name=calendar-option]:checked').val();

      $('#calendar-' + calType).fullCalendar({
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
            events: {
                    url: '/events/get',
                    type: 'GET',
                    traditional: true,
                    data: {
                      calendar_id: calId,
                      mediatype: calType
                    },
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            drop: function(date) {
                var originalEventObject = $(this).data('eventObject');
                //console.log(originalEventObject)
                var datatype = $(this).attr('data-media-type');
                var mediaFileId = $(this).attr('data-selected-id');
                var calTargetId = $(this).attr('data-media-type');
                var copiedEventObject = $.extend({}, originalEventObject);
                copiedEventObject.start = date;
                if(datatype == '3' || datatype == '4') {
                  copiedEventObject.end = moment(date).add(15, 'minutes');
                } else {
                  copiedEventObject.end = moment(date).add(60, 'minutes');
                }
                if(calType != calTargetId) {
                  return
                }
                $.ajax({
                    url: '/events/add',
                    data: 'mediafile_id=' + mediaFileId + '&mediatype=' + datatype + '&calendar_id='+ $('input[type=radio][name=calendar-option]:checked').val() + '&title='+ copiedEventObject.title+'&start='+ copiedEventObject.start+'&end='+copiedEventObject.end+'&mediatype='+datatype,
                    type: "POST",
                    success: function(data) {
                        $('#calendar-' + calType).fullCalendar('refetchEvents');
                    }
                });
            },
            eventDrop: function(event, delta, revertFunc) {
              $.ajax({
                  url: '/events/update',
                  data: 'id='+ event.id+'&start='+ event.start.format() + '&end='+ event.end.format(),
                  type: "POST",
                  success: function(data) {
                      $('#calendar-' + calType).fullCalendar('refetchEvents');
                  }
              });
            },
            eventResize: function(event, delta, revertFunc) {
              if(event.type === 3 || event.type === 4) {
                alert('This media type is not resizable!');
                revertFunc();
              } else {
                $.ajax({
                    url: '/events/update',
                    data: 'id='+ event.id + '&end='+event.end.format(),
                    type: "POST",
                    success: function(data) {
                        $('#calendar-' + calType).fullCalendar('refetchEvents');
                    }
                });
              }
            },
            eventClick: function(calEvent, jsEvent, view) {
            },
            loading: function (bool, view) { 
            },
            eventRender: function (event, element) {
              element.attr('id', 'event-' + event.id);
              var originalClass = element[0].className;
              element[0].className = originalClass + ' hasmenu';
            },
            eventAfterRender: function(event, element, view) {
                if(event.has_repeat == '1' && event.type === 1) {
                    element.find('.fc-content').after('<div title="This event repeats" style="margin-top: 10px" class="event-type-1 repeat-days-container"></div>');
                    $.each(event.repeat_days, function (index, value) {
                      $('.event-type-1').append('<span class="badge small" style="margin: 3px; font-size: 11px">'+ value +'</span>');
                    });
                } else if(event.has_repeat == '1' && event.type === 2) {
                    element.find('.fc-content').after('<div title="This event repeats" style="margin-top: 10px" class="event-type-2 repeat-days-container"></div>');
                    $.each(event.repeat_days, function (index, value) {
                      $('.event-type-2').append('<span class="badge small" style="margin: 3px; font-size: 11px">'+ value +'</span>');
                    });
                }
            },
            eventRightclick: function(event, jsEvent, view) {
              $('#event-' + event.id).contextmenu({
                target:'#event-context-menu', 
                onItem: function(context, e) {
                  if(e.target.className == 'delete-event') {
                    var event_text = context.find('.fc-title').text();
                    if (!confirm('Confirm delete ' + event_text + ' ?')) {
                        return
                    }
                    $.ajax({
                        url: '/event/delete',
                        data: { event_id: event.id },
                        type: "POST",
                        traditional: true,
                        success: function(data) {
                          $('#calendar-' + calType).fullCalendar("removeEvents", event.id);
                          $('#calendar-' + calType).fullCalendar("refetchEvents");
                        }
                    });
                  } else if(e.target.className == 'delete-events') {
                    var event_text = context.find('.fc-title').text();
                    if (!confirm('Confirm delete whole series ' + event_text + ' ?')) {
                        return
                    }
                    $.ajax({
                        url: '/event/delete',
                        data: { event_id: event.id, series: 1 },
                        type: "POST",
                        traditional: true,
                        success: function(data) {
                          $('#calendar-' + calType).fullCalendar("removeEvents", event.id);
                          $('#calendar-' + calType).fullCalendar("refetchEvents");
                        }
                    });
                  } else if(e.target.className == 'clone-event') {
                    $.ajax({
                        url: '/event/repeat',
                        data: { event_id: event.id },
                        type: "POST",
                        traditional: true
                    });
                  }
                }
              })
              return false;
            },
        });
    });

    
    var currentDay;
    $('#calendar-1, #calendar-2, #calendar-3, #calendar-4, #calendar-5').find('thead.fc-head').addClass('hide');
    $('#calendar-2, #calendar-3, #calendar-4, #calendar-5').find('.fc-axis').addClass('hide');
    $('#calendar-2, #calendar-3, #calendar-4, #calendar-5').find('.fc-toolbar').empty();
    $('.fc-toolbar').prependTo('#calendars');
    $('.fc-toolbar').find('button').css('width', '40px');
    $('.fc-button').find('span').css('vertical-align', 'middle');
    $('.fc-axis').addClass('small');
    $('#calendars').find('button.fc-next-button').attr('title', 'Next day').click(function() {
      $('#calendar-2, #calendar-3, #calendar-4, #calendar-5').fullCalendar('next');
      currentDay = $('#calendar-1').fullCalendar('getView');
      $('label#current_date').text(currentDay.start.format('dddd YYYY-MM-DD'));
      $('#calendar-1, #calendar-2, #calendar-3, #calendar-4, #calendar-5').find('thead.fc-head').addClass('hide');
      $('#calendar-2, #calendar-3, #calendar-4, #calendar-5').find('.fc-axis').addClass('hide');
    });
    $('#calendars').find('button.fc-prev-button').attr('title', 'Previous day').click(function() {
      $('#calendar-2, #calendar-3, #calendar-4, #calendar-5').fullCalendar('prev');
      currentDay = $('#calendar-1').fullCalendar('getView');
      $('label#current_date').text(currentDay.start.format('dddd YYYY-MM-DD'));
      $('#calendar-1, #calendar-2, #calendar-3, #calendar-4, #calendar-5').find('thead.fc-head').addClass('hide');
      $('#calendar-2, #calendar-3, #calendar-4, #calendar-5').find('.fc-axis').addClass('hide');
    });
    $('.fc-toolbar').first().before('<div style="position: absolute; margin-left: 11%;"><strong id="calendar_name"></strong></div>');
    $('.fc-toolbar').first().before('<div style="position: absolute; margin-left: 84%;"><label class="label label-default" id="current_date"></label></div>');
    $('strong#calendar_name').text($('input[type=radio][name=calendar-option]:checked').parent().text());
    currentDay = $('#calendar-1').fullCalendar('getView');
    $('label#current_date').text(currentDay.start.format('dddd YYYY-MM-DD'));
});
