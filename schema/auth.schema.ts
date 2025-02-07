import * as yup from "yup";

export const signinSchema = yup.object().shape({
  emailAddress: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 12 characters")
    .required("Password is required"),
});