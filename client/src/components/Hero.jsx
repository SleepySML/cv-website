import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import ParticleBackground from './ParticleBackground'
import { FiChevronDown } from 'react-icons/fi'

const PROMPT = 'visitor@evgenii-kurdakov:~$ '

const COMMANDS = {
  help: `Available commands:
  about       — Learn more about me
  experience  — View my work history
  skills      — See my technical skills
  education   — Educational background
  contact     — Get in touch with me
  whoami      — Who are you?
  clear       — Clear the terminal
  sudo hire evgenii — ???`,

  about: `Senior Software Developer with 8+ years of experience.
Specializing in React, TypeScript, Node.js, and Next.js.
Currently at EPAM Systems, building enterprise solutions.
Passionate about clean code, mentoring, and AI.`,

  whoami: `You are a curious visitor exploring Evgenii's portfolio.
Great taste in websites, by the way!`,

  'sudo hire evgenii': `[sudo] password for visitor: ********

  Authorization successful!
  Resume downloaded to your brain...
  Interview request queued...

Just kidding! But I'd love to chat.
Scroll down or run 'contact' to reach out.`,

  skills: `Frontend:  JavaScript, TypeScript, React, Next.js, HTML5, CSS3
Backend:   Node.js, Express.js, REST APIs, Microservices
Tools:     Git, CI/CD, Agile/Scrum, Webpack, Vite
Soft:      Team Leadership, Mentoring, Problem Solving`,

  experience: `Senior Developer / Team Lead @ BCD Travel (2022-Present)
Senior Engineer @ Security Bank Corporation (2022)
Developer / Team Lead @ Napoleon Games (2021-2022)
Software Engineer @ Genentech (2020)
Key Developer / Lead @ Kronos Incorporated (2018-2020)
Software Developer @ EPAM Systems (2017-Present)`,

  education: `Master's degree in Computer Science
Saint Petersburg Electrotechnical University LETI (2012-2018)`,

  contact: `LinkedIn: linkedin.com/in/evgenii-kurdakov/
Location: Spain

Or scroll down to use the contact form!`,
}

const INITIAL_COMMANDS = ['help']

export default function Hero({ resume }) {
  const [lines, setLines] = useState([])
  const [input, setInput] = useState('')
  const [historyIdx, setHistoryIdx] = useState(-1)
  const [commandHistory, setCommandHistory] = useState([])
  const [isTyping, setIsTyping] = useState(true)
  const inputRef = useRef(null)
  const terminalRef = useRef(null)

  // Auto-type initial commands
  useEffect(() => {
    let cancelled = false
    const runInitial = async () => {
      await new Promise((r) => setTimeout(r, 800))

      for (const cmd of INITIAL_COMMANDS) {
        if (cancelled) return
        // Type each character
        for (let i = 0; i <= cmd.length; i++) {
          if (cancelled) return
          setInput(cmd.slice(0, i))
          await new Promise((r) => setTimeout(r, 60 + Math.random() * 40))
        }
        await new Promise((r) => setTimeout(r, 300))
        // Execute
        executeCommand(cmd)
        setInput('')
        await new Promise((r) => setTimeout(r, 500))
      }
      setIsTyping(false)
    }

    runInitial()
    return () => { cancelled = true }
  }, [])

  // Scroll terminal to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [lines])

  const executeCommand = useCallback((cmd) => {
    const trimmed = cmd.trim().toLowerCase()

    if (trimmed === 'clear') {
      setLines([])
      return
    }

    // Scroll navigation commands
    const scrollTargets = ['about', 'experience', 'skills', 'education', 'contact']
    const shouldScroll = scrollTargets.includes(trimmed)

    const output = COMMANDS[trimmed]

    setLines((prev) => [
      ...prev,
      { type: 'input', text: cmd },
      {
        type: 'output',
        text: output || `Command not found: ${trimmed}\nType 'help' to see available commands.`,
      },
    ])

    if (shouldScroll) {
      setTimeout(() => {
        const el = document.getElementById(trimmed)
        if (el) el.scrollIntoView({ behavior: 'smooth' })
      }, 600)
    }

    setCommandHistory((prev) => [cmd, ...prev])
    setHistoryIdx(-1)
  }, [])

  const handleKeyDown = (e) => {
    if (isTyping) return

    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIdx < commandHistory.length - 1) {
        const newIdx = historyIdx + 1
        setHistoryIdx(newIdx)
        setInput(commandHistory[newIdx])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIdx > 0) {
        const newIdx = historyIdx - 1
        setHistoryIdx(newIdx)
        setInput(commandHistory[newIdx])
      } else {
        setHistoryIdx(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const partial = input.toLowerCase()
      const match = Object.keys(COMMANDS).find((c) => c.startsWith(partial))
      if (match) setInput(match)
    }
  }

  const focusInput = () => {
    if (inputRef.current) inputRef.current.focus()
  }

  return (
    <section className="hero" id="hero">
      <ParticleBackground />

      <div className="hero__content">
        <motion.div
          className="hero__text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="hero__greeting">Hello, I'm</p>
          <h1 className="hero__name">{resume.name}</h1>
          <h2 className="hero__title">{resume.title}</h2>
          <p className="hero__tagline">{resume.tagline}</p>

          <div className="hero__badges">
            {resume.primarySkills.map((skill) => (
              <span key={skill} className="hero__badge">{skill}</span>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="terminal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={focusInput}
        >
          <div className="terminal__header">
            <div className="terminal__dots">
              <span className="terminal__dot terminal__dot--red"></span>
              <span className="terminal__dot terminal__dot--yellow"></span>
              <span className="terminal__dot terminal__dot--green"></span>
            </div>
            <span className="terminal__title">visitor@evgenii-kurdakov</span>
          </div>

          <div className="terminal__body" ref={terminalRef}>
            <div className="terminal__welcome">
              Welcome to Evgenii's interactive portfolio!
              Type <span className="terminal__highlight">'help'</span> to see available commands.
            </div>

            {lines.map((line, i) => (
              <div key={i} className={`terminal__line terminal__line--${line.type}`}>
                {line.type === 'input' ? (
                  <span>
                    <span className="terminal__prompt">{PROMPT}</span>
                    {line.text}
                  </span>
                ) : (
                  <pre className="terminal__output">{line.text}</pre>
                )}
              </div>
            ))}

            <div className="terminal__input-line">
              <span className="terminal__prompt">{PROMPT}</span>
              <input
                ref={inputRef}
                type="text"
                className="terminal__input"
                value={input}
                onChange={(e) => !isTyping && setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
              />
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        className="hero__scroll"
        onClick={(e) => {
          e.preventDefault()
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
        }}
        animate={{ y: [10, 30, 10] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <FiChevronDown size={28} />
        <span>Scroll to explore</span>
      </motion.a>
    </section>
  )
}
