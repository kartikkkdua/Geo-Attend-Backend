import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Collapse, ListItemIcon, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore, Inbox, Logout, Mail } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../AuthContext';

const Sidebar = ({ WrappedComponent }) => {
    const [open, setOpen] = useState(false);
    const [subMenuOpen, setSubMenuOpen] = useState({});
    const {logout} = useAuth();
    const toggleDrawer = () => {
        setOpen(!open);
    };

    // Toggle sub-menu based on index
    const handleSubMenuClick = (index) => {
        setSubMenuOpen((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (

        <div style={{ display: 'flex' }}>
            <div className='fixed h-[60px] flex justify-between top-0 w-full text-white bg-black py-3 px-5 shadow-lg'>
                <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
                    <MenuIcon />
                </IconButton>
                <IconButton edge="start" color="inherit" onClick={logout}>
                    <Logout />
                </IconButton>
            </div>
            <Drawer anchor="left" open={open} onClose={toggleDrawer}>
                <List sx={{ width: 250 }}>
                    {/* Level 1 Item */}
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <Inbox />
                            </ListItemIcon>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                    </ListItem>

                    {/* Level 1 Item with Sub-menu */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleSubMenuClick(0)}>
                            <ListItemIcon>
                                <Mail />
                            </ListItemIcon>
                            <ListItemText primary="Reports" />
                            {subMenuOpen[0] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={subMenuOpen[0]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Level 2 Sub-items */}
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText primary="Daily Reports" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText primary="Monthly Reports" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>

                    {/* Another Level 1 Item with Sub-menu */}
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => handleSubMenuClick(1)}>
                            <ListItemIcon>
                                <Mail />
                            </ListItemIcon>
                            <ListItemText primary="Settings" />
                            {subMenuOpen[1] ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={subMenuOpen[1]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {/* Level 2 Sub-items */}
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText primary="Profile" />
                                </ListItemButton>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ pl: 4 }}>
                                    <ListItemText primary="Account" />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Collapse>
                </List>
            </Drawer>

            {/* Wrapped Component */}
            <div className='mt-[70px]' style={{ flex: 1, padding: 20 }}>
                {WrappedComponent}
            </div>
        </div>
    );
};

export default Sidebar;
