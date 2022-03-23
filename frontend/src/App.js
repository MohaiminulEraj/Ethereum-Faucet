import React, { useState, useEffect } from 'react';
import "./App.css";
import { ethers } from "ethers";

const App = () => {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null
  });

  const [account, setAccount] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      // let provider = ethers.getDefaultProvider("ropsten");
      let provider = null;
      if (window.ethereum) {
        provider = window.ethereum;

        console.log(provider)
        try {
          await provider.enable();
        } catch {
          console.error("User denied accounts access!");
        }
      }
      else if (window.web3) {
        provider = window.web3.currentProvider;
      }
      else if (!process.env.production) {
        provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");
      }
      setWeb3Api({
        // web3: new ethers.getDefaultProvider(provider),
        web3: new ethers.providers.Web3Provider(provider),
        provider
      })
    }
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      if (web3Api.provider) {
        let accounts = await web3Api.provider.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);
        console.log(accounts[0]);
      }
    }
    web3Api.provider && getAccount();
  }, [web3Api.provider]);

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <span>
            <strong>Account: </strong>
          </span>
          <h1>
            {account ? account : 'Not Connected!'}
          </h1>
          <div className="balance-view is-size-2">
            Current Banalce: <strong>0</strong> ETH
          </div>
          {!account &&
            <button className="btn mr-2"
              onClick={() => {
                window.location.reload();
              }}
            >
              Connect Account
            </button>
          }
          <button className="btn mr-2">Donate</button>
          <button className="btn">Withdraw</button>
        </div>
      </div>
    </>
  )
}

export default App;
