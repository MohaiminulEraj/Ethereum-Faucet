import React, { useState, useEffect, useCallback } from 'react';
import "./App.css";
import { ethers, Contract } from "ethers";
import detectEthereumProvider from '@metamask/detect-provider';
import { BigNumber } from "bignumber.js";
// import * as fs from "fs";
// import { loadContract } from "./utils/load-contract";
// import loadContract from "../public/contracts/Faucet.json";
import loadFaucetABI from "./Faucet.json";
import FaucetABI from './contracts/Faucet.json';
// import dotenv from 'dotenv';
// // parsing .env file
// dotenv.config()

const App = () => {

  const [ethersJsApi, setEthersJsApi] = useState({
    provider: null,
    signer: null,
    ethers: null,
    contract: null,
  });
  // const contract = JSON.parse(fs.readFileSync('./contracts/Faucet.json', { encoding: 'utf8' }));
  // console.log(JSON.stringify(contract.abi))
  // const provider = new ethers.providers.Web3Provider(window.ethereum);

  // console.log(provider)
  const [account, setAccount] = useState(null);
  const [accountBalance, setAccountBalance] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, reload] = useState(false);

  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload]);

  const setAccountListener = provider => {
    provider.on("accountsChanged", _ => window.location.reload());

    // provider._jsonRpcConnection.events.on("notification", payload => {
    //   const { method } = payload;
    //   if (method === "metamask_unlockStateChanged") {
    //     setAccount(null);
    //   }
    // })
  }

  useEffect(() => {
    const loadProvider = async () => {
      // let provider = ethers.getDefaultProvider("ropsten");
      let detectProvider = await detectEthereumProvider();
      // const contract = await loadContract("Faucet");
      // let contract = new Contract(process.env.REACT_APP_CONTRACT_ADDRESS, loadFaucetABI, provider);
      const provider = new ethers.providers.Web3Provider(window.ethereum)

      // const signer = new Signer(provider, contract)
      if (detectProvider) {
        setAccountListener(detectProvider);
        // detectProvider.request({ method: "eth_requestAccounts" });
        // await provider.send("eth_requestAccounts", []);

        setEthersJsApi({
          ethers: new ethers.providers.Web3Provider(provider),
          signer: provider.getSigner(),
          provider,
          contract: new Contract(process.env.REACT_APP_CONTRACT_ADDRESS, FaucetABI.abi, provider),
        });
      } else {
        console.error('Please Install MetaMask!');
      }
    }
    loadProvider();
  }, []);
  console.log(ethersJsApi.signer)


  useEffect(() => {
    const loadBalance = async () => {
      console.log('Loading balance', process.env.REACT_APP_CONTRACT_ADDRESS);
      setBalance(ethers.utils.formatEther((await ethersJsApi.contract.provider.getBalance(process.env.REACT_APP_CONTRACT_ADDRESS)).toString()));
      setAccountBalance(ethers.utils.formatEther(await ethersJsApi.provider.getBalance(account)).toString())

    }
    // console.log(ethersJsApi.contract)
    ethersJsApi.contract && loadBalance();
  }, [ethersJsApi.contract, shouldReload]);

  useEffect(() => {
    const getAccount = async () => {
      if (ethersJsApi.provider) {
        // let accounts = await ethersJsApi.provider.request({ method: "eth_requestAccounts" });
        let accounts = await ethersJsApi.provider.listAccounts();;
        setAccount(accounts[0]);
      }
      // let c = new Contract(process.env.REACT_APP_CONTRACT_ADDRESS, contract, provider);
      // console.log(((await c.provider.getBalance(process.env.CONTRACT_ADDRESS)).toNumber()))
    }
    ethersJsApi.provider && getAccount();
  }, [ethersJsApi.provider]);

  const addFunds = useCallback(async () => {
    const { signer, contract } = ethersJsApi;
    const tx = await signer.sendTransaction({
      from: account,
      value: ethers.utils.parseEther("1.0"),
      to: contract.address
    })
    await tx.wait();
    console.log(tx)
    // console.log(wait)

    // window.location.reload()
    reloadEffect();
  }, [ethersJsApi, account, reloadEffect]);

  const withdrawFunds = async () => {
    const { signer, contract } = ethersJsApi;
    const withdrawAmount = ethers.utils.parseEther("0.1")
    // console.log(await contract.withdraw(withdrawAmount))
    const withdraw = contract.connect(signer);
    const tx = await withdraw.withdraw(withdrawAmount, {
      from: account,
    });

    // const tx = await contract.withdraw(withdrawAmount, {
    //   from: account
    // })
    // const tx = await signer.sendTransaction({
    //   to: account,
    //   value: ethers.utils.parseEther("0.1")
    // })
    await tx.wait();
    console.log(tx)
    reloadEffect();
  }

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
                !ethersJsApi.provider ?
                  <>
                    <div className="notification is-warning is-size-6 is-rounded">
                      Wallet is not detected, <a target="_blank" href="https://docs.metamask.io">Install Metamask!</a>
                    </div>
                  </> :
                  <button className="button is-small"
                    onClick={() => {
                      ethersJsApi.provider.request({ method: "eth_requestAccounts" });
                    }}
                  >
                    Connect Wallet
                  </button>
            }
          </div>

          <div className="balance-view is-size-2 my-4">
            Current Banalce: <strong>{balance && balance.slice(0, 5)}</strong> ETH
          </div>
          <button
            disabled={!account}
            onClick={addFunds}
            className="button is-link mr-2"
          >
            Donate 1eth
          </button>
          <button
            disabled={!account}
            onClick={withdrawFunds}
            className="button is-primary"
          >
            Withdraw
          </button>
        </div>
      </div>
    </>
  )
}

export default App;