import { use, useEffect, useMemo } from "react";
import axios from "axios";
import SmartBillContext from "../../Context/SmartBillContext"; // Ensure this path is correct

const useAxiosSecure = () => {
  // Get user and logOut function from your context
  const { user, logoutUser } = use(SmartBillContext);

  // Memoize the axios instance so it's only created once
  const axiosSecure = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:4000", // A more common port number
    });
  }, []); // Empty dependency array means this runs only once

  useEffect(() => {
    // If there's no user, don't attach interceptors
    if (!user) {
      return;
    }

    // --- Request Interceptor using .then() ---
    const reqInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        // Interceptors must return the config or a promise that resolves with it.
        // We return the user.getIdToken() promise chain.
        console.log('in conig ');
        return user.getIdToken().then((token) => {
          // Once the token is retrieved, add it to the headers
          config.headers.Authorization = `Bearer ${token}`;
          // Return the modified config so the request can proceed
          return config;
        }).catch((error) => {
          // Handle potential errors during token retrieval
          return Promise.reject(error);
        });
      },
      (error) => {
        // Handle request setup errors
        return Promise.reject(error);
      }
    );

    // --- Response Interceptor (no changes needed here) ---
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        if (status === 401 || status === 403) {
          console.error("Unauthorized or Forbidden - Logging out");
          logoutUser(); // Call logout from your context
        }
        return Promise.reject(error);
      }
    );

    // --- Cleanup Function ---
    // This removes the interceptors when the component unmounts or the user changes
    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logoutUser, axiosSecure]);

  // Return the configured axios instance
  return axiosSecure;
};

export default useAxiosSecure;
