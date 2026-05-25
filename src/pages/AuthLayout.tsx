import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import type { Transition } from 'framer-motion'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import { NavBar } from '../components/NavBar'

const features = [
  'Drag & drop boards and cards',
  'Collaborate across workspaces',
  'Track progress in real time',
]

const transition: Transition = { duration: 0.5, ease: 'easeInOut' }

function BrandingContent({ tag, title, description }: {
  tag: string
  title: React.ReactNode
  description: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <span
        className="text-xs font-medium uppercase"
        style={{ color: '#48CB9D', letterSpacing: 2 }}
      >
        {tag}
      </span>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: '#EFBBFF', lineHeight: 1.2 }}>
        {title}
      </h1>
      <p className="text-sm font-light leading-relaxed" style={{ color: '#EFBBFF', opacity: 0.6, maxWidth: 280 }}>
        {description}
      </p>
      <div className="flex flex-col gap-3 mt-2">
        {features.map((f) => (
          <div key={f} className="flex items-center gap-3 text-sm" style={{ color: '#D896FF' }}>
            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#48CB9D' }} />
            {f}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function AuthLayout() {
  const location = useLocation()
  const isLogin = location.pathname === '/login' || location.pathname === '/'

  return (
    <div className="flex flex-col" style={{ height: '100dvh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;500;600&display=swap');
      `}</style>
      <NavBar />
      <div
        className="flex overflow-hidden relative"
        style={{ background: '#0d0520', flex: 1, minHeight: 0 }}
      >
        {/* BRANDING PANEL */}
        <motion.div
          layout
          transition={transition}
          className="flex flex-col justify-between p-12 pt-20 flex-shrink-0"
          style={{
            width: '45%',
            background: '#2d1052',
            borderRight: isLogin ? '1px solid #3d1a6e' : 'none',
            borderLeft: isLogin ? 'none' : '1px solid #3d1a6e',
            order: isLogin ? 0 : 1,
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-brand' : 'register-brand'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <BrandingContent
                tag={isLogin ? 'Project Management' : 'Get started for free'}
                title={isLogin ? <>Your boards,<br />your flow.</> : <>Start building<br />your workflow.</>}
                description={
                  isLogin
                    ? 'Organize work across teams with boards, workspaces and cards — all in one place.'
                    : 'Create your account and set up your first workspace in minutes.'
                }
              />
            </motion.div>
          </AnimatePresence>
          <span className="text-xs" style={{ color: '#EFBBFF', opacity: 0.25 }}>© 2026 LavenderFlow</span>
        </motion.div>

        {/* FORM PANEL */}
        <motion.div
          layout
          transition={transition}
          className="flex items-center justify-center p-12"
          style={{ flex: 1, order: isLogin ? 1 : 0 }}
        >
          {/* Subtle background glow matching CTASection */}
          <div
            aria-hidden="true"
            className="absolute -top-1/2 left-[10%] w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none"
            style={{ background: '#BE29EC', opacity: 0.07 }}
          />

          <div className="w-full max-w-[380px] relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login-form' : 'register-form'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                {isLogin ? (
                  <>
                    <h2
                      className="mb-1"
                      style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#EFBBFF' }}
                    >
                      Welcome back
                    </h2>
                    <p className="text-sm font-light mb-8" style={{ color: '#EFBBFF', opacity: 0.6 }}>
                      Sign in to your workspace
                    </p>
                    <LoginForm />
                  </>
                ) : (
                  <>
                    <h2
                      className="mb-1"
                      style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#EFBBFF' }}
                    >
                      Create an account
                    </h2>
                    <p className="text-sm font-light mb-8" style={{ color: '#EFBBFF', opacity: 0.6 }}>
                      Fill in your details to get started
                    </p>
                    <RegisterForm />
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}