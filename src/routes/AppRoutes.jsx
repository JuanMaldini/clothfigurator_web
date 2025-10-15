import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Projects from "../pages/Projects/projects.jsx";
import UsersPage from "../pages/users/users.jsx";
import ControlPanel from "../pages/controlpanel/controlpanel.jsx";

const AppRoutes = () => {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<UsersPage />} />
        <Route path="/controlpanel" element={<ControlPanel />} />
    </Routes>
  );
};

export default AppRoutes;
