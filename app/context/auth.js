import React, { createContext, useContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
  user: null,
};

if (localStorage.getItem("accessToken")) {
  const decodedToken = jwtDecode(localStorage.getItem("accessToken"));
  if (decodedToken) {
    initialState.user = decodedToken;
  }
}

const AuthStateContext = createContext({
  user: null,
});

const AuthDispatchContext = createContext({
  login: () => {},
  logout: () => {},
});

function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem("accessToken", userData.accessToken);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  function logout() {
    localStorage.removeItem("accessToken");
    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthStateContext.Provider value={{ user: state.user }}>
      <AuthDispatchContext.Provider value={{ login, logout }}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
}

function useAuthState() {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error("useAuthState msy be used within a AuthProvider");
  }
  return context;
}

function useAuthDispatch() {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error("useAuthDispatch msy be used within a AuthProvider");
  }
  return context;
}

export { useAuthDispatch, useAuthState, AuthProvider };
