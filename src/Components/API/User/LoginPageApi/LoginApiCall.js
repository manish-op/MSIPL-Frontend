import Cookies from "js-cookie";
import { URL } from "../../URL";
import { message } from "antd";

async function LoginApiCall(loginDetails, navigate) {
  const url = URL + "/admin/user/login";
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginDetails),
    });
    if (response.ok) {
      const json = await response.json();
      loginDetails.email = "";
      loginDetails.password = "";
      
      const tokenId = json.authToken; // This is the raw token
      const encodedData = btoa(tokenId); // This is the encoded one for the cookie

      // You can keep your cookie line, that's fine.
      Cookies.set("authToken", encodedData, { expires: 6, path: '/' }); 

      localStorage.setItem("authToken", tokenId); 
      // ---------------------

      // You are already saving this other info:
      localStorage.setItem("email", json.email);
      localStorage.setItem("name", json.name);
      localStorage.setItem("mobile", json.mobileNo);
      localStorage.setItem("region", json.region);
      localStorage.setItem("_User_role_for_MSIPL", json.role);
      
      navigate("/dashboard/profile");
      message.success('Login successfully!', 1);
      return true;
    } else {
      const mess = await response.text();
      return message.warning(mess, 5);
    }
  } catch (error) {
    return message.error("Error message: " + (error.message || "Network error"), 5);
  }
}

export default LoginApiCall;