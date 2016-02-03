class Parentcalendarmediafile < ActiveRecord::Base
  belongs_to :mediafile
  belongs_to :plist
  belongs_to :calendar
  has_many   :calendarmediafiles, dependent: :destroy
end
