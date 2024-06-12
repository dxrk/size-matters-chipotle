export const getCoords = async (address: string) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${process.env.GOOGLE_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch coordinates");
  }

  const data = await response.json();

  if (data.status !== "OK") {
    throw new Error(`Geocoding API error: ${data.status}`);
  }

  return data.results[0].geometry.location;
};
