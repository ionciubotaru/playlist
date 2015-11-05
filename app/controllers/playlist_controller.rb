class PlaylistController < ApplicationController
  def index
    @calendars = Calendar.where(user_id: session[:user_id])
    @media = Mediafile.where(user_id: session[:user_id])
    @plists = Plist.where(user_id: session[:user_id]).includes(:plistmediafiles)
    @devices = Device.where(user_id: session[:user_id])
  end
  def add
    parent = Parentcalendarmediafile.new
    data = Calendarmediafile.new
    _start = Time.at((params[:start]).to_i/1000).utc.strftime('%Y-%m-%d %H:%M.%S')
    parent.calendar_id = params[:calendar_id]
    data.start = _start
    data.end = data.start + ( ["1","2"].include?(params[:mediatype]) ? 1.hour : 10.minute )
    parent.tstart = data.start.to_s(:time)
    parent.duration1 = ["1","2"].include?(params[:mediatype]) ? 1 : 0
    parent.volume = ["3","4"].include?(params[:mediatype]) ? 30 : 0
    parent.destmediatype = params[:mediatype]
    parent.mediafile_id = params[:mediafile_id] if params[:mediatype]=="3" or params[:mediatype]=="4" or params[:mediatype]=="5"
    parent.plist_id= params[:mediafile_id] if params[:mediatype]=="1" or params[:mediatype]=="2"
    parent.audio = true if params[:mediatype]=="1" or params[:mediatype]=="3" or params[:mediatype]=="5"
    parent.hdmi = !parent.audio
    parent.from = _start.to_date
    parent.to = _start.to_date
    parent.d1, parent.d2, parent.d3, parent.d4, parent.d5, parent.d6, parent.d0 = 1, 1, 1, 1, 1, 1, 1
    parent.save
    data.parentcalendarmediafile_id = parent.id
    data.save
    render json: '{}'
  end
  def repeat
    @event = Calendarmediafile.find(params[:event_id])
    @parent = @event.parentcalendarmediafile
    @media = ( @parent.mediafile_id ? @parent.mediafile : @parent.plist)
  end
  def saverepeat
    event = Calendarmediafile.find(params[:event_id])
    parent = event.parentcalendarmediafile
    audio,hdmi = params[:audio], params[:hdmi]
    if not audio and not hdmi
	    audio=true if parent.destmediatype==1 or parent.destmediatype==3 or parent.destmediatype==5
	    hdmi =true if parent.destmediatype==2 or parent.destmediatype==4
    end
    @caltype=parent.destmediatype
    parent.update(from: params[:from], to: params[:to],
	    d1: params[:d1],d2: params[:d2],d3: params[:d3],d4: params[:d4],d5: params[:d5],d6: params[:d6],d0: params[:d0],
	    tstart: params[:start], duration1: params[:duration1], duration2: params[:duration2], repeat: params[:repeat] || 0,
	    every: params[:every] || 0, volume: params[:volume], audio: audio, hdmi: hdmi )
    Calendarmediafile.where(parentcalendarmediafile_id: event.parentcalendarmediafile_id).destroy_all
