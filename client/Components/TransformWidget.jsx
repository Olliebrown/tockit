import React from 'react'
import PropTypes from 'prop-types'

import Quat from 'quaternion'

import { Grid, Typography, Box, Tabs, Tab, Paper } from '@mui/material'

import AngleWidget from './AngleWidget.jsx'
import TabPanel from './TabPanel.jsx'
import LocationWidget from './LocationWidget.jsx'
import RawCoordinates from './RawCoordinates.jsx'
import Monospaced from './Monospaced.jsx'

function a11yProps (index) {
  return {
    id: `transform-tab-${index}`,
    'aria-controls': `transform-tabpanel-${index}`
  }
}

export default function TransformWidget ({ playerMatrix, havokMatrix = [] }) {
  const [curTab, setCurTab] = React.useState(0)
  const handleChange = (event, newValue) => {
    setCurTab(newValue)
  }

  if (!Array.isArray(playerMatrix) || playerMatrix.length !== 16) {
    return null
  }

  const quat = Quat.fromMatrix([
    ...playerMatrix.slice(0, 3),
    ...playerMatrix.slice(4, 7),
    ...playerMatrix.slice(8, 11)
  ])
  const angles = quat.toEuler()

  let havokQuat = null
  let havokAngles = null
  if (Array.isArray(havokMatrix) && havokMatrix.length >= 12) {
    havokQuat = Quat.fromMatrix([
      havokMatrix[0],
      havokMatrix[4],
      havokMatrix[8],
      havokMatrix[1],
      havokMatrix[5],
      havokMatrix[9],
      havokMatrix[2],
      havokMatrix[6],
      havokMatrix[10]
    ])
    havokAngles = havokQuat.toEuler()
  }

  return (
    <Paper sx={{ width: '100%', p: 1 }} elevation={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={curTab} onChange={handleChange}>
          <Tab label="Position & Heading" {...a11yProps(0)} />
          <Tab label="Save / Restore" {...a11yProps(1)} />
          <Tab label="Raw Matrix" {...a11yProps(2)} />
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
              x={playerMatrix[3]}
              y={-playerMatrix[11]}
              z={playerMatrix[7] - 106}
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
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Typography
              variant="h6"
              component="div"
              sx={{ borderBottom: 1, mb: 2 }}
            >
              {'Current Values'}
            </Typography>
            <RawCoordinates
              x={playerMatrix[3]}
              y={-playerMatrix[11]}
              z={playerMatrix[7] - 106}
              yaw={angles[0]}
              pitch={angles[1]}
              roll={angles[2]}
            />
          </Grid>
          <Grid item></Grid>
        </Grid>
      </TabPanel>

      <TabPanel curTab={curTab} index={2} name="transform">
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ borderRight: 1, borderColor: 'lightgray' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ mb: 2, textDecoration: 'underline' }}
            >
              {'Player Transform (row major):'}
            </Typography>
            <Grid container spacing={2}>
              {playerMatrix.map((value, index) => (
                <Grid item xs={3} key={index}>
                  <Monospaced variant="body1">
                    {Number(value).toFixed(3)}
                  </Monospaced>
                </Grid>
              ))}
              <Grid item xs={12}>
                {`Angles: (${angles.map((angle) => ((angle / Math.PI) * 180).toFixed(2)).join(', ')})`}
                {` / Quat: <${quat.w.toFixed(3)}, ${quat.x.toFixed(3)}, ${quat.y.toFixed(3)}, ${quat.z.toFixed(3)}>`}
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={6}>
            <Typography
              variant="h6"
              component="div"
              sx={{ mb: 2, textDecoration: 'underline' }}
            >
              {'Havok Physics Transform (col major):'}
            </Typography>
            <Grid container spacing={2}>
              {havokMatrix.map((value, index) => (
                <Grid item xs={3} key={index}>
                  <Monospaced variant="body1">
                    {Number(value).toFixed(3)}
                  </Monospaced>
                </Grid>
              ))}
              {havokQuat !== null && (
                <Grid item xs={12}>
                  {`Angles: (${havokAngles.map((angle) => ((angle / Math.PI) * 180).toFixed(2)).join(', ')})`}
                  {` / Quat: <${havokQuat.w.toFixed(3)}, ${havokQuat.x.toFixed(3)}, ${havokQuat.y.toFixed(3)}, ${havokQuat.z.toFixed(3)}>`}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  )
}

TransformWidget.propTypes = {
  playerMatrix: PropTypes.arrayOf(PropTypes.number).isRequired,
  havokMatrix: PropTypes.arrayOf(PropTypes.number)
}
