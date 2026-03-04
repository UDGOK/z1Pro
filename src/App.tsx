import { useState, useEffect } from 'react'
import './App.css'

// ========================================
// MACHINE DATA - Battery Recycling Equipment
// ========================================

interface Machine {
  id: string
  name: string
  category: string
  description: string
  specs: string
  icon: string
  image: string
  model: string
}

const machineCategories = {
  'Sorting & Separation': [
    { id: 'crusher', name: 'Primary Crusher', category: 'Sorting & Separation', description: 'Heavy-duty shredding of battery packs into smaller fragments for further processing. Features high-torque motor and reinforced cutting blades.', specs: '15-30 kW | 1-3 t/h', icon: '⚙️', image: '/imgs/industrial-battery-recycling-shredder-blades.jpg', model: 'BC-3000 Series' },
    { id: 'grinder', name: 'Hammer Mill Grinder', category: 'Sorting & Separation', description: 'Fine grinding for material liberation. Achieves uniform particle size for optimal separation.', specs: '45-75 kW | 2-5 t/h', icon: '🔄', image: '/imgs/industrial-hammer-mill-grinder-machine.jpg', model: 'HM-500 Pro' },
    { id: 'separator', name: 'Air Separator', category: 'Sorting & Separation', description: 'Density-based material separation using airflow. Separates light materials from heavy fractions.', specs: '11-22 kW | 1-4 t/h', icon: '💨', image: '/imgs/industrial-air-separator-machine-waste-sorting.jpg', model: 'AS-2000' },
    { id: 'magnetic', name: 'Magnetic Separator', category: 'Sorting & Separation', description: 'Extracts iron and steel from shredded material using high-intensity magnetic fields.', specs: '2-5 kW | 3-8 t/h', icon: '🧲', image: '/imgs/industrial-magnetic-separator-metal-machine.jpg', model: 'MS-1500' },
    { id: 'eddy', name: 'Eddy Current Separator', category: 'Sorting & Separation', description: 'Non-ferrous metal recovery using induced magnetic fields. Separates aluminum, copper, and other conductive metals.', specs: '15-30 kW | 2-6 t/h', icon: '⚡', image: '/imgs/eddy-current-separator-non-ferrous-diagram.jpg', model: 'ECS-800' },
  ],
  'Chemical Processing': [
    { id: 'leaching', name: 'Leaching Reactor', category: 'Chemical Processing', description: 'Acid or alkaline solution dissolves metals from crushed battery materials for recovery.', specs: '30-50 kW | 500-2000L', icon: '🧪', image: '/imgs/leaching-reactor-chemical-tank-industrial.jpg', model: 'LR-3000' },
    { id: 'precipitation', name: 'Precipitation Tank', category: 'Chemical Processing', description: 'Chemical precipitation of dissolved metals as solid compounds for collection.', specs: '5-15 kW | 1000-5000L', icon: '🎯', image: '/imgs/industrial-chemical-precipitation-cone-bottom-tank.jpg', model: 'PT-500' },
    { id: 'extraction', name: 'Solvent Extraction', category: 'Chemical Processing', description: 'Selective metal recovery using organic solvents. Achieves high purity metal concentrates.', specs: '10-25 kW | 200-1000L', icon: '🔬', image: '/imgs/scheibel-column-solvent-extraction-pilot-plant-diagram.jpg', model: 'SX-200' },
    { id: 'electrowinning', name: 'Electrowinning Cell', category: 'Chemical Processing', description: 'Electrochemical recovery of pure metals from solution using electrical current.', specs: '20-50 kW | 100-500A', icon: '⚗️', image: '/imgs/industrial-electrowinning-cell-copper-extraction.jpg', model: 'EW-1000' },
  ],
  'Thermal Treatment': [
    { id: 'pyrolysis', name: 'Pyrolysis Furnace', category: 'Thermal Treatment', description: 'Thermal decomposition of organic materials in oxygen-free environment. Recovers carbon and reduces waste.', specs: '50-150 kW | 300-800°C', icon: '🔥', image: '/imgs/industrial-pyrolysis-furnace-waste-recycling.jpg', model: 'PY-800' },
    { id: 'calciner', name: 'Rotary Calciner', category: 'Thermal Treatment', description: 'High-temperature processing for material transformation and purification.', specs: '80-200 kW | 800-1200°C', icon: '🌡️', image: '/imgs/industrial-rotary-calciner-furnace-render.jpg', model: 'RC-1500' },
    { id: 'dryer', name: 'Industrial Dryer', category: 'Thermal Treatment', description: 'Moisture removal from processed materials using heated air circulation.', specs: '20-60 kW | 100-500 kg/h', icon: '💧', image: '/imgs/industrial-rotary-dryer-machine-manufacturing.jpg', model: 'ID-300' },
  ],
  'Material Handling': [
    { id: 'conveyor', name: 'Belt Conveyor System', category: 'Material Handling', description: 'Automated material transport between process stages with adjustable speed control.', specs: '3-15 kW | 10-50 t/h', icon: '➡️', image: '/imgs/industrial-belt-conveyor-system-labeled-diagram.jpg', model: 'BCS-500' },
    { id: 'feeder', name: 'Vibratory Feeder', category: 'Material Handling', description: 'Controlled material input with adjustable feed rate. Ensures consistent flow.', specs: '1-5 kW | 1-10 t/h', icon: '📳', image: '/imgs/industrial-vibratory-feeder-material-handling.jpg', model: 'VF-200' },
    { id: 'hopper', name: 'Storage Hopper', category: 'Material Handling', description: 'Raw material storage with controlled discharge. Features angled bottom for easy emptying.', specs: '5-50 m³ capacity', icon: '📦', image: '/imgs/industrial-storage-hopper-bin.jpg', model: 'SH-100' },
    { id: 'dust', name: 'Dust Collection System', category: 'Material Handling', description: 'Air filtration and particulate control. Protects workers and environment.', specs: '15-40 kW | 5000-20000 m³/h', icon: '🌬️', image: '/imgs/industrial-dust-collection-system-schematic.jpg', model: 'DCS-1000' },
  ],
  'Environmental Systems': [
    { id: 'scrubber', name: 'Gas Scrubber', category: 'Environmental Systems', description: 'Hazardous gas treatment using liquid spray to remove pollutants before emission.', specs: '10-30 kW | 1000-5000 m³/h', icon: '🛡️', image: '/imgs/industrial-gas-scrubber-technical-diagram.jpg', model: 'GS-500' },
    { id: 'wastewater', name: 'Wastewater Treatment', category: 'Environmental Systems', description: 'Process water purification using filtration and chemical treatment. Enables water reuse.', specs: '15-45 kW | 10-50 m³/h', icon: '🌊', image: '/imgs/isometric-industrial-wastewater-treatment-system.jpg', model: 'WWT-200' },
    { id: 'filter', name: 'HEPA Filter System', category: 'Environmental Systems', description: 'High-efficiency air filtration capturing 99.97% of particles down to 0.3 microns.', specs: '5-15 kW | 1000-3000 m³/h', icon: '🔳', image: '/imgs/industrial-v-bank-hepa-air-filter.jpg', model: 'HF-300' },
  ],
}

// ========================================
// AUTO-DRAWING SYSTEM
// Upload PDFs to /public/drawings/ folder
// Filename format: [PREFIX]-[NUMBER]_[TITLE]_[DATE]_[STATUS].pdf
// Example: A-001_Floor-Plan_2024-03-01_Current.pdf
// The manifest is auto-generated at build time by generate-manifest.mjs
// ========================================

interface Drawing {
  sheetNumber: string
  title: string
  description: string
  discipline: string
  date: string
  status: string
  file: string
}

