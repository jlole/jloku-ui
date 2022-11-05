import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from 'react-dom/client';
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import Easy from "./pages/Easy";
import Medium from "./pages/Medium";
import Hard from "./pages/Hard";
import Extreme from "./pages/Extreme";
import Test from "./pages/Test";
import NoPage from "./pages/NoPage";
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="easy" element={<Easy />} />
          <Route path="medium" element={<Medium />} />
          <Route path="hard" element={<Hard />} />
          <Route path="extreme" element={<Extreme />} />
          <Route path="test" element={<Test />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
