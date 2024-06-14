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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const greenIcon = L.icon({
  iconUrl:
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Basic_green_dot.png",
  iconSize: [15, 15],
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

const ReviewForm = ({
  restaurantId,
  onSubmitSuccess,
}: {
  restaurantId: number;
  onSubmitSuccess: () => void;
}) => {
  const { toast } = useToast();
  const [rating, setRating] = useState([5]);
  const [storeType, setStoreType] = useState("instore");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/reviews/${restaurantId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: rating[0], storeType }),
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
        onSubmitSuccess();
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
        <div className={`mt-4 ${label.color} text-xs`}>
          {`${label.text} (${rating[0]})`}
        </div>
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
      <div className="flex items-center justify-center mb-4">
        <RadioGroup
          defaultValue="instore"
          onValueChange={setStoreType}
          className="grid grid-cols-2 w-full gap-y-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="instore" id="instore" />
            <Label htmlFor="instore">In Store</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="app" id="app" />
            <Label htmlFor="app">App</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="doordash" id="doordash" />
            <Label htmlFor="doordash">DoorDash</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ubereats" id="ubereats" />
            <Label htmlFor="ubereats">UberEats</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="postmates" id="postmates" />
            <Label htmlFor="postmates">Postmates</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="grubhub" id="grubhub" />
            <Label htmlFor="grubhub">GrubHub</Label>
          </div>
        </RadioGroup>
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
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  const handleReviewSubmitSuccess = () => {
    setSelectedStore(null);
  };

  return (
    <div className="relative">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        style={{ height: "625px", width: "100%" }}
        className="font-mono"
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
                    <h2 className="text-base font-bold font-mono">
                      {location.name}
                    </h2>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xxs text-gray-500 font-mono"
                    >
                      {location.address}
                    </a>
                    <div className="mb-3 font-mono">
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
                    <div className="border-t border-gray-300 pt-3 mt-3 font-mono">
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() =>
                          setSelectedStore(
                            selectedStore === location.restaurantNumber
                              ? null
                              : location.restaurantNumber
                          )
                        }
                      >
                        Rate Your Portion Size!{" "}
                        {selectedStore === location.restaurantNumber
                          ? upArrow({ className: "ml-4 w-4 h-4" })
                          : downArrow({ className: "ml-4 w-4 h-4" })}
                      </Button>
                      {selectedStore === location.restaurantNumber && (
                        <ReviewForm
                          restaurantId={location.restaurantNumber}
                          onSubmitSuccess={handleReviewSubmitSuccess}
                        />
                      )}
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

const downArrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={800}
    height={800}
    viewBox="0 0 330 330"
    {...props}
  >
    <path d="M325.607 79.393c-5.857-5.857-15.355-5.858-21.213.001l-139.39 139.393L25.607 79.393c-5.857-5.857-15.355-5.858-21.213.001-5.858 5.858-5.858 15.355 0 21.213l150.004 150a14.999 14.999 0 0 0 21.212-.001l149.996-150c5.859-5.857 5.859-15.355.001-21.213z" />
  </svg>
);

const upArrow = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={800}
    height={800}
    viewBox="0 0 330 330"
    {...props}
  >
    <path d="m325.606 229.393-150.004-150a14.997 14.997 0 0 0-21.213.001l-149.996 150c-5.858 5.858-5.858 15.355 0 21.213 5.857 5.857 15.355 5.858 21.213 0l139.39-139.393 139.397 139.393A14.953 14.953 0 0 0 315 255a14.95 14.95 0 0 0 10.607-4.394c5.857-5.858 5.857-15.355-.001-21.213z" />
  </svg>
);

export default Map;
