import Cookies from "js-cookie";
import { URL as manualURL } from "../URL";
import { message } from "antd";


export const RmaApi = {

  greet: async () => {
    const token = atob(Cookies.get("authToken"));

    try {
      const response = await fetch(manualURL + "/rma/greet", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const mess = await response.text();
        message.error(mess || "RMA Greet failed.", 5);
        return null;
      }

      return await response.text(); // Backend returns plain text

    } catch (error) {
      message.error("RMA API Network Error: " + error.message, 5);
      return null;
    }
  },

};
