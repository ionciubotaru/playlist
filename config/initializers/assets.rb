# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'
Rails.application.config.assets.precompile += %w( video-js.swf vjs.eot vjs.svg vjs.ttf vjs.woff )
Rails.application.config.assets.precompile += %w( bootstrap-treeview/dist/bootstrap-treeview.min.js )
Rails.application.config.assets.precompile += %w( bootstrap-combobox/bootstrap-combobox.js )
Rails.application.config.assets.precompile += %w( bootstrap-fileinput/js/fileinput.min.js )
Rails.application.config.assets.precompile += %w( bootstrap-contextmenu/bootstrap-contextmenu.js )
Rails.application.config.assets.precompile += %w( bootstrap-duallistbox/bootstrap-duallistbox.js )
Rails.application.config.assets.precompile += %w( bootstrap-list-filter/bootstrap-list-filter.js )
Rails.application.config.assets.precompile += %w( fullcalendar-rightclick/fullcalendar-rightclick.js )

# Add additional assets to the asset load path
# Rails.application.config.assets.paths << Emoji.images_path

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in app/assets folder are already added.
# Rails.application.config.assets.precompile += %w( search.js )
