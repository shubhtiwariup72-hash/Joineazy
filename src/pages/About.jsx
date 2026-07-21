import React from 'react'
import './About.css'

const About = (props) => {
  const { aboutMe } = props

  if (!aboutMe) return null

  return (
    <section id='about' className='about-section'>
      <div className='about-container'>
        <div className='about-header'>
          <h2 className='about-title'>{aboutMe.title}</h2>
          <div className='about-divider'></div>
          <p className='about-bio'>{aboutMe.bio}</p>
        </div>

        <div className='about-grid'>
          {/* Skills Section */}
          <div className='about-card skills-card'>
            <div className='card-header'>
              <span className='card-icon'>🛠️</span>
              <h3>Skills</h3>
            </div>
            <div className='skills-list'>
              {aboutMe.skills.map((skill, index) => (
                <span key={`skill-${index}`} className='skill-tag'>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Experiences Section */}
          <div className='about-card timeline-card'>
            <div className='card-header'>
              <span className='card-icon'>💼</span>
              <h3>Experiences</h3>
            </div>
            <div className='timeline'>
              {aboutMe.experiences.map((experience, index) => (
                <div key={`exp-${index}`} className='timeline-item'>
                  <div className='timeline-dot'></div>
                  <div className='timeline-content'>
                    <span className='timeline-duration'>{experience.duration}</span>
                    <h4 className='timeline-title'>{experience.title}</h4>
                    <span className='timeline-subtitle'>{experience.company}</span>
                    <p className='timeline-desc'>{experience.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className='about-card timeline-card'>
            <div className='card-header'>
              <span className='card-icon'>🎓</span>
              <h3>Education</h3>
            </div>
            <div className='timeline'>
              {aboutMe.education.map((edu, index) => (
                <div key={`edu-${index}`} className='timeline-item'>
                  <div className='timeline-dot'></div>
                  <div className='timeline-content'>
                    <span className='timeline-duration'>{edu.duration}</span>
                    <h4 className='timeline-title'>{edu.degree}</h4>
                    <span className='timeline-subtitle'>{edu.university}</span>
                    <p className='timeline-desc'>{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section */}
          <div className='about-card projects-card'>
            <div className='card-header'>
              <span className='card-icon'>💻</span>
              <h3>Projects</h3>
            </div>
            <div className='projects-grid'>
              {aboutMe.projects.map((project, index) => (
                <div key={`project-${index}`} className='project-item'>
                  <h4 className='project-title'>{project.title}</h4>
                  <span className='project-duration'>{project.duration}</span>
                  <p className='project-desc'>{project.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About