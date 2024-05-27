import PropTypes from 'prop-types'

export const boundsShape = {
  start: PropTypes.string.isRequired,
  end: PropTypes.string.isRequired
}

export const extentsShape = {
  base: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired
}

export const statusShape = {
  processId: PropTypes.number.isRequired,
  titleId: PropTypes.string.isRequired,
  mainNsoBuildId: PropTypes.string.isRequired,

  main: PropTypes.shape(boundsShape).isRequired,
  heap: PropTypes.shape(boundsShape).isRequired,

  mainNsoExtents: PropTypes.shape(extentsShape).isRequired,
  aliasExtents: PropTypes.shape(extentsShape).isRequired,
  heapExtents: PropTypes.shape(extentsShape).isRequired,

  addressSpaceExtents: PropTypes.shape(extentsShape).isRequired
}
