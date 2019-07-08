import React, { Component } from 'react';
import styles from '../css/game.css';
import Block from './block';
import Snake from './snake';
import Prey from './prey';
import PreySpecial from './preySpecial';
import {ApiService} from 'services';
import { connect } from 'react-redux';
import { UserAction } from 'actions';

class Game extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            scorePreySpecial: 0,
            blocks: [],
            showPreySpecial: false,
            arraySnake: [],
            startPrey: 0,
            startPreySpecial: 0,
            game : { mblocks: null, snake: null, prey: null, numbers: null, preySpecial: null, showPreySpecial: null, checkEat: null, score: null, go: null, die: null},
            time: 20,
            checkEat: false,
            numbers: 0,
            score: 0,
            die: false,
            go:  Math.floor(Math.random() * 3),
        }
        this.loadUser = this.loadUser.bind(this);
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
        const { setUser, user: { name } } = this.props;
        return ApiService.getUserByName(name).then(user => {
          this.setState(prevState => ({
                game: {
                    ...prevState.game,
                    mblocks: user.game.mblocks,
                    snake: user.game.snake,
                    prey: user.game.prey,
                    numbers: user.game.numbers,
                    preySpecial: user.game.preySpecial,
                    showPreySpecial: user.game.showPreySpecial,
                    checkEat: user.game.checkEat,
                    go: user.game.go,
                    score: user.game.score,
                    die: user.game.die
                }
          }))
          setUser({
                game: user.game,
          });
          this.setState({ loading: false });
        });
    }

    setUpFirt(){
        ApiService.startGame().then(()=>{
            this.loadUser();
            // const { setUser, user: { name, game } } = this.props;
            for (var i = 0; i < this.state.game.mblocks.length; i++) {
                if(i===this.state.game.prey.position){
                    this.state.blocks.push(<Prey key={i}/>)
                }else if(this.state.game.snake.position.indexOf(i)!==-1){
                   
                    this.state.blocks.push(<Snake key={i}/>);
                }else {
                    this.state.blocks.push(<Block key={i}/>);
                }
            }
        });
    }


    componentWillUnmount() {
        clearInterval(this.interval);
    }

    componentDidMount() {
        document.addEventListener('keypress', (event) => this.handleKeyPress(event));
        this.interval = setInterval(() => this.blockNew(), 400);
    }
    handleKeyPress(e){
        if(e.key === "w"){
            if(this.state.go!==2) {
                // this.setState({go:0});
                ApiService.updateGo(0).then(()=>{
                    console.log('update up');
                });
            }
        } else if(e.key === 's'){
            if(this.state.go!==0){
                ApiService.updateGo(2).then(()=>{
                    console.log('update down');
                });
            }
        } else if(e.key === 'a'){
            if(this.state.go!==3){
                ApiService.updateGo(1).then(()=>{
                    console.log('update left');
                });
            }
        } else if(e.key === 'd'){
            if(this.state.go!==1){
                ApiService.updateGo(3).then(()=>{
                    console.log('update right');
                });
            }
        }
    }

    blockNew(){
        this.setState({blocks:[]});
        ApiService.blockNew().then(()=>{
            this.loadUser();
            const { setUser, user: { name, game } } = this.props;
            if(this.state.game.die===0){
                for (var i = 0; i < this.state.game.mblocks.length; i++) {
                    if(game.mblocks[i].value === 1){
                        this.state.blocks.push(<Prey/>)
                    }else if(game.mblocks[i].value === 2){
                        this.state.blocks.push(<Snake/>);
                    }else if(game.mblocks[i].value === 3){
                        this.state.blocks.push(<PreySpecial/>)
                    } else{
                        this.state.blocks.push(<Block/>);
                    }
                }
            this.setState({blocks: this.state.blocks});    
            }
        });
        
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
export default connect(mapStateToProps, mapDispatchToProps)(Game);