import { configureStore } from "@reduxjs/toolkit";
import companyReducer from "../slices/companySlice"; // Adjusted path
// import dashboardReducer from '../slices/dashboardSlice'; // Adjusted path
import licenseReducer from "../slices/licenseSlice"; // Adjusted path
import paymentReducer from "../slices/paymentSlice"; // Adjusted path
import feeReducer from "../slices/feeSlice";
import productReducer from "../slices/productSlice";
import subscriptionReducer from "../slices/companyProductSubscriptionSlice";

export const store = configureStore({
  reducer: {
    company: companyReducer,
    // dashboard: dashboardReducer,
    license: licenseReducer,
    payment: paymentReducer,
    fee: feeReducer,
    product: productReducer,
    subscription: subscriptionReducer,
  },
});
export default store;
