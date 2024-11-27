// /src/api/config/apiConfig.ts
import axios from "axios";

const api = axios.create({
  baseURL: "https://looop-backend.onrender.com/api",
  timeout: 10000, // timeout after 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization token if available
// api.interceptors.request.use(async (config) => {
//   const token = await getToken(); // Example token fetching function
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

export default api;

// import axios from "axios";

// import Storage from "../transporter/helper/storage";
// import { showErrorNotifcation } from "../driver/components/inappnotifications/errors";
// import { persistor, store } from "../data/store";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   clearDriverStorage,
//   saveDriverAuthToken,
//   saveDriverData,
//   updateOnBoarding,
// } from "../data/reducers/driver/DriverAuthReducer";
// import { setUploadType } from "../data/reducers/transporter/accounts/company.account";

// const setAuthToken = async () => {
//   const token = await Storage.getData("token");
//   return token;
// };

// const APIs = axios.create({
//   baseURL: "https://transporter.thelodatechnologies.com/v1/api",
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });

// APIs.interceptors.request.use(async config => {
//   const token = await setAuthToken();
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// const showError = message => {
//   showErrorNotifcation(message);
// };

// APIs.interceptors.response.use(
//   res => {
//     return res;
//   },
//   async err => {
//     // network error
//     if (err.code === "ERR_NETWORK") {
//       showError(`Network error ${err.code}`);
//     }

//     if (err.response.status === 400) {
//       showErrorNotifcation(err.response.data.message);
//       // return;
//     }

//     if (err.response.status === 401) {
//       if (err.response.data.message !== "Incorrect password!") {
//         if (err.response.data.error.name === "TokenExpiredError") {
//           showError(err.response.data.message);
//           return;
//         }
//       }
//     }

//     if (err.response.status === 404) {
//       showError(err.response.data.message);
//     }

//     if (err.response.status === 409) {
//       showError(err.response.data.message);
//     }

//     if (err.response.status === 500) {
//       showError(err.response.data.message);
//       await AsyncStorage.removeItem("token");
//       await persistor.purge();
//       await Storage.clearAll();

//       store.dispatch(setUploadType(""));
//       store.dispatch(saveDriverData({}));
//       store.dispatch(clearDriverStorage());
//       store.dispatch(saveDriverAuthToken(null));
//       store.dispatch(updateOnBoarding(null));
//     }
//   },
// );

// export default APIs;
