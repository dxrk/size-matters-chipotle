import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  greenIcon,
  greyIcon,
  redIcon,
  yellowIcon,
  blueIcon,
} from "@/components/ui/icons";

export const getLabel = (value: number | undefined) => {
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

export const ReviewForm = ({
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
        <div className={`mt-4 ${label.color} text-xs font-mono`}>
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
      <div className="flex items-center justify-center mb-4 font-mono">
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
        className="w-full font-mono"
        style={{ width: "100%", marginTop: "10px" }}
      >
        Submit Review
      </Button>
    </form>
  );
};
