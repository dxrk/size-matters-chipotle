/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

export type Store = {
  restaurantNumber: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
};

interface MapProps {
  storeList: Store[];
  lat: number;
  lng: number;
  onUpdateLocation: (stores: Store[], lat: number, lng: number) => void;
}

// Define the custom green icon
const greenIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Basic_green_dot.png",
  iconSize: [8, 8],
});

const LocateButton = ({
  onUpdateLocation,
}: {
  onUpdateLocation: (stores: Store[], lat: number, lng: number) => void;
}) => {
  const map = useMap();

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);

          try {
            const res = await fetch("/api/getLocations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ lat: latitude, lng: longitude }),
            });

            if (!res.ok) {
              throw new Error("Failed to fetch data");
            }

            const data = await res.json();
            onUpdateLocation(data.stores, data.coords.lat, data.coords.lng);
            L.marker([latitude, longitude], { icon: greenIcon })
              .addTo(map)
              .bindPopup("You are here")
              .openPopup();
          } catch (error) {
            alert(error);
          }
        },
        () => {
          alert("Could not find your location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser");
    }
  };

  useEffect(() => {
    const LocateControl = L.Control.extend({
      onAdd: () => {
        const button = L.DomUtil.create(
          "button",
          "leaflet-bar leaflet-control leaflet-control-custom"
        );
        button.innerHTML = "📍";
        button.title = "Find Current Location";
        button.style.backgroundColor = "white";
        button.style.width = "40px";
        button.style.height = "40px";

        L.DomEvent.on(button, "click", handleClick);

        return button;
      },
    });

    const locateControl = new LocateControl({ position: "topright" });

    locateControl.addTo(map);

    return () => {
      locateControl.remove();
    };
  }, [handleClick, map]);

  return null;
};

const Map: React.FC<MapProps> = ({ storeList, lat, lng, onUpdateLocation }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
      />

      {storeList.length > 0 && (
        <>
          {storeList.map((location) => (
            <Marker
              key={location.restaurantNumber}
              position={[location.latitude, location.longitude]}
              icon={greenIcon}
            >
              <Popup>
                <strong>{location.name}</strong>
                <br />
                {location.address}
              </Popup>
            </Marker>
          ))}
        </>
      )}
      <LocateButton onUpdateLocation={onUpdateLocation} />
    </MapContainer>
  );
};

export default Map;
