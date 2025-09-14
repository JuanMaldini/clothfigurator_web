import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import ArcwarePlayer from "./components/arcware/ArcwarePlayer";

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/mayerfabrics" element={<ArcwarePlayer />} />
    </Routes>
  </Router>
);

export default AppRouter;
