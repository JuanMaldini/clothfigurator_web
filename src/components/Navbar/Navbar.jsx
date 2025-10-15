import { Link } from "react-router-dom";
import "./Navbar.css";
import Logo from "../../../public/icons/Logo.png";

const Navbar = () => (
    <section >
        <header className="topsColor" >
            <Link to="/" className="navbar-brand"><img src={Logo} width={32} alt="Clothfigurator Logo" />Clothfigurator</Link>
            <nav>
                <Link to="/projects">Projects</Link>
                <Link to="/login">Login</Link>
                <Link to="/controlpanel">Control Panel</Link>
            </nav>
        </header>
    </section>
);

export default Navbar;