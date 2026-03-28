import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Slider, Typography, Stack, IconButton, Tooltip } from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.panTo(center);
        }
    }, [center, map]);
    return null;
};

const MapClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};

const FindLocationHandler = ({ trigger, onFound }) => {
    const map = useMap();
    const triggerRef = useRef(0);

    useEffect(() => {
        if (trigger > 0 && trigger !== triggerRef.current) {
            triggerRef.current = trigger;
            map.locate().on("locationfound", function (e) {
                map.flyTo(e.latlng, 16);
                onFound(e.latlng.lat, e.latlng.lng);
            }).on("locationerror", function (e) {
                console.error("Location error", e.message);
                alert("Location access denied or unavailable.");
            });
        }
    }, [trigger, map, onFound]);

    return null;
};

const CustomCarto = ({ latitude, longitude, radius = 100, onChange }) => {
    const initialLat = Number(latitude) || 0;
    const initialLng = Number(longitude) || 0;

    const [pos, setPos] = useState([initialLat, initialLng]);
    const [val, setVal] = useState(radius);
    const [locateTrigger, setLocateTrigger] = useState(0);

    useEffect(() => {
        const numLat = Number(latitude);
        const numLng = Number(longitude);
        if (numLat !== pos[0] || numLng !== pos[1]) {
            setPos([numLat, numLng]);
        }
    }, [latitude, longitude]);

    useEffect(() => {
        setVal(radius);
    }, [radius]);

    const handleLocationSelect = (lat, lng) => {
        const numLat = Number(lat);
        const numLng = Number(lng);
        setPos([numLat, numLng]);
        if (onChange) {
            onChange({ latitude: numLat, longitude: numLng, radius: val });
        }
    };

    const handleSliderChange = (event, newValue) => {
        setVal(newValue);
        if (onChange) {
            onChange({ latitude: pos[0], longitude: pos[1], radius: newValue });
        }
    };

    const handleFindMe = () => {
        setLocateTrigger(prev => prev + 1);
    };

    const isPosZero = pos[0] === 0 && pos[1] === 0;
    const mapCenter = isPosZero ? [41.0082, 28.9784] : pos; // Default to Istanbul if 0,0

    return (
        <Box sx={{ width: '100%', mb: 2 }}>
            <Box
                sx={{
                    width: '100%',
                    height: 350,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                    position: 'relative',
                    zIndex: 0,
                    mb: 2
                }}
            >
                <MapContainer
                    center={mapCenter}
                    zoom={isPosZero ? 10 : 16}
                    style={{ height: '100%', width: '100%' }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ChangeView center={pos} />
                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                    <FindLocationHandler
                        trigger={locateTrigger}
                        onFound={handleLocationSelect}
                    />

                    <Marker
                        position={pos}
                        draggable={true}
                        eventHandlers={{
                            dragend: (e) => {
                                const marker = e.target;
                                const position = marker.getLatLng();
                                handleLocationSelect(position.lat, position.lng);
                            },
                        }}
                    >
                        <Popup>
                            Selected Location
                        </Popup>
                    </Marker>
                    <Circle
                        center={pos}
                        radius={val}
                        pathOptions={{
                            color: '#1976d2',
                            fillColor: '#1976d2',
                            fillOpacity: 0.2,
                            weight: 2
                        }}
                    />
                </MapContainer>

                <Box sx={{ position: 'absolute', top: 80, left: 10, zIndex: 1000 }}>
                    <Tooltip title="Find My Location" placement="right">
                        <IconButton
                            onClick={handleFindMe}
                            sx={{
                                backgroundColor: '#fff',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                                '&:hover': { backgroundColor: '#f4f4f4' },
                                width: 34,
                                height: 34,
                                borderRadius: '4px',
                                border: '2px solid rgba(0,0,0,0.2)'
                            }}
                        >
                            <MyLocationIcon sx={{ fontSize: 20, color: '#444' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            <Box sx={{ px: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                        Ulanyjylaryň programmany ulanyp biljek radius-ny saýlaň  (m)
                    </Typography>
                    <Typography variant="subtitle2" color="primary" fontWeight={700}>
                        {val} m
                    </Typography>
                </Stack>
                <Slider
                    value={val}
                    min={5}
                    max={1000}
                    step={5}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    sx={{
                        color: '#1976d2',
                        height: 6,
                        '& .MuiSlider-thumb': {
                            width: 18,
                            height: 18,
                            backgroundColor: '#fff',
                            border: '2px solid currentColor',
                            '&:hover': {
                                boxShadow: '0 0 0 8px rgba(25, 118, 210, 0.16)',
                            },
                        },
                        '& .MuiSlider-rail': {
                            opacity: 0.2,
                        },
                    }}
                />
                <Typography variant="h6" color="red" sx={{ display: 'block', mt: 0.5 }}>
                    Markeri syçanjyk bilen saklap öz ofis ýeriňize süýşürip bilersiňiz ýa-da ofis ýeriňize syçanjyk bilen basanyňyzda markeriň özi ofis ýeriňizde bolar!
                </Typography>
            </Box>
        </Box>
    );
};

export default CustomCarto;