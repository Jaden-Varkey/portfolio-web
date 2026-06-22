import { useParams, Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projectDetails } from '../data/content.js'
import Background from '../components/Background.jsx'
import ProjectDetailContent from '../components/ProjectDetailContent.jsx'
import '../styles/detail.css'

export default function ProjectDetail() {
  const { slug } = useParams()
  const p = projectDetails[slug]
  if (!p) return <Navigate to="/" replace />

  return (
    <main className="detail">
      <Background />
      <div className="wrap">
        <Link to="/" className="back link-underline">← Back</Link>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProjectDetailContent p={p} />
        </motion.div>
      </div>
    </main>
  )
}
