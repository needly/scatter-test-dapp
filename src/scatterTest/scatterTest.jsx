import React from 'react';
import { Api, JsonRpc, JsSignatureProvider } from 'eosjs';
import ScatterJS, {Network} from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs2';
import ScatterLynx from 'scatterjs-plugin-lynx';
import './scatterTest.scss';

class scatterTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      topApps: {},
    };
    this.globalCancelablePromise = null;
  }

  componentDidMount() {
    window.addEventListener("lynxMobileLoaded", () => {

      ScatterJS.plugins( new ScatterEOS(), new ScatterLynx({Api, JsonRpc}) );
      const network = Network.fromJson({
        blockchain:'eos',
        protocol:'https',
        host:'api.eossweden.org',
        port:443,
        chainId:'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
      });

      const rpc = new JsonRpc(network.fullhost());

      this.globalCancelablePromise = ScatterJS
        .scatter
        .connect('scatter-test')
        .then(connected => {

          if(!connected) return false;

          const scatter = ScatterJS.scatter;

          const requiredFields = { accounts:[network] };
          scatter.getIdentity(requiredFields).then(() => {

              const account = scatter.identity.accounts.find(x => x.blockchain === 'eos');

              this.setState({ account });

              let eos;

              if(account){
                    eos = scatter.eos(network, Api, { rpc, beta3:true });
                } else {
                    eos = new Api({ rpc });
                }

              const transactionData = {
                actions: [{
                  account: 'eosio.token',
                  name: 'transfer',
                  authorization: [{
                      actor: account.name,
                      permission: account.authority,
                  }],
                  data: {
                      from: account.name,
                      to: 'safetransfer',
                      quantity: '0.0001 EOS',
                      memo: account.name,
                  },
              }],
              };

              const transactionMetaData = {
                blocksBehind: 3,
                expireSeconds: 30,
              };


              try {
                  eos.transact(transactionData, transactionMetaData)
                  .then((result) => {
                    console.log('success!!!!', result);
                  });
              } catch (e) {
                  console.error('fail!!!!', e);
              }

          }).catch(error => {
              console.error(error);
          });
      });
    });
  }

  componentWillUnmount() {
    this.globalCancelablePromise.cancel();
  }

  render() {
    const { account } = this.state;
    return (
      <div className="background">
        <div className="header">
          <h2>scatter test</h2>
          { account && account.name }
        </div>
      </div>
    );
  }
}

export default scatterTest;
