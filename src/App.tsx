import { Link } from "react-router-dom";

function App() {
  return (
    <div className="landing-root centered-container">
      <div className="centered-content">
        <h1 className="landing-title">Clothfigurator</h1>
        <Link to="/clothfigurator" className="sp-btn landing-link">
          <div className="noUnderline">START DEMO</div>
          <img src="../icons/Logo.png" alt="Arrow Right" className="landing-icon" />
        </Link>
      </div>
    </div>
  );
}
export default App;
