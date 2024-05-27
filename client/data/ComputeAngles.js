export function computeAnglesFromMatrix (matrix) {
  const angles1 = [0, 0, 0]
  const angles2 = [0, 0, 0]
  if (Math.abs(Math.abs(matrix[8]) - 1) > 1e-4) {
    angles1[0] = -Math.asin(matrix[8])
    angles2[0] = Math.PI - angles1[0]

    const cosTheta1 = Math.cos(angles1[0])
    const cosTheta2 = Math.cos(angles2[0])
    angles1[1] = Math.atan2(matrix[9] / cosTheta1, matrix[10] / cosTheta1)
    angles2[1] = Math.atan2(matrix[9] / cosTheta2, matrix[10] / cosTheta2)
    angles1[2] = Math.atan2(matrix[4] / cosTheta1, matrix[0] / cosTheta1)
    angles2[2] = Math.atan2(matrix[4] / cosTheta2, matrix[0] / cosTheta2)
  } else {
    angles1[2] = 0
    if (matrix[8] < 0) {
      angles1[0] = Math.PI / 2
      angles1[1] = Math.atan2(matrix[1], matrix[2])
    } else {
      angles1[0] = -Math.PI / 2
      angles1[1] = Math.atan2(-matrix[1], -matrix[2])
    }
  }

  return angles1
  // if (Math.abs(angles2[1]) < Math.abs(angles1[1])) {
  //   return angles1
  // } else {
  //   return angles1
  // }
}
