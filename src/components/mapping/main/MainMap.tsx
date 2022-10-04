import { MapContainer, TileLayer } from "react-leaflet";
import { Renders } from "./Renders";

export const MainMap = () => {
  return (
    <>
      <MapContainer
        id="map"
        center={[55, -122]}
        zoom={5}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Renders />
      </MapContainer>
    </>
  );
};

export default MainMap;
