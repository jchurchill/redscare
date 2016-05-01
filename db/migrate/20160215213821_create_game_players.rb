class CreateGamePlayers < ActiveRecord::Migration
  def change
    create_table :game_players do |t|
      t.references :game, null: false, index: true
      t.references :user, null: false, index: true
      t.column :role, :integer, null: true, default: nil
      
      t.timestamps null: false
    end

    add_foreign_key :game_players, :games
    add_foreign_key :game_players, :users
  end
end
