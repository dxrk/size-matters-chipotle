/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider"; // Correct import
import { useToast } from "@/components/ui/use-toast";
import type { Store } from "@/lib/models";
import { MapProps } from "@/lib/models";

const greenIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Basic_green_dot.png",
  iconSize: [12, 12],
});

const greyIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Location_dot_grey.svg/1200px-Location_dot_grey.svg.png",
  iconSize: [15, 15],
});

const redIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg",
  iconSize: [15, 15],
});

const yellowIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/GAudit_YellowDot.png",
  iconSize: [15, 15],
});

const blueIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/3/35/Location_dot_blue.svg",
  iconSize: [15, 15],
});

const currentLocationIcon = L.icon({
  iconUrl: "https://e7.pngegg.com/pngimages/640/178/png-clipart-x-mark-computer-icons-desktop-cerca-cross-desktop-wallpaper-thumbnail.png",
  iconSize: [15, 15],
});

const FlyToHandler = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);

  return null;
};

const LocateButton = ({ onUpdateLocation }: { onUpdateLocation: (stores: Store[], lat: number, lng: number) => void }) => {
  const map = useMap();
  const { toast } = useToast();

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          map.flyTo([latitude, longitude], 13);

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
          } catch (error: any) {
            toast({
              title: "Error",
              description: error.message,
              variant: "destructive",
            });
          }
        },
        () => {
          toast({
            title: "Error",
            description: "Failed to get current location",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Error",
        description: "Geolocation is not supported by this browser",
        variant: "destructive",
      });
    }
  };

  return (
    <Button onClick={handleClick} className="absolute top-4 right-4 z-[1000]">
      Current Location
    </Button>
  );
};

const getLabel = (value: number | undefined) => {
  if (value === undefined || value === 0) return { text: 'No Rating', color: 'text-gray-500', icon: greyIcon }
  if (value <= 3) return { text: 'Tiny Taco Tragedy', color: 'text-red-500', icon: redIcon }
  if (value <= 6) return { text: 'Burrito Blunder', color: 'text-yellow-500', icon: yellowIcon }
  if (value <= 8) return { text: 'Quesadilla Quality', color: 'text-blue-500', icon: blueIcon }
  return { text: 'Guacamole Greatness', color: 'text-green-500', icon: greenIcon }
}

const ReviewForm = ({ restaurantId }: { restaurantId: number }) => {
  const { toast } = useToast();
  const [rating, setRating] = useState([2]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/reviews/${restaurantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: rating[0] }),
      });

      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to submit review",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Review submitted successfully!",
          variant: "default",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const label = getLabel(rating[0]);

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <div>
        <div className={`mt-4 ${label.color}`} style={{ fontSize: '14px' }}>{`${label.text} (${rating[0]})`}</div>
        <Slider
          className="mt-4"
          defaultValue={[rating[0]]}
          max={10}
          step={1}
          onValueChange={(value) => setRating(value)}
          style={{ width: '100%', marginTop: '10px' }}
        />
      </div>
      <Button type="submit" className="mt-6 w-full" style={{ width: '100%', marginTop: '10px' }}>
        Submit Review
      </Button>
    </form>
  );
};

const Map: React.FC<MapProps> = ({ storeList, lat, lng, onUpdateLocation }) => {
  return (
    <div className="relative">
      <MapContainer center={[lat, lng]} zoom={13} style={{ height: "500px", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors &copy; <a href='https://carto.com/attributions'>CARTO</a>"
        />

        {storeList.length > 0 && (
          <>
            {storeList.map((location) => {
              const label = getLabel(location.averageRating)
              return (
                <Marker
                  key={location.restaurantNumber}
                  position={[location.latitude, location.longitude]}
                  icon={label.icon}
                >
                  <Popup minWidth={200} maxWidth={300} className="custom-popup">
                    <h2 className="text-lg font-bold">{location.name}</h2>
                    <p className="text-sm text-gray-500">{location.address}</p>
                    <div className="mb-3">
                      {location.averageRating ? (
                        <p className={`font-semibold text-base ${label.color}`} style={{ fontSize: '14px' }}>
                          Average Review: {label.text} ({location.averageRating.toFixed(1)}){" "}
                          {location.totalRatings ? (
                            <div className="text-gray-400 text-xs">
                              ({location.totalRatings} review
                              {location.totalRatings !== 1 ? "s" : ""})
                            </div>
                          ) : null}
                        </p>
                      ) : (
                        <p className="text-gray-500">No reviews yet</p>
                      )}
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <h3 className="text-md font-semibold mb-2">Add a Review</h3>
                      <ReviewForm restaurantId={location.restaurantNumber} />
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </>
        )}
        <FlyToHandler lat={lat} lng={lng} />
        <LocateButton onUpdateLocation={onUpdateLocation} />
      </MapContainer>
    </div>
  );
};

export default Map;
