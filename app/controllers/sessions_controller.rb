class SessionsController < ApplicationController
  skip_before_action :authenticate_user!

  def new
    session[:requested_path] = request.url if request.get? and not request.url.include?("/login")
  end

  def create
    user = User.find_by_email(params[:email])
    if user && user.authenticate(params[:password]) && user.active
      session[:user_id] = user.id
      redirect_to session[:requested_path] || root_url
    else
      redirect_to login_url
    end
  end

  def destroy
    session[:user_id] = nil
    session[:requested_path] = nil
    redirect_to login_url
  end
end
