import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { connect } from 'react-redux';
import { Api, Rpc, SignatureProvider } from 'eosjs';
import Eos from 'eosjs';
// import { Api, Rpc, SignatureProvider } from 'eosjs';

var scatter;
var publicKey;
var signatureProvider;
var api;
var account;

async function takeAction(action, dataValue){
    ScatterJS.plugins(new ScatterEOS());
    const rpc = new Rpc.JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    var totalCoin = await rpc.get_currency_balance('eosio.token', 'eosio.stake', 'EOS'); 
    var balance = totalCoin.toString().split(' ',2);
    var balanceCoin = parseInt(balance[0]);
    balanceCoin = balanceCoin + 10;
    window.ScatterJS = null;
    var privateKey = '5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5';
    const signatureProvider = new SignatureProvider([privateKey]);
    rpc.get_account('eosio.stake').core_liquid_balance = balanceCoin + "EOS";
    api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
    try {
    const resultWithConfig = await api.transact({
        actions: [{
            account: process.env.REACT_APP_EOS_CONTRACT_NAME,
            name: action,
            authorization: [{
              actor: localStorage.getItem("snakegame_account"),
              permission: 'active',
            }],
            data: dataValue,
          }]
        }, {
            blocksBehind: 3,
            expireSeconds: 30,
      });
      return resultWithConfig;
    } catch (err) {
        throw(err)
    }
}

class ApiService {
  static getCurrentUser() {
    return new Promise((resolve, reject) => {
      if (!localStorage.getItem("snakegame_account")) {
        return reject();
      }
      takeAction("login", { username: localStorage.getItem("snakegame_account") })
        .then(() => {
          resolve(localStorage.getItem("snakegame_account"));
        })
        .catch(err => {
          localStorage.removeItem("snakegame_account");
          localStorage.removeItem("snakegame_key");
          reject(err);
        });
    });
  }

static async login() {
    ScatterJS.plugins(new ScatterEOS());
    const rpc = new Rpc.JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
    
    window.ScatterJS = null;
    
    const network = {
        blockchain: "eos",
        protocol: "http",
        host: "localhost",
        port: 7055,
        chainId: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906" 
    };

    ScatterJS.scatter.connect('snakegame').then(connected => {
        if (!connected) return console.log("Error Connecting");
        scatter = ScatterJS.scatter;
        const requiredFields = {
          accounts: [network] 
        };
        var account;
        scatter.getIdentity(requiredFields).then(id => {
            account = scatter.identity.accounts.find(
                e => e.blockchain === 'eos'
            );
            var privateKey = '5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5';
            localStorage.setItem("snakegame_account", account.name);
            localStorage.setItem("snakegame_key", privateKey);
            signatureProvider = scatter.eosHook(network);
            api = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });
            return new Promise((resolve, reject) => {
                takeAction("login", { username: account.name })
                    .then(() => {
                      resolve(localStorage.getItem("snakegame_account"));
                    })
                    .catch(err => {
                        localStorage.removeItem("snakegame_account");
                        localStorage.removeItem("snakegame_key");
                        reject(err);
                    });
            });
        })
    })
}

static registerUser(username) {
    return takeAction("registeruser",{username: username});
}

static startGame() {
    return takeAction("setupfirst",{username: localStorage.getItem('snakegame_account')});
}

static blockNew(){
    return takeAction("blocknew",{username: localStorage.getItem('snakegame_account')});
}  

static updateGo(go){
    return takeAction('updatego',{value: go, username: localStorage.getItem('snakegame_account')});
}

static updatescore(value){
    return takeAction('updatescore',{value: value, username: localStorage.getItem('snakegame_account')});
}

static createprey(arraySnake){
    return takeAction('createprey',{snake: arraySnake, username: localStorage.getItem('snakegame_account')});
}

static createpreyspecial(arraySnake){
    return takeAction('special',{snake: arraySnake, username: localStorage.getItem('snakegame_account')});
}

static updategame(arraySnake, go, score){
    return takeAction('updategame', {snake: arraySnake, go: go, score: score ,username: localStorage.getItem('snakegame_account')});
}

static async getUserByName(username) {
    console.log("i want to see:"+username);
    try {
      const rpc = new Rpc.JsonRpc(process.env.REACT_APP_EOS_HTTP_ENDPOINT);
      const result = await rpc.get_table_rows({
        "json": true,
        "code": process.env.REACT_APP_EOS_CONTRACT_NAME,    // contract who owns the table
        "scope": process.env.REACT_APP_EOS_CONTRACT_NAME,   // scope of the table
        "table": "users",    // name of the table as specified by the contract abi
        "limit": 1,
        "lower_bound": username,
      });
      console.log("i want to see:"+JSON.stringify(result.rows[0]));
      return result.rows[0];
    } catch (err) {
      console.error(err);
    }
}

}


export default ApiService;
