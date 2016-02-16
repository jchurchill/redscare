class CreateNominations < ActiveRecord::Migration
  def change
    create_table :nominations do |t|
      t.references :round, null: false, index: true
      t.references :leader, references: :users, null: false, index: false
      t.column :nomination_number,    :integer, null: false
      t.column :state,                :integer, null: false
      t.column :outcome,              :integer, null: true

      t.timestamps null: false

      t.index [:round_id, :nomination_number], unique: true
    end

    add_foreign_key :nominations, :rounds
  end
end
