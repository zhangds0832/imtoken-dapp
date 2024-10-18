import { useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect } = useConnect();

  const params = {
    url: "https://toncity.top",
    chain: "BSC",
    source: "toncity.top",
  };

  return (
    <button
      className="connected-wallet"
      key={connectors[0].uid}
      onClick={() =>
        connect(
          { connector: connectors[0] },
          {
            onSuccess: () => {
              console.log("is ok");
            },
            onError: () => {
              window.location.href = `tpdapp://open?params=${encodeURI(JSON.stringify(params))}`;
              console.log("err");
            },
          }
        )
      }
    >
      Connected wallet
    </button>
  );
}
