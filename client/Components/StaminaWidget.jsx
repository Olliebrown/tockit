import React from 'react'
import PropTypes from 'prop-types'

import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import useCanvas from '../data/useCanvas.js'
import { drawCircle } from '../data/canvasHelpers.js'

const lineWidths = [10, 5, 3]

export default function StaminaWidget ({
  currentStamina = 0,
  maxStamina = 0,
  bonusStamina = 0,
  scale = 60,
  ...rest
}) {
  const theme = useTheme()
  const staminaRender = React.useCallback(
    (ctx) => {
      // Pick colors
      const stamColor = theme.palette.mode === 'dark' ? 'limegreen' : 'green'
      const bkgColor = theme.palette.mode === 'dark' ? 'grey' : 'darkgrey'

      // How many circles
      const circleCount = Math.ceil(maxStamina / 1000)
      let filled = currentStamina / 1000

      ctx.translate(ctx.canvas.width / 4, ctx.canvas.height / 2)
      ctx.scale(1, -1)

      // Draw each normal circle
      let radius = ctx.canvas.width / 4
      for (let i = 0; i < circleCount; i++) {
        const lineWidth = lineWidths[circleCount - 1 - i]
        if (filled > 1) {
          drawCircle(ctx, radius - lineWidth / 2, null, stamColor, lineWidth)
        } else {
          drawCircle(ctx, radius - lineWidth / 2, null, bkgColor, lineWidth)
          drawCircle(
            ctx,
            radius - lineWidth / 2,
            null,
            stamColor,
            lineWidth,
            Math.max(filled, 0.0)
          )
        }

        radius -= lineWidth + 4
        filled -= 1.0
      }

      // Draw the bonus circle if needed
      if (bonusStamina > 0) {
        ctx.translate(ctx.canvas.width / 2, 0)
        drawCircle(
          ctx,
          ctx.canvas.width / 4,
          null,
          'yellow',
          10,
          bonusStamina / 1000
        )
      }
    },
    [bonusStamina, currentStamina, maxStamina, theme.palette.mode]
  )

  const canvasRef = useCanvas(staminaRender)

  return (
    <Box textAlign={'center'} {...rest}>
      <canvas ref={canvasRef} width={scale * 2} height={scale} />
    </Box>
  )
}

StaminaWidget.propTypes = {
  currentStamina: PropTypes.number,
  maxStamina: PropTypes.number,
  bonusStamina: PropTypes.number,
  scale: PropTypes.number
}
