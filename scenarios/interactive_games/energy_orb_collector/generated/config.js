export const CONFIG = {
  FIELD_SIZE: 50,
  FIELD_MARGIN: 2,
  PLAYER_SPEED: 8, // units per second
  ORB_BASE_VALUE: 100,
  SESSION_DURATION: parseInt(new URLSearchParams(location.search).get('time') || '90',10),
  MAX_ORBS_PHASES: [
    { t: 0, count: 8 },
    { t: 30, count: 10 },
    { t: 60, count: 12 },
  ],
  ORB_RADIUS: 0.6,
  PICKUP_DISTANCE: 1.2,
  DEBUG: false,
  STORAGE_KEY: 'energy_orb_collector_v1_highScore'
};
