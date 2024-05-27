import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import '@fontsource/roboto-mono/300.css'
import '@fontsource/roboto-mono/400.css'
import '@fontsource/roboto-mono/500.css'
import '@fontsource/roboto-mono/700.css'

import React from 'react'
import { createRoot } from 'react-dom/client'

import Root from './Components/Root.jsx'

const container = document.getElementById('appRoot')
const root = createRoot(container)
root.render(<Root />)
