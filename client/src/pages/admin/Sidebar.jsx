import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText, Collapse, ListItemIcon, IconButton } from '@mui/material';
import { ExpandLess, ExpandMore, Inbox, Mail } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

const MultiLevelDrawer = ({WrrapedComponent}) => {
  const [open, setOpen] = useState(false);
  const [subMenuOpen, setSubMenuOpen] = useState({});

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
    <div>
      <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
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
    </div>
  );
};

export default MultiLevelDrawer;
