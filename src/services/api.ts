import axios from 'axios';

const baseURL = "https://invisible-things.herokuapp.com/";

const api = axios.create({ 
    baseURL
});

export  { api, baseURL };