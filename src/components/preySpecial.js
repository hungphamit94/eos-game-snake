import React, { Component } from 'react';
import '../css/preySpecial.css';

class PreySpecial extends Component{
    constructor(props){
        super(props);
            this.Style = {
                circle: {
                    height: `${this.props.height}px`,
                    width: `${this.props.width}px`, 
                }
            };
    }
    render(){
        return (
            <div className="preySpecial">
               <div className="showPrey" style={this.Style.circle}>
               </div>
            </div>    
        )
    }
}

export default PreySpecial;