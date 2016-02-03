class User < ActiveRecord::Base
  has_secure_password
  has_many :devices, dependent: :destroy
  has_many :mediafiles, dependent: :destroy
  has_many :calendars, dependent: :destroy
  has_many :plists, dependent: :destroy
  
  def devs
    devices=Device.where(user_id: self.id).count
    devices
  end
  def fullname
    self.name+' '+self.firstname
  end

  def password=(password)
    self.password_digest = BCrypt::Password.create(password)
  end

  def is_password?(password)
    BCrypt::Password.new(self.password_digest) == password
  end

end
