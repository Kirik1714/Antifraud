import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';

// 🌟 ШАГ 1: Импортируем стили локально. Webpack сожмет их и уберет Render-blocking варнинг!
import 'leaflet/dist/leaflet.css'; 

// Импортируем наш чистый прицел из UI-кита иконок
import { CrosshairIcon } from '../../../components/ui/Icons';
import styles from './TerminalMap.module.scss';

// Modern Google Maps red pin layout
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
      map.invalidateSize(); // Fixes the half-gray rendering bug inside dynamic UI layout tabs
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
    <div className={styles.customControls}>
      <button
        onClick={handleRecenter}
        title="Find Current Location"
        className={styles.locationBtn}
        aria-label="Recenter map to terminal location" // Повышаем Accessibility для Lighthouse!
      >
        {/* Используем нашу декларативную SVG-иконку вместо сырого инлайна */}
        <CrosshairIcon size={20} className={styles.crosshairColor} />
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
    <div className={styles.mapWrapper}>
      <MapContainer 
        center={position} 
        zoom={16} 
        scrollWheelZoom={false} 
        zoomControl={false}      
        className={styles.leafletContainerHost}
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