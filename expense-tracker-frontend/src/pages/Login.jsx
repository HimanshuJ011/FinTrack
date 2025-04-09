import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { debounce } from "../utils/debounce";
import authService from "../api/authService";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameExists, setUsernameExists] = useState(true);
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const initialValues = {
    username: "",
    password: "",
  };
  const validationSchema = useMemo(
    () =>
      Yup.object({
        username: Yup.string().required("Username is required"),
        password: Yup.string().required("Password is required"),
      }),
    []
  );
  const debouncedUsernameCheck = useCallback(
    debounce(async (username) => {
      try {
        setIsCheckingUsername(true);
        const available = await authService.checkUsernameAvailability(username);
        setUsernameExists(!available);
      } catch (err) {
        console.error("Username check failed:", err);
        setUsernameExists(true);
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
      setUsernameExists(true); // reset to default
    }
  };
  const checkUsernameExists = async (username) => {
    try {
      const available = await authService.checkUsernameAvailability(username);
      return !available;
    } catch (err) {
      console.error("Error checking username:", err);
      return false;
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const exists = await checkUsernameExists(values.username);

      if (!exists) {
        setLoginError(
          "Username doesn't exist. Please check your username or register."
        );
        setSubmitting(false);
        return;
      }
      await login(values.username, values.password);
      navigate("/dashboard");
    } catch (error) {
      const status = error.response?.status;
      const message = err.response?.data?.message || "Failed to login";

      if (status === 401) {
        setLoginError("Incorrect password. Please try again.");
      } else {
        setLoginError(message);
      }
    
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold text-gray-900">
          Login
        </h2>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
        {loginError && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
            {loginError}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <Field name="username">
                    {({ field }) => (
                      <div>
                        <input
                          {...field}
                          type="text"
                          id="username"
                          placeholder="Enter your username"
                          onChange={(e) =>
                            handleUsernameChange(e, setFieldValue)
                          }
                          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        {isCheckingUsername && (
                          <div className="text-sm text-blue-600 mt-1">
                            Checking username...
                          </div>
                        )}
                        {!usernameExists &&
                          field.value.trim() !== "" &&
                          !isCheckingUsername && (
                            <div className="text-sm text-red-600 mt-1">
                              Username doesn't exist. Need to register?
                            </div>
                          )}
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    name="username"
                    component="div"
                    className="text-sm text-red-600 mt-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-sm text-red-600 mt-1"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    (currentUsername.trim() !== "" && !usernameExists) ||
                    isCheckingUsername
                  }
                  className={`w-full flex justify-center rounded-md ${
                    isSubmitting ||
                    (currentUsername.trim() !== "" && !usernameExists) ||
                    isCheckingUsername
                      ? "bg-indigo-300 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  } px-3 py-2 text-sm font-semibold text-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
