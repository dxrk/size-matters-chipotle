import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getCoords } from "@/utils/getCoords";

export async function POST(req: NextRequest) {
  try {
    const { address, lat, lng } = await req.json();

    let coords;
    if (address) {
      coords = await getCoords(address);
      if (coords.length === 0) {
        return NextResponse.json({ error: "Address not found", status: 404 });
      }
    } else if (lat && lng) {
      coords = { lat, lng };
    } else {
      return NextResponse.json({
        error: "Address or coordinates must be provided",
        status: 400,
      });
    }

    const response = await axios({
      url: "https://services.chipotle.com/restaurant/v3/restaurant",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": "b4d9f36380184a3788857063bce25d6a",
      },
      data: {
        latitude: coords.lat,
        longitude: coords.lng,
        radius: 100000,
        restaurantStatuses: ["OPEN", "LAB"],
        conceptIds: ["CMG"],
        orderBy: "distance",
        orderByDescending: false,
        pageSize: 1000,
        pageIndex: 0,
        embeds: {
          addressTypes: ["MAIN"],
        },
      },
    });

    const stores = response.data.data.map((restaurant: any) => ({
      restaurantNumber: restaurant.restaurantNumber,
      name: restaurant.restaurantName,
      address: `${restaurant.addresses[0].addressLine1}, ${restaurant.addresses[0].locality}, ${restaurant.addresses[0].administrativeArea} ${restaurant.addresses[0].postalCode}`,
      latitude: restaurant.addresses[0].latitude,
      longitude: restaurant.addresses[0].longitude,
    }));

    return NextResponse.json({ stores, coords });
  } catch (error: any) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.error || error.message;
    return NextResponse.json({ error: message, status });
  }
}