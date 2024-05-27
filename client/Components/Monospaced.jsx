import React from 'react'
import PropTypes from 'prop-types'

import { Typography } from '@mui/material'

export default function Monospaced ({ children, ...other }) {
  return (
    <Typography
      {...other}
      sx={{
        fontWeight: 400,
        fontFamily: '"Roboto Mono", "Courier New", monospace'
      }}
    >
      {children}
    </Typography>
  )
}

Monospaced.propTypes = {
  children: PropTypes.node
}
