import { Outlet } from "react-router-dom";
import NavBar from "./NavBar.jsx";

function Layout() {
  return (
    <div className="layout-wrapper">
      <NavBar />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-content">
          <p>&copy; 2026 Dorfkind. All rights reserved.</p>
          <p>Built with ❤️ by Yasmine Azzaoui</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
