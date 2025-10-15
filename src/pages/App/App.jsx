import AppRoutes from "../../routes/AppRoutes.jsx";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "./App.css";

function App() {
  return (
    <main className="app-layout backgroundColor">
      <div className="app-header">
        <Navbar />
      </div>
      <div className="app-body">
        <AppRoutes />
      </div>
      <div className="app-footer">
        <Footer />
      </div>
    </main>
  );
}

export default App;
