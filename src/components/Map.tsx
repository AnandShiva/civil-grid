import { useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import type { LatLngTuple, LatLngExpression } from 'leaflet';
import type { SelectedFeature } from '../types';
import L from 'leaflet';

const LA_CENTER: LatLngTuple = [34.0522, -118.2437];

interface MapViewProps {
    chargers: any[];
    projects: any[];
    selectedFeature: SelectedFeature | null;
    onSelectFeature: (feature: SelectedFeature | null) => void;
}

// Component to handle map movements
function MapController({ selectedFeature, projects, chargers }: { selectedFeature: SelectedFeature | null, projects: any[], chargers: any[] }) {
    const map = useMap();

    useEffect(() => {
        if (selectedFeature) {
            // Find the feature geometry to fly to
            let feature;
            if (selectedFeature.type === 'project') {
                feature = projects.find((p: any) => p.properties.OBJECTID === selectedFeature.properties.OBJECTID);
            } else {
                feature = chargers.find((c: any) => c.properties.OBJECTID === selectedFeature.properties.OBJECTID);
            }

            if (feature) {
                const geoJsonLayer = L.geoJSON(feature);
                const bounds = geoJsonLayer.getBounds();
                if (bounds.isValid()) {
                    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
                } else if (feature.geometry.type === 'Point') {
                    // For points, bounds might be 0 size, or use coordinates directly
                    const [lon, lat] = feature.geometry.coordinates;
                    map.flyTo([lat, lon], 16);
                }
            }
        }
    }, [selectedFeature, map, projects, chargers]);

    return null;
}

export default function MapView({ chargers, projects, selectedFeature, onSelectFeature }: MapViewProps) {

    const chargerStyle = {
        radius: 4,
        fillColor: "#10b981", // green-500
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    const projectStyle = {
        color: "#3b82f6", // blue-500
        weight: 2,
        opacity: 0.6,
        fillOpacity: 0.2
    };

    const onEachCharger = (feature: any, layer: any) => {
        layer.on({
            click: (e: any) => {
                // Prevent map click properly if needed, but here simple selection
                onSelectFeature({ type: 'charger', properties: feature.properties });
                e.originalEvent.stopPropagation();
            }
        });
    };

    const onEachProject = (feature: any, layer: any) => {
        layer.on({
            click: (e: any) => {
                onSelectFeature({ type: 'project', properties: feature.properties });
                e.originalEvent.stopPropagation();
            }
        });
    };

    const pointToLayer = (_feature: any, latlng: LatLngExpression) => {
        return L.circleMarker(latlng, chargerStyle);
    };

    return (
        <MapContainer
            center={LA_CENTER}
            zoom={11}
            className="h-full w-full outline-none"
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <MapController selectedFeature={selectedFeature} projects={projects} chargers={chargers} />
            <GeoJSON
                key="projects"
                data={projects as any}
                style={projectStyle}
                onEachFeature={onEachProject}
            />
            <GeoJSON
                key="chargers"
                data={chargers as any}
                pointToLayer={pointToLayer}
                onEachFeature={onEachCharger}
            />
        </MapContainer>
    );
}
