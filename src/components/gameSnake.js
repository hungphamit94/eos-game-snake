import React, { Component } from 'react';
import styles from '../css/game.css';
import Block from './block';
import Snake from './snake';
import Prey from './prey';
import PreySpecial from './preySpecial';
import {ApiService} from 'services';
import { connect } from 'react-redux';
import { UserAction } from 'actions';

class GameSnake extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            scorePreySpecial: 0,
            blocks: [],
            showPreySpecial: false,
            arraySnake: [],
            startPrey: 0,
            startPreySpecial: 0,
            time: 20,
            checkEat: false,
            numbers: 0,
            score: 0,
            die: false,
            go:  Math.floor(Math.random() * 3),
        }
        this.loadUser = this.loadUser.bind(this);
        this.checkEndGame = this.checkEndGame.bind(this);
        this.setUpFirt = this.setUpFirt.bind(this);
        this.loadUser();
        this.setUpFirt();
        this.checkEatPrey = this.checkEatPrey.bind(this);
        var blockOld = [];
        var timeFirst;
        this.blockNew = this.blockNew.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    loadUser() {
        var { setUser, user: { name } } = this.props;
        if(!name){
            name = localStorage.getItem("snakegame_account");
        }
        return ApiService.getUserByName(name).then(user => {
          this.setState({startPrey: user.game.prey.position});
          this.setState({arraySnake: user.game.snake.position});
          this.setState({go: user.game.go});

          setUser({
                game: user.game,
          });
          this.setState({ loading: false });
        });
    }

    setUpFirt(){
        ApiService.startGame().then(()=>{
            this.loadUser();
            for (var i = 0; i < 600; i++) {
                if(i===this.state.startPrey){
                    this.state.blocks.push(<Prey key={i}/>)
                }else if(this.state.arraySnake.indexOf(i)!==-1){
                    this.state.blocks.push(<Snake key={i}/>);
                }else {
                    this.state.blocks.push(<Block key={i}/>);
                }
            }
        });
        var timeRandom = 20;
        this.setState({time: timeRandom});
        this.timeFirst = timeRandom;
        this.setState({blocks: this.state.blocks});
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        document.addEventListener('keypress', (event) => this.handleKeyPress(event));
        this.interval = setInterval(() => this.blockNew(), 400);
    }

    checkEndGame(){
        var head = this.state.arraySnake[0];
        var i=1;
        for(;i<this.state.arraySnake.length;i++){
            if(head===this.state.arraySnake[i])
                break;
        }
        if(i==this.state.arraySnake.length){
            return false;
        }else{
            return true;
        }
    }

    handleKeyPress(e){
        if(e.key === "w"){
            if(this.state.go!==2) {
                 this.setState({go:0});
            }
        } else if(e.key === 's'){
            if(this.state.go!==0){
                this.setState({go:2});
            }
        } else if(e.key === 'a'){
            if(this.state.go!==3){
                this.setState({go:1});
            }
        } else if(e.key === 'd'){
            if(this.state.go!==1){
                this.setState({go:3});
            }
        }
    }

    checkEatPrey(){
        if(this.state.showPreySpecial){
            if(this.state.arraySnake.indexOf(this.state.startPreySpecial)!==-1){
                this.setState({checkEat: true});
                this.setState({showPreySpecial: false});
                this.setState({score: this.state.score+this.state.scorePreySpecial});
                do{
                    this.setState({startPrey:Math.floor(Math.random() * 599)});
                }while(this.state.arraySnake.indexOf(this.state.startPrey)!==-1);
                var s=new Uint16Array();
                for(var i=0;i<this.state.arraySnake.length;i++){
                    s[i] = this.state.arraySnake;
                }
                ApiService.updategame(s,this.state.go, this.state.score).then(()=>{
    
                })
                this.setState({time: 20});
                this.setState({scorePreySpecial: 3000});
            }
        }else{
            if(this.state.arraySnake.indexOf(this.state.startPrey)!==-1){
                this.setState({checkEat: true});
                this.setState({score: this.state.score+5});
                this.setState({numbers: this.state.numbers+1});
                if(this.state.numbers%2===0){
                    do{
                        this.setState({startPreySpecial:Math.floor(Math.random() * 599)});
                    }while(this.state.arraySnake.indexOf(this.state.startPreySpecial)!==-1);
                    this.setState({showPreySpecial: true});
                    var s=new Uint16Array();
                    for(var i=0;i<this.state.arraySnake.length;i++){
                        s[i] = this.state.arraySnake;
                    }
                    ApiService.updategame(s,this.state.go, this.state.score).then(()=>{
    
                    })
                }else {
                    do{
                        this.setState({startPrey:Math.floor(Math.random() * 599)});
                    }while(this.state.arraySnake.indexOf(this.state.startPrey)!==-1);
                    var s=new Uint16Array();
                    for(var i=0;i<this.state.arraySnake.length;i++){
                        s[i] = this.state.arraySnake;
                    }
                    ApiService.updategame(s,this.state.go, this.state.score).then(()=>{
    
                    })
                }
            }
        }
    }

    blockNew(){
        this.setState({blocks:[]});
        this.arraySnakeOld = this.state.arraySnake;
        var arraySnakeNew = [];
        switch(this.state.go){
            
            case 0: 
                if(this.arraySnakeOld[0]-30<0){
                    this.setState({die: true});
                    break;
                }
                arraySnakeNew[0] = this.arraySnakeOld[0]-30;
                break;
            case 1:
                if(this.arraySnakeOld[0]%30===0){
                    this.setState({die: true});
                    break;
                } 
                arraySnakeNew[0] = this.arraySnakeOld[0]-1;
                break; 
            case 2: 
                if(this.arraySnakeOld[0]+30>599){
                    this.setState({die: true});
                    break;
                } 
                arraySnakeNew[0] = this.arraySnakeOld[0]+30;
                break;
            case 3: 
                if((this.arraySnakeOld[0]+1)%30==0){
                    this.setState({die: true});
                    break;
                } 
                arraySnakeNew[0] = this.arraySnakeOld[0]+1;
                break;
            default: 
                if(arraySnakeNew[0]-30<0){
                    this.setState({die: true});
                    break;
                }
                arraySnakeNew[0] = this.arraySnakeOld[0]+30;
                break;
        }
        for(var i=0;i<this.arraySnakeOld.length-1;i++){
            arraySnakeNew[i+1] = this.arraySnakeOld[i];
        }
        if(this.checkEndGame()){
            this.setState({die: true});
        }
        if(!this.state.die){
            
            this.checkEatPrey();
            if(this.state.checkEat){
                arraySnakeNew[this.arraySnakeOld.length] = this.arraySnakeOld[this.arraySnakeOld.length-1];
                this.setState({checkEat: false});
            }
            
            this.setState({arraySnake: arraySnakeNew});
            
            for (var i = 0; i < 600; i++) {
               
                if(this.state.showPreySpecial&&i===this.state.startPreySpecial){
                        
                        this.state.blocks.push(<PreySpecial height={24*this.state.time/this.timeFirst} width={24*this.state.time/this.timeFirst}/>);
                        if(this.state.time === 0){
                            this.setState({showPreySpecial: false});
                            do{
                                this.setState({startPrey:Math.floor(Math.random() * 599)});
                            }while(this.state.arraySnake.indexOf(this.state.startPrey)!==-1);
                            this.setState({time: 20});
                            this.setState({scorePreySpecial: 3000});
                        }else{
                            this.setState({time: this.state.time-1});
                            this.setState({scorePreySpecial: 3000-(20-this.state.time)*150});
                        }
                        
                }else if(!this.state.showPreySpecial&&i===this.state.startPrey){
                    this.state.blocks.push(<Prey/>);
                } else if(this.state.arraySnake.indexOf(i)!=-1){
                    this.state.blocks.push(<Snake/>);
                }else {
                    this.state.blocks.push(<Block/>);
                }
            }
            this.setState({blocks:this.state.blocks});
            
        }
    }
    
    render() {
      return (
          !this.state.die?
            <div className="game" onKeyPress={this.handleKeyPress}>
                <div className="mainScreen">
                    {this.state.blocks}
                </div>
                <div className="information">
                    <h3>Số điểm của bạn:{this.state.score}</h3>
                </div>
            </div>:
            <div className="information">
                <h3>Số điểm của bạn:{this.state.score}</h3>
            </div>       
      )
    }
}

const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(GameSnake);