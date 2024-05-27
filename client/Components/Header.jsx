import React from 'react'
import PropTypes from 'prop-types'
import { Box, Typography } from '@mui/material'

export default function Header ({ title, subTitle = '' }) {
  return (
    <Box sx={{ borderBottom: 1, borderColor: 'gray', pt: 3, mb: 3 }}>
      <Typography variant="h2" component="h1">
        {title}
      </Typography>
      <Typography variant="h6" component="h2">
        {subTitle}
      </Typography>
    </Box>
  )
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string
}
