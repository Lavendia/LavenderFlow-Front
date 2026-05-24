import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import type { Transition } from 'framer-motion'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'
import Logo from '../components/ui/Logo'
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
      <span className="text-xs font-medium uppercase tracking-widest"
        style={{ color: '#48CB9D', letterSpacing: 2 }}>
        {tag}
      </span>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: '#EFBBFF', lineHeight: 1.2 }}>
        {title}
      </h1>
      <p className="text-sm font-light leading-relaxed" style={{ color: '#c084e8', maxWidth: 280 }}>
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
    <>
      <NavBar />
      <div className="h-screen flex overflow-hidden relative" style={{ background: '#2d1242' }}>

        {/* BRANDING PANEL — always visible, switches content */}
        <motion.div
          layout
          transition={transition}
          className="flex flex-col justify-between p-12 flex-shrink-0"
          style={{
            width: '45%',
            background: '#3d1a57',
            borderRight: isLogin ? '1px solid #BE29EC33' : 'none',
            borderLeft: isLogin ? 'none' : '1px solid #BE29EC33',
            order: isLogin ? 0 : 1,
          }}>
          <Logo />
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login-brand' : 'register-brand'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}>
              <BrandingContent
                tag={isLogin ? 'Project Management' : 'Get started for free'}
                title={isLogin ? <>Your boards,<br />your flow.</> : <>Start building<br />your workflow.</>}
                description={isLogin
                  ? 'Organize work across teams with boards, workspaces and cards — all in one place.'
                  : 'Create your account and set up your first workspace in minutes.'}
              />
            </motion.div>
          </AnimatePresence>
          <span className="text-xs" style={{ color: '#BE29EC66' }}>© 2026 LavenderFlow</span>
        </motion.div>

        {/* FORM PANEL — always visible, slides between sides */}
        <motion.div
          layout
          transition={transition}
          className="flex items-center justify-center p-12"
          style={{
            flex: 1,
            order: isLogin ? 1 : 0,
          }}>
          <div className="w-full max-w-[380px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login-form' : 'register-form'}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}>
                {isLogin ? (
                  <>
                    <h2 className="mb-1"
                      style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#EFBBFF' }}>
                      Welcome back
                    </h2>
                    <p className="text-sm font-light mb-8" style={{ color: '#c084e8' }}>
                      Sign in to your workspace
                    </p>
                    <LoginForm />
                  </>
                ) : (
                  <>
                    <h2 className="mb-1"
                      style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#EFBBFF' }}>
                      Create an account
                    </h2>
                    <p className="text-sm font-light mb-8" style={{ color: '#c084e8' }}>
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
    </>
  )
}