import { useState } from 'react'
import { motion } from 'motion/react'
import { FiSend, FiCheck, FiAlertCircle, FiLinkedin, FiMapPin, FiMail } from 'react-icons/fi'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (res.ok) {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setErrorMsg(data.error || 'Something went wrong. Please try again.')
        setTimeout(() => setStatus('idle'), 4000)
      }
    } catch {
      setStatus('error')
      setErrorMsg('Network error. Please check your connection.')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <section className="section contact" id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="section__title">
            <span className="section__title-accent">//</span> Get In Touch
          </h2>
          <p className="section__subtitle">
            Interested in working together? Let's connect!
          </p>
        </motion.div>

        <div className="contact__grid">
          <motion.div
            className="contact__info"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="contact__info-title">Let's talk</h3>
            <p className="contact__info-text">
              I'm always open to discussing new projects, creative ideas, or opportunities
              to be part of your vision. Whether you need a senior developer, a team lead,
              or just want to say hi, feel free to reach out!
            </p>

            <div className="contact__channels">
              <a
                href="https://www.linkedin.com/in/evgenii-kurdakov/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact__channel"
              >
                <FiLinkedin size={20} />
                <div>
                  <strong>LinkedIn</strong>
                  <span>linkedin.com/in/evgenii-kurdakov</span>
                </div>
              </a>

              <div className="contact__channel">
                <FiMapPin size={20} />
                <div>
                  <strong>Location</strong>
                  <span>Spain</span>
                </div>
              </div>

              <div className="contact__channel">
                <FiMail size={20} />
                <div>
                  <strong>Availability</strong>
                  <span>Open to opportunities</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            className="contact__form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="contact__form-row">
              <div className="contact__field">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>
              <div className="contact__field">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="contact__field">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
              />
            </div>

            <div className="contact__field">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your project or opportunity..."
              />
            </div>

            <button
              type="submit"
              className={`contact__submit ${status === 'sending' ? 'contact__submit--sending' : ''}`}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>Sending...</>
              ) : status === 'success' ? (
                <><FiCheck /> Message Sent!</>
              ) : (
                <><FiSend /> Send Message</>
              )}
            </button>

            {status === 'success' && (
              <motion.p
                className="contact__status contact__status--success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiCheck /> Thank you! I'll get back to you soon.
              </motion.p>
            )}

            {status === 'error' && (
              <motion.p
                className="contact__status contact__status--error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <FiAlertCircle /> {errorMsg}
              </motion.p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
