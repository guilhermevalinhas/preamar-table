import { Unit } from './types'

const gPerKg = 1000
const mlPerL = 1000
const gPerOz = 28.349523125
const gPerLb = 453.59237

export function toBaseQty(qty: number, unit: Unit): { qty: number; base: 'g'|'ml'|'each' } {
  switch (unit) {
    case 'kg': return { qty: qty * gPerKg, base: 'g' }
    case 'g': return { qty, base: 'g' }
    case 'l': return { qty: qty * mlPerL, base: 'ml' }
    case 'ml': return { qty, base: 'ml' }
    case 'oz': return { qty: qty * gPerOz, base: 'g' }
    case 'lb': return { qty: qty * gPerLb, base: 'g' }
    case 'each':
    case 'serv':
    case 'tbsp':
    case 'tsp':
      return { qty, base: 'each' }
    default:
      return { qty, base: 'each' }
  }
}

export function ratio(fromQty: number, toQty: number) {
  if (fromQty === 0) return 0
  return toQty / fromQty
}
