defmodule Memory.Game do
  def client_view(game) do
    
    game
  end

  # actual work after click, return game state
  def click(game, id) do
    game
  end


  def new do
    %{
      firstValue: nil,
      firstID: nil,
      lock: false,
      array: [],
      numMatch: 0,
      numClick: 0,
     }
  end




end


