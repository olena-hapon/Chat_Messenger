import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import RootLayout from './layouts/rootLayout/RootLayout'
import Homepage from './routes/homepage/Homepage'
import HomePage2 from './routes/homePage2/HomePage2'
import DashboardPage from "./routes/dashboardPage/DashboardPage"
import DashboardLayout from './layouts/dashboardLayout/DashboardLayout'
import ChatPage2 from './routes/chatPage/ChatPage2'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignInPage2 from './routes/signInPage/SignInPage2'

const router = createBrowserRouter([
  {
    element: <RootLayout/>,
    children: [
      { path: "/", element: <HomePage2 /> },
      { path: "/sign-in", element: <SignInPage2 /> },
      {
        element: <DashboardLayout/>,
        children: [
          { path:"/dashboard", element:<DashboardPage /> },
          { path: "/dashboard/chats/:id", element: <ChatPage2 /> },
        ],
      },
    ],
  },
]); 

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
          <RouterProvider router={router} />
      </GoogleOAuthProvider>
    </StrictMode>
  );
}