#   offset = "+0200"
    offset = Time.zone.now.strftime("%:z")
    params[:from].to_date.upto(params[:to].to_date) do |date|
	    if eval('params[:d'+(date.wday).to_s+']=="on"')
	      start = (date.to_s+' '+params[:start]).to_datetime.change(offset: offset)
	       if [3,4,5].include?(@caltype)
		        for i in 1..[1,parent.repeat].max
		          end1 = start + (@caltype==5 ? parent.duration1.hour + parent.duration2.minute : 10.minute)
		          Calendarmediafile.create(parentcalendarmediafile_id: event.parentcalendarmediafile_id, start: start.to_s, end: end1.to_s) if date.to_date==end1.to_date
		          start = start + [1,parent.every].max.minute
        		end
	       else
		        end1 = start + parent.duration1.hour + parent.duration2.minute
		        end1 = (date.to_s+' 23:59:29').to_datetime.change(offset: offset) if not start.to_date==end1.to_date
		        Calendarmediafile.create(parentcalendarmediafile_id: event.parentcalendarmediafile_id, start: start, end: end1)
	        end
	    end
    end
  end
  def get
    @data = Parentcalendarmediafile.select('parentcalendarmediafiles.*, calendarmediafiles.*')
	    .joins(:calendarmediafiles)
	    .where('calendar_id = ? and destmediatype = ? and ? between date(start) and date(end)', params[:calendar_id], params[:mediatype], params[:start])
    @events = Array.new
    @data.each do |t|
      case t.destmediatype
      when 1
        color = t.plist.color
      when 2
        color = t.plist.color
      when 3
        color = '#3a87ad'
      when 4
        color = '#3a87ad'
      end
      @events.push({  'id' => t.id, 
                      'start' => t.start, 
                      'end' => t.end,
                      'title' => (t.mediafile_id ? Mediafile.find(t.mediafile_id).name : Plist.find(t.plist_id).name),
                      'color' => color,
                      'plist_id' => t.plist_id || '',
                      'mediafile_id' => t.mediafile_id || '',
                      'type' => t.destmediatype,
                      'has_repeat' => (t.to - t.from > 0 ? "1" : "0" ),
                      'repeat_days' => get_days(t),
      })
    end
    render json: @events
  end
  def update
    event = Calendarmediafile.find(params[:id])
    event.start = params[:start] if params[:start]
    event.end = params[:end] if params[:end]
    event.save
    render json: '{}'
  end
  def destroy
    event = Calendarmediafile.find(params[:event_id])
    if params[:series] == "1"
	Calendarmediafile.where(parentcalendarmediafile_id: event.parentcalendarmediafile_id).destroy_all
        Parentcalendarmediafile.find(event.parentcalendarmediafile_id).destroy
    else
        Parentcalendarmediafile.find(event.parentcalendarmediafile_id).destroy if Calendarmediafile.where(parentcalendarmediafile_id: event.parentcalendarmediafile_id).count <= 1
	event.destroy
    end
    render json: '{}'
  end
  def delete_calendar
    Calendar.where(user_id: session[:user_id], id: params[:calendar_id]).first.destroy if(params[:calendar_id])
    redirect_to '/calendars'
  end
  def update_calendar
    event = Calendar.where(user_id: session[:user_id], id: params[:calendar_id]).first
    event.name = params[:cal_name] if params[:cal_name]
    event.comment = params[:comment] if params[:comment]
    event.save
    redirect_to '/calendars'
  end
  def new_calendar
    Calendar.create(user_id: session[:user_id], name: params[:cal_name], comment: params[:comment])
    redirect_to '/calendars'
  end
  def new_text
    Mediafile.create(user_id: session[:user_id], name: params[:text_label], text: params[:text], mediatype: "5")
    redirect_to '/calendars'
  end
  def new_plist
    Plist.create(user_id: session[:user_id], name: params[:playlist_name], comment: params[:playlist_comment], color: params[:playlist_color], mediatype: params[:playlist_type])
    redirect_to '/calendars'
  end
  def delete_plist
    Plist.where(user_id: session[:user_id], id: params[:ap_id]).first.destroy if(params[:ap_id])
    redirect_to '/calendars'
  end
  def update_plist
    event = Plist.where(user_id: session[:user_id], id: params[:ap_id]).first
    event.name = params[:playlist_name] if params[:playlist_name]
    event.comment = params[:playlist_comment] if params[:playlist_comment]
    event.color = params[:playlist_color] if params[:playlist_color]
    event.save
    redirect_to '/calendars'
  end
  def delete_text
    Parentcalendarmediafile.destroy_all(mediafile_id: params[:text_id]) if(params[:text_id])
    Mediafile.where(user_id: session[:user_id], id: params[:text_id]).first.destroy if(params[:text_id])
    redirect_to '/calendars'
  end
  def update_text
    text = Mediafile.where(user_id: session[:user_id], id: params[:text_id]).first
    text.name = params[:text_label] if params[:text_label]
    text.text = params[:text] if params[:text]
    text.save
    redirect_to '/calendars'
  end
  def content_plist
    Plistmediafile.destroy_all(plist_id: params[:plist_id])
    params[:list].each {|mediafile| Plistmediafile.create(plist_id: params[:plist_id],mediafile_id: mediafile)} if params[:list]
    redirect_to '/calendars'
  end
  def media_in_plist
    media_in_plist = Plistmediafile.select('mediafiles.id,mediafiles.name,mediafiles.ext,mediafiles.size').where(plist_id: params[:plist_id]).joins(:mediafile).order(:ord)
    render json: media_in_plist
  end
  def sort
    plist=Plistmediafile.where(plist_id: params[:plist_id]).update_all(ord: 0)
    so=params[:songs_order].split(",").map(&:to_i)
    so.each_with_index do |p,i|
	Plistmediafile.where("plist_id="+params[:plist_id]+" and mediafile_id="+p.to_s+" and ord=0").first.update(ord: i+1)
    end
    redirect_to '/calendars'
  end
  def calendar_devices
    media_in_plist = Plistmediafile.select('mediafiles.id,mediafiles.name,mediafiles.ext,mediafiles.size').where(plist_id: params[:plist_id]).joins(:mediafile).order(:ord)
    render json: media_in_plist
  end
  def get_devices
    devices=Device.where(user_id: session[:user_id], calendar_id: params[:calendar_id]).select('id')
    render json: devices
  end
  def attach_devices
    Device.where(user_id: session[:user_id], calendar_id: params[:calendar_id]).update_all(calendar_id: 0)
    Device.where(user_id: session[:user_id], id: params[:device_id]).update_all(calendar_id: params[:calendar_id])
    redirect_to '/calendars'
  end

  def get_days(t1)
    arr = []
    arr << "Mo" if t1.d1
    arr << "Tu" if t1.d2
    arr << "We" if t1.d3
    arr << "Th" if t1.d4
    arr << "Fr" if t1.d5
    arr << "Sa" if t1.d6
    arr << "Su" if t1.d0
    arr
  end
  def timeline
    @calendars = Calendar.where(user_id: session[:user_id])
    @devices = Device.where(user_id: session[:user_id])
  end
  def display_7_days
    @calendars = Calendar.where(user_id: session[:user_id])
    @media = Mediafile.where(user_id: session[:user_id])
    @plists = Plist.where(user_id: session[:user_id]).includes(:plistmediafiles)
    @devices = Device.where(user_id: session[:user_id])
  end
end
