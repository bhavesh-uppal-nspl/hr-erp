import { Collapse, List, MenuItem } from '@mui/material';
import React, { useState } from 'react'
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useNavigate } from 'react-router-dom';

function ExpandTopBarDropOption({ name, list, handleCloseUserMenu }) {

    const [openSubMenu, setOpenSubMenu] = useState(false);

    const handleToggleSubMenu = () => {
        setOpenSubMenu((prev) => !prev);
    };

    let navigate = useNavigate()

    return (
        <>

            <MenuItem onClick={handleToggleSubMenu}>
                {name} {openSubMenu ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
            </MenuItem>

            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding sx={{ pl: 3 }}>
                    {
                        list?.map(item => (
                            <MenuItem
                                onClick={() => {
                                    navigate(item?.url);
                                    handleCloseUserMenu();
                                }}
                            >
                                {item?.name}
                            </MenuItem>

                        ))
                    }

                </List>
            </Collapse>
        </>
    )
}

export default ExpandTopBarDropOption