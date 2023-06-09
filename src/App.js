import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import abi from './abi.json'


function App() {
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSucess] = useState("");
  const [transactionData, setTransactionData ] = useState("");
  const contractAddress ="0x6bF41505c9f996e542CA6Adba9123AE00d5704CD"
  const contract_abi = abi;

  const [token, setToken] = useState({})
  const [ account, setAccount ] = useState(null)

  
  //Metamask Login/Connect
  const web3Handler = async() =>{
    const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
    setAccount(accounts[0])
    //Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    //set signer
    const signer = provider.getSigner()
    loadContracts(signer)
  }
  const loadContracts = async (signer) => {
    //get deployed copies of contract
    const token = new ethers.Contract(contractAddress, contract_abi, signer)
    setToken(token)
  }

  const buyToken = async () => {
    setWithdrawSucess("")
    setWithdrawError(" ")
    try {
     
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          contractAddress,
          contract_abi,
          signer
        );

        const price = {value: ethers.utils.parseEther("0.0003")}
        const buyTokenTxn = await tokenContract.requestTokens(price);

        await buyTokenTxn.wait();
        console.log(buyTokenTxn)
        setWithdrawSucess("operation succeeded - enjoy your tokens");
        setTransactionData(buyTokenTxn.hash)

        alert('Purchase succesful')
        
       
      }
    } catch (error) {
      console.error(error.message);
      setWithdrawError(error.message);;
    }
    
  };

  const withdrawEth = async () => {
    setWithdrawSucess("")
    setWithdrawError(" ")
    try {
     
      const {ethereum} = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        const signer = provider.getSigner();
        const tokenContract = new ethers.Contract(
          contractAddress,
          contract_abi,
          signer
        );

        const withdrawEthTxn = await tokenContract.withdrawEth();

        await withdrawEthTxn.wait();
        setWithdrawSucess("operation succeeded - enjoy your tokens");
        setTransactionData(withdrawEthTxn.hash)

        alert('withdraw succesful')
        
       
      }
    } catch (error) {
      console.error(error.message);
      setWithdrawError(error.message);;
    }
    
  };




  return (
    <div>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-brand">
            <h1 className="navbar-item is-size-4">Rio Token(RIO)</h1>
          </div>
          <div id="navbarMenu" className="navbar-menu">
            <div className="navbar-end is-align-items-center">
              <button
                className="button is-white connect-wallet"
                onClick={web3Handler} 
              >
                <span className="is-link has-text-weight-bold">
                  {account 
                    ? `Connected: ${account.substring(
                        0,
                        6
                      )}...${account.substring(38)}`
                    : "Connect Wallet"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section className="hero is-fullheight">
        <div className="faucet-hero-body">
          <div className="container has-text-centered main-content">
            <h1 className="title is-1">Faucet</h1>
            <p>Fast and reliable. 50 RIO/day.</p>
            <div className="mt-5">
              {withdrawError && (
                <div className="withdraw-error">{withdrawError}</div>
              )}
              {withdrawSuccess && (
                <div className="withdraw-success">{withdrawSuccess}</div>
              )}{" "}
            </div>
            <div className="box address-box">
              <div className="columns">
                <div className="column is-four-fifths">
                  <input
                    className="input is-medium"
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={account}
                  />
                </div>
                <div className="column">
                  <button className="button is-link is-medium" 
                  onClick={buyToken}
                 >
                    GET TOKENS
                  </button>
                </div>
                <div className="column">
                  <button className="button is-link is-medium" 
                  onClick={withdrawEth}
                 >
                   WITHDRAW ETH
                  </button>
                </div>
              </div>
              <article className="panel is-grey-darker">
                <p className="panel-heading">Transaction Data</p>
                <div className="panel-block">
                  <p>{transactionData ? `Transaction hash: ${transactionData}` : "--"}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
