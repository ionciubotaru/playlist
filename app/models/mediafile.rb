class Mediafile < ActiveRecord::Base
  belongs_to :user
  has_many :plistmediafiles, dependent: :destroy
  has_many :parentcalendarmediafiles, dependent: :destroy
end