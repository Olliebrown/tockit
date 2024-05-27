import * as React from 'react'
import PropTypes from 'prop-types'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

import Monospaced from './Monospaced.jsx'

import useVelocity from '../data/useVelocity.js'

export default function LocationWidget ({ x = 0, y = 0, z = 0 }) {
  // Compute velocity from position
  const V = useVelocity(x, y, z)
  const lengthV = Math.sqrt(V.reduce((acc, v) => acc + v * v, 0))

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Typography variant="h6" component="div">
                {'N-S:'}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Monospaced variant="h6" component="div">
                {x.toFixed(3)}
              </Monospaced>
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Typography variant="h6" component="div">
                {'E-W:'}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Monospaced variant="h6" component="div">
                {y.toFixed(3)}
              </Monospaced>
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Typography variant="h6" component="div">
                {'Height:'}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Monospaced variant="h6" component="div">
                {z.toFixed(3)}
              </Monospaced>
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Typography variant="h6" component="div">
                {'Speed:'}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Monospaced variant="h6" component="div">
                {lengthV.toFixed(3)}
              </Monospaced>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

LocationWidget.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number
}
