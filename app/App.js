import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import AuthRoute from "./utils/AuthRoute";
// Components
import Navbar from "./components/Navbar/Navbar";
// Pages
import HomeGuest from "./pages/Community";
import Projects from "./pages/Projects";
import Development from "./pages/Development";
import Studio from "./pages/Studio";
import About from "./pages/About";
import TermsAndConditions from "./pages/TermsAndConditions";
import Privacy from "./pages/Privacy";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import SinglePost from "./pages/SinglePost";
import Profile from "./pages/Profile";
import Notification from "./pages/Notification";
import ResetPassword from "./pages/ResetPassword";
import Message from "./pages/Message";
import MessageContainer from "./components/Messaging/MessageContainer";
import SingleTrack from "./pages/SingleTrack";
import Showcase from "./pages/Showcase";
import SinglePainting from "./pages/SinglePainting";
import NotFound from "./pages/NotFound";
// Google Analytics
import ReactGa from "react-ga";
// Auth Context
import { AuthProvider } from "./context/auth";
import Modal from "react-modal";

Modal.setAppElement("#app");

const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    marginTop: "3rem",
    transform: "translate(-50%, -50%)",
    background: "rgba(0,0,0,0)",
    border: "none",
  },
  overlay: {
    zIndex: 999,
    overflowY: "scroll",
    background: "rgba(0,0,0,0.6)",
  },
};

import "./index.css";

// TODO: Use environment variables
const uri = "/api";

function App() {
  useEffect(() => {
    ReactGa.initialize("UA-178445755-1");
    ReactGa.pageview(window.location.pathname + window.location.search);
    fetch(`${uri}/refreshToken`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
    })
      .then(async (res) => {
        const { accessToken } = await res.json();
        localStorage.setItem("accessToken", accessToken);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="font-sans antialiased">
          <Navbar />

          {/* <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => {
              setModalIsOpen(false);
            }}
            style={modalStyles}
            shouldCloseOnOverlayClick={true}
          >
           {modalView === modalViews.FOLLOWER_STATS_VIEW && <FollowerStats>}
           {modalView === modalViews.FOLLOWER_STATS_VIEW && <FollowerStats>}
           {modalView === modalViews.FOLLOWER_STATS_VIEW && <FollowerStats>}
           {modalView === modalViews.FOLLOWER_STATS_VIEW && <FollowerStats>}
           {modalView === modalViews.FOLLOWER_STATS_VIEW && <FollowerStats>}
          </Modal> */}

          {/* Routing */}
          <Switch>
            <AuthRoute path="/signup" component={Register} />
            <AuthRoute path="/login" component={Login} />
            <Route exact path="/" component={Showcase} />
            <Route path="/projects" component={Projects} />
            <Route path="/community" component={HomeGuest} />
            <Route path="/studio" component={Studio} />
            <Route path="/:username/tracks/:trackId" component={SingleTrack} />
            {/* <Route path="/:username/albums/:albumId" component={} /> */}
            <Route path="/:username/gallery/:paintingId" component={SinglePainting} />
            <Route path="/development" component={Development} />
            <Route path="/about" component={About} />
            <Route path="/terms" component={TermsAndConditions} />
            <Route path="/privacy" component={Privacy} />
            <Route path="/notifications" component={Notification} />
            <Route path="/messages/:chatId-:userId" component={MessageContainer} />
            <Route path="/messages" component={Message} />
            <Route exact path="/:username" component={Profile} />
            <Route path="/:username/posts/:postId" component={SinglePost} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:resetPassToken" component={ResetPassword} />
            <Route component={NotFound} />
          </Switch>

          {/* End Routing */}

          {/* <Footer /> */}
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
