import React, { useState } from "react";
// Components
import Page from "../components/Shared/Page";
// Hooks
import { useForm } from "../utils/hooks";
import { useMutation, gql } from "@apollo/client";
// Context
import { useAuthDispatch } from "../context/auth";

function Login(props) {
  const authDispatch = useAuthDispatch();
  const [errors, setErrors] = useState({});

  const { onFieldChange, onSubmit, values } = useForm(authenticateUser, {
    email: "",
    password: "",
  });

  const [loginUser, { loading }] = useMutation(LOGIN_USER_MUTATION, {
    update: (_, result) => {
      authDispatch.login(result.data.login);
      props.history.push("/");
    },
    onError: (error) => {
      console.log(error);
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
    },
    variables: values,
  });

  function authenticateUser() {
    loginUser();
  }

  return (
    <Page title="Login">
      {loading ? (
        <h1>loading...</h1>
      ) : (
        <div className="min-h-screen bg-pageBg bg-gradient-to-r -pt-20 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div>
              <img
                className="mx-auto h-20 w-auto"
                src="https://intreecate.s3-us-west-1.amazonaws.com/intreecatelogo1.png"
                alt="Intreecate Logo"
              />
              <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-200">
                Sign in to your account
              </h2>
            </div>
            <form className="mt-8" onSubmit={onSubmit}>
              <input type="hidden" name="remember" value="true" />
              <div className="rounded-md shadow-sm">
                <div>
                  <input
                    aria-label="Email address"
                    onChange={onFieldChange}
                    value={values.email}
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border text-sm bg-gray-300 border-gray-700 placeholder-gray-900 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Email Address"
                  />
                </div>

                <div className="mt-3">
                  <input
                    aria-label="Password"
                    onChange={onFieldChange}
                    value={values.password}
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded relative block w-full px-3 py-2 border text-sm bg-gray-300 border-gray-700 placeholder-gray-900 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Password"
                  />
                </div>
              </div>
              {errors.general && (
                <p className="text-red-500 text-xs italic">{errors.general}</p>
              )}

              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm leading-5 text-gray-400"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-5">
                  <a
                    // onClick={sendEmail}
                    className="font-medium cursor-pointer text-gray-400 hover:text-teal-300 focus:outline-none focus:underline transition ease-in-out duration-150"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className=" group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white shadow-lg bg-gray-900 hover:bg-teal-400 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-teal-500 group-hover:text-teal-400 transition ease-in-out duration-150"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Sign in
                </button>
              </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
              &copy;2020 Intreecate LLC. All rights reserved.
            </p>
          </div>
        </div>
      )}
    </Page>
  );
}

const LOGIN_USER_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      email
      username
      createdAt
      accessToken
    }
  }
`;

export default Login;
