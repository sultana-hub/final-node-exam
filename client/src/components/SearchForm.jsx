import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

const SearchForm = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (

    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 2, justifyContent: 'center', my: 3 }}>

      <TextField
        label="Search Product"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => {
          const value = e.target.value;
          setSearchTerm(value);

          if (value.trim() === '') {
            // 👇 Reload the page if input is cleared
            window.location.reload();
          }
        }}
        sx={{ width: 600 }}
      />
      <Button type="submit" variant="contained" color="primary" size="small">
        Search
      </Button>
    </Box>
  );
};

export default SearchForm;









