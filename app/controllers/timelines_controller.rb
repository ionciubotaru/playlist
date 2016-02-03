class TimelinesController < ApplicationController
  def index
    @calendars = Calendar.where(user_id: session[:user_id])
    @devices = Device.where(user_id: session[:user_id])
  end
  def map
    map = Device.where(user_id: session[:user_id], id: params[:device_id]).first
    calendar = Calendar.where(user_id: session[:user_id], id: params[:calendar_id]).first
    map.calendar_id = calendar.id
    map.save
    render json: '{}'
  end
  def log
    @device=Device.find(params[:id] || 0)    
    @logs=get_log(@device.id,300)
  end
end
