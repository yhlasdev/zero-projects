import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box } from '@mui/material';

// Fix for default marker icon issue in Leaflet + React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const CustomCarto = ({ latitude, longitude }) => {
    if (!latitude || !longitude) return null;

    return (
        <Box
            sx={{
                width: '100%',
                height: 300,
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                position: 'relative',
                zIndex: 0
            }}
        >   
            <MapContainer
                center={[latitude, longitude]}
                zoom={16}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[latitude, longitude]}>
                    <Popup>
                        Company Location
                    </Popup>
                </Marker>
            </MapContainer>
        </Box>
    );
}

export default CustomCarto;