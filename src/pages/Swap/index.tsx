import { useEffect, useState } from "react";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useGasPrice,
  useChainId,
  useEstimateGas,
} from "wagmi";
import { formatEther, parseEther } from "viem";

import { IMAT } from "../../ca/mainNetWork/IMAI";
import { USDT } from "../../ca/mainNetWork/USDT";

import { uniswapV2Factory } from "../../ca/mainNetWork/PancakeSwapV2Factory";
import { uniswapV2Pair } from "../../ca/mainNetWork/PancakeSwapV2Pair";
import { uniswapV2Router } from "../../ca/mainNetWork/PancakeSwapV2Router";

import "./swap-style.css";

function formatMoney(money: any, xs = 4) {
  if (money) {
    return Number(formatEther(money)).toFixed(xs);
  }
}

function vaMoneyLen(money: string) {
  if (money.length > 15) {
    return "16px";
  } else if (money.length > 10) {
    return "18px";
  } else {
    return "20px";
  }
}

function timesloc() {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const deadline = currentTimestamp + 10 * 60;
  return deadline;
}

function Swap() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [token1Num, setToken1Num] = useState("");
  const [token2Num, setToken2Num] = useState("");
  const [tokenMoney, setTokenMoney] = useState("");

  const [token1Address, setToken1Address] = useState(
    "0x55d398326f99059fF775485246999027B3197955"
  );
  const [token2Address, setToken2Address] = useState(
    "0xa73aa71d36938e77b935263166decabd309435ff"
  );

  // ===== 查询类
  // 查询USDT
  const {
    data: USDTBalance,
    isLoading: USDTLoading,
    refetch: USDTRefetch,
  } = useReadContract({
    abi: USDT.abi,
    address: USDT.address as `0x${string}`,
    functionName: "balanceOf",
    args: [address],
  });

  // 获取交易对-用于判断是否有流动性池
  const { data: pairData } = useReadContract({
    abi: uniswapV2Factory.abi,
    address: uniswapV2Factory.address as `0x${string}`,
    functionName: "getPair",
    args: [token1Address, token2Address],
  });
  console.log("pairData =>", pairData);

  // 获取价格
  const { data: amountsOut } = useReadContract({
    abi: uniswapV2Router.abi,
    address: uniswapV2Router.address as `0x${string}`,
    functionName: "getAmountsOut",
    args: [parseEther(token1Num), [token1Address, token2Address]],
  });

  // 获取 交易对储备-用于计算价格
  const { data: tokenAmounts } = useReadContract({
    abi: uniswapV2Pair.abi,
    address: pairData as `0x${string}`,
    functionName: "getReserves",
    args: [],
  });

  const chainId = useChainId();
  console.log("chainId  =>", chainId);

  useEffect(() => {
    if (pairData && amountsOut) {
      console.log("amountsOut =>", amountsOut);
      let amountsOut1: any = amountsOut;
      let amountsOut2: any = amountsOut1[1];
      setToken2Num(formatMoney(amountsOut2, 8) as string);
    } else {
      setToken2Num("");
    }
  }, [pairData, amountsOut]);

  useEffect(() => {
    if (tokenAmounts) {
      console.log("tokenAmounts =>", tokenAmounts);
      let tokenAmounts1: any = tokenAmounts;
      let token1 = tokenAmounts1[0];
      let token2 = tokenAmounts1[1];
      let money = (
        Number(formatEther(token2)) / Number(formatEther(token1))
      ).toFixed(8);

      setTokenMoney(`1 USDT  ≈ ${money} IMAI`);
    }
  }, [pairData, tokenAmounts]);

  const swapBtn = async () => {
    const slippage = 0.03; // 3% 滑点
    let amountOutMin = Number(token2Num) * (1 - slippage);
    let amountOutMinMoney = amountOutMin.toString();
    let res = await writeContractAsync({
      abi: uniswapV2Router.abi,
      address: uniswapV2Router.address as `0x${string}`,
      functionName: "swapExactTokensForTokens",
      args: [
        parseEther(token1Num),
        parseEther(amountOutMinMoney),
        [token1Address, token2Address],
        address,
        timesloc(),
      ],
    });
    console.log("res =>", res);
    if (res) {
      USDTRefetch();
      alert("is Ok!");
    }
  };

  return (
    <div className="container swap-box">
      <div className="swap-balance">
        <span>
          Balance:{" "}
          {USDTLoading
            ? "Loading..."
            : `${USDTBalance ? formatMoney(USDTBalance) : "0" || "0"}`}
        </span>
        <span onClick={() => setToken1Num(formatMoney(USDTBalance) as string)}>
          Max
        </span>
      </div>

      <div className="swap-token">
        <div className="token-info">
          <img className="token-logo" src="/img/usdt.png" alt="" />
          <p className="token-name">USDT</p>
        </div>
        <input
          type="number"
          placeholder="0.0"
          className="swap-input"
          defaultValue={token1Num}
          onChange={(e) => setToken1Num(e.target.value)}
          autoFocus
        ></input>
      </div>

      <div className="swap-line">
        <div className="fun-icon-swap">
          <img src="/img/arr.png" alt="" />
        </div>
      </div>

      <div className="swap-token" style={{ height: "76px" }}>
        <div className="token-info">
          <img className="token-logo" src="/img/AI.png" alt="" />
          <p className="token-name">IMAI</p>
        </div>
        {token2Num == "" ? (
          <p className="swap-money" style={{ color: "#6b6b6b" }}>
            0.0
          </p>
        ) : (
          <p className="swap-money" style={{ fontSize: vaMoneyLen(token2Num) }}>
            {token2Num}
          </p>
        )}
      </div>

      <div className="swap-btn-box">
        <button type="button" className="swap-btn" onClick={swapBtn}>
          Swap
        </button>
      </div>

      {pairData && pairData != 0 ? (
        <ul className="swap-info">
          <li>
            <span className="swap-title">Provider</span>
            <span className="swap-text">Pancakeswap</span>
          </li>

          <li>
            <span className="swap-title">Rate</span>
            <span className="swap-text"> {tokenMoney}</span>
          </li>

          <li>
            <span className="swap-title">Est network fee</span>
            <span className="swap-text">$0.003</span>
          </li>

          <li>
            <span className="swap-title">Slippage</span>
            <span className="swap-text">1%</span>
          </li>

          <li>
            <span className="swap-title">Minimum received</span>
            <span className="swap-text">{token2Num} IMAI</span>
          </li>
        </ul>
      ) : (
        <p style={{ color: "#6b6b6b", padding: "10px 30px", fontSize: "14px" }}>
          No liquidity, Please add liquidity.
        </p>
      )}
    </div>
  );
}

export default Swap;
