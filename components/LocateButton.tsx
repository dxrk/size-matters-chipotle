import { useMap } from "react-leaflet";
import L from "leaflet";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import type { Store } from "@/lib/models";
import { LocateSVG, currentLocationIcon } from "@/components/ui/icons";

export const LocateButton = ({
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
    <Button onClick={handleClick} className="absolute top-4 right-4 z-[800]">
      {LocateSVG({ className: "w-6 h-6" })}
    </Button>
  );
};
