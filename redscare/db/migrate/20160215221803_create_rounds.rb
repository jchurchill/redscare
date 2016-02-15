class CreateRounds < ActiveRecord::Migration
  def change
    create_table :rounds do |t|
      t.references :game, null: false, index: true
      t.column :round_number,   :integer, null: false
      t.column :state,          :integer, null: false
      t.column :outcome,        :integer, null: true

      t.timestamps null: false

      t.index [:game_id, :round_number], unique: true
    end

    add_foreign_key :rounds, :games
  end
end
