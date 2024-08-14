import axios from "axios";
import { jwtDecode } from "jwt-decode";

axios.defaults.baseURL = "http://localhost:8080";

// function to get the username
export async function getUsername() {
  const token = localStorage.getItem("token");
  if (!token) return Promise.reject("Cannot find token");

  let decode = jwtDecode(token);
  return decode;
}

// Function to get a cookie by name
/*function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

export async function getUsernameFromCookie() {
  const token = getCookie("token"); // Assuming the token is stored in a cookie named "token"
  if (!token) return Promise.reject("Cannot find token");

  let decode = jwtDecode(token);
  return decode.username; // Assuming the username is stored in the 'username' field
}
  */


export async function fetchSearchProducts(searchInput) {
  try {
    const response = await axios.get(
      `v1/api/getProducts/search?query=${searchInput}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching products: ", error);
  }
}