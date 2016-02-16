class CreateNominees < ActiveRecord::Migration
  def change
    create_table :nominees do |t|
      t.references :nomination, null: false, index: true
      t.references :user, null: false, index: false

      t.timestamps null: false

      t.index [:nomination_id, :user_id], unique: true
    end

    add_foreign_key :nominees, :nominations
    add_foreign_key :nominees, :users
  end
end
