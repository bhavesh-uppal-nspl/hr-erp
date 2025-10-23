"use client"

import { Link, useLocation } from "react-router-dom"
import ExpandedSideOption from "./ExpandedSideOption"

function Sidebar({ SideOptions, isOpen, onMobileClose }) {
  const location = useLocation()

  const handleNavigation = (route) => {
    if (onMobileClose) {
      onMobileClose()
    }
  }

  return (
    <nav id="sidebar" className={`${isOpen ? "active" : ""} bg-white dark:bg-gray-800 h-full`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Project Name</h1>
      </div>
      <ul className="list-none p-0 m-0">
        {SideOptions.map((item, id) => (
          <li key={id} className={`${location.pathname === item.route ? "bg-blue-100 dark:bg-blue-900" : ""}`}>
            {item.children && item.children?.length > 0 ? (
              <ExpandedSideOption item={item} collapsed={false} onMobileClose={onMobileClose} />
            ) : (
              <Link
                to={item.route}
                onClick={() => handleNavigation(item.route)}
                className="flex items-center p-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 no-underline"
              >
                <i className={`${item.logo} mr-3`}></i>
                {item.heading}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Sidebar
