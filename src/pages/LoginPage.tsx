
import LoginForm from '../components/auth/LoginForm'
import Logo from '../components/ui/Logo'

export default function LoginPage() {
  return (
    <div className="h-screen flex" style={{ background: '#2d1242' }}>

      {/* LEFT PANEL */}
      <div className="w-[45%] flex flex-col justify-between p-12"
        style={{ background: '#3d1a57', borderRight: '1px solid #BE29EC33' }}>

        <Logo />

        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-widest"
            style={{ color: '#48CB9D', letterSpacing: 2 }}>
            Project Management
          </span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 38, color: '#EFBBFF', lineHeight: 1.2 }}>
            Your boards,<br />your flow.
          </h1>
          <p className="text-sm font-light leading-relaxed" style={{ color: '#c084e8', maxWidth: 280 }}>
            Organize work across teams with boards, workspaces and cards — all in one place.
          </p>
          <div className="flex flex-col gap-3 mt-2">
            {[
              'Drag & drop boards and cards',
              'Collaborate across workspaces',
              'Track progress in real time',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3 text-sm"
                style={{ color: '#D896FF' }}>
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#48CB9D' }} />
                {feature}
              </div>
            ))}
          </div>
        </div>

        <span className="text-xs" style={{ color: '#BE29EC66' }}>© 2026 LavenderFlow</span>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 flex items-center justify-center p-12">
        <div className="w-full max-w-[380px]">
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 28, color: '#EFBBFF' }}
            className="mb-1">
            Welcome back
          </h2>
          <p className="text-sm font-light mb-8" style={{ color: '#c084e8' }}>
            Sign in to your workspace
          </p>
          <LoginForm />
        </div>
      </div>

    </div>
  )
}