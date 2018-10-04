// We need to import the CSS so that webpack will load it.
// The MiniCssExtractPlugin is used to separate it out into
// its own CSS file.
import css from "../css/app.css";

// webpack automatically bundles all modules in your
// entry points. Those entry points can be configured
// in "webpack.config.js".
//
// Import dependencies
//
import "phoenix_html";
import $ from "jquery";

// Import local files
import socket from "./socket";
// Local files can be imported directly using relative paths, for example:
// import socket from "./socket"

import game_init from "./starter-game";

let channel = socket.channel("games:demo", {});
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp)})
  .receive("error", resp => { console.log("Unable to join", resp)});

function form_init(){
  $('#game-button').click(()=>{
    let xx = $('#game-input').val();
    console.log("double", xx);
    channel.push("double", {xx:xx}).receive("doubled", msg => {
      console.log("doubled", msg);
      $('#game-output').text(msg.yy);
    });
  });
}

function start(){
  let root = document.getElementById('root');
  if (root){
    game_init(root);
  }
  if (document.getElementById('game-input')){
    form_init();
  }
}

$(start);

