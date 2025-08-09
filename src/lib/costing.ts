import { Ingredient, IngredientMeasurement, IngredientWastage, LineItemRef, Unit } from './types'
import { toBaseQty, ratio } from './conversions'

export function costPerUsageUnitGBP(ingredient: Ingredient, desiredUnit: Unit): number {
  const basePackQty = ingredient.purchaseQty
  const packUnit = ingredient.purchaseUnit
  const price = ingredient.price

  const ms = ingredient.measurements || []
  const direct: IngredientMeasurement | undefined = ms.find(
    m => m.fromUnit === packUnit && m.toUnit === desiredUnit
  )

  let factor: number
  if (direct) {
    factor = ratio(direct.fromQty, direct.toQty)
  } else {
    const packBase = toBaseQty(basePackQty, packUnit)
    const desiredBase = toBaseQty(1, desiredUnit)
    if (packBase.base !== desiredBase.base) {
      throw new Error(`No conversion from ${packUnit} to ${desiredUnit} for ${ingredient.name}`)
    }
    factor = packBase.qty / desiredBase.qty
  }

  const unitsInPack = basePackQty * factor
  if (unitsInPack === 0) return 0
  const costPerUnit = price / unitsInPack

  const wastage: IngredientWastage[] = ingredient.wastage || []
  const totalWastage = wastage.reduce((acc, w) => acc + (w.percent || 0), 0) / 100
  const adjustedCost = costPerUnit / (1 - Math.min(totalWastage, 0.95))

  return adjustedCost
}

export function sumItemsCostGBP(
  items: LineItemRef[],
  resolveIngredient: (id: string) => Ingredient | undefined,
  resolvePreparationCostPerUnit: (id: string, unit: Unit) => number
): number {
  return items.reduce((sum, li) => {
    if (li.refType === 'ingredient') {
      const ing = resolveIngredient(li.refId)
      if (!ing) return sum
      const cpu = costPerUsageUnitGBP(ing, li.unit)
      return sum + cpu * li.qty
    } else {
      const cpp = resolvePreparationCostPerUnit(li.refId, li.unit)
      return sum + cpp * li.qty
    }
  }, 0)
}

export function foodCostPercent(cost: number, sellingPrice?: number): number {
  if (!sellingPrice || sellingPrice === 0) return 0
  return (cost / sellingPrice) * 100
}
export function profitGBP(cost: number, sellingPrice?: number): number {
  if (!sellingPrice) return -cost
  return sellingPrice - cost
}
export function pricePerPersonGBP(sellingPrice: number, people: number): number {
  return people > 0 ? sellingPrice / people : 0
}
export function grossProfitPercent(totalRevenue: number, totalCost: number): number {
  if (totalRevenue === 0) return 0
  return ((totalRevenue - totalCost) / totalRevenue) * 100
}
