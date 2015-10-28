Rails.application.routes.draw do

  get 'devices/index'
  get 'playlist/index'

  get '/calendars', to: 'playlist#index'
  get '/charts', to: 'charts#index'
  get '/calendar/show/:id', to: 'playlist#display_7_days'
  get '/timelines', to: 'timelines#index'
  get '/timelines/log', to: 'timelines#log'
  post '/timelines/map', to: 'timelines#map'
  root 'devices#index'
  post '/device/new', to: 'devices#new'
  get '/device/get', to: 'devices#get'
  post '/device/delete', to: 'devices#destroy'
  post '/device/update', to: 'devices#update'
  post '/device/attach', to: 'devices#attach_calendar'
  get  '/device/get_calendar', to: 'devices#get_calendar'
  post '/calendar/delete', to: 'playlist#delete_calendar'
  post '/calendar/update', to: 'playlist#update_calendar'
  post '/calendar/new', to: 'playlist#new_calendar'
  get  '/calendar/devices', to: 'playlist#calendar_devices'
  get  '/calendar/get_devices', to: 'playlist#get_devices'
  post '/calendar/attach', to: 'playlist#attach_devices'
  post '/text/new', to: 'playlist#new_text'
  post '/text/delete', to: 'playlist#delete_text'
  post '/text/update', to: 'playlist#update_text'

  post '/media/get', to: 'playlist#get_media'
  post '/playlist/audio/new', to: 'playlist#new_plist'
  post '/playlist/video/new', to: 'playlist#new_plist'
  post '/playlist/delete', to: 'playlist#delete_plist'
  post '/playlist/content', to: 'playlist#content_plist'
  get  '/playlist/content', to: 'playlist#media_in_plist'
  get  '/playlist/content/count', to: 'playlist#plist_count'
  post '/playlist/audio/update', to: 'playlist#update_plist'
  post '/playlist/video/update', to: 'playlist#update_plist'

  #root 'groups#index'
  get  '/devices', to: 'devices#index'
  get  '/events/get' => 'playlist#get'
  post '/events/add' => 'playlist#add'
  post '/events/update' => 'playlist#update'
  post '/event/delete' => 'playlist#destroy'
  post '/event/repeat' => 'playlist#repeat'
  post '/event/saverepeat' => 'playlist#saverepeat'

  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  get '/logout' => 'sessions#destroy'

  get '/signup' => 'users#new'
  post '/users' => 'users#create'
  post '/users/password' => 'users#change_password'

  get '/media', to: 'uploads#media'
  get '/locations', to: 'locations#index'
  post '/media/upload', to: 'uploads#upload'
  post '/media/update', to: 'uploads#update'
  post '/media/sort', to: 'playlist#sort'
  get '/upload', to: 'uploads#index'
  delete '/media/song/:id'  => 'uploads#destroy'
  #post '/upload/upload', to: 'uploads#upload'

  get '/cron', to: 'cron#index'
  get '/serial', to: 'serial#index'
  get '/download', to: 'serial#download'
  get '/clean', to: 'serial#clean'
  get '/pi', to: 'serial#pi'

  if Rails.env.production?
    get '*path' => redirect('/')
  end

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
