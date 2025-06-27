/**
 * Sends an API request with the specified method, data, and options.
 *
 * This function performs an HTTP request to a given endpoint with optional data 
 * and additional options. It adds a Bearer token from 
 * `localStorage` in the `Authorization` header for authenticated requests.
 * Handles both JSON requests and `multipart/form-data` for file uploads.

 * @param {string} endpoint - The endpoint to which the request will be made
 * @param {string} [method="GET"] - The HTTP method to use for the request
 * @param {Object|FormData|null} [data=null] - The data to send with the request.
 * @param {Object} [additionalOptions={}] - Additional options to be merged with the default fetch options like, query parameters
 */
export async function apiRequest(
  endpoint,
  method = "GET",
  data = null,
  additionalOptions = {}
) {
  const token = localStorage.getItem("token");
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`, // Add token to the request header
    },
    ...additionalOptions, // Merge additional options like query params
  };

  // Handle JSON request
  if (data && !(data instanceof FormData)) {
    console.log("Inside handle JSON request");
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }

  // Handle multipart/form-data request (for file uploads)
  if (data instanceof FormData) {
    console.log("Inside handle Multipart request");
    console.log(options.headers);
    options.body = data;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/${endpoint}`,
      options
    );

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => {
        return { message: "Unknown error" }; 
      });
      console.error(errorDetails);
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    // Return the JSON data from the response
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}
