import { Link } from "react-router-dom";
import './App.css';

function App() {
  return (
    <div className="landing-root centered-container">
      <div className="centered-content">
        <h1 className="landing-title">Demo</h1>
        <Link to="/ConfiguratorSystem" className="sp-btn landing-link">
          <div className="noUnderline">Configurator System</div>
          <img src="../icons/Logo.png" alt="Arrow Right" className="landing-icon" />
        </Link>
      </div>
    </div>
  );
}
export default App;
