class Question < ActiveRecord::Base
  attr_accessible :category_id, :created, :geo, :public, :question, :user_id
end
