import { useEffect, useState } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { IMAT } from "../../ca/mainNetWork/IMAI";
import { formatEther, parseEther } from "viem";
import copy from "copy-to-clipboard";
function shortenString(str: string) {
  const upperStr = str.toUpperCase();
  if (upperStr.length <= 10) {
    return upperStr;
  }
  const start = upperStr.slice(0, 6);
  const end = upperStr.slice(-4);
  return `${start}...${end}`;
}

function coppyUrl(tx: any) {
  copy(tx);
  alert("Copy OK!");
}

function formatMoney(money: any, xs = 4) {
  if (money) {
    return Number(formatEther(money)).toFixed(xs);
  }
}

const Send = () => {
  const { address } = useAccount();

  const [tokenNum, setTokenNum] = useState("0");
  const [sendAddress, setSendAddress] = useState("");
  const [transferHash, setTransferHash] = useState("");
  const [sendInputD, setSendInputD] = useState(40);

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

  const { writeContractAsync } = useWriteContract();

  const sendAi = async () => {
    if (tokenNum !== "" && sendAddress !== "") {
      const res = await writeContractAsync({
        abi: IMAT.abi,
        address: IMAT.address as `0x${string}`,
        functionName: "transfer",
        args: [sendAddress, parseEther(tokenNum)],
      });

      if (res) {
        alert("is Ok!");
        setTransferHash(res);
        IMAIRefetch();
      }
      console.log("transfer res =>", res);
    }
  };

  useEffect(() => {
    console.log("tokenNum =>", tokenNum);
    console.log("tokenNum leng", tokenNum.length);
    if (tokenNum.length > 1) {
      const inputWidth = 20 + tokenNum.length * 20;
      setSendInputD(inputWidth);
    }
  }, [tokenNum]);

  return (
    <div className="container send-main">
      <p className="send-p">Receiving address</p>

      <textarea
        placeholder="Enter wallet address or ENS domain name"
        className="send-address"
        defaultValue={sendAddress}
        onChange={(e) => setSendAddress(e.target.value)}
      ></textarea>

      <div className="line"></div>

      <div style={{ marginTop: "20px" }}>
        <div className="send-info">
          <span>Usable: </span>
          <span>
            {" "}
            {IMAILoading
              ? "Loading..."
              : `${IMAIBalance ? Number(formatEther(IMAIBalance as bigint)).toFixed(5) : "0" || "0"} IMAI`}
          </span>
          <span
            style={{ color: "#bbff2e", paddingLeft: "10px" }}
            onClick={() => setTokenNum(formatMoney(IMAIBalance) as string)}
          >
            Max
          </span>
        </div>
        {/* <p className="imai-balance"> </p> */}

        <div className="input-box-send">
          <input
            type="number"
            className="token-num"
            defaultValue={tokenNum}
            value={tokenNum}
            onChange={(e) => {
              setTokenNum(e.target.value);
            }}
          ></input>
          {/* <div className="token-send-k"></div> */}
        </div>
      </div>

      <div className="send-footer">
        <button type="button" className="send-btn" onClick={sendAi}>
          Send
        </button>
      </div>

      {/* 
      <div
        style={{
          color: "#6b6b6b",
          paddingTop: "20px",
          paddingLeft: "10px",
          fontSize: "14px",
        }}
      >
        <p>Transfer Hash</p>
        <div className="fl-center">
          <a
            href={`https://bscscan.com/tx/${transferHash}`}
            className="tx-address"
          >
            {shortenString(transferHash)}{" "}
          </a>
          <button
            type="button"
            className="copyBtn"
            onClick={() => coppyUrl(transferHash)}
          >
            Copy
          </button>
        </div>
      </div> */}
    </div>
  );
};

export default Send;
