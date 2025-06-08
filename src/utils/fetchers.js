import axios from "axios";
import axiosInstance from "./axios-interceptor";

export async function fetcher(url) {
  const response = await axiosInstance.get(url);
  return response.data;
}

export async function login(email, password) {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
    {
      email,
      password,
    }
  );
  return response;
}
export async function register(name, email, password) {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
    {
      email,
      password,
      name,
    }
  );
  return response;
}

export async function deletPost(id) {
  const response = await axiosInstance.delete(
    `${import.meta.env.VITE_BACKEND_URL}/posts/${id}`
  );
  return response;
}
