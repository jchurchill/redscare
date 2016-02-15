class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      # Basic game properties, set at creation time
      t.column :name,                     :string,    null: false
      t.column :player_count,             :integer,   null: false
      t.references :creator, references: :users, null: false, index: true

      # Included game features (selected at time of game creation)
      t.column :includes_seer,            :boolean,   null: false
      t.column :includes_seer_deception,  :boolean,   null: false
      t.column :includes_evil_master,     :boolean,   null: false
      t.column :includes_rogue_evil,      :boolean,   null: false

      # Game properties updated as game progresses
      t.column :state,                    :integer,   null: false, default: 1 # created
      t.column :outcome,                  :integer,   null: true, default: nil
      t.references :assassinated_player, references: :users, null: true

      t.timestamps null: false
    end

    add_foreign_key :games, :users, column: :creator_id
    add_foreign_key :games, :users, column: :assassinated_player_id
  end
end
