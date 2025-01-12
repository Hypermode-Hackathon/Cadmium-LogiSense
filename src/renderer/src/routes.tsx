import { Suspense, lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import LoginNavbar from './components/custom/navbars/login-navbar'
import { SidebarInset, SidebarProvider } from './components/ui/sidebar'
import { AppSidebar } from './components/custom/sidebar'
import PublicRouteProtector from './services/route-protector/public-route-protector'
import PrivateRouteProtector from './services/route-protector/private-route-protector'
import ProjectPageNavbar from './components/custom/navbars/projects-page-navbar'
import Footer from './components/custom/global/footer'
import Fallback from './components/custom/global/fallback'

// Lazy load pages
const LogAnalysis = lazy(() => import('./pages/dashboard/log-analysis/index'))
const NotFound = lazy(() => import('./pages/not-found/not-found'))
const Login = lazy(() => import('./pages/login/index'))
const Projects = lazy(() => import('./pages/projects/index'))

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <Suspense fallback={<Fallback />}>
          <PublicRouteProtector>
            <>
              <LoginNavbar />
              <Login />
            </>
          </PublicRouteProtector>
        </Suspense>
      </>
    )
  },
  {
    path: '/login',
    element: (
      <>
        <Suspense fallback={<Fallback />}>
          <PublicRouteProtector>
            <>
              <LoginNavbar />
              <Login />
            </>
          </PublicRouteProtector>
        </Suspense>
      </>
    )
  },
  {
    path: '/:organization/projects',
    element: (
      <Suspense fallback={<Fallback />}>
        <PrivateRouteProtector>
          <ProjectPageNavbar />
          <Projects />
        </PrivateRouteProtector>
      </Suspense>
    )
  },
  {
    path: '/:organization/projects/:project_id/log-analysis/:submodule',
    element: (
      <Suspense fallback={<Fallback />}>
        <PrivateRouteProtector>
          <SidebarProvider>
            <AppSidebar variant="inset" className="" />
            <SidebarInset className="">
              <LogAnalysis />
            </SidebarInset>
          </SidebarProvider>
          <div className="fixed bottom-0 right-0 bg-sidebar-background w-full">
            <Footer />
          </div>
        </PrivateRouteProtector>
      </Suspense>
    )
  },
  {
    path: '*',
    element: (
      <>
        <Suspense fallback={<Fallback />}>
          <NotFound />
        </Suspense>
      </>
    )
  }
])
