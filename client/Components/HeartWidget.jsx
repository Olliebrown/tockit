import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import useCanvas from '../data/useCanvas.js'

export default function HeartWidget ({
  filled = false,
  bonus = false,
  quarters = 4,
  scale = 40,
  ...rest
}) {
  const theme = useTheme()
  const renderHeart = React.useCallback(
    (ctx) => {
      // Pick colors
      const outlineColor =
        theme.palette.mode === 'dark' ? 'lightgrey' : 'darkgrey'
      let fillColor = theme.palette.mode === 'dark' ? 'darkred' : 'red'
      if (bonus) {
        fillColor = theme.palette.mode === 'dark' ? 'gold' : 'yellow'
      }

      // Set font
      ctx.font = `${Math.floor(ctx.canvas.width * 1.4)}px Roboto, sans-serif`
      const textSize = ctx.measureText('♥')
      const xBorder = (ctx.canvas.width - textSize.width) / 2
      const yBorder = (ctx.canvas.height - textSize.actualBoundingBoxAscent) / 2

      // Filled Heart
      if (filled) {
        ctx.fillStyle = fillColor
        ctx.fillText('♥', xBorder, ctx.canvas.height - yBorder)

        // Quarter hearts
        const halfWidth = ctx.canvas.width / 2
        for (let i = 0; i < 4 - quarters; i++) {
          switch (i) {
            case 0:
              ctx.clearRect(halfWidth, 0, halfWidth, halfWidth)
              break

            case 1:
              ctx.clearRect(halfWidth, halfWidth, halfWidth, halfWidth)
              break

            case 2:
              ctx.clearRect(0, halfWidth, halfWidth, halfWidth)
              break
          }
        }
      }

      // Heart outline
      ctx.strokeStyle = outlineColor
      ctx.strokeText('♥', xBorder, ctx.canvas.height - yBorder)
    },
    [theme.palette.mode, bonus, filled, quarters]
  )

  const canvasRef = useCanvas(renderHeart)
  return (
    <Box textAlign={'center'} {...rest}>
      <canvas ref={canvasRef} width={scale} height={scale} />
    </Box>
  )
}

HeartWidget.propTypes = {
  filled: PropTypes.bool,
  bonus: PropTypes.bool,
  quarters: PropTypes.number,
  scale: PropTypes.number,
  height: PropTypes.number
}
