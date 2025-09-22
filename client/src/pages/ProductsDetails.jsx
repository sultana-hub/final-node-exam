import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getSingleProduct } from '../components/QueryFunction/CrudProducts';
import { Link } from 'react-router-dom';
import {
  Box,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
} from '@mui/material';

const ProductsDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['single-product', id],
    queryFn: () => getSingleProduct(id),
  });

  const product = data?.data;


  const imageUrl = (imgPath) =>
    `http://localhost:3000/${imgPath?.replace(/\\/g, '/')}`;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !product) {
    return (
      <Typography variant="h6" color="error" align="center" mt={4}>
        Failed to load product
      </Typography>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
        {/* Left: Product Image */}
        <Box sx={{ flex: 1 }}>
          <CardMedia
            component="img"
            src={imageUrl(product.image)}
            alt="Product"
            sx={{
              width: "100%",
              height: 400,           // fixed height
              objectFit: "contain",  // or "cover" if you want it cropped
              borderRadius: 2,
              backgroundColor: "#f5f5f5" // optional: gives background for transparent/empty areas
            }}
          />
          <Typography
            variant="caption"
            display="block"
            align="center"
            mt={1}
            component={Link}
            to="/"
            sx={{ textDecoration: "none", color: "primary.main", cursor: "pointer" }}
          >
            Back To Home
          </Typography>
        </Box>

        {/* Right: Product Info */}
        <Box sx={{ flex: 1 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {product.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Category: {product.category?.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {product.description}
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" color="primary">
                Add to Cart
              </Button>
              <Button variant="outlined" color="secondary">
                Buy Now
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductsDetails;

