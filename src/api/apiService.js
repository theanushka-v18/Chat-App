import axios from "axios";

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_BASE_URL ||
    "https://chat-app-backend-u15o.onrender.com/api",
  // baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api',
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// add interceptor for access token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // if access token expired and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          "https://chat-app-backend-u15o.onrender.com/api/refresh",
          {
            // const res = await axios.post("http://localhost:3000/api/refresh", {
            withCredentials: true,
          }
        );
        const newAccessToken = res.data.accessToken;

        // save new token
        localStorage.setItem("accessToken", newAccessToken);

        // update header and retry request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (error) {
        console.error("Refresh token failed", error);
        window.location.href = "/"; // redirect to login
      }
    }

    return Promise.reject(error);
  }
);
