import { defineStore } from "pinia";

import { router } from "@/helpers";
import jwtDecrypt from "@/helpers/jwt-decode.js ";

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    userName: localStorage.getItem("userName"),
    token: localStorage.getItem("token"),
    refreshToken: localStorage.getItem("refreshToken"),
    returnUrl: null,
  }),
  actions: {
    async login(username, password) {
      await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }).then((response) => {
        response
          .json()
          .then((parsedJson) => {
            const jwtDecodedValue = jwtDecrypt(parsedJson.token);            
            localStorage.setItem(
              "userName",
              JSON.stringify(
                jwtDecodedValue[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ]
              )
            );
            this.userName = localStorage.getItem("userName");           
            localStorage.setItem("token", JSON.stringify(parsedJson.token)); 
            useAuthStore().token = parsedJson.token;         
            localStorage.setItem(
              "refreshToken",
              JSON.stringify(parsedJson.refreshToken)
            );           
          })
          .then(() => {
            router.push(this.returnUrl || "/");
          });
      });
    },
    logout() {
      this.refreshToken = null;
      this.userName = null;
      localStorage.removeItem("userName");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      router.push("/login");
    },
  },
});
