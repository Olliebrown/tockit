import React from 'react'
import PropTypes from 'prop-types'

import {
  Card,
  Box,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material'

import { statusShape } from '../data/PropShapes.js'
import { getGameInfoFromTitleID } from '../data/TitleIDLookup.js'

export default function GameInfo ({ statusData }) {
  // Attempt to lookup game info from the title ID
  const [gameInfo, setGameInfo] = React.useState(null)
  React.useEffect(() => {
    setGameInfo(getGameInfoFromTitleID(statusData?.titleId))
  }, [statusData?.titleId])

  return (
    <Card sx={{ display: 'flex' }} elevation={3}>
      <CardMedia
        component="img"
        sx={{ width: 635 }}
        image={gameInfo?.bannerUrl}
        alt={`${gameInfo?.title} banner image`}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {gameInfo?.name || 'Unknown Game'}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {`Process: ${statusData?.processId}, Title: ${statusData?.titleId}`}
            <br />
            {`Build Id: ${statusData?.mainNsoBuildId.slice(0, 16)}`}
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="Categories"
                secondary={gameInfo?.category.join(', ')}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Content Rating"
                secondary={`${gameInfo?.rating} (${gameInfo?.ratingContent?.join(', ')})`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Main Memory Bounds"
                secondary={`${statusData.main.start} - ${statusData.main.end}`}
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Heap Memory Bounds"
                secondary={`${statusData.heap.start} - ${statusData.heap.end}`}
              />
            </ListItem>
          </List>
        </CardContent>
      </Box>
    </Card>
  )
}

GameInfo.propTypes = {
  statusData: PropTypes.shape(statusShape).isRequired
}
