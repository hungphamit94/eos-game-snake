// React core
import React, { Component } from 'react';
import { connect } from 'react-redux';
// Components
import { GameSnake, Login } from 'components';
import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
// Services and redux action
import { UserAction } from 'actions';
import { ApiService } from 'services';
import { Api, JsonRpc, JsSignatureProvider } from 'eosjs';
// import { ScatterService } from 'services';

class App extends Component {

  constructor(props) {
    // Inherit constructor
    super(props);
    this.state = {
      loading: true,
      account: null,
    };
  this.loadUserFromScatter = this.loadUserFromScatter.bind(this);
  this.loadUserFromScatter();
  }

  loadUserFromScatter(){
    const { setUser } = this.props;
    
    ApiService.login().then(() => {
      setUser({ name: localStorage.getItem("snakegame_account") });
    }).catch(() => {}).finally(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    // Extract data from state and props (`user` is from redux)
    const { loading } = this.state;
    const { user: { name, game } } = this.props;
    return (
      <div>
        <GameSnake/>
      </div>
    );
  }
}

// Map all state to component props (for redux to connect)
const mapStateToProps = state => state;

// Map the following action to props
const mapDispatchToProps = {
  setUser: UserAction.setUser,
};

// Export a redux connected component
export default connect(mapStateToProps, mapDispatchToProps)(App);