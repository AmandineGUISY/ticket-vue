import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://backend-test-amandine.onrender.com/api',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers = config.headers || {}; // S'assurer que headers existe
        config.headers.Authorization = `Bearer ${token}`; // TypeScript devrait inférer le type correctement ici
    }
    return config;
}, error => Promise.reject(error));

export default apiClient;