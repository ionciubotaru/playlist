class Plistmediafile < ActiveRecord::Base
  belongs_to :mediafile
  belongs_to :plist
end
