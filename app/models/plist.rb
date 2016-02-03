class Plist < ActiveRecord::Base
  belongs_to :device
  belongs_to :user
  has_many :parentcalendarmediafiles, dependent: :destroy
  has_many :plistmediafiles, dependent: :destroy
end
