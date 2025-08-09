import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './layout/Layout'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import GuardedRoute from '../components/GuardedRoute'

import SuppliersList from '../features/suppliers/SuppliersList'
import SupplierEdit from '../features/suppliers/SupplierEdit'
import IngredientsList from '../features/ingredients/IngredientsList'
import IngredientEdit from '../features/ingredients/IngredientEdit'
import PreparationsList from '../features/preparations/PreparationsList'
import PreparationEdit from '../features/preparations/PreparationEdit'
import DishesList from '../features/dishes/DishesList'
import DishEdit from '../features/dishes/DishEdit'
import MenusList from '../features/menus/MenusList'
import MenuEdit from '../features/menus/MenuEdit'
import EventsList from '../features/events/EventsList'
import EventEdit from '../features/events/EventEdit'

export default function Router() {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/" element={<GuardedRoute><Layout/></GuardedRoute>}>
        <Route index element={<Navigate to="ingredients" replace />} />
        <Route path="suppliers">
          <Route index element={<SuppliersList />} />
          <Route path="new" element={<SupplierEdit />} />
          <Route path=":id" element={<SupplierEdit />} />
        </Route>
        <Route path="ingredients">
          <Route index element={<IngredientsList />} />
          <Route path="new" element={<IngredientEdit />} />
          <Route path=":id" element={<IngredientEdit />} />
        </Route>
        <Route path="preparations">
          <Route index element={<PreparationsList />} />
          <Route path="new" element={<PreparationEdit />} />
          <Route path=":id" element={<PreparationEdit />} />
        </Route>
        <Route path="dishes">
          <Route index element={<DishesList />} />
          <Route path="new" element={<DishEdit />} />
          <Route path=":id" element={<DishEdit />} />
        </Route>
        <Route path="menus">
          <Route index element={<MenusList />} />
          <Route path="new" element={<MenuEdit />} />
          <Route path=":id" element={<MenuEdit />} />
        </Route>
        <Route path="events">
          <Route index element={<EventsList />} />
          <Route path="new" element={<EventEdit />} />
          <Route path=":id" element={<EventEdit />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
