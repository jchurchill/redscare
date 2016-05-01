class CreateNominationVotes < ActiveRecord::Migration
  def change
    create_table :nomination_votes do |t|
      t.references :nomination, null: false, index: true
      t.references :user, null: false, index: false
      t.column :upvote, :boolean, null: false

      t.timestamps null: false

      t.index [:nomination_id, :user_id], unique: true
    end

    add_foreign_key :nomination_votes, :nominations
    add_foreign_key :nomination_votes, :users
  end
end
