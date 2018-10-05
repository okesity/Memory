defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel
  alias Memory.Game
 
  def join("room:" <> name, payload, socket) do
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

  # Channels can be used in a request/response fashion
  # by sending replies to requests from the client
  def handle_in("ping", payload, socket) do
    {:reply, {:ok, payload}, socket}
  end

  def handle_in("click", %{"id" => id}, socket) do
    name = socket.assigns[:name]
    game = Game.click(socket.assigns[:game], id)
    socket = assign(socket, :game, game)
    BackupAgent.put(name, game)
    {:reply,{:ok, %{"game" => Game.client_view(game)}}, socket}
  end

  def handle_in("Name", payload, socket) do
    {:reply, {:received, %{"Name"=> payload["Name"]<>"happy"}}, socket}
  end 
  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
