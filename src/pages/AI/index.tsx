import { useAccount } from "wagmi";

function AI() {
  const { address } = useAccount();
  return (
    <div className="container">
      <iframe src="https://toncity.top:3000/"></iframe>
    </div>
  );
}

export default AI;
