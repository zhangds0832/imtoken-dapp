import { useAccount, useDisconnect } from "wagmi";

function shortenAddress(address: any) {
  if (!address) return "";
  const firstPart = address.slice(0, 6); // 前6位
  const lastPart = address.slice(-4); // 后4位
  return `${firstPart}...${lastPart}`;
}

export function Account() {
  const { address } = useAccount();
  return (
    <div className="address-look">
      <div className="address-view">{shortenAddress(address)}</div>

      {/* <button className="address-out" onClick={() => disconnect()}>
        Out
      </button> */}
    </div>
  );
}
