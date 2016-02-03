 class CronController < ApplicationController
  skip_before_action :authenticate_user!

  def index
    t=Time.now
    cron=Cron.first
    cron.u1,cron.u2,cron.u3,cron.u4,cron.u5 = false,false,false,false,false
    serial="123"
    device=Device.where(sn: serial).first
    if not device
        Log.create(operation: "Unknown device "+serial)
        render text: "Err" and return
    end
    data = Calendarmediafile.select('calendarmediafiles.id as id1,calendarmediafiles.*,parentcalendarmediafiles.*')
	.joins(:parentcalendarmediafile)
	.where(['destmediatype=1 and calendar_id=? and date(calendarmediafiles.start)=?', device.calendar_id, t.to_date])
	.order('calendarmediafiles.id')
    for i in ["4","3","2","1"]
	data.each do |d|
	    if d.destmediatype==i.to_i and t.between?(d.start,d.end) and eval('cron.u'+i+'==false')
		if not eval('cron.pl'+i+'==d.id'+i)
		    play(i,'start')
		    eval('cron.pl'+i+'=d.id'+i)
		end
		eval('cron.u'+i+'=true')
	    end
	end
    end
    for i in ["4","3","2","1"]
	if eval('not cron.u'+i+' and not cron.pl'+i+'==0')
	    play(i,'stop')
	    eval('cron.pl'+i+'=0')
	end
    end
    cron.save
    render xml: data and return


    @media = Mediafile.where(user_id: session[:user_id])
    @plists = Plist.where(user_id: session[:user_id]).includes(:plistmediafiles)

  end

  def play(playlist,action,file='',out='local')
    if action=='start'
	`touch /tmp/pl#{playlist}`
	`screen -X -S "pl#{playlist}" kill`
	`screen -dmS "pl#{playlist}" sh -c 'omxplayer -o #{out} "#{file}" < /tmp/pl#{playlist}; exec bash'`
    elsif action=='pause'
	`echo -n p >> /tmp/pl#{playlist}`
    elsif action=='stop'
	`screen -X -S "pl#{playlist}" kill`
    end
    Log.create(operation: "Pl "+playlist+" action "+action+" file "+file)
  end

end

#logger.debug "A #{d.id1} #{t} #{d.start} #{d.end}"
