class DevicesController < ApplicationController
  def index
    @devices=User.find(session[:user_id]).devices
    @calendars=User.find(session[:user_id]).calendars
		@users = myChildren() # in application_controller
#    @attached = Hash.new
#    @attached['calendar_id'] = 3
   end
  def chown
    e = Device.find(params[:device_id])
    e.user_id = params[:user_id] if params[:user_id]
		e.save
    redirect_to '/devices/'
  end
  def new
    device = Device.create(name: params[:device_name],address: params[:device_address],obs: params[:device_obs], lat: params[:lat], lng: params[:lng], sn: params[:device_sn])
    User.find(session[:user_id]).devices << device
    render json: '{}'
  end
  def destroy
    Device.find(params[:device_id]).destroy if(params[:device_id])
    redirect_to '/devices/'
  end
  def get
    @device = Device.where(id: params[:device_id], user_id: session[:user_id]).first
    render json: @device
  end
  def update
    e = Device.where(id: params[:device_id], user_id: session[:user_id]).first
    e.name = params[:device_name] if params[:device_name]
    e.address = params[:device_address] if params[:device_address]
    e.obs = params[:device_obs] if params[:device_obs]
    e.sn = params[:device_sn] if params[:device_sn]
    e.lat = params[:device_lat] if params[:device_lat]
    e.lng = params[:device_lng] if params[:device_lng]
<<<<<<< HEAD
    e.default_vol = params[:default_vol] if params[:default_vol]
=======
>>>>>>> b71dc3f177d170c9fc8bde7924fd28f948e88acc
    e.save
    redirect_to '/devices/'
  end
  def attach_calendar
    @device = Device.where(id: params[:device_id], user_id: session[:user_id]).first.update(calendar_id: params[:calendar_id])
    redirect_to '/devices/'
  end
  def get_calendar
    @device = Device.where(id: params[:device_id], user_id: session[:user_id]).first
    render json: @device.calendar_id
  end

end
