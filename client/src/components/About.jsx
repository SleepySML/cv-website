import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { FiMapPin, FiCode, FiBriefcase, FiUsers } from 'react-icons/fi'

function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const start = Date.now()
          const timer = setInterval(() => {
            const elapsed = Date.now() - start
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.round(eased * target))
            if (progress >= 1) clearInterval(timer)
          }, 16)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  )
}

const stats = [
  { icon: FiBriefcase, label: 'Years Experience', value: 8, suffix: '+' },
  { icon: FiCode, label: 'Projects Delivered', value: 6, suffix: '+' },
  { icon: FiUsers, label: 'Teams Led', value: 4, suffix: '' },
  { icon: FiMapPin, label: 'Countries', value: 3, suffix: '' },
]

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function About({ resume }) {
  return (
    <section className="section about" id="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">
            <span className="section__title-accent">//</span> About Me
          </h2>
        </motion.div>

        <div className="about__grid">
          <motion.div
            className="about__text"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="about__summary">{resume.summary}</p>

            <div className="about__details">
              <div className="about__detail">
                <FiMapPin className="about__detail-icon" />
                <span>{resume.location}</span>
              </div>
              <div className="about__detail">
                <FiBriefcase className="about__detail-icon" />
                <span>Currently at EPAM Systems / BCD Travel</span>
              </div>
            </div>

            <div className="about__languages">
              <h3 className="about__subtitle">Languages</h3>
              <div className="about__lang-list">
                {resume.languages.map((lang) => (
                  <div key={lang.language} className="about__lang">
                    <span className="about__lang-name">{lang.language}</span>
                    <span className="about__lang-level">{lang.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about__stats"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} className="stat-card" variants={item}>
                <stat.icon className="stat-card__icon" />
                <div className="stat-card__value">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="stat-card__label">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
