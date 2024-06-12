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
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Basic_green_dot.png",
  iconSize: [12, 12],
});

const greyIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Location_dot_grey.svg/1200px-Location_dot_grey.svg.png",
  iconSize: [15, 15],
});

const redIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/9/92/Location_dot_red.svg",
  iconSize: [15, 15],
});

const yellowIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/GAudit_YellowDot.png",
  iconSize: [15, 15],
});

const blueIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/3/35/Location_dot_blue.svg",
  iconSize: [15, 15],
});

const currentLocationIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/75/75519.png",
  iconSize: [15, 15],
});

const FlyToHandler = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);

  return null;
};

const LocateButton = ({
  onUpdateLocation,
}: {
  onUpdateLocation: (stores: Store[], lat: number, lng: number) => void;
}) => {
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
      {locateSVG({ className: "w-6 h-6" })}
    </Button>
  );
};

const getLabel = (value: number | undefined) => {
  if (value === undefined || value === 0)
    return { text: "No Rating", color: "text-gray-500", icon: greyIcon };
  if (value <= 3)
    return { text: "Tiny Taco Tragedy", color: "text-red-500", icon: redIcon };
  if (value <= 6)
    return {
      text: "Burrito Blunder",
      color: "text-yellow-500",
      icon: yellowIcon,
    };
  if (value <= 8)
    return {
      text: "Quesadilla Quality",
      color: "text-blue-500",
      icon: blueIcon,
    };
  return {
    text: "Guacamole Greatness",
    color: "text-green-500",
    icon: greenIcon,
  };
};

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
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", width: "100%" }}
    >
      <div>
        <div
          className={`mt-4 ${label.color} text-xs`}
        >{`${label.text} (${rating[0]})`}</div>
        <Slider
          defaultValue={[rating[0]]}
          className="mb-6"
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => setRating(value)}
          style={{ width: "100%", marginTop: "10px" }}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        style={{ width: "100%", marginTop: "10px" }}
      >
        Submit Review
      </Button>
    </form>
  );
};

const Map: React.FC<MapProps> = ({ storeList, lat, lng, onUpdateLocation }) => {
  return (
    <div className="relative">
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
            {storeList.map((location) => {
              const label = getLabel(location.averageRating);
              return (
                <Marker
                  key={location.restaurantNumber}
                  position={[location.latitude, location.longitude]}
                  icon={label.icon}
                >
                  <Popup minWidth={200} maxWidth={300} className="custom-popup">
                    <h2 className="text-base font-bold">{location.name}</h2>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xxs text-gray-500"
                    >
                      {location.address}
                    </a>
                    <div className="mb-3">
                      {location.averageRating ? (
                        <div className={`pt-2 pb-2`}>
                          <div
                            className={`font-semibold text-sm ${label.color}`}
                          >
                            Average Review: {label.text} (
                            {location.averageRating.toFixed(1)})
                          </div>
                          {location.totalRatings ? (
                            <div className="text-gray-400 text-xxs">
                              ({location.totalRatings} review
                              {location.totalRatings !== 1 ? "s" : ""})
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-xxs ">
                          No reviews yet
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-300 pt-3 mt-3">
                      <h3 className="text-sm font-semibold">
                        Rate Your Portion Size!
                      </h3>
                      <ReviewForm restaurantId={location.restaurantNumber} />
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
        <FlyToHandler lat={lat} lng={lng} />
        <LocateButton onUpdateLocation={onUpdateLocation} />
      </MapContainer>
    </div>
  );
};

const locateSVG = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={800}
    height={800}
    viewBox="0 0 24 24"
    fill="white"
    {...props}
  >
    <circle cx={12} cy={12} r={4} />
    <path d="M13 4.069V2h-2v2.069A8.01 8.01 0 0 0 4.069 11H2v2h2.069A8.008 8.008 0 0 0 11 19.931V22h2v-2.069A8.007 8.007 0 0 0 19.931 13H22v-2h-2.069A8.008 8.008 0 0 0 13 4.069zM12 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z" />
  </svg>
);

export default Map;
