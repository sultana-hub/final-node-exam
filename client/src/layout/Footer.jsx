import React, { useState } from "react";
import {
  Container,
  Typography,
  Link,
  Box,
  IconButton,
  Grid,
  Button,
} from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";


const Footer = () => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ bgcolor: "#1d0944ff", color: "white", py: 4, mt: 4 }}>
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          {/* Left: Contact Info */}
          <Grid item xs={12} sm={4} textAlign={{ xs: "center", sm: "center" }}>
            <Typography variant="h6" gutterBottom>
              Contact Us
            </Typography>
            <Typography>Email: support@product.com</Typography>
            <Typography>Phone: + (91) 7584567890</Typography>
            <Typography>Address: 22 Ghosh Lane, Kolkata, WB</Typography>
          </Grid>

          {/* Center: Follow Us & Copyright */}
          <Grid
            item
            xs={12}
            sm={4}
            textAlign="center"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
            <Box>
              <IconButton
                component="a"
                href="https://facebook.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                component="a"
                href="https://twitter.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                component="a"
                href="https://instagram.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                component="a"
                href="https://linkedin.com"
                target="_blank"
                sx={{ color: "white" }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
            <Box mt={2}>
              <Typography variant="body2">
                © {new Date().getFullYear()} TechQuiz. All rights reserved.
              </Typography>
            </Box>
          </Grid>

          {/* Right: Quick Links */}
          <Grid
            item
            xs={12}
            sm={4}
            textAlign={{ xs: "center", sm: "right" }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Button color="inherit">
              <Link
                href="#!"
                color="inherit"
                underline="none"
                display="block"
              >
              About Us
              </Link>
            </Button>
            <br />
            {/* Uncomment if needed
            <Button color="inherit" onClick={() => setOpen(true)}>
              Terms & Conditions
            </Button>
            <TermsAndConditionsModal open={open} handleClose={() => setOpen(false)} />
            */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;