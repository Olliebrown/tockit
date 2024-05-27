import React from 'react'
import PropTypes from 'prop-types'

import Quat from 'quaternion'

import { Grid, Typography, Box, Tabs, Tab, Paper } from '@mui/material'

import AngleWidget from './AngleWidget.jsx'
import TabPanel from './TabPanel.jsx'
import LocationWidget from './LocationWidget.jsx'

function a11yProps (index) {
  return {
    id: `transform-tab-${index}`,
    'aria-controls': `transform-tabpanel-${index}`
  }
}

export default function TransformWidget ({ dataMatrix }) {
  const [curTab, setCurTab] = React.useState(0)
  const handleChange = (event, newValue) => {
    setCurTab(newValue)
  }

  if (!Array.isArray(dataMatrix) || dataMatrix.length !== 16) {
    return null
  }

  const quat = Quat.fromMatrix([
    ...dataMatrix.slice(0, 3),
    ...dataMatrix.slice(4, 7),
    ...dataMatrix.slice(8, 11)
  ])
  const angles = quat.toEuler()

  return (
    <Paper sx={{ width: '100%', p: 1 }} elevation={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={curTab} onChange={handleChange}>
          <Tab label="Position & Heading" {...a11yProps(0)} />
          <Tab label="Raw Matrix" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel curTab={curTab} index={0} name="transform">
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Typography
              variant="h6"
              component="div"
              sx={{ borderBottom: 1, mb: 2 }}
            >
              {'Location & Velocity'}
            </Typography>
            <LocationWidget
              x={dataMatrix[3]}
              y={-dataMatrix[11]}
              z={dataMatrix[7] - 106}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              component="div"
              sx={{ borderBottom: 1, mb: 2 }}
            >
              {'Heading'}
            </Typography>
            <AngleWidget angle={-angles[2]} width={150} height={150} />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel curTab={curTab} index={1} name="transform">
        <Grid container spacing={2}>
          {dataMatrix.map((value, index) => (
            <Grid item xs={3} key={index} sx={{ width: '30px' }}>
              <Typography variant="body1">
                {Number(value).toFixed(3)}
              </Typography>
            </Grid>
          ))}
          <Grid item xs={12}>
            {`Angles: (${angles.map((angle) => ((angle / Math.PI) * 180).toFixed(2)).join(', ')})`}
            {` / Quat: <${quat.w.toFixed(4)}, ${quat.x.toFixed(4)}, ${quat.y.toFixed(4)}, ${quat.z.toFixed(4)}>`}
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  )
}

TransformWidget.propTypes = {
  dataMatrix: PropTypes.arrayOf(PropTypes.number).isRequired
}
