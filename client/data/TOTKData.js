export const currentHealthData = {
  nickname: 'currentHealth',
  offsets: [0x45d6750, 0x480, 0x130, 0x1f0, 0x150, 0x198],
  dataType: 'i32',
  dataCount: 1,
  nsInterval: 5e8 // 1/2 second
}

export const maxHealthData = {
  nickname: 'maxHealth',
  offsets: [0x45d6750, 0x480, 0x130, 0x1f0, 0x150, 0x1a8],
  dataType: 'i32',
  dataCount: 1,
  nsInterval: 5e8 // 1/2 second
}

export const currentStaminaData = {
  nickname: 'currentStamina',
  offsets: [0x4649c10, 0x40, 0x934],
  dataType: 'f32',
  dataCount: 1,
  nsInterval: 5e8 // 1/2 second
}

export const bonusStaminaData = {
  nickname: 'bonusStamina',
  offsets: [0x4649c10, 0x40, 0x938],
  dataType: 'f32',
  dataCount: 1,
  nsInterval: 5e8 // 1/2 second
}

export const playerTransformData = {
  nickname: 'currentPlayerTransform',
  offsets: [0x4649de8, 0x70, 0x1a8, 0x0, 0x58],
  dataType: 'f32',
  dataCount: 16,
  nsInterval: 33333333 // 1/30 second
}

export const havokMatrixData = {
  nickname: 'currentHavokMatrix',
  offsets: [0x45ba998, 0x60, 0x20, 0x18c0],
  dataType: 'f32',
  dataCount: 16,
  isDynamic: true,
  nsInterval: 33333333 // 1/30 second
}
