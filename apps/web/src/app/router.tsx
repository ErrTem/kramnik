import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from './AppLayout.tsx'
import { NotFoundPage } from '../features/catalog/NotFoundPage.tsx'
import { ProductDetailPage } from '../features/catalog/ProductDetailPage.tsx'
import { ProductListPage } from '../features/catalog/ProductListPage.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: 'products', element: <ProductListPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])