class User < ActiveRecord::Base
  has_secure_password
  has_many :devices, dependent: :destroy
  has_many :mediafiles, dependent: :destroy
  has_many :calendars, dependent: :destroy
  has_many :plists, dependent: :destroy
end
