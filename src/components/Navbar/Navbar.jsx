import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
    <section >
        <header className="topsColor" >
        <h1>Clothfigurator</h1>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/login">Login</Link>
                <Link to="/controlpanel">Control Panel</Link>
            </nav>
        </header>
    </section>
);

export default Navbar;