import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import { Api, Rpc, SignatureProvider } from 'eosjs';

const network = {
  blockchain: 'EOSIO',
  protocol: 'http',
  host: 'localhost',
  port: 7055,
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
};
const dappName = 'snakegame';

async function connect() {
    ScatterJS.plugins(new ScatterEOS());
    const connectionOptions = {initTimeout:10000}
    var scatter;
    var account;
    await ScatterJS.scatter.connect("snakegame",connectionOptions).then(connected => {
      if (!connected) return console.log('Failed to connect with Scatter!');
      scatter = ScatterJS.scatter;
    });
    await scatter.getIdentity({ accounts: [network] }).then(() => {
      account = scatter.identity.accounts.find(
        e => e.blockchain === 'eos'
      );
    });
    if (account === null) return false;
    return true;
};

class EosService {
   
    static connectScatter() {
        return new Promise((resolve, reject) => {
            connect().then(() => {
                console.log('connect success');
            })
            .catch(err => {
                console.log('connect failure');  
                reject(err);
            });
        });

    }
}

export default EosService;