import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import APlayer from './components/arcware/ArcwarePlayer';

const AppRouter: React.FC = () => (
  <Router>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/ConfiguratorSystem" element={<APlayer />} />
    </Routes>
  </Router>
);

export default AppRouter;
