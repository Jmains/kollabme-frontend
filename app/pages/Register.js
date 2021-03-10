import React, { useState } from "react";
import Page from "../components/Shared/Page";
import { useMutation, gql } from "@apollo/client";
import { useForm } from "../utils/hooks";
// Context
import { useAuthDispatch } from "../context/auth";

function Register(props) {
  const authDispatch = useAuthDispatch();
  // Handle errors state
  const [errors, setErrors] = useState({});
  // custom form hook to handle user input
  const { onFieldChange, onSubmit, values } = useForm(registerUser, {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // Add user once form is submitted
  function registerUser() {
    addUser();
  }
  // Handle Graphql API call
  const [addUser, { loading }] = useMutation(REGISTER_USER, {
    update: (_, result) => {
      authDispatch.login(result.data.register);
      props.history.push("/");
    },
    onError: (error) => {
      console.log(error);
      setErrors(error.graphQLErrors[0].extensions.exception.errors);
    },
    // Form values
    variables: values,
  });

  return (
    <Page title="Register">
      {loading ? (
        <div>Loading</div>
      ) : (
        <div className="min-h-screen bg-pageBg -pt-16 flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div>
              <img
                className="mx-auto h-20 w-auto"
                src="https://intreecate.s3-us-west-1.amazonaws.com/intreecatelogo1.png"
                alt="Intreecate Logo"
              />
              <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-200">
                Sign up an account
              </h2>
            </div>
            <form className="mt-8" onSubmit={onSubmit}>
              <div className="rounded-md shadow-sm">
                <div>
                  <input
                    aria-label="Username"
                    onChange={onFieldChange}
                    value={values.username}
                    name="username"
                    type="text"
                    required
                    className="appearance-none text-sm rounded relative block w-full px-3 py-2 border bg-gray-300 border-gray-700 placeholder-gray-900 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Username"
                  />
                </div>
                {errors && errors.username && (
                  <p className="text-red-500 text-xs italic">{errors.username}</p>
                )}
                <div className="mt-5">
                  <input
                    aria-label="Email Address"
                    onChange={onFieldChange}
                    value={values.email}
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded text-sm relative block w-full px-3 py-2 border bg-gray-300 border-gray-700 placeholder-gray-900 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Email Address"
                  />
                </div>
                {errors && errors.email && (
                  <p className="text-red-500 text-xs italic">{errors.email}</p>
                )}
                <div className="mt-5">
                  <input
                    aria-label="Password"
                    onChange={onFieldChange}
                    value={values.password}
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded text-sm relative block w-full px-3 py-2 border bg-gray-300 border-gray-700 placeholder-gray-900 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Password"
                  />
                </div>
                {errors && errors.password && (
                  <p className="text-red-500 text-xs italic">{errors.password}</p>
                )}
                <div className="mt-5">
                  <input
                    aria-label="Confirm Password"
                    onChange={onFieldChange}
                    value={values.confirmPassword}
                    name="confirmPassword"
                    type="password"
                    required
                    className="appearance-none rounded text-sm relative block w-full px-3 py-2 border bg-gray-300 border-gray-700 placeholder-gray-900 text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300 focus:z-10 sm:text-sm sm:leading-5"
                    placeholder="Confirm Password"
                  />
                </div>
                {errors && errors.confirmPassword && (
                  <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="mt-6 flex text-sm justify-center text-gray-400">
                <p>By clicking Sign Up you are agreeing to our terms and conditions</p>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  className=" group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white shadow-lg bg-gray-900 hover:bg-teal-400 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                >
                  Sign Up
                </button>
              </div>
            </form>
            <p className="text-center text-gray-500 text-xs">
              &copy;2020 Intreecate LLC. All rights reserved.
            </p>
          </div>
          {/* {Object.keys(errors).length > 0 &&
            Object.values(errors).map((value) => console.log(value))} */}
        </div>
      )}
    </Page>
  );
}

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      authInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      accessToken
    }
  }
`;

export default Register;
