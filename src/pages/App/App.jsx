import AppRoutes from "../../routes/AppRoutes.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { useLocation } from "react-router-dom";
import "./App.css";

function App() {
  const location = useLocation();
  const hideFooterOn = new Set(["/vconfigurator", "/voffice01", "/vclothfigurator"]);
  const shouldHideFooter = hideFooterOn.has(location.pathname.toLowerCase());
  return (
    <main className="app-layout backgroundColor">
      <div className="app-header">
        <Navbar />
      </div>
      <div className="app-body">
        <AppRoutes />
      </div>
      {!shouldHideFooter && (
        <div className="app-footer">
          <Footer />
        </div>
      )}
    </main>
  );
}

export default App;
