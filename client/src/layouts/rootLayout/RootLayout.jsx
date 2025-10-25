import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Link, Outlet } from 'react-router-dom';
import './rootLayout.css';

const API_URL = import.meta.env.VITE_API_UR;

const queryClient = new QueryClient();

const RootLayout = () => {
  return (
    
      <QueryClientProvider client={queryClient}>
        <div className="rootLayout">
          <header>
            <Link to="/#">
              <span>Chat app</span>
            </Link>
            <div className="user">
            </div>
          </header>
          <main>
            <Outlet />
          </main>
        </div>
      </QueryClientProvider>
  );
};

export default RootLayout;
