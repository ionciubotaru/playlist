class Device < ActiveRecord::Base
  belongs_to :user
  belongs_to :calendar

  def active
    log=Log.where('operation like "%'+self.sn+'%"').order(id: :desc).first
    dif = (not self.sn.empty? and log and (Time.now - log.created_at) < 12*60 ? true : false)
    dif
  end
end
