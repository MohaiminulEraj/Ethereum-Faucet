import React, { useState, useEffect } from 'react';
import "./App.css";
import { ethers, Contract } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';
// import { loadContract } from "./utils/load-contract";
// import loadContract from "../public/contracts/Faucet.json";
import loadFaucetABI from "./contracts/Faucet.json";
// import dotenv from 'dotenv';
// // parsing .env file
// dotenv.config()

const App = () => {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const ethersProvider = new ethers.providers.Web3Provider(window.ethereum);
  // console.log(ethersProvider)
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const loadProvider = async () => {
      // let provider = ethers.getDefaultProvider("ropsten");
      const provider = await detectEthereumProvider();
      // const contract = await loadContract("Faucet");
      const contract = loadFaucetABI
      // console.log('contract', contract)
      // let c = new Contract(account, contract, provider);
      // console.log('c', c)

      if (provider) {
        provider.request({ method: "eth_requestAccounts" });
        setWeb3Api({
          web3: new ethers.providers.Web3Provider(provider),
          provider,
          contract
        });
      } else {
        console.error('Please Install MetaMask!');
      }
    }
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      console.log(web3Api.provider);
      if (web3Api.provider) {
        // let accounts = await web3Api.provider.request({ method: "eth_requestAccounts" });
        let accounts = await ethersProvider.listAccounts();;
        setAccount(accounts[0]);
        setBalance(ethers.utils.formatEther(await ethersProvider.getBalance(accounts[0])).toString())
      }
      // let c = new Contract(process.env.CONTRACT_ADDRESS, contract, ethersProvider);
      // console.log(((await c.provider.getBalance(process.env.CONTRACT_ADDRESS)).toNumber()))
    }
    web3Api.provider && getAccount();
  }, [web3Api.provider]);
  const contract = loadFaucetABI
  // console.log('contract', contract)
  // console.log()

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          <div className="is-flex is-align-items-center">
            <span>
              <strong className="mr-2">Account: </strong>
            </span>
            {
              account ?
                account :
                <button className="button is-small"
                  onClick={() => {
                    web3Api.provider.request({ method: "eth_requestAccounts" });
                  }}
                >
                  Connect Wallet
                </button>
            }
          </div>

          <div className="balance-view is-size-2 my-4">
            Current Banalce: <strong>{balance ? balance.slice(0, 6) : 0}</strong> ETH
          </div>
          <button className="button is-link mr-2">Donate</button>
          <button className="button is-primary">Withdraw</button>
        </div>
      </div>
    </>
  )
}

export default App;
