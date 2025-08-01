import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Sidebar from './Sidebar';
import RightSidebar from './RightSidebar';
import './MainLayout.css';

const MainLayout = ({ children, onPostClick }) => {
  const { theme } = useTheme();

  return (
    <div className={`main-layout ${theme}`}>
      <div className="layout-content">
        <Sidebar onPostClick={onPostClick} />
        <main className="main-content">
          {children}
        </main>
        <RightSidebar />
      </div>
    </div>
  );
};

export default MainLayout;
