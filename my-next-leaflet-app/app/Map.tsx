'use client';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';

// Define Card type
interface Card {
  id: number;
  content: string;
  additionalCards: string[];
}

// Dynamically import the Cards component
const Cards = dynamic(() => import('./Cards'), { ssr: false });

// Custom icon options
const customIcon = L.icon({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], // Original size is [25, 41]
  iconAnchor: [12, 41], // Anchor the icon to its bottom center
  popupAnchor: [0, -41], // Position the popup above the icon
  shadowSize: [41, 41], // Same size as icon
  shadowAnchor: [12, 41] // Same anchor as icon
});

const Map = () => {
  const [cardsVisible, setCardsVisible] = useState(false);
  const [clickedLocation, setClickedLocation] = useState<LatLngTuple | null>(null);
  const [cardsData, setCardsData] = useState<Card[]>([]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setCardsVisible(true);
        setClickedLocation([e.latlng.lat, e.latlng.lng]);

        // Dynamically generate card data based on the clicked location
        setCardsData([
          { id: 1, content: 'Options go here', additionalCards: ['Additional Card 1', 'Additional Card 2'] },
          { id: 2, content: 'More options here', additionalCards: ['Additional Option 1'] },
          { id: 3, content: 'Even more options here', additionalCards: ['Additional Option 2', 'Additional Option 3'] },
        ]);
      }
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

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%' }}>
      <MapContainer center={[4.5709, -74.2973]} zoom={6} style={{ height: '100%', width: 'calc(100% - 300px)' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker />
      </MapContainer>
      <Cards isVisible={cardsVisible} onClose={closeCards} cardsData={cardsData} />
    </div>
  );
};

export default Map;
