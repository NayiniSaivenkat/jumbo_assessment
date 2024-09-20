import React, { useState } from 'react';
import { Container, TextField, MenuItem, Button, Grid, Typography } from '@mui/material';

// Haversine formula to calculate distance between two coordinates
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of the earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  console.log(R*c)
  return R * c; // Distance in km
};

const productsList = [
  { name: 'Noodles Rs10 pack of 10', weight: 0.5 },
  { name: 'Rice Bag 10Kg', weight: 10 },
  { name: 'Sugar Bag 25kg', weight: 25 },
];

const warehouses = {
  BLR_Warehouse: { lat: 12.99999, long: 37.923273 },
  MUMB_Warehouse: { lat: 11.99999, long: 27.923273 },
};

function App() {
  const [name, setName] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [selectedProducts, setSelectedProducts] = useState({
    Noodles: 0,
    Rice: 0,
    Sugar: 0,
  });
  const [deliveryType, setDeliveryType] = useState('');
  const [shippingCharge, setShippingCharge] = useState(null);

  const handleInputChange = (e, productName) => {
    const value = e.target.value === '' ? 0 : parseInt(e.target.value);
  setSelectedProducts({
    ...selectedProducts,
    [productName]: value,
  });
  };
  let distance;
  const calculateShipping = () => {
    // Set the warehouse (according to less distance)
    const warehouse1 = warehouses.BLR_Warehouse;
    const warehouse2 = warehouses.MUMB_Warehouse;
    // Calculate the distance between the user and the warehouse
    const distance1 = calculateDistance(
      warehouse1.lat,
      warehouse1.long,
      parseFloat(latitude),
      parseFloat(longitude)
    );
    const distance2 = calculateDistance(
      warehouse2.lat,
      warehouse2.long,
      parseFloat(latitude),
      parseFloat(longitude)
    );

    if(distance1<distance2){
     distance=distance1;
    }
    else{
     distance=distance2;
    }
     console.log(distance);
    // Calculate the weight of all selected products
    const totalWeight =
      selectedProducts.Noodles * 0.5 +
      selectedProducts.Rice * 10 +
      selectedProducts.Sugar * 25;

    let transportMode;
    let ratePerKm;

    if (distance > 500) {
      transportMode = 'Aeroplane';
      ratePerKm = 1;
    } else if (distance > 100) {
      transportMode = 'Truck';
      ratePerKm = 2;
    } else {
      transportMode = 'Mini Van';
      ratePerKm = 3;
    }

    const transportCost = ratePerKm * distance * totalWeight;

    let totalShippingCost;
    if (deliveryType === 'Standard') {
      totalShippingCost = 10 + transportCost;
    } else if (deliveryType === 'Express') {
      totalShippingCost = 10 + 1.2 * totalWeight + transportCost;
    }

    setShippingCharge(totalShippingCost.toFixed(2));
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Shipping Calculator
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Latitude"
            fullWidth
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Longitude"
            fullWidth
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
          />
        </Grid>

        <Grid item xs={4}>
          <TextField
            label="Noodles Quantity"
            type="number"
            fullWidth
            value={selectedProducts.Noodles}
            onChange={(e) => handleInputChange(e, 'Noodles')}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Rice Quantity"
            type="number"
            fullWidth
            value={selectedProducts.Rice}
            onChange={(e) => handleInputChange(e, 'Rice')}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Sugar Quantity"
            type="number"
            fullWidth
            value={selectedProducts.Sugar}
            onChange={(e) => handleInputChange(e, 'Sugar')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            label="Delivery Type"
            fullWidth
            value={deliveryType}
            onChange={(e) => setDeliveryType(e.target.value)}
          >
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Express">Express</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={calculateShipping}>
            Calculate Shipping
          </Button>
        </Grid>

        {shippingCharge && (
          <Grid item xs={12}>
            <Typography variant="h6">Shipping Charge: Rs {shippingCharge}</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;

