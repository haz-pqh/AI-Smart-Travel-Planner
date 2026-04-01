import { motion } from "motion/react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { TripPlan } from "../services/gemini";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet
const markerIcon = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const markerShadow = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapDisplayProps {
  plan: TripPlan;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export function MapDisplay({ plan }: MapDisplayProps) {
  const allItems = plan.itinerary.flatMap((day) => day.items);
  const points = allItems.map((item) => [item.lat, item.lng] as [number, number]);
  
  if (points.length === 0) return null;

  const center = points[0];

  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden glass-card border-white/10">
      <MapContainer
        center={center}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {allItems.map((item, idx) => (
          <Marker key={idx} position={[item.lat, item.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="font-bold text-blue-600">{item.location}</h3>
                <p className="text-sm text-gray-600">{item.activity}</p>
                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
              </div>
            </Popup>
          </Marker>
        ))}
        <Polyline positions={points} color="#3b82f6" weight={3} opacity={0.6} dashArray="10, 10" />
        <ChangeView center={center} />
      </MapContainer>
    </div>
  );
}
