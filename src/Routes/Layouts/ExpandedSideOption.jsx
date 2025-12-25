"use client"
import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ListItem, ListItemIcon, ListItemText, Collapse, List } from "@mui/material"
import { ExpandLess, ExpandMore } from "@mui/icons-material"

function ExpandedSideOption({ collapsed, item, onNavigate }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    setOpen(!open)
  }

  const handleNavigation = (route) => {
    if (onNavigate) {
      onNavigate(route)
    } else {
      navigate(route)
    }
  }

  if (collapsed) return null

  return (
    <>
      <ListItem button onClick={handleClick} sx={{ py: 1, cursor: "pointer" }}>
        <ListItemIcon sx={{ minWidth: "35px" }}>{item.icon}</ListItemIcon>
        <ListItemText primary={item.title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {item.children.map((child, index) => (
            <ListItem
              button
              key={index}
              onClick={() => handleNavigation(child.route)}
              sx={{
                pl: 4,
                py: 0.5,
                cursor: "pointer",
                backgroundColor: location.pathname === child.route ? "action.selected" : "transparent",
              }}
            >
              <ListItemIcon sx={{ minWidth: "25px" }}>{child.icon}</ListItemIcon>
              <ListItem   sx={{fontSize: "15px !important" ,  py: 0.5, }}>{child.title} </ListItem> 
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  )
}

export default ExpandedSideOption
