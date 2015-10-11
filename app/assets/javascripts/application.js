// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require jquery-ui
//= require bootstrap.min
//= require bootstrapValidator.min
//= require bootstrap-select
//= require dataTables/jquery.dataTables
//= require dataTables/bootstrap/3/jquery.dataTables.bootstrap
//= require video
//= require js/fileinput
//= require sortable
//= require moment
//= require fullcalendar
//= require bootstrap-datetimepicker
//= require underscore
//= require bootstrap-contextmenu
//= require bootstrap-duallistbox
//= require bootstrap-list-filter
//= require gmaps/google
//= require fullcalendar-rightclick
//require turbolinks
// require jquery.contextMenu.js
//= require bootstrap-colorpicker
//= require_tree .

//$(document).on('ready page:ready', function() {
$(document).ready(function () {

//  var $contextMenu = $("#contextMenu");
  
//  $("body").on("contextmenu", "ul li", function(e) {
//    $contextMenu.css({
//      display: "block",
//      left: e.pageX,
//      top: (e.pageY)
//    });
//    return false;
//  });

//  $contextMenu.on("click", "a", function() {
//     $contextMenu.hide();
//  });
//  $('body').on('click', function() {
//     $contextMenu.hide();
//  });
  

  var currentPage = $('span.current-page').attr('data-controller-name');
  var currentView = $('span.current-page').attr('data-action-name');

  if (currentPage == 'uploads') {
      var player;
      var selected;
      var preview_container = $('.panel-body').find('#media-preview').length;
      if(preview_container > 0) {
        videojs('media-preview', {}, function() {
          player = this;
        });
      }
      var table1 = $('#media-table').dataTable({
        sDom: '<"top">rt<"bottom">i<"toolbar">',
        //searching: true,
        sScrollY: '360',
        bPaginate: false,
        bScrollCollapse: true,
        aoColumns: [
            { bSortable: true, width: '3%' },
            { bSortable: true, width: '50%', sClass: 'text-left' },
            { bSortable: true, width: '10%', sClass: 'text-right' },
            { visible: false },
            { visible: false },
            { visible: false },
            { bSortable: false, width: '5%', sClass: 'text-right' },
        ],
        order: [[ 0, 'asc' ]]
      });


      if(device_id && device_id !== 0) {
        if(songtype === 1 || songtype === 2) { 
          if(table1.fnGetData().length > 1) {
            $("div.toolbar").html('<div class="pull-right" style="margin-top: 10px;" class=""><button id="playlist-order" type="button" class="btn btn-primary btn-xs">Change play order</button></div>');
          }
        }
      }

      var tableObject = $('#media-table').DataTable();
      $('#table-search').keyup(function(){
            tableObject.search($(this).val()).draw();
      });

      $('#table-search').focus();

      $('.dataTables_info').addClass('small');

      $('#media-table').on( 'click', 'tr', function () {
          var aData = table1.fnGetData(this);
          if(aData) {
            selected = '/songs/' + aData[4]+ '/' + aData[5] + aData[3];
            player.src(selected);
            player.currentTime(1);
          }

          if ( $(this).hasClass('selected') ) {
              $(this).removeClass('selected');
          }
          else {
              table1.$('tr.selected').removeClass('selected');
              $(this).addClass('selected');
          }
      });


      $('#update_playlist').attr('disabled', 'disabled'); // button initial disabled
      $('select#media-picker').on('change', function(){
        var count = $('select#media-picker option:selected').length;
        if(count > 0) { 
          $('#update_playlist').removeAttr('disabled') 
        } else { 
          $('#update_playlist').attr('disabled', 'disabled') 
        }
      });
      $('button[type="submit"]').click(function() {
        $(this).html('<i class="fa fa-spinner fa-spin"></i><span>&nbsp;Se încarcă..</span>');
      });

      $('button#update_playlist').click(function() {
        $('select#media-picker option:selected').each(function() {
          $('#selected_songs').append('<div class="checkbox"><label><input type="checkbox" name="selected_songs[]" checked value="' + $(this).val() + '">' + $(this).text() + '</label></div>');
        });
        $('#devices-container').modal();
      });

      $('#devices-container').on('hide.bs.modal', function() {
        $('#selected_songs').empty();
      });

      $('button#playlist-order').click(function() {
       $('#order-container').modal(); 
      });

  } else if (currentPage == 'playlist' && currentView == 'index') {

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

    $(this).bind("contextmenu", function(e) { // disable browser contextmenu
        //e.preventDefault();
    });

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
                //if(event.hours_recovered) {
                    //$('.fc-content')
                    //.find("[data-date='" + event.start.format() + "']")
                    //.find('.fc-day-content')
                    //.after($('<div title="cucu" class="fc-event-comment"></div>')
                    //.html('din care <span class="badge">' + event.days[0] + '</span> ore recuperare'));
                //}
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
  } else if (currentPage == 'devices') {

    $('.device-context').contextmenu({
      target:'#device-context-menu', 
      before: function(e, context) {
      },
      onItem: function(context, e) {
        if(e.target.className == 'delete-device') {
          $('strong.device-name').html(context.text());
          $('.device-target-id').val(context.attr('data-device-id'));
          $('#delete-device-container').modal();
        } else if(e.target.className == 'update-device') {
          $.ajax({
              url: '/device/get',
              data: { 
                device_id: context.attr('data-device-id'),
              },
              type: "GET",
              success: function(data) {
                var container = '#update-device-container';
                $(container).find('input[id="device_id"]').val(data.id);
                $(container).find('input[name="device_name"]').val(data.name);
                $(container).find('textarea[name="device_address"]').val(data.address);
                $(container).find('textarea[name="device_obs"]').val(data.obs);
                $(container).find('input[name="device_sn"]').val(data.sn);
              }
          });
          $('#update-device-container').modal();
        } else if(e.target.className == 'attach-to-calendar') {
          $('.device-target-id').val(context.attr('data-device-id'));
          $.ajax({
              url: '/device/get_calendar',
              data: { device_id: context.attr('data-device-id') },
              type: "GET",
              traditional: true,
              success: function(data) {
                $('input[name="calendar_id"]').prop('checked', false);
                $('#attach-to-calendar-container').find('i.fa').remove();
                $('#attach-to-calendar-container').find('label').css('text-decoration', 'none');
                if(data) {
                  $('input[name="calendar_id"][value="'+ data +'"]').prop('checked', true);
                  $('input[name="calendar_id"][value="'+ data +'"]').parent().after('<i data-calendar-id="'+ data +'" title="Click to detach" class="fa fa-trash pull-right detach-calendar"></i>');
                  $('.detach-calendar').click(function() {
                    var detached = $(this).attr('data-calendar-id');
                    $('input[name="calendar_id"][value="'+ detached +'"]').prop('checked', false);
                    $('input[name="calendar_id"][value="'+ detached +'"]').parent().css('text-decoration', 'line-through');
                  });
                }
              }
          });
          $('#attach-to-calendar-container').modal();
        }
      }
    })

    var handler = Gmaps.build('Google');
    var coordinates = [];
    handler.buildMap({ internal: {id: 'multi_markers'}}, function() {
      $("ul#user_devices").find('li').each(function(index) {
        var latitude = $(this).attr('data-location-latitude');
        var longitude = $(this).attr('data-location-longitude');
        var address = $(this).text();
        coordinates.push ({
          lat: latitude, 
          lng: longitude,
          infowindow: address,
        });        
      });

      var markers = handler.addMarkers(coordinates);
      handler.bounds.extendWith(markers);
      handler.fitMapToBounds();
    });

    var geocoder = new google.maps.Geocoder();

    function codeAddress(user_address, callback) {
      geocoder.geocode( { 'address': user_address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var lat = results[0].geometry.location.lat();
          var lng = results[0].geometry.location.lng();
          var formatted = results[0].formatted_address;
          var obj = {
              fAddress: formatted,
              lat: lat,
              lng: lng
          };
          callback(obj);
        } else {
          console.log('Geocode was not successful for the following reason: ' + status);
        }
      });
    }

    $('#user_devices').btsListFilter('#search-device', { itemChild: 'h5' });

    $('button#new-device').click(function(){
      $('#new-device-container').modal();
    });
    $('textarea[name="device_address"]').change(function(){
      var updated_address = $(this).val();
      codeAddress(updated_address, function(res) {
        $('input#device_lat').val(res.lat);
        $('input#device_lng').val(res.lng);
        $('textarea[name="device_address"]').val(res.fAddress);
      });
    });
    $('form#update_device').submit(function(e) {
        var form = this;
        e.preventDefault();
        setTimeout(function () {
            form.submit();
        }, 1000); // 1 second delay before submit
    });
    $('button#submit-new-device').click(function(){
      var name = $('input#device-name').val();
      var address = $('textarea#device-address').val();
      var obs = $('textarea#device-obs').val();
      var sn = $('input#device-sn').val();
      codeAddress(address, function(res) {
        if(res) {
          $.ajax({
              url: '/device/new',
              data: { device_sn: sn, device_name: name, device_address: res.fAddress, device_obs: obs, lat: res.lat, lng: res.lng },
              type: "POST",
              traditional: true,
              success: function(data) {
                window.location = '/devices';
              }
          });
        }
      });
    });
  } else if (currentPage == 'playlist' && currentView == 'timeline') {
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
  } else if (currentPage == 'charts' && currentView == 'index') {

    google.load('visualization','1', { packages: ['corechart'], callback: draw_chart});

    function draw_chart() {
      var data_table = new google.visualization.DataTable();

      data_table.addColumn({'type':'string','label':'Calendar'});
      data_table.addColumn({'type':'number','label':'Events'});
      data_table.addColumn({'type':'number','label':'Devices'});
      data_table.addColumn({'type':'number'});
      data_table.addRow([{v: 'Calendar 1'}, {v: 30}, {v: 6}, {v: 1}]);
      data_table.addRow([{v: 'Calendar 2'}, {v: 46}, {v: 11}, {v: 998}]);
      data_table.addRow([{v: 'Calendar 55'}, {v: 20}, {v: 8}, {v: 997}]);
      data_table.addRow([{v: 'Calendar defined by mihai'}, {v: 9}, {v: 2}, {v: 996}]);
      data_table.addRow([{v: 'Calendar number 5'}, {v: 10}, {v: 3}, {v: 995}]);
      data_table.addRow([{v: 'This is a great calendar'}, {v: 15}, {v: 11}, {v: 994}]);

      var chart = new google.visualization.BarChart(document.getElementById('chart'));
      var view = new google.visualization.DataView(data_table);
      view.setColumns([0, 1, 2]);
      google.visualization.events.addListener(chart, 'select', function() {
        var selection = chart.getSelection();
        var row = selection[0].row;
        var calId = data_table.getValue(row, 3);
        console.log(calId);
        window.location = '/calendar/show/' + calId;
      });

      chart.draw(view, { 
        width: 'auto', 
        height: 420, 
        title: 'Devices and Events', 
        vAxis: {
          title: 'Calendars', 
          titleTextStyle: { color: 'red' }
        }
      });
    };
  } else if (currentPage == 'playlist' && currentView == 'display-7-days') {

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
  }
});
