class CreateRoundOperatives < ActiveRecord::Migration
  def change
    create_table :round_operatives do |t|
      t.references :round, null: false, index: true
      t.references :operative, null: false, references: :users
      t.column :pass, :boolean, null: true
      t.timestamps null: false
    end

    add_foreign_key :round_operatives, :rounds
    add_foreign_key :round_operatives, :users, column: :operative_id
  end
end
