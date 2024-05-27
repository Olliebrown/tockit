import React from 'react'
import PropTypes from 'prop-types'

import { Box, Stack } from '@mui/material'
import Monospaced from './Monospaced.jsx'

export default function AngleWidget ({
  angle = 0,
  width = 100,
  height = 100,
  ...rest
}) {
  const canvasRef = React.useRef(null)
  const [context, setContext] = React.useState(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    setContext(ctx)
  }, [])

  React.useEffect(() => {
    function drawArrow (ctx, thickness, color) {
      ctx.fillStyle = color
      ctx.strokeStyle = color

      const halfW = ctx.canvas.width / 2

      // Main line of the arrow
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(halfW - 10, 0)
      ctx.lineWidth = thickness
      ctx.stroke()

      // Arrowhead
      const height = (16 * 1.73205080757) / 2

      ctx.beginPath()
      ctx.moveTo(halfW - 5, 0)
      ctx.lineTo(halfW - 5 - height, 8)
      ctx.lineTo(halfW - 5 - height, -8)
      ctx.closePath()
      ctx.fill()
    }

    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      context.save()

      context.translate(context.canvas.width / 2, context.canvas.height / 2)

      // Draw circle
      context.strokeStyle = 'grey'
      context.beginPath()
      context.arc(0, 0, context.canvas.width / 2 - 2, 0, 2 * Math.PI)
      context.stroke()

      context.rotate(angle - Math.PI / 2)
      drawArrow(context, 4, 'lightgrey')
      context.restore()
    }
  }, [angle, context])

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
