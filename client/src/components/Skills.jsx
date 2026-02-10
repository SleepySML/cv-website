import { motion } from 'motion/react'
import { FiMonitor, FiServer, FiTool, FiHeart } from 'react-icons/fi'

const categoryIcons = {
  'Frontend': FiMonitor,
  'Backend': FiServer,
  'Tools & Practices': FiTool,
  'Soft Skills': FiHeart,
}

const categoryColors = {
  'Frontend': '#00d4ff',
  'Backend': '#7c3aed',
  'Tools & Practices': '#10b981',
  'Soft Skills': '#f59e0b',
}

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
}

export default function Skills({ skills }) {
  return (
    <section className="section skills" id="skills">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">
            <span className="section__title-accent">//</span> Skills & Technologies
          </h2>
          <p className="section__subtitle">
            Technologies and tools I use to bring ideas to life
          </p>
        </motion.div>

        <div className="skills__grid">
          {Object.entries(skills).map(([category, items], catIndex) => {
            const Icon = categoryIcons[category] || FiCode
            const color = categoryColors[category] || '#00d4ff'

            return (
              <motion.div
                key={category}
                className="skill-category"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                <div className="skill-category__header">
                  <div
                    className="skill-category__icon"
                    style={{ '--category-color': color }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 className="skill-category__title">{category}</h3>
                </div>

                <motion.div
                  className="skill-category__tags"
                  variants={container}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {items.map((skill) => (
                    <motion.span
                      key={skill}
                      className="skill-tag"
                      style={{ '--tag-color': color }}
                      variants={item}
                      whileHover={{ scale: 1.08, y: -2 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
