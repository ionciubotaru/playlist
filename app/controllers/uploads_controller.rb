class UploadsController < ApplicationController
  def upload
    params[:song].each do |uploaded_song|
      ext=File.extname(uploaded_song.original_filename)
      filename=File.basename(uploaded_song.original_filename,ext) 
      song=Mediafile.create(:name => filename.force_encoding("UTF-8"), :user_id => session[:user_id], :mediatype => params[:mediatype],:ext => ext)
      device=Device.find(params[:device_id]) if params[:device_id].to_i != 0
      song.devices << device if device
      directory_name = Rails.root.to_s+"/public/songs/"+session[:user_id].to_s
      Dir.mkdir(directory_name) unless Dir.exists?(directory_name)
      saved_name=Rails.root.join('public','songs', session[:user_id].to_s, song.id.to_s+ext)
      File.open(saved_name, 'w') do |file|
          file.write(uploaded_song.read.force_encoding("UTF-8"))
      end
      song.checksum=Digest::SHA2.file(saved_name).hexdigest
      song.size=File.size(saved_name)/1024/1024
      song.save
    end
      #redirect_to '/media?device_id='+params[:device_id]+'&mediatype='+params[:mediatype], success: 'File uploaded!'
      #redirect_to '/media?device_id=0&mediatype=1', success: 'File uploaded!'
			render json: {}
  end

  def media
    @device_id = params[:device_id].to_i || 0
    @mediatype = params[:mediatype]
    @device = User.find(session[:user_id]).devices.find(params[:device_id]) if @device_id != 0
    @group = Group.find(@device.group_id) if @device
    if @device_id != 0
	@devices = User.find(session[:user_id]).devices.where(group_id: @device.group_id)
	@files=@device.songs.where(:mediatype => @mediatype, :user_id => session[:user_id])
	@files = Mediafile.find_by_sql(
        "SELECT s.*,p.ord
        FROM songs s left join plists p on s.id=p.song_id
        WHERE s.user_id="+session[:user_id].to_s+" and s.mediatype="+@mediatype+" and p.device_id="+@device.id.to_s+
        " ORDER BY p.ord")
	@mediacenter = Mediafile.where(:user_id => session[:user_id], :mediatype => @mediatype).where.not(:id => @files).order(:name)
    else
	@devices = User.find(session[:user_id]).devices
	@files = Mediafile.where(:user_id => session[:user_id], :mediatype => @mediatype).order(:name)
	@mediacenter=@files
    end
  end

  def destroy
    begin
	song=User.find(session[:user_id]).mediafiles.find(params[:id])
	mediatype=song.mediatype
	device_id = params[:device_id] || '0'
	if device_id == '0'
    	    song.destroy
	    songName=Rails.root.join('public','songs', session[:user_id].to_s, song.id.to_s+song.ext)
	    File.delete(songName) if File.exist?(songName)
	else
	    device = song.devices.find(params[:device_id])
	    song.devices.delete(device)
	end
    end
    redirect_to '/media?device_id='+device_id+'&mediatype='+mediatype.to_s, success: 'The file was deleted!'
  end

  def update
    songs=User.find(session[:user_id]).mediafiles.where(:id => params[:selected_songs],:mediatype => params[:mediatype])
    devices=User.find(session[:user_id]).devices.where(:id => params[:selected_devices])
    songs.each do |song|
	devices.each do |device|
    	    song.devices << device unless song.devices.include?(device)
	end
    end
    redirect_to '/media?device_id='+params[:device_id]+'&mediatype='+params[:mediatype], success: 'The playlist has been updated!'
  end
#  def sort
#    device=User.find(session[:user_id]).devices.find(params[:device_id])
#    plist=Plist.where("device_id="+device.id.to_s+" and song_id in ("+params[:songs_order]+")")
#    so=params[:songs_order].split(",").map(&:to_i)
#    plist.each do |p|
#	p.ord=so.index(p.song_id)+1
#	p.save
#    end
#    redirect_to '/media?device_id='+params[:device_id]+'&mediatype='+params[:mediatype], success: 'The playlist order has been updated!'
#  end
end
