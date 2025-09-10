import { Link } from "react-router-dom";

function App() {
  return (
    <div className="landing-root centered-container">
      <div className="centered-content">
        <h1 className="landing-title">Mayer Fabrics</h1>
        <Link to="/mayerfabrics" className="sp-btn landing-link">
          <div className="noUnderline">START APP</div>
          <img src="../icons/Logo.png" alt="Arrow Right" className="landing-icon" />
        </Link>
      </div>
    </div>
  );
}
export default App;
