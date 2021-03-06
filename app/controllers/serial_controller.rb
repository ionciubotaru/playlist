class SerialController < ApplicationController
  skip_before_action :authenticate_user!
  def index
    rasp='{}'
    t = Time.now.to_date
    remote=request.env["REMOTE_ADDR"]
    device=Device.where(sn: params[:serial]).first
    if not device
      Log.create(operation: "Invalid license "+(params[:serial] || ''), remote: remote)
      render text: "Invalid license" and return
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
<<<<<<< HEAD
    	elsif params[:object]=='Device'
        rasp = Device.select('default_vol').where(sn: params[:serial]).first
=======
>>>>>>> b71dc3f177d170c9fc8bde7924fd28f948e88acc
    	else
    	    rasp=Log.where(id: 0)
    	end
    	begin
    	    max=rasp.maximum(:created_at).strftime("%s")+"I"+rasp.sum(:id).to_s
#    	    render text: max and return
    	rescue
    	    max=0
    	end
    	if max == params[:max]
        rasp='{}'
      else
        Log.create(operation: params[:object], device_id: device.id, operation_type: 3,remote: remote)
      end
    elsif device and params[:mediafile]
      Log.create(device_id: device.id,mediafile_id: params[:mediafile],operation_type: params[:operationtype],remote: remote)
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
    if device and params[:kill]=="1"
      Log.create(device_id: device.id, operation_type: 5,remote: request.env["REMOTE_ADDR"])
      txt = "OK"
    elsif device
      device.version=params[:version]
      device.sdfull=params[:full].to_i+10
      device.save
      Log.create(device_id: device.id, operation_type: 4,remote: request.env["REMOTE_ADDR"])
      txt=device.order
      txt = "Ok" if not txt
    else
      Log.create(operation: params[:serial], operation_type: 9,remote: request.env["REMOTE_ADDR"])
      txt="Error"
    end
    render text: txt
  end

  def debug
    device=Device.where(sn: params[:serial]).first
    if device
      Log.create(device_id: device.id, operation_type: 8,remote: request.env["REMOTE_ADDR"],operation: params[:operation])
      txt = "OK"
    else
      txt = "Err"
    end
    render text: txt
  end

end

