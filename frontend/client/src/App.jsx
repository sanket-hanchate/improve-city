import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import PublicDashboard from "./components/PublicDasbboard/PublicDashboard.jsx";
import Home from "./components/Home/Home.jsx";
import Chatbot from "./components/Chatbot/Chatbot.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/public" element={<PublicDashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
