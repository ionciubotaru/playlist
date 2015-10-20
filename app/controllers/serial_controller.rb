class SerialController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    rasp='{}'
    t = Time.now.to_date
    device=Device.where(sn: params[:serial]).first
    if not device
      Log.create(operation: "Invalid license "+(params[:serial] || ''))
      render text: "Invalid license" and return
    else
      Log.create(operation: "Update "+params[:serial]+" object "+(params[:object] || ""))
    end
    if device and params[:object]
	      if params[:object]=='Mediafile'
    	    mediafile_ids1 = Parentcalendarmediafile.select('mediafile_id').where(['calendar_id=? and mediafile_id is not null', device.calendar.id])
    	    plist_ids = Parentcalendarmediafile.select('plist_id').where(['calendar_id=? and plist_id is not null', device.calendar.id])
    	    mediafile_ids2 = Plistmediafile.select('mediafile_id').where(['plist_id in (?)', plist_ids])
	        rasp=Mediafile.where(['id in (?) or id in (?)',mediafile_ids1, mediafile_ids2])
	      elsif params[:object]=='Plist'
    	    plist_ids = Parentcalendarmediafile.select('plist_id').where(['calendar_id=? and plist_id is not null', device.calendar.id])
	        rasp=Plist.where(id: plist_ids)
	      elsif params[:object]=='Calendar'
	        rasp=Calendar.where(id: device.calendar_id)
	      elsif params[:object]=='Calendarmediafile'
    	    ids = Parentcalendarmediafile.select('id').where(calendar_id: device.calendar.id)
    	    rasp = Calendarmediafile.where(['parentcalendarmediafile_id in (?) and date(start) between ? and date(DATE_ADD(?,INTERVAL 14 DAY))', ids, t, t])
      	elsif params[:object]=='Parentcalendarmediafile'
      	  rasp = Parentcalendarmediafile.where(['calendar_id=? and ? between date(`from`) and date(`to`)', device.calendar.id, t])
      	elsif params[:object]=='Plistmediafile'
    	    plist_ids = Parentcalendarmediafile.select('plist_id').where(['calendar_id=? and plist_id is not null', device.calendar.id])
    	    rasp = Plistmediafile.where(['plist_id in (?)', plist_ids])
      	else
      	    rasp=Log.where(id: 0)
      	end
      	begin
      	    max=rasp.maximum(:created_at).strftime("%s")
      	rescue
      	    max=0
      	end
      	rasp='{}' if max == params[:max]
    end
    render json: rasp || '{}'
  end
  
  def download
    begin
        send_file Rails.root.to_s+'/public/songs/'+params[:user_id]+'/'+params[:song], :type=>"application/zip", :x_sendfile=>true
    rescue
	  render text: "Error" and return
    end
  end
  
  def clean
    user_ids=User.select('id').all
    Mediafile.where.not(user_id: user_ids).destroy_all
    media=Mediafile.select('id,ext,checksum,user_id').where('mediatype<5')
    media.each do |m|
        song_name = Rails.root.to_s+"/public/songs/"+m.user_id.to_s+"/"+m.id.to_s+m.ext
        if not File.exist?(song_name)
	        m.destroy
      #	elsif not m.checksum==Digest::SHA2.file(song_name).hexdigest
      #	    m.destroy
      #	    File.delete(song_name)
      	end
    end
    Plist.where.not(user_id: user_ids).destroy_all
    Device.where.not(user_id: user_ids).destroy_all
    Calendar.where.not(user_id: user_ids).destroy_all
    mediafile_ids=Mediafile.select('id').all
    plist_ids=Plist.select('id').all
    Plistmediafile.where.not(plist_id: plist_ids).destroy_all
    Plistmediafile.where.not(mediafile_id: mediafile_ids).destroy_all
    calendar_ids=Calendar.select('id').all
    Parentcalendarmediafile.where.not(calendar_id: calendar_ids).destroy_all
    Parentcalendarmediafile.where(['mediafile_id not in (?) and mediafile_id is not null', mediafile_ids]).destroy_all
    Parentcalendarmediafile.where(['plist_id not in (?) and plist_id is not null', plist_ids]).destroy_all
    Parentcalendarmediafile.where('mediafile_id is null and plist_id is null and destmediatype<>5').destroy_all
    parentcalendarmediafile_ids=Parentcalendarmediafile.select('id').all
    Calendarmediafile.where.not(parentcalendarmediafile_id: parentcalendarmediafile_ids).destroy_all
    Device.where('lat is null or lng is null').update_all(lat: 44.4268, lng: 26.1025)
    render text: 'Ok'
  end
  
  def pi
    device=Device.where(sn: params[:serial]).first
    if device
      device.version=params[:version]
      device.sdfull=params[:full]
      device.save
      Log.create(operation: "Alive "+params[:serial])
      txt="Ok"
    else
      txt="Error"
    end
    render text: txt
  end

end

