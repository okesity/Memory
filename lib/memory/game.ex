defmodule Memory.Game do
  def new do
    newstate = %{
      firstValue: nil,
      firstID: nil,
      lock: false,
      array: [],   #contain condition of tiles
      numMatch: 0,
      numClick: 0
    }
    
    letters=[65,66,67,68,69,70,71,72]
    letters = Enum.shuffle(letters++letters)
    map1 = Enum.map(letters, fn l-> %{value: l, isHidden: true, hasMatched: false} end)

    Map.put(newstate, :array, map1)
  end
 

  def client_view(game) do
    %{
        array: game.array,
    }
  end

  def restart(game) do
    new()
  end


  def click(game, id) do
     r = game.array
     r = Enum.map(r, fn m-> %{value: m.value, isHidden: false, hasMatched: true} end)
     Map.put(game, :array, r)
  end
end
