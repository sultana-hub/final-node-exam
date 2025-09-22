import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { NavLink } from 'react-router-dom';
import "./styleNav.css";

const Header = () => {
  return (
    <AppBar position="static" color="primary" enableColorOnDark>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" component="div">
            <NavLink to="#!" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
              E-Kart
            </NavLink>
          </Typography>
          <Button color="inherit">
            <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active-link' : ''}`}>
              Home
            </NavLink>
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;



