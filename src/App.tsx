import { Route, Routes } from "react-router-dom";
import Home from "../src/pages/Home";
import TokenList from "../src/pages/TokenList";
import Send from "../src/pages/Send";
import Receive from "../src/pages/Receive";
import Buy from "../src/pages/Buy";
import Swap from "../src/pages/Swap";
import AI from "../src/pages/AI";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tokenList" element={<TokenList />} />
        <Route path="/send" element={<Send />} />
        <Route path="/receive" element={<Receive />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/swap" element={<Swap />} />
        <Route path="/ai" element={<AI />} />
      </Routes>
    </>
  );
};

export default App;
