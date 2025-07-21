// src/utils/validators.js
import * as yup from "yup";

// ====================
// AUTH
// ====================
export const loginSchema = yup.object().shape({
  email: yup.string().email("Valid email is required").required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Valid email is required").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup
    .string()
    .oneOf(["commander", "commando", "specialForce", "globalSoldier"])
    .nullable(),
  battalion: yup
    .string()
    .oneOf(["Alpha", "Bravo", "Charlie", "Delta"])
    .nullable(),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string().email("Valid email is required").required("Email is required"),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

// ====================
// KPI
// ====================
export const createKPISchema = yup.object().shape({
  title: yup.string().required("KPI title is required"),
  target: yup.string().required("KPI target is required"),
  deadline: yup
    .date()
    .typeError("Deadline must be a valid date")
    .required("Deadline is required"),
  assignmentType: yup
    .string()
    .oneOf(["all", "role", "specific"])
    .default("specific"),
  role: yup.string().when("assignmentType", {
    is: "role",
    then: (schema) => schema.required("Role is required for role assignment"),
  }),
  userIds: yup.array().when("assignmentType", {
    is: "specific",
    then: (schema) =>
      schema
        .of(yup.string().required())
        .min(1, "At least one user must be selected"),
  }),
});

export const updateKPIStatusSchema = yup.object().shape({
  progress: yup.number().nullable(),
  status: yup
    .string()
    .oneOf(["Pending", "In Progress", "Completed"])
    .nullable(),
});

// ====================
// USER PROFILE UPDATE
// ====================
export const updateProfileSchema = yup.object().shape({
  firstName: yup.string().min(2, "First name too short"),
  lastName: yup.string().min(2, "Last name too short"),
  email: yup.string().email("Valid email required"),
  phone: yup.string().nullable(),
  sex: yup.string().oneOf(["Male", "Female"]),
  ageBracket: yup.string().oneOf(["18-25", "26-35", "36-45", "46-60", "60+"]),
  battalion: yup.string().oneOf(["Alpha", "Bravo", "Charlie", "Delta"]),
});
