import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import '../css/app.css';


export default function game_init(root, channel) {
  console.log('gameinit started', channel);
  ReactDOM.render(<Starter channel={channel} />, root);
}

class Starter extends React.Component {
  constructor(props) {
    super(props);

    this.channel = props.channel;
    this.state = {
      firstValue:null,
      firstID:null,
      lock:false,
      array:[],   //contain condition of tiles
      numMatch:0,
      numClick:0
    };

    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => {console.log("Unable to join", resp)});
  }

  gotView(view) {
    console.log("got view", view.game);
    for(let i=0;i<view.game.array.length;i++){
      view.game.array[i].value = String.fromCharCode(view.game.array[i].value);
    }
    this.setState(view.game);
  }


  checkCard(id){
   /* console.log("check card", id);
    this.channel.push("click", {id: id})
	        .receive("ok", this.gotView.bind(this))
    */
    let value=this.state.array[id].value;
    console.log("check card", value, id);

    if(this.state.lock)             //do nothing when locked
      return;


    let Tile=this.state.array;
    Tile[id].isHidden=false;

    this.setState({array:Tile, lock:true}); //start checking

    if(this.state.firstValue!=null){ //has first card

      if(this.state.firstValue == value){   //first and second card have same value
        console.log('find same card!');
        //action
	this.channel.push("match",{firstid: id, secondid: this.state.firstID})
	            .receive("ok", this.gotView.bind(this));
	this.setState({lock:false});
      }
      
      else{                       //not same, hide all cards after 1s
        //Tile[id].isHidden=true;
        //Tile[this.state.firstID].isHidden=true;
	    setTimeout(()=>{
	    this.channel.push("clearfirst", {id1: id, id2: this.state.firstID})
		        .receive("ok", this.gotView.bind(this));
            this.setState({lock:false});
	    }, 1000);
      }
    }


    else{                      //no first card

      console.log("add first value");
      this.channel.push("first", {id: id, value: value})
	          .receive("ok", this.gotView.bind(this));
      
      this.setState({ lock:false});
    }
    
  }

  renderTile(i){
    console.log("trying to render tile");
    if (this.state.array.length ==0)
	  return;
    else
    return (
      <Tile id={i}
            value={this.state.array[i].value}
            isHidden={this.state.array[i].isHidden}
            hasMatched={this.state.array[i].hasMatched}
            clickFunc={this.checkCard.bind(this)} />
    );
  }

  reset(){
    this.channel.push("reset", {})
	  .receive("ok", this.gotView.bind(this));
  }
	


  render() {
    let wintext='';
    if(this.state.numMatch==16)
      wintext='You Win!!!!!';
    else
      wintext='';
    return (
      <div>
	<h1>Server state</h1>
        <link href='App.css'></link>
        <div className='winning'>{wintext}</div>
        <div className='row'>
          {this.renderTile(1)}
          {this.renderTile(2)}
          {this.renderTile(3)}
          {this.renderTile(4)}
        </div>
        <div className='row'>
          {this.renderTile(5)}
          {this.renderTile(6)}
          {this.renderTile(7)}
          {this.renderTile(8)}
        </div>
        <div className='row'>
          {this.renderTile(9)}
          {this.renderTile(10)}
          {this.renderTile(11)}
          {this.renderTile(12)}
        </div>
        <div className='row'>
          {this.renderTile(13)}
          {this.renderTile(14)}
          {this.renderTile(15)}
          {this.renderTile(0)}
        </div>
        <div className='row'>Number of clicks so far: {this.state.numClick}</div>
        <button className='row' onClick={this.reset.bind(this)}>Reset</button>
      </div>
    );
  }
}


class Tile extends React.Component{
  constructor(props){
    super(props);
    this.handleClick=this.handleClick.bind(this);
  }

  handleClick(){
    if(this.props.isHidden){
      console.log("handle Click invoked!");
      this.props.clickFunc(this.props.id);
    }

  }

  render(){
    if(this.props.isHidden)
      return <div className="Hidden" onClick={this.handleClick}>??</div>
    else if(this.props.hasMatched)
      return(
        <div className='Matched'>{this.props.value}</div>)
    else
      return(
        <div className="Revail">
          {this.props.value}
        </div>
      );
  }
}

