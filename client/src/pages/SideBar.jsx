import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Container,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getAllProducts } from '../components/QueryFunction/CrudProducts';

const SideBar = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['allProducts'],
    queryFn: getAllProducts,
  });

  // Extract unique categories
  const allProducts = data?.data || [];
  const uniqueCategories = Array.from(
    new Set(allProducts.map((p) => p.category?.name).filter(Boolean))
  );

  const handleCategoryChange = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updated);
    onFilterChange({ category: updated });
  };

  if (isLoading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container sx={{ textAlign: 'center', mt: 6 }}>
        <Typography variant="h6" color="error">
          Failed to load product categories.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ p: 2, mt: 5 }}>
      <Typography variant="h6" fontWeight="bold" mb={2} noWrap>
        Filter by Category
      </Typography>
      <FormGroup>
        {uniqueCategories.map((category) => (
          <FormControlLabel
            key={category}
            control={
              <Checkbox
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            }
            label={category}
          />
        ))}
      </FormGroup>
    </Box>
  );
};

export default SideBar;

