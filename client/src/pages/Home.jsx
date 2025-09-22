

import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import SideBar from './SideBar';
import MainPage from './MainPage';
import '../style/style.css';

const Home = () => {
   const [filters, setFilters] = useState({ category: "" });
  return (
    <Stack direction="row" className="sidebarContainer">
      {/* <SideBar onFilterChange={setFilters} /> */}
      <Box flexGrow={1} className="mainBlock">
        <MainPage filters={filters} />
      </Box>
    </Stack>
  );
};

export default Home;

