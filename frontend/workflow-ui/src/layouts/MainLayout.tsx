import * as React from 'react';
import { Outlet, Link } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <header style={{ marginBottom: '20px' }}>
        <h1>
          <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            Workflow UI
          </Link>
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
