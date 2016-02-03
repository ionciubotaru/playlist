$('.devices.index').ready(function() {
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
                $(container).find('input[name="default_vol"]').val(data.default_vol);
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
        } else if(e.target.className == 'chown-device') {
					var owner_id = $('input#current_user_id').val();
          $('input[name="device_id"]').val(context.attr('data-device-id'));
          $('strong.device_name').html(context.text());
					$('input[name="user_id"][value="'+ owner_id +'"]').prop('checked', true)
					$('#chown-container').modal();
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
});
