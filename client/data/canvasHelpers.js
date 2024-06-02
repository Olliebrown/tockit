export function drawArrow (ctx, thickness, color) {
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

export function drawCircle (
  ctx,
  radius,
  fillColor = null,
  strokeColor = null,
  lineWidth = 1,
  percent = 1.0
) {
  // Draw circle
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, 2 * Math.PI * percent)

  if (strokeColor) {
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = strokeColor
    ctx.stroke()
  }

  if (fillColor) {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
}
