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

export const signupSchema = yup.object().shape({
  emailAddress: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  username: yup
    .string()
    .min(5, "Username must be at least 5 characters")
    .matches(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, dots and underscores")
    .required("Username is required"),
  password: yup
    .string()
    .min(12, "Password must be at least 12 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .required("Password is required"),
});

export const creatorProfileSchema = yup.object().shape({
  stageName: yup
    .string()
    .required("Stage name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  bio: yup
    .string()
    .max(500, "Bio must not exceed 500 characters"),
  websiteUrl: yup
    .string()
    .url("Please enter a valid URL"),
  socialAccounts: yup.object().shape({
    twitter: yup.string().url("Please enter a valid Twitter URL"),
    instagram: yup.string().url("Please enter a valid Instagram URL"),
    tiktok: yup.string().url("Please enter a valid TikTok URL"),
  }),
  profileImage: yup
    .string()
    .required("Profile image is required"),
});

export const passwordValidationSchema = yup.object().shape({
  currentPassword: yup
    .string()
    .required("Current password is required"),
  newPassword: yup
    .string()
    .min(12, "Password must be at least 12 characters")
    .matches(/[a-zA-Z]/, "Password must contain at least one letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
    .notOneOf([yup.ref('currentPassword')], "New password must be different from current password")
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], "Passwords must match")
    .required("Please confirm your password"),
});