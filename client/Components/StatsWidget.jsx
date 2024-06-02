import React from 'react'
import PropTypes from 'prop-types'

import {
  Box,
  Stack,
  Tabs,
  Tab,
  Paper,
  List,
  ListItem,
  Grid
} from '@mui/material'

import TabPanel from './TabPanel.jsx'
import HeartWidget from './HeartWidget.jsx'
import StaminaWidget from './StaminaWidget.jsx'

function a11yProps (index) {
  return {
    id: `stats-tab-${index}`,
    'aria-controls': `stats-tabpanel-${index}`
  }
}

export default function StatsWidget ({
  health = 0,
  maxHealth = 12,
  bonusHealth = 0,
  stamina = 0,
  maxStamina = 1000,
  bonusStamina = 0
}) {
  const [curTab, setCurTab] = React.useState(0)
  const handleChange = (event, newValue) => {
    setCurTab(newValue)
  }

  // Calculate the number of hearts to display
  const hearts = Math.ceil(health / 4)
  const maxHearts = maxHealth / 4 || 3
  const bonusHearts = Math.ceil(bonusHealth / 4) || 0

  // Calculate quarter heart metrics (if any)
  const bonus = bonusHealth > 0
  const quarters = (bonus ? bonusHealth % 4 : health % 4) || 4
  const quarterCheck = bonus ? hearts + bonusHearts - 1 : hearts - 1

  // Build all the widgets
  const heartWidgets = [
    ...Array(maxHearts + Math.ceil(bonusHearts)).keys()
  ].map((i) => {
    if (i + 1 < hearts) {
      // Filled hearts
      return <HeartWidget scale={20} key={i} filled />
    } else {
      // Empty / partially filled hearts or bonus hearts
      if (i === quarterCheck) {
        return (
          <HeartWidget
            scale={20}
            key={i}
            bonus={bonus}
            quarters={quarters}
            filled
          />
        )
      } else if (i + 1 === hearts) {
        return <HeartWidget scale={20} key={i} filled />
      } else {
        return <HeartWidget scale={20} key={i} bonus={bonus} filled={bonus} />
      }
    }
  })

  return (
    <Paper sx={{ width: '100%', p: 1 }} elevation={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={curTab} onChange={handleChange}>
          <Tab label="Health & Stamina" {...a11yProps(0)} />
          <Tab label="Raw Data" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel curTab={curTab} name="stats" index={0}>
        <Grid container spacing={1}>
          <Grid item xs={7}>
            <Stack direction="row" alignContent={'space-between'}>
              {heartWidgets.slice(0, 19)}
            </Stack>
            {heartWidgets.length > 19 && (
              <Stack direction="row" spacing={1}>
                {heartWidgets.slice(19)}
              </Stack>
            )}
          </Grid>
          <Grid item xs={5}>
            <StaminaWidget
              currentStamina={stamina}
              maxStamina={maxStamina}
              bonusStamina={bonusStamina}
              scale={45}
            />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel curTab={curTab} name="stats" index={1}>
        <List>
          <ListItem>{`Health: ${health / 4} hearts`}</ListItem>
          <ListItem>{`Max Health: ${maxHealth / 4} hearts`}</ListItem>
          <ListItem>{`Stamina: ${stamina}`}</ListItem>
          <ListItem>{`Bonus Stamina: ${bonusStamina}`}</ListItem>
        </List>
      </TabPanel>
    </Paper>
  )
}

StatsWidget.propTypes = {
  health: PropTypes.number,
  maxHealth: PropTypes.number,
  bonusHealth: PropTypes.number,
  stamina: PropTypes.number,
  maxStamina: PropTypes.number,
  bonusStamina: PropTypes.number
}
