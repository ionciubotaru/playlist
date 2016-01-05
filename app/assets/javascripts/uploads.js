$('.uploads.media').ready(function() {
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

          if ($(this).hasClass('selected')) {
              $(this).removeClass('selected');
          }
          else {
              table1.$('tr.selected').removeClass('selected');
              $(this).addClass('selected');
          }
		});
		
		$('i.delete-media-file').click(function() {
				var id = $(this).attr('data-file-id');
				$('input[name="id"]').val(id);
				$('strong.song-name').text($(this).attr('data-file-name'));
				$('#delete-media-container').modal(); 
    });

    $('button#show_upload_modal').click(function() {
       	$('#upload-container').modal(); 
    });

		$.urlParam = function(name) {
				var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
				if (results == null) {
						return null;
				} else {
						return results[1] || 0;
				}
		}
		$.getExtraParams = function() {
				var tab = $.urlParam('mediatype');
				var name = $('span#new-plist-name').text();
				return { mediatype: tab, plistName: name, color: '#c9e03b' }
		}

		$('.combobox').combobox();
		$('input.combobox').attr('placeholder', 'Type the playlist name or select an existing one..')

		$('.combobox-container .input-group input').on('keyup change', function() { 
				$('span#new-plist-name').text($(this).val());
		});
		$("#input-708").fileinput({
				uploadUrl: '/media/upload',
				uploadExtraData: $.getExtraParams,
				uploadAsync: false,
		}).on('filebatchselected', function(event, data) {
				$('.combo-container').removeClass('hide');
		}).on('filebatchuploadsuccess', function(event, data, previewId, index) {
				$('#upload-container').modal('hide');
				location.reload();
		});
});
