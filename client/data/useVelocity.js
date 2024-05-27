import React from 'react'

// How often to recompute velocity
const REFRESH_SECONDS = 0.5

export default function useVelocity (x, y, z) {
  // Most recent position and time
  const [V, setV] = React.useState([0, 0, 0])
  const [lastP, setLastP] = React.useState([x, y, z])
  const [lastTime, setLastTime] = React.useState(Date.now())

  // Update the last position and time
  React.useEffect(() => {
    const deltaT = (Date.now() - lastTime) / 1000
    if (deltaT >= REFRESH_SECONDS) {
      setV([
        (x - lastP[0]) / deltaT,
        (y - lastP[1]) / deltaT,
        (z - lastP[2]) / deltaT
      ])

      setLastP([x, y, z])
      setLastTime(Date.now())
    }
  }, [lastP, lastTime, x, y, z])

  // If the position hasn't changed, then the velocity is zero
  React.useEffect(() => {
    const interval = setInterval(() => {
      const lenDelta =
        (x - lastP[0]) ** 2 + (y - lastP[1]) ** 2 + (z - lastP[2]) ** 2
      if (lenDelta < 0.001) {
        setV([0, 0, 0])
        clearInterval(interval)
      } else {
        setLastP([x, y, z])
      }
    }, REFRESH_SECONDS * 1000)

    return () => clearTimeout(interval)
  }, [lastP, x, y, z])

  return V
}
