import showAlert from "@/hooks/useAlert";
import axios from "axios";
import { getToken } from "./authToken";
// import { getToken } from "./auth-token";

export const cancelTokenSource = axios.CancelToken.source();
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}`,
  cancelToken: cancelTokenSource?.token,
  headers: {
    "Content-Type": "application/json"
  }
});
axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    // clientPayload = config?.data;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  function (response) {
    return response?.data;
  },
  async function (error) {
    if (
      error.response?.status === 403 &&
      (error.message.includes("authentication") || error.message.includes("authorization"))
    ) {
      showAlert("error", "Your session has expired");
      return window.location.reload();
    }
    // Reject promise if usual error
    if (error?.message === "Network Error") {
      showAlert("error", "Network Error");
      return Promise.reject(error?.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
