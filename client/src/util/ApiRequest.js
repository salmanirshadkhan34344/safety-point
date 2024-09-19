import axios from "axios";

function getCommonHeaders(h) {
  let headers = {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("accessToken");
  if (token) headers.Authorization = `Bearer ${token}`;
  if (h) headers = { ...h, ...headers };
  return headers;
}

export const apiGet = async (url, onSuccess, onFailure) => {
  await axios
    .get(url, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error);
    });
};

export const apiGetAuth = async (url, onSuccess, onFailure, headers) => {
  await axios
    .get(url, {
      headers: getCommonHeaders(headers),
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error?.response?.data);
    });
};

export const apiPost = async (url, body, onSuccess, onFailure) => {
  await axios
    .post(url, body, {
      headers: getCommonHeaders(),
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (error.response.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
      if (onFailure) onFailure(error?.response);
    });
};

export const apiPostWithoutAuth = async (url, body, onSuccess, onFailure) => {
  axios
    .post(url, body, {
      headers: {
        headers: { "Access-Control-Allow-Origin": "*" },
      },
    })
    .then((response) => {
      if (onSuccess) onSuccess(response?.data);
    })
    .catch((error) => {
      if (onFailure) onFailure(error?.response?.data);
    });
};
