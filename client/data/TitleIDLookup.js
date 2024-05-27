import gameDBData from './US.en.json'

export function getGameInfoFromTitleID (titleID) {
  if (!gameDBData) {
    return null
  }

  return Object.values(gameDBData).find(
    (game) => game.id === titleID.toUpperCase()
  )
}