// Discipline mapping based on prefix
const DISCIPLINE_MAP: Record<string, string> = {
  'G': 'General',
  'A': 'Architectural',
  'S': 'Structural',
  'M': 'Mechanical',
  'E': 'Electrical',
  'C': 'Civil',
  'B': 'Building',
  'P': 'Plumbing',
  'F': 'Fire Protection',
  'T': 'Telecommunications',
}

// Default drawings - used if manifest fails to load
const DEFAULT_DRAWINGS: Drawing[] = [
  { sheetNumber: "G-001", title: "General Notes & Legend", description: "Project general notes, abbreviations, and drawing legend", discipline: "General", date: "2024-01-15", status: "Current", file: "/drawings/A-001_General-Notes_2024-03-03_Current.pdf" },
]

// Group drawings by discipline
function groupDrawingsByDiscipline(drawings: Drawing[]): Record<string, Drawing[]> {
  return drawings.reduce((acc, drawing) => {
    const discipline = drawing.discipline
    if (!acc[discipline]) {
      acc[discipline] = []
    }
    acc[discipline].push(drawing)
    return acc
  }, {} as Record<string, Drawing[]>)
}

// Sort drawings by sheet number
function sortDrawings(drawings: Drawing[]): Drawing[] {
  return [...drawings].sort((a, b) => {
    const aPrefix = a.sheetNumber.match(/^([A-Za-z])/)?.[1] || ''
    const bPrefix = b.sheetNumber.match(/^([A-Za-z])/)?.[1] || ''
    const aNum = parseInt(a.sheetNumber.match(/(\d+)/)?.[1] || '0')
    const bNum = parseInt(b.sheetNumber.match(/(\d+)/)?.[1] || '0')
    
    if (aPrefix !== bPrefix) return aPrefix.localeCompare(bPrefix)
    return aNum - bNum
  })
}

// Types for modal
interface ProcessStepDetail {
  title: string
  description: string
  tag: string
  tagType: string
  cost: string | null
  technicalDetails: string
  safetyNotes: string
  supplierOptions: { name: string; pros: string; cons: string; price: string }[]
  whyNeeded: string
}

// Comment interface
interface Comment {
  id: number
  questionIndex: number
  name: string
  email: string
  comment: string
  createdAt: string
}

