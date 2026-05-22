import logo from '../../assets/logo-dark.webp'

export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <img src={logo} alt="LavenderFlow" style={{ height: 64 }} />
      <span style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#EFBBFF' }}>
        LavenderFlow
      </span>
    </div>
  )
}