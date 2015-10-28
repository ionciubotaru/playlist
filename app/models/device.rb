class Device < ActiveRecord::Base
  belongs_to :user
  belongs_to :calendar

  def active
    log=Log.where('operation like "%'+self.sn+'%"').order(id: :desc).first if not self.sn.empty?
    if not log
      color='danger disabled'
    elsif (Time.now - log.created_at) < 12*60
      color='success'
    elsif (Time.now - log.created_at) < 30*60
      color='warning'
    else
      color='danger'
    end
    msg='<a data-remote="true" href="/timelines/log" class="btn btn-'+color+' btn-xs" role="button">'+(log ? log.created_at.to_formatted_s(:short) : "&nbsp;&nbsp;&nbsp;&nbsp;Never&nbsp;&nbsp;&nbsp;&nbsp;") +'</a>'
    msg
  end
  
  def full
    if self.sdfull == nil
      msg='class="label label-default">0'
    elsif self.sdfull <= 80
      msg='class="label label-success">'+self.sdfull.to_s
    elsif self.sdfull > 80 and self.sdfull < 86
      msg='class="label label-warning">'+self.sdfull.to_s
    else
      msg='class="label label-danger">'+self.sdfull.to_s
    end    
    msg
  end
  
end
