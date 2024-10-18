import { useAccount } from "wagmi";

import QRCode from "react-qr-code";
import copy from "copy-to-clipboard";

function coppyUrl(url: any) {
  copy(url);
  alert("复制成功");
}

function Receive() {
  const { address } = useAccount();
  return (
    <div className="container receive-main">
      <div className="qr-box">
        <QRCode
          size={256}
          level={"L"}
          style={{ height: "auto", maxWidth: "100%" }}
          value={address as string}
          viewBox={`0 0 256 256`}
        />
      </div>

      <p style={{ color: "#6b6b6b", fontSize: "12px", textAlign: "center" }}>
        Only <span style={{ color: "#ffffff" }}>BSC</span> network assets can be
        accepted
      </p>

      <div className="receive">
        <p style={{ color: "#ffffff", fontWeight: "bold" }}>BSC</p>

        <div className="receive-box">
          <p style={{ color: "#6b6b6b", fontSize: "14px", paddingTop: "5px" }}>
            {address}
          </p>
          <button
            type="button"
            className="copyBtn"
            onClick={() => coppyUrl(address)}
          >
            Copy
          </button>
        </div>
      </div>
    </div>
  );
}

export default Receive;
