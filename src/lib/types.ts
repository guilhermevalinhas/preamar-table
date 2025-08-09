export type ID = string
export type Unit = 'g'|'kg'|'ml'|'l'|'each'|'serv'|'tbsp'|'tsp'|'oz'|'lb'

export interface Supplier {
  id?: ID
  ownerId: ID
  name: string
  phone?: string
  email?: string
  location?: string
  comments?: string
  createdAt?: any
  updatedAt?: any
}

export interface IngredientMeasurement {
  name: string
  fromQty: number
  fromUnit: Unit
  toQty: number
  toUnit: Unit
}

export interface IngredientWastage {
  type: string
  percent: number
  notes?: string
}

export interface IngredientPricePoint {
  price: number
  currency: 'GBP'
  date: string
  supplierId?: ID
  packQty?: number
  packUnit?: Unit
}

export interface Ingredient {
  id?: ID
  ownerId: ID
  name: string
  category?: string
  supplierIds?: ID[]
  purchaseQty: number
  purchaseUnit: Unit
  price: number
  priceHistory?: IngredientPricePoint[]
  measurements?: IngredientMeasurement[]
  wastage?: IngredientWastage[]
  allergens?: string[]
  lastUpdated?: string
  comments?: string
  createdAt?: any
  updatedAt?: any
}

export interface LineItemRef {
  refType: 'ingredient'|'preparation'
  refId: ID
  qty: number
  unit: Unit
}

export interface Preparation {
  id?: ID
  ownerId: ID
  name: string
  category?: string
  yieldQty: number
  yieldUnit: Unit
  wastagePercent?: number
  items: LineItemRef[]
  notes?: string
  createdAt?: any
  updatedAt?: any
}

export interface Dish {
  id?: ID
  ownerId: ID
  name: string
  category?: string
  yieldQty: number
  yieldUnit: Unit
  sellingPrice?: number
  items: ({ refType: 'ingredient'|'preparation'; refId: ID; qty: number; unit: Unit })[]
  tags?: string[]
  imageUrl?: string
  createdAt?: any
  updatedAt?: any
}

export interface MenuEntry {
  dishId: ID
  qty: number
  unit: Unit
}

export interface Menu {
  id?: ID
  ownerId: ID
  name: string
  date?: string
  origin?: string
  peopleCount: number
  pricePerPerson?: number
  entries: MenuEntry[]
  createdAt?: any
  updatedAt?: any
}

export interface EventExtra { name: string; cost: number }

export interface Event {
  id?: ID
  ownerId: ID
  name: string
  date: string
  location?: string
  guestCount: number
  menuId?: ID
  extras?: EventExtra[]
  createdAt?: any
  updatedAt?: any
}
