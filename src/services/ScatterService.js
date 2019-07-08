import Eos from 'eosjs'

document.addEventListener('scatterLoaded', scatterExtension => {
    scatter = window.scatter
  
    const network = {
      blockchain:'eos',
      host:'159.65.161.242',
      port:8888
    }
  
    const eosOptions = {}
  
    const eos = scatter.eos( network, Eos.Localnet, eosOptions )
})

class ScatterService {

  getIdentity = () => {
    scatter.getIdentity().then(identity => {
      console.log(identity, "identityFound");
      window.identity = identity
      console.log('console in name:'+identity.name);
    }).catch(error => {
      console.log(error, "identityCrisis!")
    })
  }

}

export default ScatterService;