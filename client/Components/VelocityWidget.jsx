import * as React from 'react'
import PropTypes from 'prop-types'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { Typography } from '@mui/material'
import Monospaced from './Monospaced.jsx'

import useVelocity from '../data/useVelocity.js'

export default function VelocityWidget ({ x = 0, y = 0, z = 0 }) {
  const V = useVelocity(x, y, z)
  const lengthV = Math.sqrt(V.reduce((acc, v) => acc + v * v, 0))

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Typography variant="h6" component="div">
                {'Speed:'}
              </Typography>
            </TableCell>
            <TableCell>
              <Monospaced variant="h6" component="div">
                {`${lengthV.toFixed(3)} m/s`}
              </Monospaced>
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell colSpan={2}>
              <Monospaced variant="h6" component="div">
                {`[${V.map((v) => v.toFixed(3)).join(', ')}] m/s`}
              </Monospaced>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

VelocityWidget.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number
}
