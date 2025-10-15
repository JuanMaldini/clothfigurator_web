import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
      <section>
        <footer className="topsColor">
          <div>
            <Link to="/projects">Projects</Link>
            <a href="https://vanishingpoint3d.com/contact/">Contact</a>
          </div>
        </footer>
      </section>  
  );

export default Footer;
