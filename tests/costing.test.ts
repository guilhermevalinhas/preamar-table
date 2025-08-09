import { describe, it, expect } from 'vitest'
import { costPerUsageUnitGBP, foodCostPercent, profitGBP, pricePerPersonGBP, grossProfitPercent } from '../src/lib/costing'
import { Ingredient } from '../src/lib/types'

const almond: Ingredient = {
  ownerId: 'u',
  name: 'Almonds',
  purchaseQty: 1,
  purchaseUnit: 'kg',
  price: 8,
  measurements: [{ name: 'per g', fromQty: 1, fromUnit: 'kg', toQty: 1000, toUnit: 'g' }],
  wastage: [{ type: 'trim', percent: 5 }]
}

describe('costing', () => {
  it('ingredient cost per g with wastage uplift', () => {
    const cpu = costPerUsageUnitGBP(almond, 'g')
    expect(cpu).toBeGreaterThan(0.0084)
    expect(cpu).toBeLessThan(0.0085)
  })
  it('food cost %, profit', () => {
    expect(foodCostPercent(2, 10)).toBe(20)
    expect(profitGBP(2, 10)).toBe(8)
  })
  it('menu & event helpers', () => {
    expect(pricePerPersonGBP(100, 5)).toBe(20)
    expect(grossProfitPercent(200, 80)).toBe(60)
  })
})
