import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import type { Store } from "@/lib/models";
import { MapProps } from "@/lib/models";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { isMobile } from "react-device-detect";
import { Separator } from "@/components/ui/separator";
import { DownArrow, UpArrow } from "@/components/ui/icons";
import { LocateButton } from "@/components/LocateButton";
import { ReviewForm } from "@/components/ReviewForm";
import { getLabel } from "@/components/ReviewForm";

const FlyToHandler = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([lat, lng], 13);
  }, [lat, lng, map]);

  return null;
};

const HandleDragEnd = (e: any, onUpdateLocation: Function) => {
  const lat = e.target.getLatLng().lat;
  const lng = e.target.getLatLng().lng;
  onUpdateLocation(lat, lng);
};

const Map: React.FC<MapProps> = ({ storeList, lat, lng, onUpdateLocation }) => {
  const [selectedStore, setSelectedStore] = useState<number | null>(null);

  const handleReviewSubmitSuccess = () => {
    setSelectedStore(null);
  };

  const renderPopupOrDrawer = (location: Store) => {
    if (isMobile)
      return (
        <Drawer
          open={selectedStore === location.restaurantNumber}
          onOpenChange={(open) =>
            setSelectedStore(open ? location.restaurantNumber : null)
          }
        >
          <DrawerContent className="z-[1500] pl-6 pr-6 font-mono">
            <DrawerHeader>
              <DrawerTitle>{location.name}</DrawerTitle>
              <DrawerDescription>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 font-mono"
                >
                  {location.address}
                </a>
              </DrawerDescription>
              <DrawerClose />
            </DrawerHeader>
            <ReviewForm
              restaurantId={location.restaurantNumber}
              onSubmitSuccess={handleReviewSubmitSuccess}
            />
            <Button
              variant="outline"
              onClick={() => setSelectedStore(null)}
              className="w-full mt-2 mb-4"
            >
              Close
            </Button>
          </DrawerContent>
        </Drawer>
      );
  };

  return (
    <div className="relative font-mono">
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
                    <div className="mb-2 font-mono">
                      {location.averageRating ? (
                        <div className={`pt-2 pb-2`}>
                          <div
                            className={`font-semibold text-sm ${label.color}`}
                          >
                            Average: {label.text} (
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
                        <div className="text-gray-500 text-xxs">
                          No reviews yet
                        </div>
                      )}
                    </div>
                    <Separator />
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
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
                        ? UpArrow({ className: "ml-4 w-4 h-4" })
                        : DownArrow({ className: "ml-4 w-4 h-4" })}
                    </Button>
                    {!isMobile &&
                      selectedStore === location.restaurantNumber && (
                        <ReviewForm
                          restaurantId={location.restaurantNumber}
                          onSubmitSuccess={handleReviewSubmitSuccess}
                        />
                      )}
                  </Popup>
                  {selectedStore === location.restaurantNumber &&
                    renderPopupOrDrawer(location)}
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

export default Map;
