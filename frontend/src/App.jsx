import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Box, Button, Stack } from '@mui/material';
import AddRestaurant from './components/Restaurant/AddRestaurant';
import AddMenuItem from './components/Menu/AddMenuItem';
import { Capacitor } from '@capacitor/core';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar } from '@capacitor/status-bar';

// Initialize Capacitor plugins
if (Capacitor.isNativePlatform()) {
  // Set status bar style
  StatusBar.setStyle({ style: 'dark' });
  
  // Handle back button
  CapacitorApp.addListener('backButton', ({ canGoBack }) => {
    if (!canGoBack) {
      CapacitorApp.exitApp();
    } else {
      window.history.back();
    }
  });
}

const App = () => {
  return (
    <Router>
      <Container>
        <Box sx={{ my: 4 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
            <Button component={Link} to="/" variant="contained">
              Add Restaurant
            </Button>
            <Button component={Link} to="/menu/test" variant="contained">
              Add Menu Item
            </Button>
          </Stack>

          <Routes>
            <Route path="/" element={<AddRestaurant />} />
            <Route path="/menu/:restaurantId" element={<AddMenuItem />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
};

export default App;