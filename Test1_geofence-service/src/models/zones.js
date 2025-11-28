const zones = [
  {
    id: "zone-a",
    name: "Downtown Circle",
    type: "circle",
    center: { lat: 19.0760, lng: 72.8777 },
    radiusMeters: 2000
  },
  {
    id: "zone-b",
    name: "Business District",
    type: "rectangle",
    bounds: {
      minLat: 19.06,
      maxLat: 19.09,
      minLng: 72.86,
      maxLng: 72.89
    }
  },
  {
    id: "zone-c",
    name: "Airport Area",
    type: "circle",
    center: { lat: 19.0896, lng: 72.8656 },
    radiusMeters: 3000
  }
];

export default zones;
