/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";

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
  iconSize: [12, 12],
});

const currentLocationIcon = L.icon({
  iconUrl:
    "https://e7.pngegg.com/pngimages/640/178/png-clipart-x-mark-computer-icons-desktop-cerca-cross-desktop-wallpaper-thumbnail.png",
  iconSize: [14, 14],
});

const FlyToHandler = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 13); // Use flyTo for smooth animation
  }, [lat, lng, map]);

  return null;
};

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
          map.flyTo([latitude, longitude], 13); // Use flyTo for smooth animation

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
            L.marker([latitude, longitude], { icon: currentLocationIcon })
              .addTo(map)
              .bindPopup("You are here");
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

const ReviewForm = ({ restaurantId }: { restaurantId: number }) => {
  const [rating, setRating] = useState<number>(5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/reviews/${restaurantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      alert("Review submitted successfully!");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rating
        </label>
        <Slider
          min={1}
          max={10}
          step={1}
          onChange={(value) => setRating(value)}
        />
      </div>
      <div className="mt-4"></div>
      <Button type="submit" className="mt-4 w-full">
        Submit Review
      </Button>
    </form>
  );
};

const Map: React.FC<MapProps> = ({ storeList, lat, lng, onUpdateLocation }) => {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
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
                <div>
                  <h2 className="text-lg font-semibold">{location.name}</h2>
                  <p>{location.address}</p>
                  <ReviewForm restaurantId={location.restaurantNumber} />
                </div>
              </Popup>
            </Marker>
          ))}
        </>
      )}
      <FlyToHandler lat={lat} lng={lng} />
      <LocateButton onUpdateLocation={onUpdateLocation} />
    </MapContainer>
  );
};

export default Map;
