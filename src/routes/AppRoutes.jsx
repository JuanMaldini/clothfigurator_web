import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Projects from "../pages/projects/projects.jsx";
import LoginPage from "../pages/Login/Login.jsx";
import ControlPanel from "../pages/controlpanel/controlpanel.jsx";
import VConfigurator from "../pages/InteractiveProjects/Configurator_01/V_Configurator_01.jsx";
import VOffice01 from "../pages/InteractiveProjects/V_Office_01/V_Office_01.jsx";
import VClothfigurator from "../pages/InteractiveProjects/V_Clothfigurator/V_Clothfigurator.jsx";
import NotFound from "../pages/NotFound/NotFound.jsx";
import ProtectedRoute from "../components/Auth/ProtectedRoute.jsx";

/**
 * AppRoutes - Configuración de rutas de la aplicación con OIDC
 *
 * Define todas las rutas públicas y privadas.
 * Las rutas privadas están protegidas con ProtectedRoute.
 */
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas - Solo accesibles con login */}
      <Route
        path="/controlpanel"
        element={
          <ProtectedRoute>
            <ControlPanel />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vconfigurator"
        element={
          <ProtectedRoute>
            <VConfigurator />
          </ProtectedRoute>
        }
      />
      <Route
        path="/voffice01"
        element={
          <ProtectedRoute>
            <VOffice01 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vclothfigurator"
        element={
          <ProtectedRoute>
            <VClothfigurator />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
