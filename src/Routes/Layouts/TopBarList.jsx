import React, { useState, useRef, useEffect } from 'react';
import styles from './TopbarMenu.module.css';
import { useNavigate } from 'react-router-dom';

const TopBarList = ({ openMenu, setOpenMenu }) => {
  const [openSubmenu, setOpenSubmenu] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  const settings = [
    { name: 'Profile', route: '/profile' },
    { name: 'Settings', submenu: true },
    { name: 'Logout', route: '/logout' },
  ];

  const submenuItems = [
    { name: 'Change Password', route: '/settings/change-password' },
    { name: 'Update Credentials', route: '/settings/update-credentials' }
  ];

  const handleNavigate = (route) => {
    if (route === '/logout') {
      console.log('Logging out...');
    } else {
      navigate(route);
    }
    setOpenMenu(false);   // close menu after action
    setOpenSubmenu(false);
  };

  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpenMenu(false);
      setOpenSubmenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div className={styles.topBarList}>
      {/* Remove the internal button! */}
      {openMenu && (
        <div className={styles.menu} ref={menuRef}>
          {settings.map((item, index) => (
            <div
              key={index}
              className={styles.menuItem}
              onMouseEnter={() => item.submenu && setOpenSubmenu(true)}
              onMouseLeave={() => item.submenu && setOpenSubmenu(false)}
              onClick={() => {
                if (!item.submenu) handleNavigate(item.route);
              }}
            >
              {item.name}
              {item.submenu && openSubmenu && (
                <div className={styles.submenu}>
                  {submenuItems.map((subitem, subindex) => (
                    <div
                      key={subindex}
                      className={styles.submenuItem}
                      onClick={() => handleNavigate(subitem.route)}
                    >
                      {subitem.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default TopBarList;
