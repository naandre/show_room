import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const instance_api = axios.create({
    baseURL: process.env.URL_API,
    timeout: 1000,
    headers: { 'Authorization': `Bearer ${process.env.TOKEN_AUTH}` }
});
export default instance_api;