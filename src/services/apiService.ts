import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_BASE_URL ||
  "https://chat-app-backend-u15o.onrender.com/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/**
 * Exchange the httpOnly refresh-token cookie for a fresh access token.
 * Uses a bare axios call (not `apiClient`) so a failed refresh cannot
 * trigger the response interceptor and create a redirect/retry loop.
 */
export const refreshAccessToken = async (): Promise<string> => {
  const res = await axios.post(
    `${API_BASE_URL}/refresh`,
    {},
    { withCredentials: true },
  );
  const newAccessToken: string = res.data.accessToken;
  if (newAccessToken) {
    localStorage.setItem("accessToken", newAccessToken);
  }
  return newAccessToken;
};

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
        const newAccessToken = await refreshAccessToken();

        // update header and retry request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed", refreshError);
        localStorage.removeItem("accessToken");
        // Only bounce to login once, and never loop on the login route itself.
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }

    return Promise.reject(error);
  }
);
