import React from 'react'

export default function useCanvas (renderFunc) {
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
      renderFunc(context)
      context.restore()
    }
  }, [context, renderFunc])

  return canvasRef
}
