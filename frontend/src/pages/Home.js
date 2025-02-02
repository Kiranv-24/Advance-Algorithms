import React from "react";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";

const Home = () => {
  return (
    <Box>
      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4}>
          {/* Hero Section */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                p: 6,
                textAlign: "center",
                background: "linear-gradient(45deg, #1976d2 30%, #2196f3 90%)",
                color: "white",
              }}
            >
              <Typography variant="h3" gutterBottom>
                Welcome to TechMart System
              </Typography>
              <Typography variant="h6" paragraph>
                Join us to share and analyze product feedback
              </Typography>
            </Paper>
          </Grid>

          {/* Features Section */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Product Reviews
              </Typography>
              <Typography>
                Share your experience with products and help others make
                informed decisions.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Sentiment Analysis
              </Typography>
              <Typography>
                Advanced analytics to understand customer sentiment and feedback
                patterns.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Improvement Insights
              </Typography>
              <Typography>
                Get actionable insights to improve products based on customer
                feedback.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
