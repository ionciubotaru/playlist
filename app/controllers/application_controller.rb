class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  #after_filter :add_flash_to_header
  add_flash_types :danger, :success, :info, :warning

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def message(id)
    message=Message.find(id)
    message.ro || "#Message error"
  end
  helper_method :message

  def authenticate_user!
    if current_user.nil?
      session[:requested_path] = request.url if request.get?
      redirect_to '/login'
    end
  end

 
  def add_flash_to_header
    # only run this in case it's an Ajax request.
    return unless request.xhr?
 
    # add different flashes to header
    response.headers['X-Flash-Error'] = flash[:error] unless flash[:error].blank?
    response.headers['X-Flash-Warning'] = flash[:warning] unless flash[:warning].blank?
    response.headers['X-Flash-Notice'] = flash[:notice] unless flash[:notice].blank?
    response.headers['X-Flash-Message'] = flash[:message] unless flash[:message].blank?
 
    # make sure flash does not appear on the next page
    flash.discard
  end
  def get_log(dev,limit)
    logs=Log.select('logs.*,mediafiles.name,mediafiles.mediatype')
      .joins(:mediafile)
      .where("device_id = #{dev} and operation_type in (1,2)").order(created_at: :desc).limit(limit)
    logs
  end
  def myChildren
		@children = [ session[:user_id] ]
		@allusers = User.all
		childIds(session[:user_id])
		users = User.where(id: @children).order(:name, :firstname)
		users
  end
	def childIds(parent_id)
		@allusers.each do |u|
			if u.parent_id==parent_id
				@children.push(u.id) 
				childIds(u.id)
			end
		end
		@children
	end
end
