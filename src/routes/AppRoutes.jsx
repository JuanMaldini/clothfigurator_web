import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Projects from "../pages/projects/projects.jsx";
import UsersPage from "../pages/users/users.jsx";
import ControlPanel from "../pages/controlpanel/controlpanel.jsx";
import VConfigurator from "../pages/InteractiveProjects/Configurator_01/V_Configurator_01.jsx";
import VOffice01 from "../pages/InteractiveProjects/V_Office_01/V_Office_01.jsx";
import VClothfigurator from "../pages/InteractiveProjects/V_Clothfigurator/V_Clothfigurator.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/login" element={<UsersPage />} />
      <Route path="/controlpanel" element={<ControlPanel />} />
      <Route path="/vconfigurator" element={<VConfigurator />} />
      <Route path="/voffice01" element={<VOffice01 />} />
      <Route path="/vclothfigurator" element={<VClothfigurator />} />
    </Routes>
  );
};

export default AppRoutes;