function App() {
  const [activeSection, setActiveSection] = useState('hero')
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [drawings, setDrawings] = useState<Drawing[]>(DEFAULT_DRAWINGS)
  const [manifestLoaded, setManifestLoaded] = useState(false)
  const [machineMenuOpen, setMachineMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [commentForm, setCommentForm] = useState({ name: '', email: '', comment: '' })
  const [submitting, setSubmitting] = useState(false)

  // Fetch drawings from manifest (generated at build time)
  useEffect(() => {
    fetch('/drawings-manifest.json')
      .then(res => res.json())
      .then(data => {
        if (data.drawings && data.drawings.length > 0) {
          setDrawings(data.drawings)
        }
        setManifestLoaded(true)
      })
      .catch(() => {
        console.log('Using default drawings')
        setManifestLoaded(true)
      })
  }, [])

  // Close machine dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.nav-dropdown-container')) {
        setMachineMenuOpen(false)
        setActiveCategory(null)
      }
    }
    
    if (machineMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [machineMenuOpen])

  // Load comments from API on mount
  useEffect(() => {
    fetch('https://process.z1recycle.com/api/comments')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setComments(data)
        }
      })
      .catch(() => {
        // Fallback to localStorage
        const saved = localStorage.getItem('z1question_comments')
        if (saved) {
          setComments(JSON.parse(saved))
        }
      })
  }, [])

  // Save comments to localStorage as backup
  const saveComments = (newComments: Comment[]) => {
    setComments(newComments)
    localStorage.setItem('z1question_comments', JSON.stringify(newComments))
  }

  // Submit a new comment to API
  const submitComment = async (questionIndex: number) => {
    if (!commentForm.name || !commentForm.email || !commentForm.comment) return
    
    setSubmitting(true)
    
    try {
      const res = await fetch('https://process.z1recycle.com/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex,
          name: commentForm.name,
          email: commentForm.email,
          comment: commentForm.comment
        })
      })
      
      if (res.ok) {
        const newComment = await res.json()
        setComments([...comments, newComment])
      }
    } catch (error) {
      console.error('Failed to submit comment to API, using localStorage')
      // Fallback to localStorage
      const newComment: Comment = {
        id: Date.now(),
        questionIndex,
        name: commentForm.name,
        email: commentForm.email,
        comment: commentForm.comment,
        createdAt: new Date().toISOString()
      }
      setComments([...comments, newComment])
      localStorage.setItem('z1question_comments', JSON.stringify([...comments, newComment]))
    }
    
    setCommentForm({ name: '', email: '', comment: '' })
    setSubmitting(false)
  }

  // Get comments for a specific question
  const getQuestionComments = (questionIndex: number) => {
    return comments.filter(c => c.questionIndex === questionIndex)
  }

  // Get all drawings and apply filter
  const allDrawings = drawings
  const filteredDrawings = activeFilter === 'All' 
    ? allDrawings 
    : allDrawings.filter(d => d.discipline === activeFilter)
  const sortedDrawings = sortDrawings(filteredDrawings)
  
  // Group by discipline for display
  const drawingsByDiscipline = groupDrawingsByDiscipline(allDrawings)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(id)
    }
  }

  const openModal = (index: number) => {
    setSelectedStep(index)
    document.body.style.overflow = 'hidden'
  }

  const closeModal = () => {
    setSelectedStep(null)
    document.body.style.overflow = 'auto'
  }

  const openPdf = (pdfPath: string) => {
    setSelectedPdf(pdfPath)
    document.body.style.overflow = 'hidden'
  }

  const closePdf = () => {
    setSelectedPdf(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className="app">
      <div className="bg-animation"></div>
      <div className="grid-overlay"></div>

      {/* Navigation */}
      <nav className="nav">
        <div className="nav-container">
          <div className="nav-logo">Z1 Process</div>
          <div className="nav-links">
            <div className="nav-dropdown-container">
              <a 
                href="#machines" 
                className={`nav-dropdown-trigger ${machineMenuOpen ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setMachineMenuOpen(!machineMenuOpen) }}
              >
                <span>Machines</span>
                <svg className={`dropdown-arrow ${machineMenuOpen ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
              {machineMenuOpen && (
                <div className="nav-dropdown">
                  <div className="dropdown-glow"></div>
                  {Object.entries(machineCategories).map(([category, machines]) => (
                    <a 
                      key={category} 
                      href={`#machines-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault()
                        setMachineMenuOpen(false)
                        scrollToSection(`machines-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`)
                      }}
                    >
                      <span className="dropdown-icon">{machines[0].icon}</span>
                      <span className="dropdown-label">{category}</span>
                      <span className="dropdown-count">{machines.length}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#process" onClick={(e) => { e.preventDefault(); scrollToSection('process') }}>Process</a>
            <a href="#equipment" onClick={(e) => { e.preventDefault(); scrollToSection('equipment') }}>Equipment</a>
            <a href="#oklahoma" onClick={(e) => { e.preventDefault(); scrollToSection('oklahoma') }}>Oklahoma</a>
            <a href="#economics" onClick={(e) => { e.preventDefault(); scrollToSection('economics') }}>Economics</a>
            <a href="#questions" onClick={(e) => { e.preventDefault(); scrollToSection('questions') }}>Questions</a>
            <a href="#drawings" onClick={(e) => { e.preventDefault(); scrollToSection('drawings') }}>Drawings</a>
            <a href="#team" onClick={(e) => { e.preventDefault(); scrollToSection('team') }}>Team</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div className="hero-badge">Oklahoma DEQ Compliant</div>
        <h1>USA Battery Recycling<br />Equipment Guide</h1>
        <p className="subtitle">Hybrid Approach: Chinese Equipment + Western Safety Systems<br />Complete 14-Step Process with Discharge, PACK Decomposition & Waste Gas Treatment</p>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="value">$420K-550K</div>
            <div className="label">Standard Tier CAPEX</div>
          </div>
          <div className="metric-card">
            <div className="value">1 t/h</div>
            <div className="label">Capacity</div>
          </div>
          <div className="metric-card">
            <div className="value">24-36 mo</div>
            <div className="label">Payback Period</div>
          </div>
          <div className="metric-card">
            <div className="value">95%+</div>
            <div className="label">Recovery Rate</div>
          </div>
        </div>
        
        <div className="scroll-indicator" onClick={() => scrollToSection('process')}>
          <span>Scroll to explore</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>
      </section>

      {/* Process Flow */}
      <section id="process">
        <div className="section-header">
          <span className="section-number">// Complete Process Flow</span>
          <h2 className="section-title">14-Step Recycling Process</h2>
          <p className="section-subtitle">Click any step for detailed technical specifications and engineering rationale</p>
        </div>
        
        <div className="warning-banner">
          <div className="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <h4>Critical Additions Based on Engineering Review</h4>
            <p>This enhanced process includes battery discharge (Step 2), PACK decomposition (Step 3), and organic waste gas treatment (Step 11) - essential for safe, Oklahoma-compliant operations. Click each step for detailed engineering rationale.</p>
          </div>
        </div>
        
        <div className="process-flow">
          {processSteps.map((step, index) => (
            <div key={index} className="process-step" onClick={() => openModal(index)}>
              <div className="step-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <span className="click-hint">Click for detailed specs →</span>
              </div>
              <div className="step-meta">
                <span className={`supplier-tag ${step.tagType}`}>{step.tag}</span>
                {step.cost && <div className="cost-tag">{step.cost}</div>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipment Details */}
      <section id="equipment">
        <div className="section-header">
          <span className="section-number">// Equipment Specifications</span>
          <h2 className="section-title">Complete Equipment List</h2>
          <p className="section-subtitle">Detailed specifications with supplier options and pricing tiers</p>
        </div>
        
        <div className="equipment-grid">
          {equipmentList.map((item, index) => (
            <div key={index} className="equipment-card" onClick={() => openModal(index)}>
              <div className="equipment-header">
                <span className={`equipment-tag ${item.tagType}`}>{item.category}</span>
                <div className="equipment-cost">{item.cost}</div>
              </div>
              <h3>{item.name}</h3>
              <p>{item.shortDesc}</p>
              <div className="equipment-suppliers">
                {item.suppliers.slice(0, 2).map((s, i) => (
                  <span key={i} className="supplier-chip">{s}</span>
                ))}
              </div>
              <span className="click-hint">Click for detailed specs →</span>
            </div>
          ))}
        </div>
      </section>

      {/* Oklahoma Compliance */}
      <section id="oklahoma">
        <div className="section-header">
          <span className="section-number">// Oklahoma Regulations</span>
          <h2 className="section-title">Oklahoma DEQ Compliance</h2>
          <p className="section-subtitle">Environmental requirements and permitting strategy</p>
        </div>
        
        <div className="oklahoma-grid">
          {oklahomaInfo.map((info, index) => (
            <div key={index} className="ok-card">
              <div className="icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={info.iconPath}/>
                </svg>
              </div>
              <h3>{info.title}</h3>
              <p>{info.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Economics */}
      <section id="economics">
        <div className="section-header">
          <span className="section-number">// Investment Options</span>
          <h2 className="section-title">Cost Tiers & Economics</h2>
          <p className="section-subtitle">Three configuration options based on budget and operational requirements</p>
        </div>
        
        <div className="tier-grid">
          {tierOptions.map((tier, index) => (
            <div key={index} className={`tier-card ${tier.recommended ? 'recommended' : ''}`}>
              {tier.recommended && <div className="tier-badge">Recommended</div>}
              <h3>{tier.name}</h3>
              <p className="tier-desc">{tier.description}</p>
              <div className="tier-cost">{tier.cost}</div>
              <ul className="tier-features">
                {tier.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
              <div className="tier-tradeoffs">
                <strong>Trade-offs:</strong> {tier.tradeoffs}
              </div>
            </div>
          ))}
        </div>

        {/* LFP Economics */}
        <div className="lfp-section">
          <h3>LFP Recycling Economics (Chinese Research)</h3>
          <p className="lfp-note">Cross-referenced with pilot-scale data from Chinese operations (2024)</p>
          
          <div className="lfp-grid">
            <div className="lfp-card">
              <h4>Operating Cost</h4>
              <div className="lfp-value">$0.506/kg</div>
              <p>Total operating cost per kg of LFP black mass processed</p>
            </div>
            <div className="lfp-card">
              <h4>Revenue Potential</h4>
              <div className="lfp-value">$1,341-1,950/ton</div>
              <p>Total revenue from Li₂CO₃ + FePO₄ products</p>
            </div>
            <div className="lfp-card">
              <h4>Net Margin</h4>
              <div className="lfp-value">$835-1,444/ton</div>
              <p>Profit margin per ton of LFP black mass processed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Questions for Engineers */}
      <section id="questions">
        <div className="section-header">
          <span className="section-number">// Engineering Questions</span>
          <h2 className="section-title">Questions for Your Engineering Team</h2>
          <p className="section-subtitle">Key questions to discuss with your engineers based on this analysis</p>
        </div>
        
        <div className="questions-grid">
          {engineeringQuestions.map((q, index) => {
            const questionComments = getQuestionComments(index)
            return (
            <div key={index} className="question-card">
              <div className="question-number">Q{index + 1}</div>
              <h3>{q.question}</h3>
              <p className="question-context">{q.context}</p>
              <div className="question-importance">
                <span className={`importance-tag ${q.importance}`}>{q.importance}</span>
              </div>
              
              {/* Comment Toggle */}
              <button 
                className="comment-toggle"
                onClick={() => setActiveQuestion(activeQuestion === index ? null : index)}
              >
                💬 {questionComments.length} {questionComments.length === 1 ? 'Reply' : 'Replies'}
              </button>
              
              {/* Comments Section */}
              {activeQuestion === index && (
                <div className="comments-section">
                  {questionComments.length > 0 ? (
                    <div className="comments-list">
                      {questionComments.map((c) => (
                        <div key={c.id} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-name">{c.name}</span>
                            <span className="comment-date">
                              {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <p className="comment-text">{c.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="no-comments">No replies yet. Be the first to reply!</p>
                  )}
                  
                  {/* Comment Form */}
                  <div className="comment-form">
                    <h4>Add Your Reply</h4>
                    <div className="form-row">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                        className="comment-input"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                        className="comment-input"
                      />
                    </div>
                    <textarea
                      placeholder="Write your reply..."
                      value={commentForm.comment}
                      onChange={(e) => setCommentForm({...commentForm, comment: e.target.value})}
                      className="comment-textarea"
                      rows={3}
                    />
                    <button 
                      className="submit-comment-btn"
                      onClick={() => submitComment(index)}
                      disabled={submitting || !commentForm.name || !commentForm.email || !commentForm.comment}
                    >
                      {submitting ? 'Posting...' : 'Post Reply'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )})}
        </div>

        <div className="questions-note">
          <h4>📋 Recommended Next Steps</h4>
          <ol>
            <li>Schedule engineering review meeting with this document</li>
            <li>Request quotes from at least 2 suppliers per major equipment category</li>
            <li>Contact
            Oklahoma DEQ Air Quality Division for pre-application meeting</li>
            <li>Engage a metallurgical engineer or battery recycling consultant</li>
            <li>Develop feedstock supply agreements with 2-3 potential suppliers</li>
          </ol>
        </div>
      </section>

      {/* Drawings Section */}
      <section id="drawings">
        <div className="section-header">
          <span className="section-number">// Facility Drawings</span>
          <h2 className="section-title">Architectural & Engineering Plans</h2>
          <p className="section-subtitle">Official construction documents, permits, and technical drawings</p>
        </div>

        <div className="drawings-container">
          <div className="drawings-sidebar">
            <div className="drawings-filters">
              <h3>Drawing Categories</h3>
              <div className="filter-group">
                <button 
                  className={`filter-btn ${activeFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('All')}
                >
                  All Drawings <span className="filter-count">{allDrawings.length}</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Architectural' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Architectural')}
                >
                  Architectural <span className="filter-count">{drawingsByDiscipline['Architectural']?.length || 0}</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Structural' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Structural')}
                >
                  Structural <span className="filter-count">{drawingsByDiscipline['Structural']?.length || 0}</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Mechanical' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Mechanical')}
                >
                  Mechanical <span className="filter-count">{drawingsByDiscipline['Mechanical']?.length || 0}</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Electrical' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Electrical')}
                >
                  Electrical <span className="filter-count">{drawingsByDiscipline['Electrical']?.length || 0}</span>
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'Civil' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('Civil')}
                >
                  Civil <span className="filter-count">{drawingsByDiscipline['Civil']?.length || 0}</span>
                </button>
              </div>
            </div>
            
            <div className="drawings-info">
              <div className="info-card">
                <h4>Project Details</h4>
                <div className="info-row">
                  <span className="label">Project:</span>
                  <span className="value">Z1 Process Facility</span>
                </div>
                <div className="info-row">
                  <span className="label">Location:</span>
                  <span className="value">Oklahoma</span>
                </div>
                <div className="info-row">
                  <span className="label">Status:</span>
                  <span className="value status-wip">WIP - In Progress</span>
                </div>
                <div className="info-row">
                  <span className="label">Sheets:</span>
                  <span className="value">{drawings.length} Drawings</span>
                </div>
              </div>
            </div>
          </div>

          <div className="drawings-main">
            <div className="drawings-header-row">
              <h3>Drawing Register</h3>
              <span className="drawing-count">{sortedDrawings.length} of {allDrawings.length} documents</span>
            </div>
            
            <div className="drawings-table">
              <div className="table-header">
                <div className="col-sheet">Sheet No.</div>
                <div className="col-title">Drawing Title</div>
                <div className="col-discipline">Discipline</div>
                <div className="col-date">Date</div>
                <div className="col-action">View</div>
              </div>
              {sortedDrawings.map((drawing, index) => (
                <div 
                  key={index} 
                  className={`table-row ${drawing.status === 'Current' ? 'current' : 'revision'}`}
                  onClick={() => openPdf(drawing.file)}
                >
                  <div className="col-sheet">
                    <span className="sheet-number">{drawing.sheetNumber}</span>
                  </div>
                  <div className="col-title">
                    <span className="drawing-name">{drawing.title}</span>
                    <span className="drawing-desc">{drawing.description}</span>
                  </div>
                  <div className="col-discipline">
                    <span className={`discipline-tag ${drawing.discipline.toLowerCase()}`}>
                      {drawing.discipline}
                    </span>
                  </div>
                  <div className="col-date">
                    <span className="date">{drawing.date}</span>
                  </div>
                  <div className="col-action">
                    <button className="view-btn">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="drawings-legend">
          <div className="legend-item">
            <span className="legend-dot current"></span>
            <span>Current Released Drawing</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot revision"></span>
            <span>Revision/Work in Progress</span>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team">
        <div className="team-hero">
          <div className="team-hero-image">
            <img src="/team-neon.png" alt="Z1 Process Team" />
            <div className="team-hero-overlay"></div>
          </div>
          <div className="team-hero-content">
            <span className="section-number">// Leadership Team</span>
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">Industry experts driving sustainable battery recycling innovation</p>
          </div>
        </div>
        
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-card">
              <div className="team-avatar">
                <div className="avatar-initials">{member.initials}</div>
                <div className="avatar-glow"></div>
              </div>
              <h3>{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-email">{member.email}</p>
              <div className="team-bio">{member.bio}</div>
            </div>
          ))}
        </div>

        <div className="team-cta">
          <div className="team-cta-content">
            <h3>And Our Extended Team</h3>
            <p>We have a dedicated team of {extendedTeamCount}+ professionals including engineers, safety specialists, environmental compliance experts, and operations staff committed to advancing sustainable battery recycling in Oklahoma.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to Build Your Plant?</h2>
        <p>Contact suppliers for quotes. Start with feedstock agreements and offtake contracts. Ensure Oklahoma DEQ compliance from day one.</p>
        <a href="#process" className="btn" onClick={(e) => { e.preventDefault(); scrollToSection('process') }}>
          View Complete Process
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </section>

      {/* Machine Sections */}
      {Object.entries(machineCategories).map(([category, machines]) => (
        <section key={category} id={`machines-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} className="machine-section">
          <div className="section-header">
            <span className="section-number">// {category}</span>
            <h2 className="section-title">{category} Equipment</h2>
          </div>
          <div className="machines-grid">
            {machines.map((machine) => (
              <div key={machine.id} className="machine-card">
                <div className="machine-image">
                  <img src={machine.image} alt={machine.name} />
                  <div className="machine-image-glow"></div>
                </div>
                <div className="machine-content">
                  <div className="machine-model">{machine.model}</div>
                  <h3 className="machine-title">{machine.name}</h3>
                  <p className="machine-description">{machine.description}</p>
                  <div className="machine-specs">
                    <span className="spec-label">Specifications</span>
                    <span className="spec-value">{machine.specs}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* Modal */}
      {selectedStep !== null && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <span className={`supplier-tag ${processSteps[selectedStep].tagType}`}>
                {processSteps[selectedStep].tag}
              </span>
              <h2>{processSteps[selectedStep].title}</h2>
              <div className="modal-cost">{processSteps[selectedStep].cost}</div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>📋 Overview</h3>
                <p>{processSteps[selectedStep].description}</p>
              </div>

              <div className="modal-section">
                <h3>🔧 Why This Step is Needed</h3>
                <p>{processSteps[selectedStep].whyNeeded}</p>
              </div>

              <div className="modal-section">
                <h3>⚙️ Technical Details</h3>
                <p>{processSteps[selectedStep].technicalDetails}</p>
              </div>

              <div className="modal-section">
                <h3>⚠️ Safety Notes</h3>
                <p>{processSteps[selectedStep].safetyNotes}</p>
              </div>

              <div className="modal-section">
                <h3>🏭 Supplier Options</h3>
                <div className="supplier-details">
                  {processSteps[selectedStep].supplierOptions.map((supplier, i) => (
                    <div key={i} className="supplier-option">
                      <h4>{supplier.name}</h4>
                      <div className="supplier-pros-cons">
                        <span className="pros">✓ {supplier.pros}</span>
                        <span className="cons">✗ {supplier.cons}</span>
                      </div>
                      <div className="supplier-price">{supplier.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Viewer Modal */}
      {selectedPdf && (
        <div className="pdf-viewer-overlay" onClick={closePdf}>
          <div className="pdf-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-viewer-header">
              <div className="pdf-title">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span>Facility Drawing</span>
              </div>
              <button className="pdf-close-btn" onClick={closePdf}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="pdf-viewer-body">
              <iframe 
                src={selectedPdf} 
                title="Drawing Viewer"
                className="pdf-iframe"
              />
            </div>
            <div className="pdf-viewer-footer">
              <span className="pdf-instructions">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                Use controls in PDF viewer to zoom, pan, and navigate pages
              </span>
              <a href={selectedPdf} download className="pdf-download-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
                Download PDF
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Updated process steps with detailed information from PDF
const processSteps: ProcessStepDetail[] = [
  {
    title: "Battery Collection & Receiving",
    description: "EV batteries, laptop batteries, power tools received and logged. All chemistries accepted: NMC, LFP, NCA, LCO. Stored in fire-resistant containers with proper spacing.",
    tag: "Required",
    tagType: "required",
    cost: null,
    whyNeeded: "Proper receiving and sorting is critical for downstream processing. Different chemistries (LFP vs NMC) require different handling and have different value profiles. LFP contains lithium carbonate and iron phosphate, while NMC contains valuable nickel and cobalt.",
    technicalDetails: "Establish receiving protocols for: (1) Weighing and logging each shipment, (2) Visual inspection for damage/leakage, (3) Chemistry identification via marking or testing, (4) Sorting into chemistry categories, (5) Storage in fire-resistant containers with 3ft spacing between pallets. Accepts: cylindrical (18650, 21700), prismatic, pouch cells. EV packs (400V) require special handling.",
    safetyNotes: "⚠️ CRITICAL: Even 'dead' batteries may retain charge. All incoming batteries should be treated as potentially energized. Fire-resistant containers required. Maintain SDS sheets for each chemistry type. Train workers on battery hazard recognition.",
    supplierOptions: [
      { name: "Local Fabrication", pros: "Lower cost, faster delivery", cons: "May not meet specific requirements", price: "$5,000-15,000" },
      { name: "Battery Tech Solutions", pros: "Industry experience", cons: "Higher cost", price: "$15,000-30,000" }
    ]
  },
  {
    title: "🔋 Battery Discharge Station",
    description: "CRITICAL SAFETY STEP. Batteries discharged to <0.5V/cell using salt water or conductive discharge methods. Prevents thermal runaway and fires during shredding.",
    tag: "NEW - REQUIRED",
    tagType: "required",
    cost: "$50K-95K",
    whyNeeded: "Industry data shows over 90% of battery recycling facility fires originate from processing charged cells. When a charged battery is crushed, internal separator fails causing immediate short circuit, igniting electrolyte. This produces toxic HF gas and can destroy equipment.",
    technicalDetails: "Four discharge methods available: (1) Salt Water: Immersion in 5% NaCl solution, 24-48 hours, lowest cost ($5K). (2) Conductive Discharge: Direct connection to resistive load, 1-4 hours, $25K. (3) Automated Discharge: Robotic connection + monitoring, 30-60 min, $80K. (4) Cryogenic: Liquid nitrogen + crush, 15-30 min, $200K (emergency only). Target voltage: <0.5V per cell.",
    safetyNotes: "⚠️ SAFETY CRITICAL: Never shred batteries above 1V/cell. Produces toxic HF, CO, organic compounds when burning. Fire can propagate to adjacent cells. OSHA requires discharge before mechanical processing. Workers need proper PPE including HF-resistant gloves.",
    supplierOptions: [
      { name: "Salt Water Tanks (Local)", pros: "Low cost, simple operation", cons: "Slow (24-48h), produces wastewater", price: "$5,000-10,000" },
      { name: "Automated Discharge (Chinese)", pros: "Fast (30-60min), precise control", cons: "Higher initial cost", price: "$40,000-80,000" },
      { name: "Conductive Discharge (Western)", pros: "Known voltage batteries, reliable", cons: "Requires trained operators", price: "$25,000-50,000" }
    ]
  },
  {
    title: "🔧 PACK Decomposition Station",
    description: "Manual and semi-automated disassembly for EV modules, power tool packs, laptop batteries. Includes emergency fire suppression and thermal monitoring.",
    tag: "NEW - REQUIRED",
    tagType: "required",
    cost: "$43K-70K",
    whyNeeded: "EV battery packs contain 96-192 cells in modules with complex electrical connections, thermal management, and structural housings. Shredding intact packs causes massive thermal events, equipment damage, and dangerous shrapnel. Must safely separate cells while managing potential thermal events.",
    technicalDetails: "PACK decomposition station requirements: (1) 3 manual workstations with insulated tools, (2) Emergency fire suppression (Ansul/Kidde), (3) Thermal monitoring cameras (FLIR), (4) High-voltage gloves (up to 400V for EV packs), (5) Emergency stop buttons at each station, (6) Ventilation for gas release during decomposition. Handle formats: 18650/21700 cells to large prismatic EV modules.",
    safetyNotes: "⚠️ HIGH VOLTAGE: EV packs operate at 200-400V. Workers must be trained in high-voltage safety. Potential for thermal runaway during disassembly if cells damaged. Keep fire suppression armed at all times. Have emergency response procedures posted.",
    supplierOptions: [
      { name: "Local Fabrication", pros: "Lower cost", cons: "May lack safety features", price: "$15,000-25,000" },
      { name: "Ansul Fire Suppression", pros: "Industry standard, reliable", cons: "Higher cost", price: "$20,000-30,000" },
      { name: "FLIR Thermal Cameras", pros: "Early thermal event detection", cons: "Requires training", price: "$8,000-15,000" }
    ]
  },
  {
    title: "Primary Shredder (Nitrogen Inertized)",
    description: "Dual-shaft shear shredder under nitrogen atmosphere. Breaks open battery cells, releases electrode materials. Output: 20-50mm fragments.",
    tag: "BHS/GEP",
    tagType: "china",
    cost: "$80K-150K",
    whyNeeded: "Primary shredding is the first mechanical size reduction step. Must break open battery cells to liberate electrode materials while preventing fire. Nitrogen inertization reduces oxygen below 5% to prevent ignition of electrolyte vapors released during shredding.",
    technicalDetails: "Equipment specifications: (1) Dual-shaft shear shredder, 30-50mm output, (2) Nitrogen inertization system maintaining O2 <5%, (3) Gas-tight design to contain vapors, (4) Integrated fire suppression, (5) Continuous O2 monitoring with alarms. BHS-Sonthofen VLR rotary shear recommended for reliability. GEP ECOTECH for cost efficiency.",
    safetyNotes: "⚠️ FIRE RISK: Even with nitrogen, thermal events can occur. Maintain O2 below 5% at all times. Have fire suppression ready. Monitor for sparks or smoke. If thermal event occurs, immediately seal and suppress. Evacuate area if uncontrolled.",
    supplierOptions: [
      { name: "BHS-Sonthofen VLR (German)", pros: "Proven reliability, low maintenance", cons: "Highest cost", price: "$120,000-150,000" },
      { name: "GEP ECOTECH (Chinese)", pros: "Cost efficient, good performance", cons: "Less support", price: "$80,000-100,000" },
      { name: "Genox (Chinese)", pros: "Complete recycling lines", cons: "Variable quality", price: "$70,000-90,000" }
    ]
  },
  {
    title: "Secondary Crushing (Hammer Mill)",
    description: "High-speed impact crusher at 1500 rpm. Liberates electrode materials from current collectors. Output: 5-10mm particles.",
    tag: "BHS/Chinese",
    tagType: "china",
    cost: "$40K-80K",
    whyNeeded: "Secondary crushing further reduces particle size to liberate electrode materials from copper/aluminum foil collectors. MDPI research shows 1500 rpm optimal for liberation without excessive heat generation. Reduces binder adhesion, improves separation efficiency downstream.",
    technicalDetails: "Specifications: (1) Hammer mill or rotary shear, 1500 rpm optimal, (2) Output: 5-10mm particles, (3) Dust collection system required, (4) Replaceable wear parts. Chinese hammer mills offer good value for non-critical size reduction. BHS for premium applications.",
    safetyNotes: "⚠️ DUST HAZARD: Fine particles can create dust explosions if concentrated. Maintain dust collection active. Use HEPA filters. Wear N95 minimum. Potential for residual electrolyte release - ensure ventilation.",
    supplierOptions: [
      { name: "BHS Hammer Mill (German)", pros: "Premium quality, low wear", cons: "High cost", price: "$60,000-80,000" },
      { name: "Chinese Hammer Mill", pros: "Lower cost", cons: "Higher wear rate", price: "$40,000-60,000" },
      { name: "SUNY Group", pros: "Complete systems", cons: "Variable support", price: "$35,000-55,000" }
    ]
  },
  {
    title: "Drying System + VOC Capture",
    description: "Rotary kiln dryer at 120-150°C to evaporate electrolyte. VOC emissions captured and routed to treatment system.",
    tag: "Chinese/Western",
    tagType: "china",
    cost: "$35K-75K",
    whyNeeded: "Electrolyte (organic carbonates: DMC, EMC, DEC) must be evaporated and captured. Direct release would violate Oklahoma DEQ regulations. Heating releases VOCs which must be treated before emission. Critical for both environmental compliance and safety.",
    technicalDetails: "System requirements: (1) Rotary kiln dryer, 120-150°C operating temperature, (2) VOC capture hoods and ductwork, (3) Connected to RTO system, (4) Temperature and flow monitoring. Electrolyte typically 5-15% of battery weight. 1 ton/hour requires ~5,000 CFM exhaust.",
    safetyNotes: "⚠️ VOC RELEASE: Electrolyte vapors are flammable and toxic. Ensure all vapors captured and routed to RTO. Monitor for leaks. Maintain proper ventilation. VOCs include DMC, EMC, DEC - all flammable.",
    supplierOptions: [
      { name: "Chinese Rotary Kiln", pros: "Lower cost", cons: "Variable quality", price: "$30,000-50,000" },
      { name: "Western Rotary Dryer", pros: "Reliable, well-supported", cons: "Higher cost", price: "$50,000-75,000" },
      { name: "Local Fabrication + Ductwork", pros: "Custom fit", cons: "Requires design", price: "$15,000-25,000" }
    ]
  },
  {
    title: "VOC Treatment (RTO System)",
    description: "Regenerative Thermal Oxidizer destroying volatile organic compounds at 1400-1600°F. 95-99% destruction efficiency.",
    tag: "REQUIRED - RTO",
    tagType: "required",
    cost: "$150K-250K",
    whyNeeded: "Oklahoma DEQ OAC 252:100 requires VOC control. Battery recycling releases electrolyte organic compounds (DMC, EMC, DEC). RTO achieves 95-99% destruction efficiency, required for synthetic minor permit. Without RTO, facility cannot obtain air quality permit.",
    technicalDetails: "RTO Specifications: (1) 5,000-10,000 CFM capacity for 1 ton/hour line, (2) Operating temperature: 1400-1600°F, (3) 95-99% DRE (Destruction Removal Efficiency), (4) Heat recovery reduces operating costs, (5) Natural gas or electric heated. Must be sized for worst-case VOC loading.",
    safetyNotes: "⚠️ HIGH TEMPERATURE: RTO operates at extreme temperatures. Proper insulation and safety guards required. Regular maintenance to ensure proper function. Monitor for flameout or inefficient combustion. Stack emissions testing required for permit compliance.",
    supplierOptions: [
      { name: "Durr (German)", pros: "Premium quality, high efficiency", cons: "Highest cost", price: "$220,000-300,000" },
      { name: "John Zink (US)", pros: "US support, reliable", cons: "High cost", price: "$200,000-280,000" },
      { name: "Chinese RTO", pros: "Lower cost", cons: "Variable efficiency", price: "$150,000-200,000" }
    ]
  },
  {
    title: "Vibrating Screen Separation",
    description: "Multi-deck screens (2mm, 5mm, 20mm) classify materials by size. Fine black mass passes through; larger fragments recirculate.",
    tag: "Xingmao/Eriez",
    tagType: "china",
    cost: "$20K-40K",
    whyNeeded: "Size classification is critical for purity. Different particle sizes require different processing. Black mass (<2mm) must be separated from larger fragments (>2mm) which need further crushing. Multiple deck screens achieve efficient classification.",
    technicalDetails: "Specifications: (2-3) deck vibrating screens, mesh sizes: 2mm, 5mm, 20mm. Fine particles pass through to black mass collection. Oversized particles recirculate to hammer mill. Screen efficiency affects final purity significantly.",
    safetyNotes: "⚠️ DUST: Screen operation generates fine particles. Ensure dust collection active. Regular maintenance to prevent screen blinding. Monitor for material buildup that could create fire hazard.",
    supplierOptions: [
      { name: "Xingmao (Chinese)", pros: "Good value", cons: "Variable quality", price: "$20,000-30,000" },
      { name: "Eriez (US)", pros: "Premium quality", cons: "Higher cost", price: "$30,000-45,000" },
      { name: "Local Fabrication", pros: "Custom sizing", cons: "Requires design", price: "$15,000-25,000" }
    ]
  },
  {
    title: "Magnetic Separation",
    description: "Rare earth drum magnet extracts ferrous materials. Protects downstream equipment and improves black mass purity.",
    tag: "Eriez",
    tagType: "western",
    cost: "$15K-25K",
    whyNeeded: "Steel casings and iron contaminants must be removed to protect downstream equipment and improve black mass purity. Eriez rare earth magnets provide highest separation efficiency. ferrous removal also protects eddy current separators from damage.",
    technicalDetails: "Rare earth drum magnet specifications: (1) Permanent or electromagnetic, (2) Belt-driven for continuous operation, (3) Multiple pole designs for fine particle capture, (4) Self-cleaning or manual cleaning options. Eriez standard in industry.",
    safetyNotes: "⚠️ PHYSICAL HAZARD: Strong magnetic field can catch metal objects. Keep tools, phones, etc. away from magnet. Persons with pacemakers must maintain distance. Watch for magnetic attraction of ferromagnetic particles.",
    supplierOptions: [
      { name: "Eriez (US)", pros: "Industry standard, reliable", cons: "Higher cost", price: "$20,000-30,000" },
      { name: "Chinese Rare Earth", pros: "Lower cost", cons: "Variable strength", price: "$10,000-18,000" },
      { name: "STEINERT (German)", pros: "High efficiency", cons: "Premium pricing", price: "$25,000-35,000" }
    ]
  },
  {
    title: "Eddy Current Separation",
    description: "Non-ferrous metal separator recovers aluminum and copper. 95%+ recovery achievable. Critical for value recovery.",
    tag: "Eriez",
    tagType: "western",
    cost: "$25K-45K",
    whyNeeded: "Aluminum and copper from current collectors have significant value. Eddy current separation uses magnetic fields to separate non-ferrous metals based on conductivity. Higher recovery rates justify premium Western equipment. 95%+ recovery is achievable.",
    technicalDetails: "Eddy current separator specifications: (1) High-speed rotating magnetic field, (2) Variable belt speed for different particle sizes, (3) Adjustable splitter for material separation, (4) Capacitor-driven for consistent field. Eriez and STEINERT are industry leaders.",
    safetyNotes: "⚠️ ROTATING EQUIPMENT: High-speed rotating components. Guard all moving parts. Lockout/tagout procedures required for maintenance. High decibel operation - hearing protection required.",
    supplierOptions: [
      { name: "Eriez (US)", pros: "Industry standard, high recovery", cons: "Higher cost", price: "$30,000-50,000" },
      { name: "STEINERT (German)", pros: "Premium quality", cons: "Highest cost", price: "$40,000-60,000" },
      { name: "Chinese Eddy Current", pros: "Lower cost", cons: "Lower efficiency", price: "$20,000-35,000" }
    ]
  },
  {
    title: "Air Classification",
    description: "Density separation separates black mass from lighter plastic and separator fragments. Critical for clean black mass output.",
    tag: "Chinese/Western",
    tagType: "china",
    cost: "$25K-45K",
    whyNeeded: "Air classification uses density differences to separate black mass (heavy) from plastics and separator materials (light). Critical for achieving clean black mass output. Air knife or zig-zag separators effective for this separation.",
    technicalDetails: "Air classifier specifications: (1) Variable air velocity control, (2) Multiple stage separation for purity, (3) Dust collection integration, (4) Adjustable product cut points. Zig-zag separators and air knives both effective.",
    safetyNotes: "⚠️ DUST: High-velocity air creates significant dust. Full dust collection required. Potential for dust explosion - maintain below LEL. Regular cleaning of ducts and collectors.",
    supplierOptions: [
      { name: "Xingmao (Chinese)", pros: "Complete systems", cons: "Variable quality", price: "$25,000-40,000" },
      { name: "Eriez (US)", pros: "Reliable, well-supported", cons: "Higher cost", price: "$35,000-55,000" },
      { name: "Air Knife Systems", pros: "Simple operation", cons: "Less efficient", price: "$20,000-35,000" }
    ]
  },
  {
    title: "Nitrogen Inertization System",
    description: "Membrane nitrogen generator maintains O2 <5% in shredding area. Prevents fires and thermal runaway.",
    tag: "Generon",
    tagType: "safety",
    cost: "$25K-45K",
    whyNeeded: "Nitrogen inertization is the primary fire prevention measure. Maintaining oxygen below 5% prevents ignition of electrolyte vapors and reduces thermal runaway risk. Industry standard approach for safe battery shredding operations.",
    technicalDetails: "Nitrogen system specifications: (1) Membrane nitrogen generator, (2) O2 monitoring with alarms, (3) Automatic nitrogen injection on O2 rise, (4) Target: O2 <5% in processing area, (5) Continuous monitoring required. Generon industry standard.",
    safetyNotes: "⚠️ OXYGEN DEPRIVATION: Low oxygen levels are hazardous to workers. Area must be confined space certified. Continuous O2 monitoring with alarms at 19.5% (danger). Emergency ventilation must be available. Workers need proper training.",
    supplierOptions: [
      { name: "Generon (US)", pros: "Industry standard, reliable", cons: "Higher cost", price: "$35,000-55,000" },
      { name: "Chinese Membrane", pros: "Lower cost", cons: "Variable purity", price: "$20,000-35,000" },
      { name: "Liquid Nitrogen Backup", pros: "High purity backup", cons: "Ongoing costs", price: "$15,000-25,000" }
    ]
  },
  {
    title: "Fire Suppression & Gas Detection",
    description: "Water mist + CO2 suppression. HF, HCN, CO detection with ATEX-rated sensors. Insurance requirement.",
    tag: "Drager/Siemens",
    tagType: "safety",
    cost: "$40K-70K",
    whyNeeded: "Fire detection and suppression is critical for insurance and worker safety. HF (hydrogen fluoride) is highly toxic released during battery fires. CO and HCN also dangerous. ATEX-rated sensors required for explosive atmospheres. Insurance carriers mandate proper systems.",
    technicalDetails: "Safety system specifications: (1) Multi-sensor gas detection (HF, HCN, CO), (2) ATEX/IECEx rated sensors for explosive atmospheres, (3) Water mist + CO2 fire suppression, (4) Emergency ventilation, (5) Alarm and notification system, (6) Integration with facility shutdown.",
    safetyNotes: "⚠️ MULTIPLE HAZARDS: HF is immediately dangerous to life. HCN (hydrogen cyanide) extremely toxic. CO (carbon monoxide) toxic. Fire suppression must be appropriate for electrical fires. Drager and Honeywell are industry leaders in battery facility safety.",
    supplierOptions: [
      { name: "Drager (Germany)", pros: "ATEX certified, reliable", cons: "Premium pricing", price: "$30,000-50,000" },
      { name: "Siemens (US)", pros: "Full integration, insurance accepted", cons: "Higher cost", price: "$35,000-55,000" },
      { name: "Honeywell (US)", pros: "Good support", cons: "Variable for battery apps", price: "$25,000-45,000" }
    ]
  },
  {
    title: "Control System & Electrical",
    description: "PLC control system with motor control center. Integration of all safety systems and monitoring.",
    tag: "Siemens/Allen-Bradley",
    tagType: "safety",
    cost: "$30K-50K",
    whyNeeded: "Integrated control system ensures safe coordinated operation of all equipment. Emergency shutdown, gas detection integration, fire suppression triggering, and O2 monitoring all require unified control. MCC (Motor Control Center) provides proper electrical distribution.",
    technicalDetails: "Control system specifications: (1) PLC controller (Siemens S7 or Allen-Bradley), (2) Motor control center with VFDs, (3) HMI touch screen for operation, (4) Integration with gas detection, fire suppression, O2 monitoring, (5) Emergency stop system, (6) Data logging for compliance.",
    safetyNotes: "⚠️ ELECTRICAL: Proper grounding and bonding required. High voltage (480V) equipment. Lockout/tagout procedures essential. All electrical must meet NEC for hazardous locations. Regular inspection required.",
    supplierOptions: [
      { name: "Siemens", pros: "Industry standard, reliable", cons: "Higher cost", price: "$40,000-60,000" },
      { name: "Allen-Bradley (Rockwell)", pros: "Good support", cons: "Higher cost", price: "$35,000-55,000" },
      { name: "Chinese PLC", pros: "Lower cost", cons: "Less support", price: "$20,000-35,000" }
    ]
  }
]

const equipmentList = [
  { category: "Discharge", name: "Salt Water Discharge Tanks", shortDesc: "Immersion discharge for unknown/damaged cells", cost: "$10-15K", suppliers: ["Local Fab", "Battery Tech"], tagType: "required" },
  { category: "Discharge", name: "Automated Discharge Station", shortDesc: "Robotic connection for known-type batteries", cost: "$40-80K", suppliers: ["Chinese Mfr", "American Eq"], tagType: "required" },
  { category: "PACK", name: "Disassembly Workstations", shortDesc: "Manual/semi-auto pack opening", cost: "$15-25K", suppliers: ["Local Fab", "ProFab"], tagType: "required" },
  { category: "PACK", name: "Fire Suppression System", shortDesc: "Ansul/Kidde integrated suppression", cost: "$20-30K", suppliers: ["Ansul", "Kidde"], tagType: "safety" },
  { category: "Shredding", name: "Dual-Shaft Shredder", shortDesc: "BHS rotary shear with nitrogen", cost: "$80-150K", suppliers: ["BHS", "GEP", "Genox"], tagType: "china" },
  { category: "Crushing", name: "Hammer Mill", shortDesc: "Secondary size reduction", cost: "$40-80K", suppliers: ["BHS", "Chinese"], tagType: "china" },
  { category: "Drying", name: "Rotary Kiln Dryer", shortDesc: "Electrolyte evaporation", cost: "$30-60K", suppliers: ["Chinese", "Western"], tagType: "china" },
  { category: "VOC", name: "RTO System", shortDesc: "Thermal oxidizer 95%+ DRE", cost: "$150-250K", suppliers: ["Durr", "John Zink"], tagType: "required" },
  { category: "Separation", name: "Vibrating Screens", shortDesc: "Multi-deck size classification", cost: "$20-40K", suppliers: ["Xingmao", "Eriez"], tagType: "china" },
  { category: "Separation", name: "Magnetic Separator", shortDesc: "Rare earth drum magnet", cost: "$15-25K", suppliers: ["Eriez", "STEINERT"], tagType: "western" },
  { category: "Separation", name: "Eddy Current Separator", shortDesc: "Al/Cu recovery", cost: "$25-45K", suppliers: ["Eriez", "STEINERT"], tagType: "western" },
  { category: "Safety", name: "Nitrogen Generator", shortDesc: "Membrane system O2<5%", cost: "$25-45K", suppliers: ["Generon", "Chinese"], tagType: "safety" },
  { category: "Safety", name: "Gas Detection", shortDesc: "HF, HCN, CO sensors", cost: "$20-35K", suppliers: ["Drager", "Honeywell"], tagType: "safety" },
  { category: "Safety", name: "Control System", shortDesc: "PLC + MCC integration", cost: "$30-50K", suppliers: ["Siemens", "A-B"], tagType: "safety" }
]

const tierOptions = [
  {
    name: "Budget Tier",
    description: "Chinese mechanical equipment with basic safety systems",
    cost: "$280K-380K",
    features: [
      "Chinese shredder and crusher",
      "Salt water discharge only",
      "Basic fire suppression",
      "Carbon adsorption for VOCs",
      "Manual PACK decomposition",
      "Limited automation"
    ],
    tradeoffs: "Higher operational risk, more manual labor, may not meet all permit requirements, longer payback but higher risk",
    recommended: false
  },
  {
    name: "Standard Tier",
    description: "Hybrid Chinese/Western with RTO - Recommended",
    cost: "$420K-550K",
    features: [
      "German BHS shredder",
      "Hybrid discharge systems",
      "Full fire suppression (Ansul)",
      "RTO for VOC treatment (95% DRE)",
      "3 PACK decomposition stations",
      "Eriez separation equipment",
      "Integrated control system"
    ],
    tradeoffs: "Balanced cost/performance, meets all permit requirements, reasonable payback period, recommended for most operations",
    recommended: true
  },
  {
    name: "Premium Tier",
    description: "Western equipment with full automation",
    cost: "$800K-1,200K",
    features: [
      "All Western equipment",
      "Automated discharge system",
      "Full automation and robotics",
      "Premium RTO with heat recovery",
      "Advanced monitoring systems",
      "Lower labor requirements",
      "Highest reliability"
    ],
    tradeoffs: "Highest CAPEX but lowest operating costs, fastest throughput, best reliability, longest payback but lowest risk",
    recommended: false
  }
]

const oklahomaInfo = [
  {
    title: "DEQ Air Permits",
    description: "Oklahoma DEQ requires air quality permits. Synthetic minor permits available if emissions stay below 100 tons/year VOC.",
    iconPath: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
  },
  {
    title: "HB1907 Regulations",
    description: "Oklahoma HB1907 establishes B2B battery regulations. Improper disposal subject to hazardous waste penalties.",
    iconPath: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
  },
  {
    title: "EPA RCRA (D001/D003)",
    description: "Li-ion classified as ignitable (D001) and reactive (D003) hazardous waste. Must comply with federal hazardous waste.",
    iconPath: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
  },
  {
    title: "Critical Minerals Hub",
    description: "Oklahoma offers expedited permitting in Critical Minerals Hub zones. Atoka facility operates with Tier 1 EPA permits.",
    iconPath: "M13 10V3L4 14h7v7l9-11h-7z"
  }
]

const engineeringQuestions = [
  {
    question: "What is our expected battery feedstock composition (% LFP vs NMC vs other chemistries)?",
    context: "Different chemistries have different processing requirements, safety considerations, and revenue potential. LFP contains iron phosphate and lithium carbonate; NMC contains valuable nickel and cobalt.",
    importance: "critical"
  },
  {
    question: "Do we have the infrastructure for high-voltage (400V) EV pack handling?",
    context: "EV battery packs operate at 200-400V and require special training, insulated tools, and safety protocols. This affects PACK decomposition station design.",
    importance: "critical"
  },
  {
    question: "What is our timeline for Oklahoma DEQ permit acquisition?",
    context: "Permit timeline is 6-12 months. RTO must be sized for expected throughput. Pre-application meeting with DEQ is recommended.",
    importance: "high"
  },
  {
    question: "Have we secured feedstock supply agreements?",
    context: "Battery availability is the #1 success factor. Need 2-3 year agreements with collectors, auto dismantlers, or electronics recyclers.",
    importance: "critical"
  },
  {
    question: "Have we identified black mass offtake buyers?",
    context: "Need contracts with hydrometallurgical processors (Li-Cycle, Redwood, Glencore) before production. Pricing tied to metal prices.",
    importance: "critical"
  },
  {
    question: "What is our fire insurance coverage and requirements?",
    context: "Insurance carriers require specific fire suppression systems (often ATEX-rated), gas detection, and safety protocols. Premium pricing depends on safety systems.",
    importance: "high"
  },
  {
    question: "Do we have staff trained in hazardous waste handling (RCRA)?",
    context: "Li-ion batteries are D001 (ignitable) and D003 (reactive) hazardous waste. Proper handling, storage, and documentation required.",
    importance: "high"
  },
  {
    question: "What is our contingency for thermal runaway events?",
    context: "Need documented emergency response procedures, worker training, ventilation systems, and suppression equipment. One incident can destroy equipment.",
    importance: "critical"
  },
  {
    question: "How will we handle wastewater from discharge process?",
    context: "Salt water discharge produces contaminated wastewater requiring treatment before discharge. Need wastewater treatment system or contract.",
    importance: "medium"
  },
  {
    question: "What is our budget for ongoing maintenance and wear parts?",
    context: "Hammer mills, screens, and conveyors require ongoing maintenance. Budget 5-10% of CAPEX annually for maintenance and wear parts.",
    importance: "medium"
  },
  {
    question: "Have we evaluated the LFP vs NMC economics for our specific feedstock?",
    context: "LFP economics driven by iron phosphate; NMC economics driven by nickel/cobalt. Revenue potential differs significantly by chemistry mix.",
    importance: "high"
  },
  {
    question: "What is our power infrastructure capacity?",
    context: "RTO, shredders, and process equipment require significant electrical power. Verify available amperage and utility capacity.",
    importance: "medium"
  }
]

const teamMembers = [
  {
    name: "Syed Hussain",
    role: "Chief Executive Officer",
    email: "syed@shtllc.org",
    initials: "SH",
    bio: "Visionary leader driving sustainable battery recycling innovation. Strategic oversight of operations, partnerships, and growth initiatives."
  },
  {
    name: "Javed Iqbal, Ph.D.",
    role: "Chief Research Officer",
    email: "javed@evbolt.com",
    initials: "JI",
    bio: "Leading battery technology researcher with deep expertise in recycling processes and emerging battery chemistries. Academic and industry experience."
  },
  {
    name: "Muhammad Siddiki",
    role: "Procurement & Vendor Relations",
    email: "muhammad@z1power.com",
    initials: "MS",
    bio: "Strategic sourcing expert managing equipment procurement and supplier relationships. Building the supply chain for sustainable operations."
  }
]

const extendedTeamCount = 25

export default App
