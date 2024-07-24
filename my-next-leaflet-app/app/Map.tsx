"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { Card as CardType } from './types';
import SearchBar from './SearchBar';

const Cards = dynamic(() => import('./Cards'), { ssr: false });

const customIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

const Map = () => {
  const [cardsVisible, setCardsVisible] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<LatLngTuple | null>(null);
  const [cardsData, setCardsData] = useState<CardType[]>([]);
  const [searchMarker, setSearchMarker] = useState<L.Marker | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<number[]>([]);
  
  const variables = [
    { id: 1, name: 'Precipitación' },
    { id: 2, name: 'Temperatura' },
    { id: 3, name: 'Evatransporación' }
  ];

  const fetchRegions = async (lat: number, lng: number) => {
    try {
      console.log(`Fetching regions for coordinates: lat=${lat}, lng=${lng}`);
      const response = await fetch('/api/regions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat, lng }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Data received 1:', data); // Log the data to see what is returned

        const cardData = await Promise.all(data.regions.map(async (region: { regionName: string; products: { product_ID: string; URL: string, variable: number }[] }) => ({
          id: Math.random(),
          regionName: region.regionName,
          additionalCards: await Promise.all(region.products.map(async product => {
            const productDetails = await fetchProductDetails(product.product_ID);
            return {
              ...productDetails,
              productId: product.product_ID,
              variable: product.variable
            };
          }))
        })));

        return cardData;
      } else {
        console.error('Error fetching regions:', response.statusText);
        return [];
      }
    } catch (error) {
      console.error('Error fetching regions:', error);
      return [];
    }
  };

  const fetchProductDetails = async (productId: string) => {
    try {
      const url = `https://crm.emergente.com.co/staging/wp-json/wc/v3/products/${productId}`;
      const auth = btoa('ck_9e89f9111ea747e1ffde795e76eaae27b0a440ae:cs_eaad3d6619951e54d68c1b08f954a961b63167cb');
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      });

      if (response.ok) {
        const product = await response.json();
        console.log(product.name);
        //console.log(product.description);
        return {  
          name: product.name,
          description: product.short_description,
          price: product.price,
          details: product.permalink
        };
      } else {
        console.error(`Failed to fetch product details for product ID ${productId}`);
        return {};
      }
    } catch (error) {
      console.error(`Error fetching product details for product ID ${productId}:`, error);
      return {};
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click: async (e) => {
        if (e.originalEvent) {
          const target = e.originalEvent.target as HTMLElement;
          if (target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'input') {
            return;
          }
        }

        // Remove existing search marker
        if (searchMarker) {
          searchMarker.remove();
          setSearchMarker(null);
        }

        setCardsVisible(true);
        setClickedLocation([e.latlng.lat, e.latlng.lng]);

        const cardData = await fetchRegions(e.latlng.lat, e.latlng.lng);
        console.log('Card data:', cardData); // Debugging output to check card data
        setCardsData(cardData);
      },
    });

    return clickedLocation === null ? null : (
      <Marker position={clickedLocation} icon={customIcon}>
        <Popup>
          You clicked at {clickedLocation[0].toFixed(4)}, {clickedLocation[1].toFixed(4)}
        </Popup>
      </Marker>
    );
  };

  const closeCards = () => {
    setCardsVisible(false);
    setClickedLocation(null);
    setCardsData([]);
  };

  const handleVariableChange = (variableId: number, isChecked: boolean) => {
    if (isChecked) {
      setSelectedVariables((prev) => [...prev, variableId]);
    } else {
      setSelectedVariables((prev) => prev.filter((id) => id !== variableId));
    }
  };

  const handleCheckAll = () => {
    setSelectedVariables(variables.map(variable => variable.id));
  };

  const handleUncheckAll = () => {
    setSelectedVariables([]);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <MapContainer center={[4.5709, -74.2973]} zoom={6} style={{ flex: 1 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SearchBar customIcon={customIcon} setClickedLocation={setClickedLocation} setSearchMarker={setSearchMarker} />
        <LocationMarker />
      </MapContainer>
      <Box
        sx={{
          position: 'absolute',
          height: 'calc(105vh - 180px)',
          top: '130px',
          left: '10px',
          padding: '10px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 1000,
          borderRadius: '0px',
          maxWidth: '400px', // Set maximum width for the box
          width: '100%' // Ensure the box takes up the full width up to the max width
        }}
      >
        
        <FormGroup row sx={{ flexWrap: 'wrap', marginTop: '10px' }}>
          {variables.map(variable => (
            <Button
              key={variable.id}
              variant={selectedVariables.includes(variable.id) ? 'contained' : 'outlined'}
              onClick={() => handleVariableChange(variable.id, !selectedVariables.includes(variable.id))}
              sx={{
                margin: 0.5,
                backgroundColor: selectedVariables.includes(variable.id) ? '#625B71' : '#fff',
                color: selectedVariables.includes(variable.id) ? '#fff' : '#000',
                borderColor: selectedVariables.includes(variable.id) ? '#625B71' : '#000', // Border color
                '&:hover': {
                  backgroundColor: selectedVariables.includes(variable.id) ? '#4a3f56' : '#e0e0e0', // Hover color
                  borderColor: selectedVariables.includes(variable.id) ? '#4a3f56' : '#000' // Hover border color
                },
                fontSize: '12px', // Decrease font size
                textTransform: 'capitalize', // capitalize first letter
                padding: '2px 5px' // Adjust padding to make it smaller
              }}
            >
              {variable.name}
            </Button>
          ))}
        </FormGroup>
        <Box sx={{ overflowY: 'auto', flexGrow: 1, marginTop: '10px'}}>
          <Cards isVisible={cardsVisible} onClose={() => setCardsVisible(false)} cardsData={cardsData} selectedVariables={selectedVariables} />
        </Box>
      </Box>
    </div>
  );  
};

export default Map;
