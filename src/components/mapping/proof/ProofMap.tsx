import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Renders } from "./Renders";

export const ProofMap = () => {
  return (
    <MapContainer id="map" center={[55, -122]} zoom={5} zoomControl={false}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Renders />
    </MapContainer>
  );
};

export default ProofMap;
