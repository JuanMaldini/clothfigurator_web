import { Link } from "react-router-dom"
import Sidepanel from "./components/panel/Sidepanel"

function App() {
  return (
    <div className="centered-container">
      <div className="centered-content">
        <h1>Demo</h1>
        <Link to="/ConfiguratorSystem" className="sp-btn">
          Configurator System
        </Link>
      </div>
    </div>
  )
}
export default App
