import * as React from 'react'
import PropTypes from 'prop-types'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import Monospaced from './Monospaced.jsx'

export default function RawCoordinates ({
  x = 0,
  y = 0,
  z = 0,
  yaw = 0,
  pitch = 0,
  roll = 0
}) {
  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableBody>
          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Typography variant="h6" component="div">
                {'Position:'}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Monospaced variant="h6" component="div">
                {`(${x.toFixed(3)}, ${y.toFixed(3)}, ${z.toFixed(3)})`}
              </Monospaced>
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              <Typography variant="h6" component="div">
                {'Rotation:'}
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Monospaced variant="h6" component="div">
                {`(${yaw.toFixed(3)}, ${pitch.toFixed(3)}, ${roll.toFixed(3)})`}
              </Monospaced>
            </TableCell>
          </TableRow>

          <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell colSpan={2} align="right">
              <Button variant="contained" color="primary">
                {'Save'}
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

RawCoordinates.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  z: PropTypes.number,
  yaw: PropTypes.number,
  pitch: PropTypes.number,
  roll: PropTypes.number
}
