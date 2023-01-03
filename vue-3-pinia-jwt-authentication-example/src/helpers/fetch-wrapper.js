import { useAuthStore } from "@/stores";
import jwtDecrypt from "@/helpers/jwt-decode.js ";

export const fetchWrapper = {
  get: request("GET"),
  post: request("POST"),
  put: request("PUT"),
  delete: request("DELETE"),
};

const baseUrl = `${import.meta.env.VITE_API_URL}`;

async function refresh() {
  const userStore = useAuthStore();  
  const response = await fetch(`${baseUrl}/api/Token/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      AccessToken: JSON.parse(userStore.token),
      refreshToken: JSON.parse(userStore.refreshToken), //localStorage.getItem("refreshToken"),
    }),
  });
  if (!response.ok) return response
  const data = await response.json();  
  localStorage.setItem("token", JSON.stringify(data.token));
  localStorage.setItem("refreshToken", JSON.stringify(data.refreshToken));
  userStore.refreshToken = data.refreshToken;
  userStore.token = data.token;
  return { response };
}

function request(method, isRefresh = false) {
  return (url, body) => {   
    const requestOptions = {
      method,
      headers: authHeader(url),
    };
    if (body) {
      requestOptions.headers["Content-Type"] = "application/json";
      requestOptions.body = JSON.stringify(body);
    }
    return new Promise(function (resolve) {
      fetch(url, requestOptions)
        .then(function (result) {
         
          /* on success */
          if (result.ok) {
            resolve(result);      
            return    
          }

          if ([401].includes(result.status) && !isRefresh) {  
              refresh().then(() => {
                resolve(request(method, true)(url, body));
              });           
              return
          }
          if (isRefresh) handleResponse(result);

        })
        .catch(function (error) {
          console.log("not success", error);
          return Promise.reject(error);         
        });
    });
  };
}

// helper functions

function authHeader(url) {
  const token = useAuthStore().token;
  const isLoggedIn = !!token;
  const isApiUrl = url.startsWith(import.meta.env.VITE_API_URL);

  if (isLoggedIn && isApiUrl) {
    return { Authorization: `Bearer ${token}` };
  } else {
    return {};
  }
}

function handleResponse(response) {
  
  return response.text().then((text) => {   
    const data = text && JSON.parse(text);

    if (!response.ok) {
      const { userName, logout } = useAuthStore();
      if ([401, 403].includes(response.status) && userName) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        logout();
      }

      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}
