class UsersController < ApplicationController
#	skip_before_action :authenticate_user!
	def add
		user = User.create(
			active: 1,
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
		usr.save
		redirect_to '/manage/users'
	end
	def destroy
		return unless params[:user_id]
		User.find(params[:user_id]).destroy
		redirect_to '/manage/users'
	end
  def index
		@children = [ session[:user_id] ]
		@allusers = User.all
		childIds(session[:user_id])
		@users = User.where(id: @children).order(:name, :firstname)
  end
	def get_resources
		@devices = Device.where(user_id: params[:id])
		@res = Array.new
		@devices.each do |d|
			log=Log.where(device_id: d.id).order(id: :desc).first
			@res.push( 	'name' => d.name, 
									'location' => d.address, 
									'sn' => d.sn, 
									'sd' => d.sdfull, 
									'log' => log.created_at.to_formatted_s(:short), 
									'cal' => '<a href="/calendar/show/8">Magic Mega Mall</a>',
									last_m: 'Celine-Dion-Blue-Christmas',
									last_at: log.created_at.to_formatted_s(:short)
		)
		end
#		logger.debug @res
		render json: { 'data' => @res }
	end
	def get_data
		@user = User.where(id: params[:user_id])
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
			state: { 'selected' => true },
			has_children: 0
		} ]
  	render json: @tree
	end
#  def create
#  end
#  def change_password
#		user = User.find(session[:user_id])
#		user.password = params[:passwd_new]
#		user.password_confirmation = params[:passwd_verify]
#		user.save
#	  redirect_to '/'
#	end
private
	def child(parent_id)
		children = Array.new
		@users.each do |u|
			if u.parent_id==parent_id
				kids=child(u.id)
				children.push({ text: u.fullname, href: u.id, tags: [ u.devs ], nodes: (kids.empty? ? nil : kids ), has_children: (kids.empty? ? 0 : 1 ) }) 
			end
		end
		children
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

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :parent_id, :active)
  end
end
