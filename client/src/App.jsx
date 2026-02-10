import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [visitors, setVisitors] = useState(0)

  useEffect(() => {
    // Fetch resume data from backend
    fetch('/api/resume')
      .then((res) => res.json())
      .then((data) => {
        setResume(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load resume data:', err)
        setLoading(false)
      })

    // Track visitor
    fetch('/api/visitors')
      .then((res) => res.json())
      .then((data) => setVisitors(data.count))
      .catch(() => {})
  }, [])

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader">
          <div className="loader-bar"></div>
        </div>
        <p className="loader-text">Loading portfolio...</p>
      </div>
    )
  }

  if (!resume) {
    return (
      <div className="loader-screen">
        <p className="loader-text">Failed to load data. Please refresh.</p>
      </div>
    )
  }

  return (
    <div className="app">
      <Navbar />
      <Hero resume={resume} />
      <About resume={resume} />
      <Experience experience={resume.experience} />
      <Skills skills={resume.skills} />
      <Education education={resume.education} certifications={resume.certifications} />
      <Contact />
      <Footer resume={resume} visitors={visitors} />
    </div>
  )
}

export default App
