import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FiChevronDown, FiExternalLink, FiCalendar, FiMapPin } from 'react-icons/fi'

function TimelineCard({ exp, index }) {
  const [expanded, setExpanded] = useState(false)
  const isLeft = index % 2 === 0

  return (
    <motion.div
      className={`timeline__item ${isLeft ? 'timeline__item--left' : 'timeline__item--right'}`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <div className="timeline__dot">
        <div className="timeline__dot-inner"></div>
      </div>

      <motion.div
        className="timeline__card"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="timeline__card-header">
          <div>
            <h3 className="timeline__role">{exp.role}</h3>
            <div className="timeline__company">
              {exp.company}
              {exp.via && <span className="timeline__via"> via {exp.via}</span>}
            </div>
          </div>
        </div>

        <div className="timeline__meta">
          <span className="timeline__meta-item">
            <FiCalendar size={14} />
            {exp.period}
          </span>
          <span className="timeline__meta-item">
            <FiMapPin size={14} />
            {exp.location}
          </span>
        </div>

        <p className="timeline__description">{exp.description}</p>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="timeline__expanded"
            >
              <h4 className="timeline__achievements-title">Key Achievements</h4>
              <ul className="timeline__achievements">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="timeline__achievement">
                    {achievement}
                  </li>
                ))}
              </ul>

              <div className="timeline__tech">
                {exp.technologies.map((tech) => (
                  <span key={tech} className="timeline__tech-tag">{tech}</span>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className={`timeline__toggle ${expanded ? 'timeline__toggle--open' : ''}`}
          onClick={() => setExpanded(!expanded)}
        >
          <span>{expanded ? 'Show less' : 'Show more'}</span>
          <FiChevronDown size={16} />
        </button>
      </motion.div>
    </motion.div>
  )
}

export default function Experience({ experience }) {
  return (
    <section className="section experience" id="experience">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">
            <span className="section__title-accent">//</span> Experience
          </h2>
          <p className="section__subtitle">
            8+ years building enterprise solutions across banking, healthcare, travel, and gaming
          </p>
        </motion.div>

        <div className="timeline">
          <div className="timeline__line"></div>
          {experience.map((exp, index) => (
            <TimelineCard key={exp.id} exp={exp} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
