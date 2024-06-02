import React from 'react'
import PropTypes from 'prop-types'

import { Box, Stack } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

import Monospaced from './Monospaced.jsx'

import useCanvas from '../data/useCanvas.js'
import { drawArrow, drawCircle } from '../data/canvasHelpers.js'

export default function AngleWidget ({
  angle = 0,
  width = 100,
  height = 100,
  ...rest
}) {
  const theme = useTheme()
  const angleRender = React.useCallback(
    (ctx) => {
      // Pick colors
      const circleStroke = theme.palette.mode === 'dark' ? 'grey' : 'lightgrey'
      const circleFill = theme.palette.mode === 'dark' ? grey[900] : 'white'
      const arrowColor = theme.palette.mode === 'dark' ? 'lightgrey' : 'black'

      // Translate and rotate before drawing
      ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
      ctx.rotate(angle + Math.PI / 2)

      // Draw circle and arrow
      drawCircle(ctx, ctx.canvas.width / 2 - 2, circleFill, circleStroke, 3)
      drawArrow(ctx, 4, arrowColor)
    },
    [angle, theme.palette.mode]
  )

  const canvasRef = useCanvas(angleRender)

  return (
    <Stack {...rest}>
      <Box textAlign={'center'}>
        <canvas ref={canvasRef} width={width} height={height} />
      </Box>
      <Monospaced variant="h6" component="div" textAlign={'center'}>
        {`${((angle / Math.PI) * 180).toFixed(2)}°`}
      </Monospaced>
    </Stack>
  )
}

AngleWidget.propTypes = {
  angle: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
}
