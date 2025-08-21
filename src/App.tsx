import { Link } from "react-router-dom"

function App() {
  return (
    <div style={{background: '#18181a'}} className="centered-container">
      <div className="centered-content">
        <h1 style={{color: "white"}}>Demo</h1>
        <Link  to="/ConfiguratorSystem" className="sp-btn" style={{display: 'flex', alignItems: 'center', gap: '0.7rem', color: "white", background: 'var(--ColorBackgroundSelected)'}}>
          <div>Configurator System</div>
          <img src="../icons/Logo.png" alt="Arrow Right" style={{width: '1rem'}} />
        </Link>
      </div>
    </div>
  )
}
export default App
