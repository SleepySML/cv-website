import { motion } from 'motion/react'
import { FiAward, FiBookOpen, FiExternalLink } from 'react-icons/fi'

export default function Education({ education, certifications }) {
  return (
    <section className="section education" id="education">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">
            <span className="section__title-accent">//</span> Education & Certifications
          </h2>
        </motion.div>

        <div className="education__grid">
          {education.map((edu, i) => (
            <motion.div
              key={i}
              className="education__card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="education__card-icon">
                <FiBookOpen size={28} />
              </div>
              <h3 className="education__degree">{edu.degree}</h3>
              <p className="education__field">{edu.field}</p>
              <p className="education__institution">{edu.institution}</p>
              {edu.institutionOriginal && (
                <p className="education__institution-original">{edu.institutionOriginal}</p>
              )}
              <p className="education__period">{edu.period}</p>
            </motion.div>
          ))}

          {certifications?.map((cert, i) => (
            <motion.div
              key={i}
              className="education__card education__card--cert"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: (education.length + i) * 0.1 }}
              whileHover={{ y: -6 }}
            >
              <div className="education__card-icon education__card-icon--cert">
                <FiAward size={28} />
              </div>
              <h3 className="education__degree">{cert.name}</h3>
              <p className="education__institution">{cert.issuer}</p>
              <p className="education__period">Issued {cert.date}</p>
              {cert.url && (
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="education__link"
                >
                  View Certificate <FiExternalLink size={14} />
                </a>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
