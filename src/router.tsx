import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import APlayer from './components/arcware/ArcwarePlayer';
import WebPlayer from './components/webPlayer/webPlayer';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/WebPlayer" element={<WebPlayer />} />
      <Route path="/ConfiguratorSystem" element={<APlayer />} />
    </Routes>
  </Router>
);

export default AppRouter;
