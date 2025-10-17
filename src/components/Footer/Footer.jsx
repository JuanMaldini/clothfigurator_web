import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <section>
    <footer className="topsColor">
      <div>
        <Link to="/projects" className="footer-link-underline">Projects</Link>
        <a id="footer-contact-link" className="contact-link footer-link-underline" href="https://vanishingpoint3d.com/contact/">Contact</a>
      </div>
    </footer>
  </section>
);

export default Footer;
