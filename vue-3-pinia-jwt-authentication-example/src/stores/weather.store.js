import { defineStore } from 'pinia';

import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}/api/weatherforecast`;

export const useWeatherForecastStore = defineStore({
  id: "weather",
  state: () => ({
    weather: {},
  }),
  actions: {
    async getAll() {      
      this.weather = { loading: true };
      //fetchWrapper.get(baseUrl  , {body:data}, );   
      fetchWrapper
        .get(baseUrl)
        .then(response => response.json())
        .then((data) => (this.weather = data))
        .catch((error) => (this.weather = { error:error }));
    },
  },
});
