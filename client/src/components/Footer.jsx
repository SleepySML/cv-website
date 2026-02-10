import { FiLinkedin, FiGithub, FiHeart, FiEye } from 'react-icons/fi'

export default function Footer({ resume, visitors }) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__brand">
            <span className="footer__logo">
              <span className="footer__logo-bracket">&lt;</span>
              <span className="footer__logo-text">EK</span>
              <span className="footer__logo-bracket"> /&gt;</span>
            </span>
            <p className="footer__tagline">
              Senior Software Developer crafting modern web experiences
            </p>
          </div>

          <div className="footer__links">
            <a
              href="https://www.linkedin.com/in/evgenii-kurdakov/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {currentYear} {resume.name}. Built with <FiHeart size={14} className="footer__heart" /> using React & Node.js
          </p>
          {visitors > 0 && (
            <p className="footer__visitors">
              <FiEye size={14} /> {visitors.toLocaleString()} visitors
            </p>
          )}
        </div>
      </div>
    </footer>
  )
}
