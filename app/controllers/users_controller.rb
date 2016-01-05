class UsersController < ApplicationController
#	skip_before_action :authenticate_user!
	def add
		user = User.create(
			active: params[:active],
			name: params[:lastname],
			firstname: params[:firstname],
			address: params[:address],
			email: params[:mail],
			obs: params[:obs],
			parent_id: params[:parent_id],
			password: params[:newpasswd]
		)
		redirect_to '/manage/users'
	end
	def update
		usr=User.find(params[:user_id])
		usr.name=params[:lastname]
		usr.firstname=params[:firstname]
		usr.address=params[:address]
		usr.email=params[:mail]
		usr.obs=params[:obs]
		usr.parent_id=params[:parent_id] if params[:parent_id].to_i>0
		usr.password=params[:newpasswd] if not params[:newpasswd].empty?
		params[:active] ? usr.active=1 : usr.active=0
		usr.save
		redirect_to '/manage/users'
	end
	def destroy
		return unless params[:user_id]
		User.find(params[:user_id]).destroy
		redirect_to '/manage/users'
	end
  def index
		@users = myChildren() # in application_controller
  end
	def get_resources
		@devices = Device.where(user_id: params[:id])
		@res = Array.new
		@devices.each do |d|
			begin
				log= get_log(d.id,1).first
				log1=Log.where(device_id: d.id).order(id: :desc).first
				last= log1.created_at.to_formatted_s(:short)
				created_at= log.created_at.to_formatted_s(:short)
				log_name= log.name
				cal=Calendar.where(id: d.calendar_id).first
				cal_name= cal.name
			rescue
				created_at,last,cal_name,log_name=''
			end
			@res.push( 	name: d.name, 
									location: d.address, 
									sn: d.sn, 
									sd: d.sdfull, 
									log: last,
									cal_id: d.calendar_id,
									cal: cal_name,
									last_m: log_name,
									last_at:  created_at
		)
		end
#		logger.debug @res
		render json: { 'data' => @res }
	end
	def get_data
		@user = User.find(params[:user_id])
		render json: @user 
	end
 	def get_tree
		@users=User.all
		parent = User.find(session[:user_id])
		@tree = [ {
			tags: [ parent.devs ],
			href: parent.id,
			text: parent.fullname,
			nodes: child(session[:user_id]),
			has_children: 0
		} ]
  	render json: @tree
	end
	def modal_new
		@users = myChildren()
		render :template => "/users/actions/new"
	end
	def modal_delete
		render :template => "/users/actions/delete"
	end
	def modal_su
		render :template => "/users/actions/su"
	end
private
	def child(parent_id)
		children = Array.new
		@users.each do |u|
			u.active ? color = '#333333' : color = 'lightgrey'
			if u.parent_id==parent_id
				kids=child(u.id)
				children.push({ 
					text: u.fullname, 
					enabled: u.active, 
					color: color || '#333333',
					href: u.id, 
					tags: [ u.devs ], 
					nodes: (kids.empty? ? nil : kids ), 
					has_children: (kids.empty? ? 0 : 1 ) 
				}) 
			end
		end
		children
	end
#  def user_params
#    params.require(:user).permit(:name, :email, :password, :password_confirmation, :parent_id, :active)
#  end
end
