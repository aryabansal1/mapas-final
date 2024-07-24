// app/SearchBar.tsx
import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';

interface SearchBarProps {
  customIcon: L.Icon;
  setClickedLocation: (location: LatLngTuple | null) => void;
  setSearchMarker: (marker: L.Marker | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ customIcon, setClickedLocation, setSearchMarker }) => {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query) return;

    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await response.json();

    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      const latLng: LatLngTuple = [latNum, lonNum];
      map.setView(latLng, 13);

      // Remove any existing search markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker && (layer as any)._isSearchMarker) {
          map.removeLayer(layer);
        }
      });

      // Add new marker
      const marker = L.marker(latLng, { icon: customIcon });
      (marker as any)._isSearchMarker = true; // Custom property to identify the search marker
      marker.addTo(map);
      setSearchMarker(marker);
      setClickedLocation(latLng);
    }
  };

  return (
    <form onSubmit={handleSearch} style={styles.form}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for a location"
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Search</button>
    </form>
  );
};

const styles = {
  form: {
    position: 'absolute' as 'absolute',
    top: 80,
    left: 10,
    zIndex: 1000,
    display: 'flex',
    backgroundColor: 'white',
    padding: '5px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  input: {
    padding: '5px',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginRight: '5px',
    color: 'black', // Set text color to black
  },
  button: {
    padding: '5px 10px',
    backgroundColor: '#E74F20',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
  },
};

export default SearchBar;
