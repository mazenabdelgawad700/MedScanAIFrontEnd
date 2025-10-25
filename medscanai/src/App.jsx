import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import ConfirmEmail from "./pages/ConfirmEmail/ConfirmEmail";

function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/confirm-email" element={<ConfirmEmail />} />
      </Routes>
    </main>
  );
}

export default App;
