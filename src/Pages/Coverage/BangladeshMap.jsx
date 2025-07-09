// src/components/BangladeshMap.jsx
import { useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom component to control map movement
const FlyToLocation = ({ position }) => {
  const map = useMap();
  if (position) map.flyTo(position, 9); // zoom 9
  return null;
};

const BangladeshMap = ({ serviceCenter }) => {
  const [searchText, setSearchText] = useState("");
  const [targetPosition, setTargetPosition] = useState(null);
  const markerRefs = useRef({}); // to open popup programmatically

  const handleSearch = () => {
    const input = searchText.toLowerCase().trim();

    // Step 1: Try partial includes match
    let found = serviceCenter.find((d) =>
      d.district.toLowerCase().includes(input)
    );

    // Step 2: If not found, use Levenshtein match
    if (!found) {
      let closest = null;
      let smallestDistance = Infinity;

      for (const d of serviceCenter) {
        const dist = levenshteinDistance(input, d.district.toLowerCase());
        if (dist < smallestDistance) {
          smallestDistance = dist;
          closest = d;
        }
      }

      if (smallestDistance <= 4) {
        found = closest;
      }
    }

    // Step 3: Fly to marker
    if (found) {
      const pos = [found.latitude, found.longitude];
      setTargetPosition(pos);
      setTimeout(() => {
        markerRefs.current[found.district]?.openPopup();
      }, 800);
    } else {
      alert("District not found");
    }
  };

  return (
    <div className="w-full">
      {/* 🔍 Search Input */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search district..."
          className="border rounded px-4 py-2 w-full max-w-sm"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* 🗺️ Map Display */}
      <div className="w-full h-[500px] rounded-lg shadow-md overflow-hidden">
        <MapContainer
          center={[23.685, 90.3563]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Fly when searched */}
          <FlyToLocation position={targetPosition} />

          {/* All 64 Markers */}
          {serviceCenter.map((district, index) => (
            <Marker
              key={index}
              position={[district.latitude, district.longitude]}
              ref={(ref) => (markerRefs.current[district.district] = ref)}
            >
              <Popup>
                <strong>{district.district}</strong>
                <br />
                <span className="text-sm">Covered Areas:</span>
                <ul className="list-disc ml-4 text-xs mt-1">
                  {district.covered_area.map((area, idx) => (
                    <li key={idx}>{area}</li>
                  ))}
                </ul>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

// 🔧 Utility for spelling mistakes (Levenshtein)
function levenshteinDistance(a, b) {
  const dp = Array(a.length + 1)
    .fill(null)
    .map(() => Array(b.length + 1).fill(0));

  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[a.length][b.length];
}

export default BangladeshMap;
