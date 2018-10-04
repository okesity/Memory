import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import '../css/app.css';


export default function game_init(root) {
  console.log('gameinit started');
  ReactDOM.render(<Starter />, root);
}

class Starter extends React.Component {
  constructor(props){
    super(props);
    this.checkCard=this.checkCard.bind(this);
    this.initTile=this.initTile.bind(this);
    this.reset=this.reset.bind(this);
    this.state = {
      firstValue:null,
      firstID:null,
      lock:false,
      array:this.initTile(),   //contain condition of tiles
      numMatch:0,
      numClick:0
    };
  }

  checkCard(id){
    let value=this.state.array[id].value;
    console.log(value, id);

    if(this.state.lock)             //do nothing when locked
      return;


    let Tile=this.state.array;
    Tile[id].isHidden=false;
    let num=this.state.numClick+1;
    this.setState({array:Tile, numClick:num, lock:true}); //start checking

    if(this.state.firstValue!=null){ //has first card

      if(this.state.firstValue == value){   //first and second card have same value
        console.log('find same card!');
        //action
        let num=this.state.numMatch+2;  //add count, stay isHidden=false
        this.setState({numMatch: num});

        if(this.state.firstValue){  //prevent access null when reset
          Tile[id].isHidden=false;
          Tile[id].hasMatched=true;
          Tile[this.state.firstID].isHidden=false;
          Tile[this.state.firstID].hasMatched=true;
          this.setState({array: Tile,firstValue:null, lock:false})
        }
      }
      else{                       //not same, hide all cards after 1s
        //Tile[id].isHidden=true;
        //Tile[this.state.firstID].isHidden=true;
        setTimeout(() => {
          if(this.state.firstValue){
            Tile[id].isHidden=true;
            Tile[this.state.firstID].isHidden=true;
            this.setState({array: Tile, firstValue:null, lock:false})
          }
        }, 1000);
      }
    }


    else{                      //no first card
      console.log("add first value");
      this.setState({firstValue:value, firstID:id, lock:false});
    }
  }

  initTile(){   //initial l with {id:1, value:'A', isHidden:true, hasMatched:false}
    let l=[];
    for(let i='A'.charCodeAt();i<='H'.charCodeAt();i++){
      l.push({
        value: String.fromCharCode(i),
        isHidden: true,
        hasMatched:false
      });
      l.push({
        value: String.fromCharCode(i),
        isHidden: true,
        hasMatched:false
      });
    }
    l=_.shuffle(l);       //randomize l
    console.log('initial ',l[0].isHidden);
    return l;
  }

  renderTile(i){
    return (
      <Tile id={i}
            value={this.state.array[i].value}
            isHidden={this.state.array[i].isHidden}
            hasMatched={this.state.array[i].hasMatched}
            clickFunc={this.checkCard} />
    );
  }

  reset(){
    this.setState({
      firstValue:null,
      firstID:null,
      lock:true,
      array:this.initTile(),   //contain condition of tiles
      numMatch:0,
      numClick:0
    });
    setTimeout(() => {
        this.setState({lock:false})
      }, 100);
  }


  render() {
    let wintext='';
    if(this.state.numMatch==16)
      wintext='You Win!!!!!';
    else
      wintext='';
    return (
      <div>
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
        <button className='row' onClick={this.reset}>Reset</button>
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

