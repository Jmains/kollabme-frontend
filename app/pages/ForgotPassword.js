import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Page from "../components/Shared/Page";

function ForgotPassword() {
  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");

  const [sendEmail] = useMutation(SEND_FORGOT_PASS_EMAIL_MUTATION, {
    variables: { recipient: email },
    update: (_, res) => {
      console.log("email res: " + res.data.sendForgotPassEmail.email);
    },
    onError: (err) => {
      setErrors(err.graphQLErrors[0].extensions.exception.errors);
    },
  });

  // TODO: Implement forgot password functionality

  return (
    <Page title="Forgot Password">
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div>
            {/* <img
                className="mx-auto h-12 w-auto"
                src=""
                alt=""
              /> */}
            <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-200">
              Forgot Password
            </h2>
          </div>
          <form className="mt-8" onSubmit={sendEmail}>
            <input type="hidden" name="remember" value="true" />
            <div className="rounded-md shadow-sm">
              <div>
                <input
                  aria-label="Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded relative block w-full px-3 py-2 border bg-gray-200 border-gray-500 placeholder-gray-600 text-gray-900 rounded-t-md focus:outline-none focus:shadow-outline-gray focus:border-gray-300 focus:z-10 sm:text-sm sm:leading-5"
                  placeholder="Email address"
                />
              </div>
            </div>
            {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}

            <div className="mt-6">
              <button
                type="submit"
                className=" group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white shadow-xl bg-gray-900 hover:bg-indigo-100 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition ease-in-out duration-150"
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
                reset password
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2020 Intreecate Corp. All rights reserved.
          </p>
        </div>
      </div>
    </Page>
  );
}

const SEND_FORGOT_PASS_EMAIL_MUTATION = gql`
  mutation sendForgotPassEmail($recipient: String!) {
    sendForgotPassEmail(recipient: $recipient) {
      email
    }
  }
`;

export default ForgotPassword;
