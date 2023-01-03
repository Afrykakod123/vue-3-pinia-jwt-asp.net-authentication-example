<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore, useWeatherForecastStore } from '@/stores';

const authStore = useAuthStore();
const {userName } = storeToRefs(authStore);
//In order to extract properties from the store while keeping its reactivity, you need to use storeToRefs()
const useWeather = useWeatherForecastStore();
const { weather } = storeToRefs(useWeather);
useWeather.getAll();
</script>

<template>
    <div>            
        <h1>Hi {{userName}}!</h1>       
        <p>You're logged in with Vue 3 + Pinia & JWT!!</p>
        <h3>Weather from secure api end point:</h3>        
        <ul v-if="weather.length">
            <li v-for="item in weather" :key="item.id">{{item.date}} - {{item.temperatureC}}</li>
        </ul>
        <div v-if="weather.loading" class="spinner-border spinner-border-sm"></div>
        <div v-if="weather.error" class="text-danger">Error loading weather: {{weather.error}}</div>
    </div>
</template>
