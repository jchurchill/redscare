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

    # create join table for many-many association for nominations to nominees
    create_table :nominations_users do |t|
      t.integer :nomination_id, null: false, index: true
      t.integer :user_id, null: false, index: false

      t.index [:nomination_id, :user_id], unique: true
    end
  end
end
