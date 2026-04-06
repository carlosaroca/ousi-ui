export const charts = {
  categorical: [
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#22c55e', // green-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#06b6d4', // cyan-500
    '#ec4899', // pink-500
    '#f97316', // orange-500
  ],
  sequential: {
    blue: ['#dbeafe', '#93c5fd', '#3b82f6', '#1d4ed8', '#172554'],
    green: ['#dcfce7', '#86efac', '#22c55e', '#15803d', '#052e16'],
  },
  diverging: {
    blueRed: ['#1d4ed8', '#93c5fd', '#f5f5f5', '#fca5a5', '#dc2626'],
  },
} as const

export type Charts = typeof charts
