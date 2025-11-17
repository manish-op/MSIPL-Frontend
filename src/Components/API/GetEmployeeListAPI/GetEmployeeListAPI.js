// src/API/EmployeeList/GetEmployeeListAPI.js

import Cookies from "js-cookie";
import { URL } from "../URL"; // Assuming this path is correct relative to this file
import { message } from "antd";

/**
 * Fetches the list of employees.
 * @param {string | null} regionName - The name of the region to filter by (optional).
 *@returns {Promise<Array>} - A promise that resolves to the list of employees.
 */
async function GetEmployeeListAPI(regionName) {
  // 1. Using atob and js-cookie to get the token, as per your example
  const token = atob(Cookies.get("authToken"));

  // 2. Using your imported URL constant
  let url = URL + "/all-users";
  
  // Add the regionName as a query parameter if it exists
  if (regionName) {
    url += `?regionName=${encodeURIComponent(regionName)}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // 3. Using the Authorization header format from your example
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // 4. Using antd message for non-ok responses, like in your example
      const mess = await response.text();
      const errorMessage = mess || `HTTP error! status: ${response.status}`;
      message.warning(errorMessage, 5);
      
      // Throw an error to be caught by the component's catch block
      throw new Error(errorMessage);
    }

    // This is the key difference from AddEmployeeAPI:
    // We must return the JSON data for the component to display.
    const data = await response.json();
    return data;

  } catch (error) {
    // 5. Using antd message for network or other errors
    console.error("Error fetching employee list:", error); // Good to keep for debugging
    message.error("API Error: " + error.message, 5);
    
    // Re-throw the error so the component's .catch() block will run
    throw error;
  }
}

export default GetEmployeeListAPI;