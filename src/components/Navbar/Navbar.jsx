import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => (
    <section >
        <header className="topsColor" >
            <Link to="/" className="navbar-brand">Clothfigurator</Link>
            <nav>
                <Link to="/projects">Projects</Link>
                <Link to="/login">Login</Link>
                <Link to="/controlpanel">Control Panel</Link>
            </nav>
        </header>
    </section>
);

export default Navbar;