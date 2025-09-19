import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App";
import ArcwarePlayer from "./components/arcware/ArcwarePlayer";
import PdfLayout from "./components/pdfConfigurator/pdfLayout";

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/mayerfabrics" element={<ArcwarePlayer />} />
      <Route path="/imthepdf" element={<PdfLayout />} />
    </Routes>
  </Router>
);

export default AppRouter;
