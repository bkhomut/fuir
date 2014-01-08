class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.string :question
      t.foreign_key :category_id
      t.foreign_key :user_id
      t.datetime :created
      t.Boolean :public
      t.integer :geo

      t.timestamps
    end
  end
end
