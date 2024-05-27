import React from 'react'
import PropTypes from 'prop-types'

import { Box, Stack, Tabs, Tab, Paper, List, ListItem } from '@mui/material'

import TabPanel from './TabPanel.jsx'
import HeartWidget from './HeartWidget.jsx'

function a11yProps (index) {
  return {
    id: `stats-tab-${index}`,
    'aria-controls': `stats-tabpanel-${index}`
  }
}

export default function StatsWidget ({ data }) {
  const [curTab, setCurTab] = React.useState(0)
  const handleChange = (event, newValue) => {
    setCurTab(newValue)
  }

  // Calculate the number of hearts to display
  const hearts = Math.ceil(data?.currentHealth / 4) ?? 0
  const quarters = data?.currentHealth % 4 ?? 0
  const maxHearts = data?.maxHealth / 4 ?? 3

  return (
    <Paper sx={{ width: '100%', p: 1 }} elevation={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={curTab} onChange={handleChange}>
          <Tab label="Health & Stamina" {...a11yProps(0)} />
          <Tab label="Raw Data" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel curTab={curTab} name="stats" index={0}>
        <Stack direction="row" spacing={1}>
          {[...Array(maxHearts).keys()].map((i) => {
            if (i + 1 < hearts) {
              return <HeartWidget key={i} filled />
            } else if (i + 1 === hearts) {
              return <HeartWidget key={i} quarters={quarters || 4} filled />
            } else {
              return <HeartWidget key={i} />
            }
          })}
        </Stack>
      </TabPanel>
      <TabPanel curTab={curTab} name="stats" index={1}>
        <List>
          <ListItem>{`Health: ${data?.currentHealth / 4} hearts`}</ListItem>
          <ListItem>{`Max Health: ${data?.maxHealth / 4} hearts`}</ListItem>
          <ListItem>{`Stamina: ${data?.currentStamina}`}</ListItem>
          <ListItem>{`Bonus Stamina: ${data?.bonusStamina}`}</ListItem>
        </List>
      </TabPanel>
    </Paper>
  )
}

StatsWidget.propTypes = {
  data: PropTypes.shape({
    currentHealth: PropTypes.number,
    maxHealth: PropTypes.number,
    currentStamina: PropTypes.number,
    bonusStamina: PropTypes.number
  })
}
