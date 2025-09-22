import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

const Error = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 12, mb: 12 }}
    >
      <Card sx={{ width: 300, textAlign: 'center' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            First You need to login
          </Typography>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            color="primary"
          >
            Go To Login Page
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Error;
