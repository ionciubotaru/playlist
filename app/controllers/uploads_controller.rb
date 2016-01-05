class UploadsController < ApplicationController
  def upload
    if params[:plistName] and not params[:plistName].empty?
      plist=Plist.where(name: params[:plistName],mediatype: params[:mediatype]).first
      plist=Plist.create(name: params[:plistName],mediatype: params[:mediatype],color: params[:color],user_id: session[:user_id]) if plist.nil?
    end
    params[:song].each do |uploaded_song|
      ext=File.extname(uploaded_song.original_filename)
      filename=File.basename(uploaded_song.original_filename,ext) 
      song=Mediafile.create(:name => filename.force_encoding("UTF-8"), :user_id => session[:user_id], :mediatype => params[:mediatype],:ext => ext)
      directory_name = Rails.root.to_s+"/public/songs/"+session[:user_id].to_s
      Dir.mkdir(directory_name) unless Dir.exists?(directory_name)
      saved_name=Rails.root.join('public','songs', session[:user_id].to_s, song.id.to_s+ext)
      File.open(saved_name, 'w') do |file|
          file.write(uploaded_song.read.force_encoding("UTF-8"))
      end
      song.checksum=Digest::SHA2.file(saved_name).hexdigest
      song.size=File.size(saved_name)/1024/1024
      song.save
      Plistmediafile.create(plist_id: plist.id,mediafile_id: song.id) if plist
    end
		render json: {}
  end
  def media
    @mediatype = params[:mediatype]
		@plists = Plist.where(:user_id => session[:user_id],mediatype: @mediatype)
  	@files = Mediafile.where(:user_id => session[:user_id], :mediatype => @mediatype).order(:name)
  	@mediacenter=@files
  end
  def destroy
  	song=User.find(session[:user_id]).mediafiles.find(params[:id])
  	mediatype=song.mediatype
 	  song.destroy
	  songName=Rails.root.join('public','songs', session[:user_id].to_s, song.id.to_s+song.ext)
	  File.delete(songName) if File.exist?(songName)
    redirect_to '/media?mediatype='+mediatype.to_s, success: 'The file was deleted!'
  end
#  def update
#    songs=User.find(session[:user_id]).mediafiles.where(:id => params[:selected_songs],:mediatype => params[:mediatype])
#    devices=User.find(session[:user_id]).devices.where(:id => params[:selected_devices])
#    songs.each do |song|
#    	devices.each do |device|
#        song.devices << device unless song.devices.include?(device)
#    	end
#    end
#    redirect_to '/media?mediatype='+params[:mediatype], success: 'The playlist has been updated!'
#  end
  def songs
    send_file(
      "#{Rails.root}/public/#{params[:user_id]}/#{params[:file]}.#{params[:ext]}",
      filename: "#{params[:file_name]}",
      type: "application/mp3"
    )
  end
end
