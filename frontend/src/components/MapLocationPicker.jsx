import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Navigation, Loader } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function MapController({ center, shouldCenter }) {
  const map = useMap();

  useEffect(() => {
    if (center && shouldCenter) {
      map.setView(center, 15);
    }
  }, [center, shouldCenter, map]);

  return null;
}

function MapLocationPicker({ location, onChange, height = '300px' }) {
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState([5.6037, -0.1870]); // Default to Accra, Ghana
  const [shouldCenter, setShouldCenter] = useState(false); // Only center when explicitly requested
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize position from location prop only once on mount
  useEffect(() => {
    if (!isInitialized) {
      if (location?.latitude && location?.longitude) {
        const pos = { lat: location.latitude, lng: location.longitude };
        setPosition(pos);
        setCenter([location.latitude, location.longitude]);
        setShouldCenter(true);
        setTimeout(() => setShouldCenter(false), 100);
      } else {
        // Try to get user's current location on initial load only
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const userLocation = [pos.coords.latitude, pos.coords.longitude];
              setCenter(userLocation);
              setShouldCenter(true);
              setTimeout(() => setShouldCenter(false), 100);
            },
            (error) => {
              console.log('Geolocation error:', error);
            }
          );
        }
      }
      setIsInitialized(true);
    }
  }, [location, isInitialized]);

  // Call onChange when position changes (but don't respond to location prop changes)
  useEffect(() => {
    if (position && onChange && isInitialized) {
      onChange({
        latitude: position.lat,
        longitude: position.lng,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, isInitialized]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    // Force fresh location (no cache) with high accuracy
    const options = {
      enableHighAccuracy: true,
      timeout: 30000, // 30 seconds for high accuracy
      maximumAge: 0, // Always get fresh location, no cache
    };

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const accuracyInMeters = Math.round(pos.coords.accuracy);
        setLocationAccuracy(accuracyInMeters);

        // If accuracy is very poor (> 5000m = 5km), warn user instead of setting position
        if (accuracyInMeters > 5000) {
          setLocationError(
            `Location accuracy too low (±${accuracyInMeters}m). Please click on the map to select your location manually.`
          );
          setCenter([pos.coords.latitude, pos.coords.longitude]);
          setShouldCenter(true);
          setTimeout(() => setShouldCenter(false), 100);
          setIsLocating(false);
          return;
        }

        const newPosition = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setPosition(newPosition);
        setCenter([pos.coords.latitude, pos.coords.longitude]);
        setShouldCenter(true);
        setTimeout(() => setShouldCenter(false), 100);

        setIsLocating(false);
      },
      (error) => {
        // If high accuracy fails, try again with lower accuracy but still fresh
        if (error.code === error.TIMEOUT) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const accuracyInMeters = Math.round(pos.coords.accuracy);
              setLocationAccuracy(accuracyInMeters);

              // If accuracy is very poor, warn user
              if (accuracyInMeters > 5000) {
                setLocationError(
                  `Location accuracy too low (±${accuracyInMeters}m). Please click on the map to select your location manually.`
                );
                setCenter([pos.coords.latitude, pos.coords.longitude]);
                setShouldCenter(true);
                setTimeout(() => setShouldCenter(false), 100);
                setIsLocating(false);
                return;
              }

              const newPosition = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };
              setPosition(newPosition);
              setCenter([pos.coords.latitude, pos.coords.longitude]);
              setShouldCenter(true);
              setTimeout(() => setShouldCenter(false), 100);

              setIsLocating(false);
            },
            (fallbackError) => {
              setIsLocating(false);
              switch (fallbackError.code) {
                case fallbackError.PERMISSION_DENIED:
                  setLocationError('Location access denied. Please enable location permissions in your browser settings.');
                  break;
                case fallbackError.POSITION_UNAVAILABLE:
                  setLocationError('Location information unavailable. Please check your device location settings.');
                  break;
                case fallbackError.TIMEOUT:
                  setLocationError('Location request timed out. Please try again or click on the map to select a location manually.');
                  break;
                default:
                  setLocationError('Unable to get your location. Please select it manually on the map.');
              }
            },
            {
              enableHighAccuracy: false, // Lower accuracy for fallback
              timeout: 20000,
              maximumAge: 0, // Still get fresh location
            }
          );
        } else {
          setIsLocating(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError('Location access denied. Please enable location permissions in your browser settings.');
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Location information unavailable. Please check your device location settings.');
              break;
            default:
              setLocationError('Unable to get your location. Please select it manually on the map.');
          }
        }
      },
      options
    );
  };

  return (
    <div className="relative" style={{ height }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
      >
        {/* Google Satellite Hybrid - Shows satellite imagery with labels */}
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
          maxZoom={20}
        />
        <LocationMarker position={position} setPosition={setPosition} />
        <MapController center={center} shouldCenter={shouldCenter} />
      </MapContainer>

      {/* Use Current Location Button */}
      <button
        type="button"
        onClick={handleGetCurrentLocation}
        disabled={isLocating}
        className="absolute top-2 right-2 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all z-[1000] flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-slate-200 hover:border-red-500"
        title="Use my current location"
      >
        {isLocating ? (
          <Loader className="text-red-500 animate-spin" size={18} />
        ) : (
          <Navigation className="text-red-500" size={18} />
        )}
        <span className="text-sm font-semibold text-slate-700">
          {isLocating ? 'Locating...' : 'Use My Location'}
        </span>
      </button>

      {/* Selected Location Info */}
      {position && !locationError && (
        <div className={`absolute bottom-2 left-2 right-2 bg-white px-3 py-2 rounded-lg shadow-md text-xs z-[1000] border-2 ${
          locationAccuracy && locationAccuracy > 1000 ? 'border-amber-200' : 'border-green-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className={`font-semibold ${
                locationAccuracy && locationAccuracy > 1000 ? 'text-amber-700' : 'text-green-700'
              }`}>
                Location Selected
              </div>
              <div className="text-gray-600">
                {position.lat.toFixed(4)}°, {position.lng.toFixed(4)}°
              </div>
              {locationAccuracy && (
                <div className={`text-xs mt-1 ${
                  locationAccuracy > 1000 ? 'text-amber-600' : 'text-green-600'
                }`}>
                  Accuracy: ±{locationAccuracy}m
                  {locationAccuracy > 1000 && ' (Low - Please verify on map)'}
                </div>
              )}
            </div>
            <div className={locationAccuracy && locationAccuracy > 1000 ? 'text-amber-500' : 'text-green-500'}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {locationError && (
        <div className="absolute bottom-2 left-2 right-2 bg-red-50 px-3 py-2 rounded-lg shadow-md text-xs z-[1000] border-2 border-red-200">
          <div className="font-semibold text-red-700 mb-1">Location Error</div>
          <div className="text-red-600">{locationError}</div>
        </div>
      )}
    </div>
  );
}

export default MapLocationPicker;
