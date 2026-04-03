import useStore from './store/useStore'
import BlobBackground from './components/BlobBackground'
import BottomNav      from './components/BottomNav'
import Toast          from './components/Toast'
import Landing  from './screens/Landing'
import CheckIn  from './screens/CheckIn'
import Journal  from './screens/Journal'
import Advice   from './screens/Advice'
import History  from './screens/History'
import Setup    from './screens/Setup'
import Profile  from './screens/Profile'

const SCREENS = {
  landing: Landing,
  checkin: CheckIn,
  journal: Journal,
  advice:  Advice,
  history: History,
  setup:   Setup,
  profile: Profile,
}

export default function App() {
  const screen = useStore(s => s.screen)
  const Screen = SCREENS[screen] ?? Landing

  return (
    <>
      <BlobBackground />
      {/* key forces remount + animation replay on screen change */}
      <Screen key={screen} />
      <BottomNav />
      <Toast />
    </>
  )
}
