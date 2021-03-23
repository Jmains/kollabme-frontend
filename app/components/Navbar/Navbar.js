import React, { useState, useRef } from "react";
import { NavLink } from "react-router-dom";
import NavChatButton from "./NavChatButton";
import { useAuthDispatch, useAuthState } from "../../context/auth";
import NavNotifButton from "./NavNotifButton";
import NavProfPic from "./NavProfPic";
import { useMutation, gql } from "@apollo/client";

const LOGOUT = gql`
  mutation logout {
    logout
  }
`;

function Navbar() {
  const { user } = useAuthState();
  const { logout } = useAuthDispatch();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [expanded, setExpanded] = useState("false");
  const myProfileRef = useRef(null);

  const [logoutMutation, { error, loading, data }] = useMutation(LOGOUT);

  function handleEscape(e) {
    if (e.key === "Esc" || e.key === "Escape") {
      setShowProfileDropdown(false);
    }
  }

  function handleDropdownClick() {
    setExpanded(expanded === "true" ? "false" : "true");
    setShowDropdown(!showDropdown);
    document.addEventListener("keydown", handleEscape);
  }

  function handleDropdownItemClick() {
    setExpanded(expanded === "true" ? "false" : "true");
    setShowDropdown(!showDropdown);
    document.removeEventListener("keydown", handleEscape);
  }

  function handleProfileDropdownClick() {
    setExpanded(expanded === "true" ? "false" : "true");
    setShowProfileDropdown(!showProfileDropdown);
    document.addEventListener("keydown", handleEscape);
    if (myProfileRef.current) {
      myProfileRef.current.focus();
    }
  }

  function handleProfileDropdownItemClick() {
    setExpanded(expanded === "true" ? "false" : "true");
    setShowProfileDropdown(!showProfileDropdown);
    document.removeEventListener("keydown", handleEscape);
  }

  // const showDropdownClass = showDropdown
  //   ? "block ml-6 transition ease-out duration-100 transform opacity-0 scale-95 transform opacity-100 scale-100"
  //   : "hidden";

  function logoutUser() {
    localStorage.removeItem("accessToken");
    document.removeEventListener("keydown", handleEscape);
    setShowProfileDropdown(!showProfileDropdown);
    logoutMutation();
    logout();
  }

  const navbar = user ? (
    <nav className="shadow-lg sticky top-0 bg-black z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 relative">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              onClick={handleDropdownClick}
              className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none  transition duration-300 ease-in-out"
              aria-label="Main menu containing home, live reel, projects, and studio"
              aria-expanded={expanded}
            >
              {/* <!-- Icon when menu is closed. -->
          <!-- Menu open: "hidden", Menu closed: "block" --> */}
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* <!-- Icon when menu is open. -->
          <!-- Menu open: "block", Menu closed: "hidden" --> */}
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:justify-start">
            <div className="flex-shrink-0">
              <h1 className="text-white font-bold text-xl w-auto ">KollabMe</h1>
            </div>

            <div className="hidden sm:block sm:ml-6">
              <div className="flex items-baseline">
                <a className="sr-only" href="#profilepic">
                  Skip navigation
                </a>

                <NavLink
                  exact
                  activeClassName="px-2 py-1 text-white"
                  className="px-2 py-1 text-sm font-medium leading-5 text-gray-400 hover:text-white focus:outline-none transition duration-200 ease-in-out"
                  to="/"
                >
                  Showcase
                </NavLink>
                <NavLink
                  exact
                  activeClassName="px-2 py-1 text-white"
                  className="px-2 py-1 text-sm font-medium leading-5 text-gray-400 hover:text-white focus:outline-none transition duration-200 ease-in-out"
                  to="/projects"
                >
                  My Projects
                </NavLink>
                <NavLink
                  exact
                  activeClassName="px-2 py-1 text-white"
                  className="px-2 py-1 text-sm font-medium leading-5 text-gray-400 hover:text-white focus:outline-none transition duration-200 ease-in-out"
                  to="/community"
                >
                  Community
                </NavLink>
                <NavLink
                  exact
                  activeClassName="px-2 py-1 text-white"
                  className="px-2 py-1 text-sm font-medium leading-5 text-gray-400 hover:text-white focus:outline-none transition duration-200 ease-in-out"
                  to="studio"
                >
                  Studio
                </NavLink>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <NavLink
              className="sm:mr-3 mr-1 relative flex items-center p-1 border-2 border-transparent rounded-full hover:bg-blue-500 hover:bg-opacity-50 focus:outline-none focus:text-white focus:bg-blue-500 focus:bg-opacity-50 transition duration-300 ease-out"
              to="/messages"
            >
              {user && <NavChatButton user={user} />}
            </NavLink>
            <div className="relative sm:mr-2 flex items-center p-1 border-2 border-transparent rounded-full hover:bg-red-600 hover:bg-opacity-50 focus:outline-none focus:text-white focus:bg-red-600 focus:bg-opacity-50 transition duration-300 ease-out">
              {user && <NavNotifButton user={user} />}
            </div>

            {/* <!-- Profile dropdown --> */}
            <div id="profilepic" className="ml-2 sm:ml-3 relative">
              <button
                id="user-menu"
                aria-label="User menu containing My profile, settings and sign out"
                aria-haspopup="true"
                aria-expanded={expanded}
                onClick={() => {
                  handleProfileDropdownClick();
                }}
              >
                {user && <NavProfPic user={user} />}
              </button>
              {/* <!--
            Profile dropdown panel, show/hide based on dropdown state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          --> */}

              {showProfileDropdown && (
                <div>
                  <button
                    aria-label="close user menu popup"
                    tabIndex="-1"
                    onClick={() => {
                      setShowProfileDropdown(false);
                      document.removeEventListener("keydown", handleEscape);
                    }}
                    className="fixed inset-0 h-full w-full cursor-default focus:outline-none bg-black bg-opacity-25"
                  ></button>
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg ">
                    <div
                      className="py-1 rounded-md bg-gray-300 shadow-xs"
                      role="user-menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                      aria-expanded={expanded}
                    >
                      <NavLink
                        tabIndex="0"
                        ref={myProfileRef}
                        onClick={handleProfileDropdownItemClick}
                        to={`/${user.username}`}
                        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-cardBg hover:text-white focus:bg-cardBg focus:text-white transition duration-200 ease-in-out"
                        role="menuitem"
                      >
                        My Profile
                      </NavLink>
                      <NavLink
                        onClick={handleProfileDropdownItemClick}
                        to="/settings"
                        className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-cardBg hover:text-white focus:bg-cardBg focus:text-white transition duration-200 ease-in-out"
                        role="menuitem"
                      >
                        Settings
                      </NavLink>
                      <NavLink
                        to="/"
                        onClick={logoutUser}
                        className="block cursor-pointer px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-cardBg hover:text-white focus:bg-cardBg focus:text-white transition duration-200 ease-in-out"
                        role="menuitem"
                      >
                        Sign out
                      </NavLink>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <!--
    Mobile menu, toggle classNamees based on menu state.
    Menu open: "block", Menu closed: "hidden"
  --> */}
      {showDropdown && (
        <div className=" block sm:hidden">
          <button
            tabIndex="-1"
            onClick={() => {
              setShowDropdown(false);
              document.removeEventListener("keydown", handleEscape);
            }}
            aria-label="close menu"
            className="fixed inset-0 h-full w-full z-20 cursor-default focus:outline-none"
          ></button>
          <div id="mobileDropdown" aria-expanded={expanded} className="px-2 pt-2 pb-3">
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="mt-1 block relative px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/"
            >
              Showcase
            </NavLink>
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="mt-1 block relative px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/projects"
            >
              My Projects
            </NavLink>
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="mt-1 block relative px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/community"
            >
              Community
            </NavLink>
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="mt-1 block relative px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/studio"
            >
              Studio
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  ) : (
    <nav className="shadow-lg sticky top-0 bg-black z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-12 relative">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* <!-- Mobile menu button--> */}
            <button
              onClick={handleDropdownClick}
              aria-pressed={expanded}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:bg-black focus:text-white transition duration-200 ease-in-out"
              aria-label="Main menu containing home, live reel, projects, and studio"
              aria-expanded={expanded}
            >
              {/* <!-- Icon when menu is closed. -->
          <!-- Menu open: "hidden", Menu closed: "block" --> */}
              <svg
                className="block h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* <!-- Icon when menu is open. -->
          <!-- Menu open: "block", Menu closed: "hidden" --> */}
              <svg
                className="hidden h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            {/* <!-- End Mobile menu button--> */}
          </div>
          <div className="flex-1 flex items-center justify-center sm:justify-start">
            <div className="flex-shrink-0">
              <h1 className="text-white font-bold text-xl w-auto ">KollabMe</h1>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex">
                <NavLink
                  exact
                  activeClassName="px-2 py-1 text-white"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-4 text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
                  to="/"
                >
                  Showcase
                </NavLink>
                <NavLink
                  exact
                  activeClassName="px-2 py-1 text-white"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-4 text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
                  to="/login"
                >
                  My Projects
                </NavLink>
                <NavLink
                  exact
                  activeClassName="px-2 py-1 bg-tra nsparent text-white"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-4 text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
                  to="/community"
                >
                  Community
                </NavLink>
                <NavLink
                  exact
                  activeClassName="px-2 py-1 text-white"
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium leading-4 text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
                  to="/studio"
                >
                  Studio
                </NavLink>
              </div>
            </div>
          </div>
          <div className="absolute top-0 mt-4 sm:mt-0 right-0 flex items-center pr-2 text-sm md:text-base sm:static sm:ml-2 sm:pr-0">
            <NavLink
              to="/signup"
              className="cursor-pointer text-white h-auto font-medium rounded py-1 px-2 bg-gradient-to-r from-white to-gray-800 hover:bg-gradient-to-r hover:from-teal-300 hover:to-teal-600 focus:outline-none focus:border-2  focus:border-gray-700 transition duration-300 ease-out"
            >
              Sign Up
            </NavLink>

            <NavLink
              to="/login"
              className="cursor-pointer text-white h-auto font-medium shadow-md py-1 px-2 ml-4 border border-gray-300 rounded hover:bg-teal-600 focus:border-2  focus:border-gray-700 focus:outline-none focus:text-gray-900 focus:bg-black transition duration-200 ease-out"
            >
              Login
            </NavLink>
          </div>
        </div>
      </div>

      {/* <!--
    Mobile menu, toggle classNamees based on menu state.

    Menu open: "block", Menu closed: "hidden"
  --> */}
      {/* <!--
            Profile dropdown panel, show/hide based on dropdown state.

            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          --> */}
      {showDropdown && (
        <div className="block sm:hidden">
          <button
            tabIndex="-1"
            onClick={() => {
              setShowDropdown(false);
              document.removeEventListener("keydown", handleEscape);
            }}
            aria-label="close menu"
            className="fixed inset-0 h-full w-full z-10 cursor-default focus:outline-none bg-red-500"
          ></button>
          <div aria-expanded={expanded} className="px-2 pt-2 pb-3 ">
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="relative mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/"
            >
              Showcase
            </NavLink>
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="relative mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/login"
            >
              My Projects
            </NavLink>
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="relative mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/community"
            >
              Community
            </NavLink>
            <NavLink
              exact
              onClick={handleDropdownItemClick}
              activeClassName="px-2 py-1 text-white"
              className="relative mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-black focus:outline-none focus:text-white focus:bg-black transition duration-200 ease-in-out"
              to="/studio"
            >
              Studio
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );

  return navbar;
}

export default Navbar;
