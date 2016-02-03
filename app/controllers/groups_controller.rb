class GroupsController < ApplicationController
  def index
    devices=User.find(session[:user_id]).devices.select('group_id')
    @groups=Group.where(id: devices)
   end
end
