import {
  useAccount,
  useBalance,
  useChainId,
  useReadContract,
  useSendTransaction,
} from "wagmi";
import { Account } from "../../components/account";
import { WalletOptions } from "../../components/WalletOptions";
import { IMAT } from "../../ca/mainNetWork/IMAI";
import { USDT } from "../../ca/mainNetWork/USDT";
import { formatEther, parseEther } from "viem";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";

function ConnectWallet() {
  const { isConnected } = useAccount();
  if (isConnected) return <Account />;
  return <WalletOptions />;
}

function Home() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { sendTransaction } = useSendTransaction();

  const {
    data: balanceData,
    isLoading,
    refetch: bnbRefetch,
  } = useBalance({
    address: address,
    unit: "ether",
  });

  const {
    data: IMAIBalance,
    isLoading: IMAILoading,
    refetch: IMAIRefetch,
  } = useReadContract({
    abi: IMAT.abi,
    address: IMAT.address as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
  });

  const { data: USDTBalance, isLoading: USDTLoading } = useReadContract({
    abi: USDT.abi,
    address: USDT.address as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
  });

  const chainId = useChainId();
  console.log("chainId  =>", chainId);

  const formatMoney = (money: any) => {
    if (money) {
      return Number(formatEther(money)).toFixed(4);
    } else {
      return 0;
    }
  };

  const isAI = () => {
    if (!address || (formatMoney(IMAIBalance) as number) < 5000) {
      alert("Sorry, must have IMAI 5000, available");
    } else {
      navigate("/ai");
    }
  };

  return (
    <div className="home">
      <div className="header">
        <img src="/img/AI.png" className="chatgpt" onClick={isAI}></img>
        <ConnectWallet></ConnectWallet>
      </div>

      <div className="my-banlance">
        {isLoading
          ? "Loading..."
          : `${Number(balanceData?.formatted) ? Number(balanceData?.formatted).toFixed(2) : "" || "0"} BNB`}
      </div>

      <ul className="fun-list">
        <li>
          <Link to="/send">
            <div className="fun-icon">
              <img src="/img/arr.png" alt="" />
            </div>
            <span>Send</span>
          </Link>
        </li>

        <li>
          <Link to="/receive">
            <div className="fun-icon fun-icon1">
              <img src="/img/arr.png" alt="" />
            </div>
            <span>Receive</span>
          </Link>
        </li>
        <li
          onClick={() =>
            sendTransaction(
              {
                to: IMAT.address as `0x${string}`,
                value: parseEther("0.1"),
              },
              {
                onSuccess: () => {
                  IMAIRefetch();
                  bnbRefetch();
                  alert("is Ok!");
                },
              }
            )
          }
        >
          <div className="fun-icon">
            <img src="/img/buy.png" alt="" />
          </div>
          <span>Buy</span>
        </li>

        <li onClick={() => alert("Gradual opening...")}>
          <div className="fun-icon">
            <img src="/img/history.png" alt="" />
          </div>
          <span>History</span>
        </li>
      </ul>

      <div className="app-list">
        <p className="app-actv">Crypto</p>
        <p onClick={() => alert("Gradual opening...")}>NFT</p>
        <p onClick={() => alert("Gradual opening...")}>DeFi</p>
        <p onClick={() => alert("Gradual opening...")}>Approvals</p>
      </div>

      <ul className="token-list">
        <li>
          <Link to="/swap">
            <div className="token-info">
              <img className="token-logo" src="/img/AI.png" alt="" />
              <p className="token-name">IMAI</p>
            </div>
            <div className="token-num">
              {IMAILoading
                ? "Loading..."
                : `${IMAIBalance ? formatMoney(IMAIBalance) : "0" || "0"}`}
            </div>
          </Link>
        </li>

        <li>
          <Link to="/swap">
            <div className="token-info">
              <img
                className="token-logo"
                src="https://bscscan.com/assets/bsc/images/svg/logos/token-light.svg?v=24.9.5.0"
                alt=""
              />
              <p className="token-name">BNB</p>
            </div>
            <div className="token-num">
              {balanceData?.formatted
                ? Number(balanceData?.formatted).toFixed(4)
                : "0" || "0"}
            </div>
          </Link>
        </li>
        <li>
          <Link to="/swap">
            <div className="token-info">
              <img className="token-logo" src="/img/usdt.png" alt="" />
              <p className="token-name">USDT</p>
            </div>
            <div className="token-num">
              {USDTLoading
                ? "Loading..."
                : `${USDTBalance ? formatMoney(USDTBalance) : "0" || "0"}`}
            </div>
          </Link>
        </li>
      </ul>

      <footer className="footer">
        Experience is priceless.
        <a
          href="https://t.me/goodsmm00008"
          style={{ color: "#ffffff", paddingLeft: "10px" }}
        >
          Call me!
        </a>
      </footer>
    </div>
  );
}

export default Home;
