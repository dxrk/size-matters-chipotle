/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

import type { Store } from "@/components/Map";

const Page: React.FC = () => {
  const { toast } = useToast();

  const [storeList, setStoreList] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("New York, NY");
  const [lat, setLat] = useState<number>(40.7128);
  const [lng, setLng] = useState<number>(-74.006);

  const fetchData = async () => {
    if (!searchTerm) {
      return;
    }
    try {
      const res = await fetch(`/api/getLocations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address: searchTerm }),
      });
      if (!res.ok) {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        });
      }

      const data: any = await res.json();

      if (data.stores) {
        setStoreList(data.stores);
      } else {
        toast({
          title: "Error",
          description: "No stores found!",
          variant: "destructive",
        });
      }

      if (data.coords) {
        setLat(data.coords.lat);
        setLng(data.coords.lng);
      } else {
        toast({
          title: "Error",
          description: "No coordinates found!",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    await fetchData();
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await fetchData();
    }
  };

  const handleUpdateLocation = (stores: Store[], lat: number, lng: number) => {
    setStoreList(stores);
    setLat(lat);
    setLng(lng);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex h-screen items-center justify-center select-none">
      <Card className="w-10/12 mx-auto flex flex-col items-center justify-center">
        <CardHeader className="flex items-center justify-center">
          <CardTitle>Size Matters, Chipotle.</CardTitle>
          <h2 className="text-gray-500 text-center">
            Find the nearest Chipotle location based on your current location or
            search for a location.
          </h2>
        </CardHeader>
        <CardContent className="w-full flex flex-col items-center justify-center">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="mb-4 w-3/4 text-center"
          />
          <Button onClick={handleSearch} className="mb-4 w-3/4">
            Search
          </Button>
          <div className="w-full">
            <Map
              storeList={storeList}
              lat={lat}
              lng={lng}
              onUpdateLocation={handleUpdateLocation}
            />
          </div>
        </CardContent>
        <CardFooter>
          <CardDescription className="text-center">
            In the wise words of your CEO,{" "}
            <q>all you got to do is, kinda, like...</q>{" "}
            <i>We all know that is not going to work.</i>{" "}
            <strong>Checkmate.</strong>
          </CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Page;
