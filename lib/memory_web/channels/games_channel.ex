defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  alias Memory.Game, as: Game
  alias Memory.BackupAgent, as: BackupAgent
 
  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = BackupAgent.get(name) || Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      BackupAgent.put(name, game)
      {:ok, %{"join" => name, "game"=> Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end 
  end


  def handle_in("restart", %{}, socket) do
    game = Game.restart(socket.assigns[:game])
    socket = assign(socket, :game, game)
    BackupAgent.put(socket.assigns[:name], game)
    {:reply, {:ok, %{ "game" => Game.client_view(game)}}, socket}
  end

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client

  def handle_in("reset", payload, socket) do
    name = socket.assigns[:name]
    game = Game.new()
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok,%{"game" => Game.client_view(game)}}, socket}

  end

  def handle_in("match", %{"firstid" => id1, "secondid" => id2},  socket) do
    name = socket.assigns[:name]
    game = Game.match(socket.assigns[:game], id1, id2)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}

  end

  def handle_in("clearfirst", %{"id1" => id1, "id2" => id2},  socket) do
    name = socket.assigns[:name]
    game = Game.clearfirst(socket.assigns[:game], id1, id2)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}

  end

  def handle_in("first", %{"id" => id, "value" => value},  socket) do
    name = socket.assigns[:name]
    game = Game.addfirst(socket.assigns[:game], id, value)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply, {:ok, %{"game" => Game.client_view(game)}}, socket}

  end


  def handle_in("click", %{"id" => id}, socket) do
    name = socket.assigns[:name]
    game = Game.click(socket.assigns[:game], id)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply,{:ok, %{"game" => Game.client_view(game)}}, socket}
  end
  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
