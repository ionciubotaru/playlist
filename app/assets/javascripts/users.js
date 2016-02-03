$('.users.index').ready(function() {
				$.ajax({
					url: '/users/tree',
					type: "GET",
					success: function(data) {
								$('#uTree').treeview({
									data: data,
									showTags: true,
									onNodeSelected: function(event, node) {
										getUserData(node.href);
										$('#info-container').addClass('hide');
										$('#table-container').removeClass('hide');
										table.ajax.url('/user/getresources?id=' + node.href).load();
										$('i#update-user')
										.css({ 'opacity': '1', 'cursor': 'pointer' })
										.attr('data-user-id', node.href)
										.attr('data-user-name', node.text);
										if(node.enabled) {
											$('i#su-user')
											.css({ 'opacity': '1', 'cursor': 'pointer' })
											.attr('data-user-id', node.href)
											.attr('data-user-name', node.text);
										}
										if (node.nodeId !== 0) {
														if(node.has_children === 0 ) {
															$('i#delete-user')
															.css({ 'opacity': '1', 'cursor': 'pointer' })
															.attr('data-user-id', node.href)
															.attr('data-user-name', node.text);
														}
										}
									},
									onNodeUnselected: function(event, node) {
										$('i#update-user, i#delete-user, i#su-user').css({ 'opacity': '0.4', 'cursor': 'not-allowed' }).removeAttr('data-user-id');
										$('#info-container').removeClass('hide');
										$('#table-container').addClass('hide');
									},
								});
								$('#uTree').treeview('selectNode', [ 1, { silent: false } ]).treeview('selectNode', [ 0, { silent: false } ]);
					}
			  });
				$('#icons').on('click', '#new-user', function() {
						$.ajax({
								url: '/user/modals/new',
								type: "GET",
								success: function(data) {
										validateUser();
								}
						});
				});
				$('#icons').on('click', '#delete-user', function() {
						var id = $(this).attr('data-user-id');
						var name = $(this).attr('data-user-name');
						if (typeof id !== typeof undefined && id !== false) {
								$.ajax({
										url: '/user/modals/delete',
										type: "GET",
										success: function(data) {
											$('.username').text(name);
											$('.user-target-id').val(id);
										} 
								});
						}
				});
				$('#icons').on('click', '#update-user', function() {
						var attr = $(this).attr('data-user-id');
						if (typeof attr !== typeof undefined && attr !== false) {
							$('input#user_id').val(attr);
							$('#update-user-container').modal();
						}
				});
				$('#icons').on('click', '#su-user', function() {
						var id = $(this).attr('data-user-id');
						var name = $(this).attr('data-user-name');
						if (typeof id !== typeof undefined && id !== false) {
							$.ajax({
									url: '/user/modals/su',
									type: "GET",
									success: function(data) {
										$('.destination-username').text(name);
									}
							});
						}
				});
				$('i#collapse-tree').click(function(){
					$('#uTree').treeview('collapseAll', { silent: true });
					$(this).addClass('hide');
					$('i#expand-tree').removeClass('hide');
				});
				$('i#expand-tree').click(function(){
					$('#uTree').treeview('expandAll', { silent: true });
					$(this).addClass('hide');
					$('i#collapse-tree').removeClass('hide');
				});

        var search = function(e) {
          var pattern = $('input#search-user').val();
          var options = {
            ignoreCase: true,
            revealResults: true
          };
					$('#uTree').treeview('search', [ pattern, options ]);
        }
				$('input#search-user').on('keyup', search);

				function getUserData(id) {
								$.ajax({
									url: '/user/getdata',
									data: { user_id: id },
									type: "GET",
									success: function(data) {
												$('input#update-active').prop('checked', data.active);
												//data.active == 'true' ? $('input[name="active"]').val('1') : $('input[name="active"]').val('0'); 
												$('input[name=firstname]').val(data.firstname);
												$('strong[id=fn]').text(data.firstname);
												$('input[name=lastname]').val(data.name);
												$('strong[id=ln]').text(data.name);
												$('input[name=mail]').val(data.email);
												$('textarea[name=adddatas]').val(data.adddatas);
												$('textarea[name=obs]').val(data.obs);
												$('select#parent option[value=' + data.parent_id + ']').prop('selected', true);
									}
								});
				}
				function validateUser() {
								$('form#new-user').bootstrapValidator({
										excluded: [':disabled'],
										feedbackIcons: {
												valid: 'glyphicon glyphicon-ok',
												invalid: 'glyphicon glyphicon-remove',
												validating: 'glyphicon glyphicon-refresh'
										},
										fields: {
												firstname: {
														validators: {
																notEmpty: {
																		message: 'Mandatory field!'
																},
														}
												},
												lastname: {
														validators: {
																notEmpty: {
																		message: 'Mandatory field!'
																},
														}
												},
												mail: {
														validators: {
																notEmpty: {
																		message: 'Mandatory field!'
																},
														}
												},
												newpasswd: {
														validators: {
																notEmpty: {
																		message: 'Mandatory field!'
																},
																stringLength: {
																		min: 6,
																		message: 'Password length must exceed 5 chars!'
																},
														}
												},
												repeat_newpasswd: {
														validators: {
																notEmpty: {
																		message: 'Mandatory field!'
																},
																identical: {
																		field: 'newpasswd',
																		message: 'Password doesn\'t match!'
																},
														}
												},
										},
								});
				}
				$('#new-user-container').on('hidden.bs.modal', function() {
						$('form#new-user').data('bootstrapValidator').destroy();
						$('form#new-user').find('input, textarea').val('');
						
				});

				/* Formatting function for row details - modify as you need */
				function format ( d ) {
						// `d` is the original data object for the row
						return '<table cellpadding="5" cellspacing="0" border="0" style="margin-left: 60px;">'+
								'<tr>'+
										'<td>Calendar:</td>'+
										'<td title="Clic for 7 days report"><a href="/calendar/show/'+d.cal_id+'">'+d.cal+'</a></td>'+
								'</tr>'+
								'<tr>'+
										'<td>Last mediafile:</td>'+
										'<td>'+d.last_m+' at '+ d.last_at+'</td>'+
								'</tr>'+
								'<tr>'+
										'<td>Extra info:</td>'+
										'<td>And any further details here (images, link to files, etc, etc)...</td>'+
								'</tr>'+
						'</table>';
				}
				var table = $('#example').DataTable({
						//paging: false,
						//ordering: false,
						//info: false,
						//searching: false,
						//retrieve: true,
						"columns": [
								{
										"className":      'details-control',
										"orderable":      false,
										"data":           null,
										"defaultContent": ''
								},
								{ "data": "name" },
								{ "data": "location" },
								{ "data": "sn" },
								{ "data": "sd", sClass: 'text-center' },
								{ "data": "log", sClass: 'text-right' }
						],
						"order": [[1, 'asc']]
				});
					 
				// Add event listener for opening and closing details
				$('#example tbody').on('click', 'td.details-control', function () {
						var tr = $(this).closest('tr');
						var row = table.row( tr );
		 
						if ( row.child.isShown() ) {
								// This row is already open - close it
								row.child.hide();
								tr.removeClass('shown');
						} else {
								// Open this row
								row.child( format(row.data()) ).show();
								tr.addClass('shown');
						}
				});
});
