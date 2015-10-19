class Device < ActiveRecord::Base
  belongs_to :user
  belongs_to :calendar

  def active
    log=Log.where('operation like "%'+self.sn+'%"').order(id: :desc).first
    if not log or self.sn.empty?
      msg='class="label label-default">Never'
    elsif (Time.now - log.created_at) < 12*60
      msg='class="label label-success">'+log.created_at.to_formatted_s(:short)
    elsif (Time.now - log.created_at) < 30*60
      msg='class="label label-warning">'+log.created_at.to_formatted_s(:short)
    else
      msg='class="label label-danger">'+log.created_at.to_formatted_s(:short)
    end    
    msg
  end
end
