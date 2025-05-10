// src/api.js
export async function fetchCruxData(url) {
  const apiKey = "AIzaSyAYk6xdFkMuqRrpsNMzFwtn0xihzLkuxzw"; // Replace with actual key
  const endpoint = `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`;
  const response = await fetch(endpoint, {
    method: "POST",
    body: JSON.stringify({
      formFactor: "PHONE",
      origin: url,
      metrics: [
        "interaction_to_next_paint",
        "largest_contentful_paint",
        "experimental_time_to_first_byte",
        "largest_contentful_paint_image_element_render_delay",
        "largest_contentful_paint_image_resource_load_duration",
        "round_trip_time",
        "experimental_time_to_first_byte",
        "first_contentful_paint",
        "largest_contentful_paint_image_resource_load_delay",
        "largest_contentful_paint_image_time_to_first_byte",
        "cumulative_layout_shift"
      ],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) throw new Error("Failed to fetch data");

  return response.json();
}
