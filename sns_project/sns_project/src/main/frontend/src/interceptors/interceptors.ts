import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  if (!config.headers) {
    return config;
  }
  config.headers.Authorization = localStorage.getItem("accessToken");
  return config;
};

const onErrorRequest = (err: AxiosError | Error) => {
  return Promise.reject(err);
};

const onResponse = (res: AxiosResponse) => {
  return res;
};

const onErrorResponse = async (err: AxiosError | Error): Promise<AxiosError> => {
  const _err = err as unknown as AxiosError;
  const { response } = _err;
  const originalConfig = _err?.config;

  if (response && response.status === 401) {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/refresh`, {
        headers: {
          Refresh: localStorage.getItem("refreshToken"),
        },
      });
      if (res.status === 200) {
        localStorage.setItem("accessToken", res.headers["authorization"]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 500) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("Id");
        }
      }
    }
    const newAccessToken = localStorage.getItem("accessToken");
    if (originalConfig && originalConfig.headers) {
      originalConfig.headers.Authorization = newAccessToken;
      return await axios(originalConfig);
    }
  }
  return Promise.reject(_err);
};

const authinstance = axios.create({ baseURL: process.env.REACT_APP_API_URL });
authinstance.interceptors.request.use(onRequest, onErrorRequest);
authinstance.interceptors.response.use(onResponse, onErrorResponse);

export const authInstance = authinstance;

export const defaultInstance = axios.create({ baseURL: `${process.env.REACT_APP_API_URL}` });
