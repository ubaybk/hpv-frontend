// src/utils/auth.js
export const getToken = () => {
    return localStorage.getItem("access_token");
};

export const setToken = (token) => {
    localStorage.setItem("access_token", token);
};

export const isAuthenticated = () => {
    return !!getToken();
};