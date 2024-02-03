import axios from "axios";
export const axiosCli = () => {
    // Create a new axios instance
    const api = axios.create({
        baseURL: "http://localhost:3000/api/",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        validateStatus: function (status) {
            return status <= 500; // Resolve only if the status code is less than 500
        }
    });

    // Add a request interceptor to add the JWT token to the authorization header
    api.interceptors.request.use(
        (config) => {
            const email = localStorage.getItem("accessToken");
            if (email) {
                config.headers.Authorization = email;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Add a response interceptor to refresh the JWT token if it's expired
    // api.interceptors.response.use(
    //     (res) => {
    //         if (res.status == 400) {
    //             localStorage.removeItem("accessToken");
    //             localStorage.removeItem("level");
    //         }
    //     }
    // );

    const get = (path) => {
        return api.get(path).then((response) => response);
    };

    const post = (path, data) => {
        return api.post(path, data).then((response) => response);
    };

    const put = (path, data) => {
        return api.put(path, data).then((response) => response.data);
    };

    const del = (path) => {
        return api.delete(path).then((response) => response);
    };
    return {
        get,
        post,
        put,
        del,
    };
};