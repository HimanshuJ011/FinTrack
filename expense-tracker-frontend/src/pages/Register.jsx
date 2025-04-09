import React, { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { debounce } from "../utils/debounce";
import authService from "../api/authService";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");
  const [registerError, setRegisterError] = useState("");

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const debouncedUsernameCheck = useCallback(
    debounce(async (username) => {
      try {
        setIsCheckingUsername(true);
        const isAvailable = await authService.checkUsernameAvailability(username);
        setUsernameAvailable(isAvailable);
      } catch (err) {
        console.error("Username check failed:", err);
        setUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    }, 500),
    []
  );

  const handleUsernameChange = (e, setFieldValue) => {
    const username = e.target.value;
    setCurrentUsername(username);
    setFieldValue("username", username);

    if (username.trim()) {
      debouncedUsernameCheck(username);
    } else {
      setUsernameAvailable(true);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const isAvailable = await authService.checkUsernameAvailability(values.username);
      if (!isAvailable) {
        setRegisterError("Username is already taken");
        setSubmitting(false);
        return;
      }

      await register(values.username, values.email, values.password);
      navigate("/login", {
        state: { message: "Registration successful! Please login." },
      });
    } catch (err) {
      setRegisterError(err?.response?.data?.message || "Registration failed. Please try again.");
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Register
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {registerError && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded-md">
            {registerError}
          </div>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-900">
                  Username
                </label>
                <Field name="username">
                  {({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        id="username"
                        placeholder="Choose a username"
                        onChange={(e) => handleUsernameChange(e, setFieldValue)}
                        className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <ErrorMessage name="username" component="div" className="text-sm text-red-600 mt-1" />
                      {isCheckingUsername && (
                        <div className="text-sm text-blue-600 mt-1">Checking username...</div>
                      )}
                      {!usernameAvailable && (
                        <div className="text-sm text-red-600 mt-1">Username is already taken.</div>
                      )}
                    </>
                  )}
                </Field>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter your email"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                  Password
                </label>
                <Field
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Create a password"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-900">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  className="mt-2 block w-full rounded-md border border-gray-300 px-3 py-1.5 text-base text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !usernameAvailable || isCheckingUsername}
                  className={`flex w-full justify-center rounded-md ${
                    isSubmitting || !usernameAvailable || isCheckingUsername
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  } px-3 py-1.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
