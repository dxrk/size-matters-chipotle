/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { fetchStoreData } from "@/lib/utils";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

import type { Store } from "@/lib/models";

const Page: React.FC = () => {
  const { toast } = useToast();

  const [storeList, setStoreList] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("New York, NY");
  const [lat, setLat] = useState<number>(40.7128);
  const [lng, setLng] = useState<number>(-74.006);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchStoreData(searchTerm);
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
    <div className="md:container select-none font-mono flex items-center justify-center min-h-screen pt-16 pb-16">
      <Card className="w-11/12 md:w-10/12 mx-auto flex flex-col items-center justify-center h-fit">
        <Header />
        <CardContent className="w-full flex flex-col items-center justify-center">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="mb-4 w-3/4 text-center"
            disabled={loading}
          />
          <Button
            onClick={handleSearch}
            className="mb-4 w-3/4"
            disabled={loading}
          >
            {loading ? "Loading..." : "Search"}
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
        <Footer />
      </Card>
    </div>
  );
};

export default Page;
