import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'

export default function HeartWidget ({
  filled = false,
  quarters = 4,
  width = 40,
  height = 40,
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
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height)
      context.save()

      context.font = '60px Roboto, sans-serif'

      // Filled Heart
      if (filled) {
        context.fillStyle = 'red'
        context.fillText('♥', 2, context.canvas.height - 2)

        // Quarter hearts
        const halfWidth = context.canvas.width / 2
        for (let i = 0; i < 4 - quarters; i++) {
          switch (i) {
            case 0:
              context.clearRect(halfWidth, 0, halfWidth, halfWidth)
              break

            case 1:
              context.clearRect(halfWidth, halfWidth, halfWidth, halfWidth)
              break

            case 2:
              context.clearRect(0, halfWidth, halfWidth, halfWidth)
              break
          }
        }
      }

      // Heart outline
      context.strokeStyle = 'white'
      context.strokeText('♥', 2, context.canvas.height - 2)

      context.restore()
    }
  }, [context, filled, quarters])

  return (
    <Box textAlign={'center'} {...rest}>
      <canvas ref={canvasRef} width={width} height={height} />
    </Box>
  )
}

HeartWidget.propTypes = {
  filled: PropTypes.bool,
  quarters: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
}
