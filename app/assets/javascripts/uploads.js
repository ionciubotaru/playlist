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
<<<<<<< HEAD
			//select: {
			//		style: 'os',
			//},
			aoColumns: [
					{ bSortable: false, width: '2%' },
=======
			aoColumns: [
>>>>>>> b71dc3f177d170c9fc8bde7924fd28f948e88acc
					{ bSortable: true, width: '3%' },
					{ bSortable: true, width: '50%', sClass: 'text-left' },
					{ bSortable: true, width: '10%', sClass: 'text-right' },
					{ visible: false },
					{ visible: false },
					{ visible: false },
<<<<<<< HEAD
=======
					{ bSortable: false, width: '5%', sClass: 'text-right' },
>>>>>>> b71dc3f177d170c9fc8bde7924fd28f948e88acc
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
<<<<<<< HEAD
            selected = '/songs/' + aData[5]+ '/' + aData[6] + aData[4];
=======
            selected = '/songs/' + aData[4]+ '/' + aData[5] + aData[3];
>>>>>>> b71dc3f177d170c9fc8bde7924fd28f948e88acc
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
		
<<<<<<< HEAD
=======
		$('i.delete-media-file').click(function() {
				var id = $(this).attr('data-file-id');
				$('input[name="id"]').val(id);
				$('strong.song-name').text($(this).attr('data-file-name'));
				$('#delete-media-container').modal(); 
    });
>>>>>>> b71dc3f177d170c9fc8bde7924fd28f948e88acc

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
<<<<<<< HEAD

		$('#media-table').on('change' , '.checkbox' , function(){
				if(this.checked) {
					$('#delete_selected').removeClass('hide');
				} else if($('#media-table input:checked').length == 0) {
					$('#delete_selected').addClass('hide');
				}
		});

    $('body').on('click', 'button#delete_selected', function() {
				var selected = [];
				$('#media-table input:checked').each(function() {
						selected.push($(this).attr('data-row-id'));
				});
				$('strong.song-items').text(selected.length);
				$('#delete-media-container').modal(); 
				deleteMedia(selected);
		});

		function deleteMedia(items) {
    		$('#delete-media-container').on('click', 'button#do_delete', function() {
						$.ajax({
							type: 'POST',
							url: '/media/delete',
							data: { selected: items },
							success: function(data) {
								//$('#delete-media-container').modal('hide'); 
								location.reload();
							}
						});
				});
		}
	
=======
>>>>>>> b71dc3f177d170c9fc8bde7924fd28f948e88acc
});
