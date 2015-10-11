class UsersController < ApplicationController
    skip_before_action :authenticate_user!
    def new
    end

    def create
      user = User.new(user_params)
      if user.save
        session[:user_id] = user.id
        redirect_to '/'
      else
        redirect_to '/signup'
      end
    end

    def change_password
	user = User.find(session[:user_id])
	user.password = params[:passwd_new]
	user.password_confirmation = params[:passwd_verify]
	user.save
        redirect_to '/'
    end

private

  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
