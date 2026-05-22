import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layers, Navigation, X, Filter, ZoomIn, ZoomOut } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { formatPrice } from '../lib/formatters';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || '';
const TORONTO_CENTER = [-79.3832, 43.6532];

// Dynamically import mapbox-gl to avoid SSR issues
let mapboxgl;

const PROPERTY_TYPES = ['All', 'Detached', 'Semi-Detached', 'Condo', 'Townhouse'];
const STATUS_OPTIONS  = ['Active', 'Sold'];

function FilterPanel({ filters, onChange, onClose }) {
  return (
    <div className="w-[308px] shrink-0 bg-cream border-r border-cream3 h-full overflow-y-auto flex flex-col">
      <div className="p-5 border-b border-cream3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-green" />
          <span className="font-sans font-medium text-ink text-sm">filters</span>
        </div>
        <button onClick={onClose} className="p-1 text-ink3 hover:text-ink md:hidden">
          <X size={16} />
        </button>
      </div>
      <div className="p-5 space-y-6 flex-1">
        {/* Property type */}
        <div>
          <p className="text-xs uppercase tracking-widest text-ink4 font-sans mb-3">type</p>
          <div className="flex flex-wrap gap-2">
            {PROPERTY_TYPES.map(t => (
              <button
                key={t}
                onClick={() => onChange('type', filters.type === t ? 'All' : t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium transition-all min-h-[36px] ${
                  filters.type === t
                    ? 'bg-green text-white'
                    : 'bg-cream2 text-ink2 hover:bg-cream3'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <p className="text-xs uppercase tracking-widest text-ink4 font-sans mb-3">price range</p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-ink3 font-sans">min</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={e => onChange('minPrice', e.target.value)}
                placeholder="$400,000"
                className="input-base mt-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-ink3 font-sans">max</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={e => onChange('maxPrice', e.target.value)}
                placeholder="$1,500,000"
                className="input-base mt-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Beds */}
        <div>
          <p className="text-xs uppercase tracking-widest text-ink4 font-sans mb-3">min bedrooms</p>
          <div className="flex gap-2">
            {['Any', '1', '2', '3', '4+'].map(b => (
              <button
                key={b}
                onClick={() => onChange('minBeds', b === 'Any' ? '' : b.replace('+', ''))}
                className={`flex-1 py-2 rounded-lg text-xs font-sans font-medium transition-all min-h-[36px] ${
                  (b === 'Any' && !filters.minBeds) || filters.minBeds === b.replace('+', '')
                    ? 'bg-green text-white'
                    : 'bg-cream2 text-ink2 hover:bg-cream3'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <p className="text-xs uppercase tracking-widest text-ink4 font-sans mb-3">status</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map(s => (
              <button
                key={s}
                onClick={() => onChange('status', s === 'Active' ? 'A' : 'U')}
                className={`flex-1 py-2 rounded-lg text-xs font-sans font-medium transition-all min-h-[36px] ${
                  (s === 'Active' && filters.status === 'A') || (s === 'Sold' && filters.status === 'U')
                    ? 'bg-green text-white'
                    : 'bg-cream2 text-ink2 hover:bg-cream3'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ListingDrawer({ listings, onClose }) {
  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="absolute bottom-0 left-0 right-0 bg-cream rounded-t-2xl shadow-2xl z-20 max-h-[60vh] overflow-y-auto"
    >
      <div className="sticky top-0 bg-cream px-4 py-3 border-b border-cream3 flex items-center justify-between">
        <p className="font-sans text-sm font-medium text-ink">{listings.length} properties here</p>
        <button onClick={onClose} className="p-1 text-ink3 hover:text-ink min-h-[36px] min-w-[36px] flex items-center justify-center">
          <X size={16} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {listings.slice(0, 6).map((l, i) => {
          const addr = l.address || `${l.streetNumber || ''} ${l.streetName || ''}`;
          return (
            <Link
              key={l.mlsNumber || i}
              to={`/property/${l.mlsNumber || l.id || i}`}
              className="bg-white rounded-xl border border-cream3 p-3 hover:border-green transition-all"
            >
              <p className="font-serif text-lg text-ink">{formatPrice(l.listPrice)}</p>
              <p className="text-xs text-ink2 font-sans truncate">{addr}</p>
              <p className="text-[10px] text-ink4 font-sans mt-1">
                {l.numBedrooms}bd · {l.numBathrooms}ba
              </p>
            </Link>
          );
        })}
        <Link
          to="/chat"
          className="bg-greenl border border-greenm rounded-xl p-3 flex items-center justify-center text-center"
        >
          <p className="text-sm text-green font-sans font-medium">ask about these →</p>
        </Link>
      </div>
    </motion.div>
  );
}

export default function MapPage() {
  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [drawerListings, setDrawerListings] = useState(null);
  const [zoom, setZoom] = useState(11);
  const [filters, setFilters] = useState({
    type: 'All', minPrice: '', maxPrice: '', minBeds: '', status: 'A',
  });
  const { searchByBounds, loading } = useListings();

  const filterChange = (key, value) => setFilters(f => ({ ...f, [key]: value }));

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
  };

  const addListingMarkers = useCallback((listings, map) => {
    clearMarkers();
    listings.forEach(l => {
      const lat = l.latitude  || l.lat;
      const lng = l.longitude || l.lng;
      if (!lat || !lng) return;

      const el = document.createElement('div');
      el.className = 'map-pin';
      el.style.cssText = `
        background: white; border: 1.5px solid #E1D9C8; border-radius: 8px;
        padding: 3px 8px; font-family: 'DM Sans', sans-serif; font-size: 11px;
        font-weight: 500; color: #18181A; cursor: none; white-space: nowrap;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: all 0.15s;
      `;
      const price = l.listPrice;
      el.textContent = price >= 1e6
        ? `$${(price / 1e6).toFixed(1)}M`
        : `$${(price / 1000).toFixed(0)}K`;

      el.addEventListener('mouseenter', () => {
        el.style.background = '#2A7A55';
        el.style.color = 'white';
        el.style.borderColor = '#2A7A55';
      });
      el.addEventListener('mouseleave', () => {
        el.style.background = 'white';
        el.style.color = '#18181A';
        el.style.borderColor = '#E1D9C8';
      });
      el.addEventListener('click', () => {
        setDrawerListings([l]);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, []);

  const addClusterMarkers = useCallback((clusters, map) => {
    clearMarkers();
    clusters.forEach(c => {
      const lat = c.latitude  || c.lat || c.coordinate?.latitude;
      const lng = c.longitude || c.lng || c.coordinate?.longitude;
      if (!lat || !lng) return;

      const el = document.createElement('div');
      el.style.cssText = `
        width: 40px; height: 40px; background: #2A7A55; border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
        color: white; cursor: none; box-shadow: 0 3px 10px rgba(42,122,85,0.35);
      `;
      el.textContent = c.count || '•';
      el.addEventListener('click', () => {
        map.flyTo({ center: [lng, lat], zoom: map.getZoom() + 2 });
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([lng, lat])
        .addTo(map);
      markersRef.current.push(marker);
    });
  }, []);

  const loadMapData = useCallback(async (map) => {
    const bounds = map.getBounds();
    const currentZoom = map.getZoom();
    const data = await searchByBounds(
      { north: bounds.getNorth(), south: bounds.getSouth(), east: bounds.getEast(), west: bounds.getWest() },
      currentZoom
    );
    if (!data) return;
    if (currentZoom < 12 && data.clusters?.length > 0) {
      addClusterMarkers(data.clusters, map);
    } else {
      addListingMarkers(data.listings || [], map);
    }
  }, [searchByBounds, addClusterMarkers, addListingMarkers]);

  useEffect(() => {
    if (!MAPBOX_TOKEN) return;

    import('mapbox-gl').then(mod => {
      mapboxgl = mod.default;
      import('mapbox-gl/dist/mapbox-gl.css').catch(() => {});

      if (mapRef.current) return;
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: TORONTO_CENTER,
        zoom: 11,
      });

      map.on('load', () => {
        setMapLoaded(true);
        mapRef.current = map;
        loadMapData(map);
      });

      map.on('moveend', () => {
        setZoom(Math.round(map.getZoom()));
        loadMapData(map);
      });

      map.on('zoomend', () => {
        setZoom(Math.round(map.getZoom()));
      });
    }).catch(console.error);

    return () => {
      clearMarkers();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-load when filters change
  useEffect(() => {
    if (mapRef.current && mapLoaded) loadMapData(mapRef.current);
  }, [filters, mapLoaded]);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden relative bg-cream">
      {/* Filter panel - desktop */}
      <div className={`hidden md:flex flex-col border-r border-cream3 transition-all duration-300 ${showFilters ? 'w-[308px]' : 'w-0 overflow-hidden'}`}>
        {showFilters && (
          <FilterPanel filters={filters} onChange={filterChange} onClose={() => setShowFilters(false)} />
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {/* No token warning */}
        {!MAPBOX_TOKEN && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream2 z-10">
            <div className="text-center max-w-sm px-6">
              <p className="font-serif text-2xl text-ink mb-2">Map unavailable</p>
              <p className="text-sm text-ink3 font-sans">Add VITE_MAPBOX_TOKEN to enable the interactive map.</p>
            </div>
          </div>
        )}

        <div ref={mapContainer} className="w-full h-full" />

        {/* Floating controls */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-sans font-medium shadow-md transition-all min-h-[44px] ${
              showFilters ? 'bg-green text-white' : 'bg-white text-ink border border-cream3'
            }`}
          >
            <Filter size={14} />
            filters
          </button>
        </div>

        {/* Zoom controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-1 z-10">
          <button
            onClick={() => mapRef.current?.zoomIn()}
            className="w-11 h-11 bg-white rounded-xl border border-cream3 shadow-sm flex items-center justify-center text-ink2 hover:border-green transition-all"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={() => mapRef.current?.zoomOut()}
            className="w-11 h-11 bg-white rounded-xl border border-cream3 shadow-sm flex items-center justify-center text-ink2 hover:border-green transition-all"
          >
            <ZoomOut size={16} />
          </button>
          <button
            onClick={() => mapRef.current?.flyTo({ center: TORONTO_CENTER, zoom: 11 })}
            className="w-11 h-11 bg-white rounded-xl border border-cream3 shadow-sm flex items-center justify-center text-ink2 hover:border-green transition-all"
          >
            <Navigation size={16} />
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-2 shadow-md flex items-center gap-2 z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-3 h-3 border-2 border-cream3 border-t-green rounded-full"
            />
            <span className="text-xs font-sans text-ink2">loading properties...</span>
          </div>
        )}

        {/* "Describe what you want" pill */}
        <Link
          to="/chat"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-ink text-white px-5 py-3 rounded-full text-sm font-sans shadow-lg hover:bg-ink2 transition-colors z-10 whitespace-nowrap"
        >
          Describe what you want → ask in chat
        </Link>

        {/* Listing drawer */}
        <AnimatePresence>
          {drawerListings && (
            <ListingDrawer
              listings={drawerListings}
              onClose={() => setDrawerListings(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
