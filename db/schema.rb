# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150710075850) do

  create_table "calendarmediafiles", force: :cascade do |t|
    t.integer  "calendar_id",   limit: 4
    t.integer  "mediafile_id",  limit: 4
    t.integer  "plist_id",      limit: 4
    t.datetime "start"
    t.datetime "end"
    t.integer  "destmediatype", limit: 4
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  add_index "calendarmediafiles", ["mediafile_id"], name: "mediatype", using: :btree
  add_index "calendarmediafiles", ["plist_id"], name: "plist", using: :btree

  create_table "calendars", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.integer  "user_id",    limit: 4
    t.text     "comment",    limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "calendars", ["user_id"], name: "user", using: :btree

  create_table "devices", force: :cascade do |t|
    t.string   "name",        limit: 255
    t.text     "address",     limit: 16777215
    t.text     "obs",         limit: 16777215
    t.float    "lat",         limit: 24
    t.float    "lng",         limit: 24
    t.string   "sn",          limit: 255
    t.integer  "calendar_id", limit: 4
    t.integer  "user_id",     limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "devices", ["calendar_id"], name: "calendar", using: :btree
  add_index "devices", ["user_id"], name: "user", using: :btree

  create_table "logs", force: :cascade do |t|
    t.text     "operation",  limit: 65535
    t.integer  "user_id",    limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "logs", ["user_id"], name: "index_logs_on_user_id", using: :btree

  create_table "mediafiles", force: :cascade do |t|
    t.text     "name",       limit: 65535
    t.decimal  "size",                     precision: 11, scale: 2
    t.integer  "mediatype",  limit: 4
    t.string   "ext",        limit: 255
    t.string   "checksum",   limit: 255
    t.integer  "user_id",    limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "mediafiles", ["user_id"], name: "index_songs_on_user_id", using: :btree

  create_table "messages", force: :cascade do |t|
    t.text     "ro",         limit: 65535
    t.text     "en",         limit: 65535
    t.text     "fr",         limit: 65535
    t.text     "de",         limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "plistmediafiles", force: :cascade do |t|
    t.integer  "plist_id",     limit: 4
    t.integer  "mediafile_id", limit: 4
    t.integer  "ord",          limit: 4
    t.datetime "created_at",             null: false
    t.datetime "updated_at",             null: false
  end

  add_index "plistmediafiles", ["mediafile_id"], name: "mediafile_id", using: :btree
  add_index "plistmediafiles", ["plist_id"], name: "plist_id", using: :btree

  create_table "plists", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.string   "color",      limit: 255
    t.integer  "mediatype",  limit: 4
    t.integer  "user_id",    limit: 4
    t.text     "comment",    limit: 65535
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  add_index "plists", ["user_id"], name: "user", using: :btree

  create_table "tests", force: :cascade do |t|
    t.text     "title",      limit: 65535
    t.datetime "start"
    t.datetime "end"
    t.integer  "mediatype",  limit: 4
    t.datetime "created_at",               null: false
    t.datetime "updated_at",               null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "name",            limit: 255
    t.string   "email",           limit: 255
    t.string   "password_digest", limit: 255
    t.boolean  "active",          limit: 1
    t.string   "lang",            limit: 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
