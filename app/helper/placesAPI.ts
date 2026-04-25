import { Stop } from "../data/newtypes";

type GooglePlace = any; // keep loose to avoid overly specific typings for now

/**
 * Calls Google Places 'searchNearby' endpoint with the exact request body payload
 * shape you provided and maps the first N results to the project's Stop type.
 *
 * Important: this function intentionally preserves the content/shape of the
 * request body exactly as supplied in the prompt. Do NOT change the payload.
 */
export async function searchNearbyStops(
  apiKey: string,
  latitude: number,
  longitude: number,
  category: string,
  radiusMeters = 2000,
  maxResultCount = 5,
): Promise<Stop[]> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const body = {
    includedTypes: [category],
    maxResultCount: maxResultCount,
    locationRestriction: {
      circle: {
        center: {
          latitude: latitude,
          longitude: longitude,
        },
        radius: radiusMeters,
      },
    },
  };

  const fieldMask = "places.displayName,places.addressComponents,places.googleMapsUri,places.generativeSummary,places.priceRange";

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Places API error: ${resp.status} ${resp.statusText} - ${text}`);
  }

  const data = await resp.json();

  // The response shape includes `places: []` per example. Map first results to Stop.
  const places: GooglePlace[] = data.places || [];

  const stops: Stop[] = places.map((p: any) => {
    const displayName = p.displayName?.text || (p.name ?? "Unknown");

    // Build a readable address from addressComponents if present
    let address = "";
    if (Array.isArray(p.addressComponents)) {
      // join longText values for street_number, route, locality and postal_code when present
      const parts: string[] = [];
      const order = ["street_number", "route", "neighborhood", "locality", "administrative_area_level_1", "postal_code"];
      for (const t of order) {
        const comp = p.addressComponents.find((c: any) => Array.isArray(c.types) && c.types.includes(t));
        if (comp) parts.push(comp.longText || comp.shortText);
      }
      address = parts.filter(Boolean).join(", ");
    } else if (p.formattedAddress) {
      address = p.formattedAddress;
    }

    const mapUrl = p.googleMapsUri || p.googleMapsUri?.uri || "";

    const aiInsight = p.generativeSummary?.overview?.text || undefined;

    // priceRange.startPrice.units in example is a string like "100" representing units
    let costEstimate = 0;
    if (p.priceRange?.startPrice?.units) {
      const units = p.priceRange.startPrice.units;
      const parsed = Number(String(units));
      if (!Number.isNaN(parsed)) costEstimate = parsed;
    }

    const stop: Stop = {
      time: "",
      name: displayName,
      category,
      duration: "",
      mapUrl: mapUrl,
      address: address,
      costEstimate,
      isLocalSme: false,
      aiInsight,
    };

    return stop;
  });

  return stops;
}

export default searchNearbyStops;
