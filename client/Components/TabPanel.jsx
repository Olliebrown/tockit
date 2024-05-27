import * as React from 'react'
import PropTypes from 'prop-types'
import { Box } from '@mui/material'

function a11yProps (index, name) {
  return {
    id: `${name}-tabpanel-${index}`,
    'aria-labelledby': `${name}-tab-${index}`
  }
}

export default function TabPanel ({
  children = null,
  curTab = 0,
  index = 0,
  name = 'none',
  ...other
}) {
  return (
    <div role="tabpanel" hidden={curTab !== index} {...a11yProps(index, name)}>
      {curTab === index && (
        <Box sx={{ p: 3 }} {...other}>
          {children}
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  curTab: PropTypes.number,
  index: PropTypes.number,
  name: PropTypes.string
}
