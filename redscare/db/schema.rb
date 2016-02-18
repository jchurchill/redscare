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

ActiveRecord::Schema.define(version: 20160216014026) do

  create_table "game_players", force: :cascade do |t|
    t.integer  "game_id",    null: false
    t.integer  "user_id",    null: false
    t.integer  "role"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "game_players", ["game_id"], name: "index_game_players_on_game_id"
  add_index "game_players", ["user_id"], name: "index_game_players_on_user_id"

  create_table "games", force: :cascade do |t|
    t.string   "name",                                null: false
    t.integer  "player_count",                        null: false
    t.integer  "creator_id",                          null: false
    t.boolean  "includes_seer",                       null: false
    t.boolean  "includes_seer_deception",             null: false
    t.boolean  "includes_evil_master",                null: false
    t.boolean  "includes_rogue_evil",                 null: false
    t.integer  "state",                   default: 1, null: false
    t.integer  "outcome"
    t.integer  "assassinated_player_id"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "games", ["creator_id"], name: "index_games_on_creator_id"

  create_table "nomination_votes", force: :cascade do |t|
    t.integer  "nomination_id", null: false
    t.integer  "user_id",       null: false
    t.boolean  "upvote",        null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "nomination_votes", ["nomination_id", "user_id"], name: "index_nomination_votes_on_nomination_id_and_user_id", unique: true
  add_index "nomination_votes", ["nomination_id"], name: "index_nomination_votes_on_nomination_id"

  create_table "nominations", force: :cascade do |t|
    t.integer  "round_id",          null: false
    t.integer  "leader_id",         null: false
    t.integer  "nomination_number", null: false
    t.integer  "state",             null: false
    t.integer  "outcome"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  add_index "nominations", ["round_id", "nomination_number"], name: "index_nominations_on_round_id_and_nomination_number", unique: true
  add_index "nominations", ["round_id"], name: "index_nominations_on_round_id"

  create_table "nominations_users", force: :cascade do |t|
    t.integer "nomination_id", null: false
    t.integer "user_id",       null: false
  end

  add_index "nominations_users", ["nomination_id", "user_id"], name: "index_nominations_users_on_nomination_id_and_user_id", unique: true
  add_index "nominations_users", ["nomination_id"], name: "index_nominations_users_on_nomination_id"

  create_table "round_operatives", force: :cascade do |t|
    t.integer  "round_id",     null: false
    t.integer  "operative_id", null: false
    t.boolean  "pass"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "round_operatives", ["round_id"], name: "index_round_operatives_on_round_id"

  create_table "rounds", force: :cascade do |t|
    t.integer  "game_id",      null: false
    t.integer  "round_number", null: false
    t.integer  "state",        null: false
    t.integer  "outcome"
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
  end

  add_index "rounds", ["game_id", "round_number"], name: "index_rounds_on_game_id_and_round_number", unique: true
  add_index "rounds", ["game_id"], name: "index_rounds_on_game_id"

  create_table "users", force: :cascade do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                          null: false
    t.datetime "updated_at",                          null: false
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

end
