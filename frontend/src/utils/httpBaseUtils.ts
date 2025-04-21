import axios, { AxiosError, AxiosInstance } from "axios";
import { message } from "antd";
import { BASE_URL, JWT_TOKEN, PublicRoutes } from "../constants";
import { getLocalStorage, setLocalStorage } from "./storage";
import { NavigateFunction } from "react-router-dom";

export function createHttpBase(
  isDownloadable: boolean = false,
  signal?: AbortSignal,
  navigate?: NavigateFunction,
  endpoint?: string,
): AxiosInstance {
  const isPublicRoute =
    PublicRoutes && endpoint && PublicRoutes.includes(endpoint);

  const headers = {
    Accept: isDownloadable ? "*/*" : "application/json",
    "Content-Type": "application/json",
    "X-XSRF-TOKEN": !isPublicRoute ? getLocalStorage(JWT_TOKEN) : undefined,
  };
  const api = axios.create({
    baseURL: BASE_URL,
    headers,
    responseType: isDownloadable ? "blob" : "json",
    signal,
  });
  //Create request interceptor to inject headers
  api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error),
  );

  // Response interceptor to handle token updates and session management
  api.interceptors.response.use(
    (response) => {
      const inValidTokenMessage = [
        "MISSING SECURITY TOKEN",
        "MISSING SECURITY TOKEN IS INVALID",
        "SECURITY TOKEN HAS EXPIRED",
        "SECURITY TOKEN HAS INVALID SIGNATURE",
      ];
      if (inValidTokenMessage.includes(response.data.message) && navigate) {
        message.destroy();
        message.error("Session expired. Please login again");
        localStorage.removeItem(JWT_TOKEN);
        handleUnauthorizedError(navigate);
        return Promise.reject(new Error("Session expired"));
      }
      const xsrfToken = response.headers["x-xsrf-token"];
      if (xsrfToken) {
        setLocalStorage(JWT_TOKEN, xsrfToken);
      }
      return response;
    },
    (error) => handleErrorResponse(error, navigate),
  );

  return api;
}

function handleErrorResponse(error: AxiosError, navigate?: NavigateFunction) {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      if (navigate) {
        handleUnauthorizedError(navigate);
        // message.destroy();
        localStorage.clear();
      }
    } else if (status === 503 && navigate) {
      navigate("/503");
    }
    const inValidTokenMessage = [
      "MISSING SECURITY TOKEN",
      "MISSING SECURITY TOKEN IS INVALID",
      "SECURITY TOKEN HAS EXPIRED",
      "SECURITY TOKEN HAS INVALID SIGNATURE",
    ];
    if (
      inValidTokenMessage.includes(
        (error.response?.data as { message: string }).message,
      ) &&
      navigate
    ) {
      handleUnauthorizedError(navigate);
      localStorage.removeItem(JWT_TOKEN);
      // message.destroy();
      return;
    }
  }
  return Promise.reject(error);
}

function handleUnauthorizedError(navigate: NavigateFunction) {
  localStorage.clear();
  // navigate("/");
}
