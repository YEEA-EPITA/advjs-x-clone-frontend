import { useTheme } from "../context/ThemeContext";
import Sidebar from "./Sidebar";
import RightSidebar from "./RightSidebar";
import MobileNavbar from "./MobileNavbar";
import MobileHeader from "./MobileHeader";
import "./MainLayout.css";

const MainLayout = ({ children, onPostClick, pageTitle = "Home" }) => {
  const { theme } = useTheme();

  return (
    <div className={`main-layout ${theme}`}>
      <MobileHeader title={pageTitle} />
      <div className="layout-content">
        <Sidebar onPostClick={onPostClick} />
        <main className="main-content">{children}</main>
        <RightSidebar />
      </div>
      <MobileNavbar onPostClick={onPostClick} />
    </div>
  );
};

export default MainLayout;
