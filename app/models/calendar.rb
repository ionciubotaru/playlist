class Calendar < ActiveRecord::Base
  belongs_to  :user
  has_many :devices
  has_many :parentcalendarmediafiles, dependent: :destroy
end
