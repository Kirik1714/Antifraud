import React, { useState, useRef, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ChevronDown, User, LogOut } from "lucide-react";
import { logout } from "../../features/auth/authSlice";

import Sidebar from "../ui/Sidebar";
import styles from "./MainLayout.module.scss";

export default function MainLayout() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className={styles.pageWrapper}>
      <header className={styles.mainHeader}>
        {isAuthenticated ? (
          <button
            className={styles.burgerBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <div
              className={`${styles.burgerLine} ${isMobileMenuOpen ? styles.open : ""}`}
            ></div>
          </button>
        ) : (
          <div className={styles.burgerPlaceholder} />
        )}

        <div className={styles.logo}>ANTIFRAUD</div>

        <div className={styles.profileWrapper} ref={dropdownRef}>
          {isAuthenticated ? (
            <div
              className={`${styles.userInfo} ${isDropdownOpen ? styles.activeInfo : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <User className={styles.userIcon} size={16} />
              <span className={styles.userName}>
                {user ? `${user.firstName} ${user.lastName}` : "Guest"}
              </span>
              <ChevronDown
                className={`${styles.arrowIcon} ${isDropdownOpen ? styles.rotated : ""}`}
                size={14}
              />
            </div>
          ) : (
            <div className={`${styles.userInfo} ${styles.guestMode}`}>
              <User className={styles.userIcon} size={16} />
              <span className={styles.userName}>Guest</span>
            </div>
          )}

          {isAuthenticated && isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <LogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        {isAuthenticated && (
          <div
            className={`${styles.sidebarWrapper} ${isMobileMenuOpen ? styles.showMobileMenu : ""}`}
          >
            <Sidebar
              isReviewPage={location.pathname.includes("/transactions")}
            />
          </div>
        )}

        {isAuthenticated && isMobileMenuOpen && (
          <div
            className={styles.overlay}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <div className={styles.workspaceArea}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
