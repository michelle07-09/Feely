import useStore from '../store/useStore'
import styles from './BottomNav.module.css'

const NAV_ITEMS = [
  { id: 'home',    icon: '🏡', label: 'Home',    screen: 'landing'  },
  { id: 'checkin', icon: '✨', label: 'Check In', screen: 'checkin' },
  { id: 'journal', icon: '📖', label: 'Journal',  screen: 'history' },
  { id: 'profile', icon: '🌸', label: 'Profile',  screen: 'profile' },
]

const CHECK_IN_SCREENS = new Set(['checkin', 'journal', 'advice'])

export default function BottomNav() {
  const { screen, navigate, resetCheckin } = useStore()

  function handleNav(item) {
    if (item.id === 'checkin') {
      resetCheckin()
      navigate('checkin')
    } else {
      navigate(item.screen)
    }
  }

  function activeId() {
    if (screen === 'landing')  return 'home'
    if (screen === 'history')  return 'journal'
    if (screen === 'profile')  return 'profile'
    if (CHECK_IN_SCREENS.has(screen)) return 'checkin'
    return null
  }

  const active = activeId()

  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          className={`${styles.btn} ${active === item.id ? styles.active : ''}`}
          onClick={() => handleNav(item)}
          aria-label={item.label}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
