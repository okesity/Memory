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
        firstValue: game.firstValue, 
        firstID: game.firstID,
        numClick: game.numClick,
        numMatch: game.numMatch,
        array: game.array,
    }
  end

  def restart(game) do
    new()
  end


  def click(game, id) do
    array = game.array
    cond do
      game.firstValue == nil ->
        game
	|> Map.put(:firstValue, array[id].value)
	|> Map.put(:firstID, id)
	|> Map.put(:numClick, game.numClick+1)
	|> update(id, false, true)
    end 
  end

  def addfirst(game, id, value) do
    game
    |> Map.put(:firstValue, value)
    |> Map.put(:firstID, id)
    |> Map.put(:numClick, game.numClick+1)
    |> update(id, false, false)
  end

  def clearfirst(game, id1, id2) do
    game
    |> Map.put(:firstValue, nil)
    |> Map.put(:firstID, nil)
    |> Map.put(:numClick, game.numClick+1)
    |> update(id1, true, false)
    |> update(id2, true, false)
  end

  def match(game, id1, id2) do
    array = game.array
    v1 = Enum.at(array, id1)
    v2 = Enum.at(array, id2)
    game
    |> update(id1, false, true) 
    |> update(id2, false, true)
    |> Map.put(:firstValue, nil)
    |> Map.put(:firstID, nil)
    |> Map.put(:numClick, game.numClick+1)
    |> Map.put(:numMatch, game.numMatch+2)
  end

  def update(game, id, ishid, hasM) do  # update at {value, ishid, hasM}
    v = Enum.at(game.array, id)
    rp = List.replace_at(game.array, id, %{value: v.value, isHidden: ishid, hasMatched: hasM})
    Map.put(game, :array, rp) 
  end

end



