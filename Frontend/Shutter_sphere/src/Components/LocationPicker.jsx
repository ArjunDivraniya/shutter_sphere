import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaCrosshairs } from 'react-icons/fa';

// Fix for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const [position, setPosition] = useState(initialLocation?.lat && initialLocation?.lng ? 
    [initialLocation.lat, initialLocation.lng] : [20.5937, 78.9629]); // Default to India center
  const [search, setSearch] = useState(initialLocation?.city || '');
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    // If no initial location, attempt to get live location
    if (!initialLocation?.lat) {
      handleGetLiveLocation();
    }
  }, []);

  const handleGetLiveLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = [latitude, longitude];
          setPosition(newPos);
          
          // Reverse geocode to get city name
          try {
            const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await resp.json();
            const city = data.address.city || data.address.town || data.address.village || data.address.state_district || "";
            const state = data.address.state || "";
            setSearch(city);
            onLocationSelect({
              lat: latitude,
              lng: longitude,
              city: city,
              state: state
            });
          } catch (error) {
            console.error("Reverse geocoding error", error);
          } finally {
            setIsLocating(false);
          }
        },
        (error) => {
          console.error("Geolocation error", error);
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      map.setView(center, 13);
    }, [center, map]);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
          city: search // Keep existing search text as city unless we reverse geocode
        });
      },
    });

    return position ? <Marker position={position} /> : null;
  };

  const handleSearch = async () => {
    if (!search) return;
    // Mocking Google Places search since we don't have the API key here
    // In a real app, this would call Google Places API
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${search}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newPos = [parseFloat(lat), parseFloat(lon)];
        setPosition(newPos);
        onLocationSelect({
          lat: parseFloat(lat),
          lng: parseFloat(lon),
          city: display_name.split(',')[0],
          state: display_name.split(',')[1]?.trim() || ''
        });
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search city or area..."
            className="w-full px-4 py-2 bg-[#191919] border border-white/10 rounded-lg text-white outline-none focus:border-[#D4A853] pr-10"
          />
          <button
            onClick={handleGetLiveLocation}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:text-[#D4A853] transition-colors ${isLocating ? 'text-[#D4A853] animate-pulse' : 'text-[#756C64]'}`}
            title="Use My Location"
          >
            <FaCrosshairs />
          </button>
        </div>
        <button
          onClick={handleSearch}
          className="px-6 py-2 bg-[#D4A853] text-black font-semibold rounded-lg hover:bg-[#F0C560] transition-colors"
        >
          Search
        </button>
      </div>

      <div className="h-[300px] w-full rounded-xl overflow-hidden border border-white/10">
        <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
          <MapUpdater center={position} />
        </MapContainer>
      </div>
      <p className="text-xs text-[#756C64]">Click on the map to fine-tune the pin location.</p>
    </div>
  );
};

export default LocationPicker;
