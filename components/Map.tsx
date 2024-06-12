/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
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
    "https://icon2.cleanpng.com/20180411/pre/kisspng-visual-perception-optical-illusion-eye-color-circle-5acdca5077ff26.9533774115234361124915.jpg",
  iconSize: [15, 15],
});

const yellowIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/GAudit_YellowDot.png",
  iconSize: [15, 15],
});

const currentLocationIcon = L.icon({
  iconUrl:
    "https://e7.pngegg.com/pngimages/640/178/png-clipart-x-mark-computer-icons-desktop-cerca-cross-desktop-wallpaper-thumbnail.png",
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
          } catch (error: Error | any) {
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
      }

      toast({
        title: "Success",
        description: "Review submitted successfully!",
        variant: "default",
      });
    } catch (error: Error | any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Slider
          className="mt-4"
          min={1}
          max={10}
          step={1}
          defaultValue={rating}
          onValueChange={(i) => setRating(i)}
        />
      </div>
      <Button type="submit" className="mt-6 w-full">
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
              icon={
                location.averageRating === 0
                  ? greyIcon
                  : location.averageRating && location.averageRating < 3
                  ? redIcon
                  : location.averageRating &&
                    location.averageRating >= 3 &&
                    location.averageRating <= 7
                  ? yellowIcon
                  : greenIcon
              }
            >
              <Popup>
                <h2 className="text-lg font-bold">{location.name}</h2>
                <p className="text-sm text-gray-500">{location.address}</p>
                <div className="mb-3">
                  {location.averageRating ? (
                    <p
                      className={
                        "font-semibold text-base " +
                        (Number(location.averageRating) < 3
                          ? "text-red-500"
                          : location.averageRating >= 3 &&
                            location.averageRating <= 7
                          ? "text-yellow-500"
                          : "text-green-500")
                      }
                    >
                      Average Review: {location.averageRating.toFixed(1)}{" "}
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
          ))}
        </>
      )}
      <FlyToHandler lat={lat} lng={lng} />
      <LocateButton onUpdateLocation={onUpdateLocation} />
    </MapContainer>
  );
};

export default Map;
