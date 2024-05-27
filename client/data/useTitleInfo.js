import React from 'react'

async function retrieveGameDBData (setData) {
  try {
    const response = await fetch(
      'https://raw.githubusercontent.com/blawar/titledb/master/US.en.json'
    )
    setData(await response.json())
  } catch (e) {
    console.error(e)
    setData(false)
  }
}

export function useTitleInfo (titleID) {
  const [gameDBData, setGameDBData] = React.useState(null)
  React.useEffect(() => {
    if (gameDBData === null) {
      retrieveGameDBData(setGameDBData)
    }
  }, [gameDBData])

  if (!gameDBData) {
    return null
  }

  return Object.values(gameDBData).find(
    (game) => game.id === titleID.toUpperCase()
  )
}
