import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

const googleLikeRedIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#ea4335" width="38px" height="38px">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-12-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `,
  className: '',
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -34]
});

const geoCache = {};

function MapRefresher({ center }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.invalidateSize();
      map.setView(center, 16, { animate: true, duration: 0.8 });
    }
  }, [center, map]);

  return null;
}

function LocationButton({ center }) {
  const map = useMap();

  const handleRecenter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (center) {
      map.setView(center, 16, { animate: true, duration: 0.6 });
    }
  };

  return (
    <div 
      className="custom-map-controls"
      style={{
        position: 'absolute',
        bottom: '110px', 
        right: '10px',   
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleRecenter}
        title="Find Current Location"
        style={{
          width: '34px',  
          height: '34px',
          backgroundColor: '#ffffff',
          border: 'none',
          borderRadius: '4px', 
          boxShadow: '0 1px 5px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f4f4'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#666666" width="20px" height="20px">
          <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1c0-.55-.45-1-1-1s-1 .45-1 1v2.06C6.83 3.52 3.52 6.83 3.06 11H1c-.55 0-1 .45-1 1s.45 1 1 1h2.06c.46 4.17 3.77 7.48 7.94 7.94V23c0 .55.45 1 1 1s1-.45 1-1v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23c.55 0 1-.45 1-1s-.45-1-1-1h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
        </svg>
      </button>
    </div>
  );
}

export default function TerminalMap({ cityName, addressText }) {
  const [position, setPosition] = useState([33.448376, -112.074036]);

  useEffect(() => {
    const query = cityName && addressText ? `${addressText}, ${cityName}` : (cityName || "Phoenix");
    
    if (geoCache[query]) {
      setPosition(geoCache[query]);
      return;
    }

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data[0]) {
          const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          geoCache[query] = coords;
          setPosition(coords);
        }
      })
      .catch((err) => console.error("OSM Geocoding Error:", err));
  }, [cityName, addressText]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer 
        center={position} 
        zoom={16} 
        scrollWheelZoom={false}
        zoomControl={false} 
        style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        <MapRefresher center={position} />
        
        <LocationButton center={position} />
        
        <ZoomControl position="bottomright" />
        
        <Marker position={position} icon={googleLikeRedIcon}>
          <Popup>
            <b>{addressText || "Target Terminal"}</b><br />{cityName}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}