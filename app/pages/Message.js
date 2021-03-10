import React, { useState } from "react";
import { NavLink } from "react-router-dom";
// Modals
import Modal from "react-modal";
// Context
import { useAuthState } from "../context/auth";
// Apollo Client
import { useQuery, gql } from "@apollo/client";
// Utils
import moment from "moment";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
// Components
import Page from "../components/Shared/Page";
import NewConvoModal from "../components/Modals/NewConvoModal";
import LoadingSpinner from "../components/Shared/LoadingSpinner";
import ContactCard from "../components/Messaging/ContactCard";
import SearchBar from "../components/Search/UserSearchBar";

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
    background: "rgba(0,0,0,0.5)",
  },
};

function Message() {
  let chats = [];
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { user } = useAuthState();

  const { loading, error, data } = useQuery(GET_USER_CHATS, {
    variables: { userId: user.id },
    update: (_, res) => {
      console.log(res);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  if (data) {
    chats = data.getUserChats;
  }

  return (
    <Page title="Messages">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
      >
        <NewConvoModal setModalIsOpen={setModalIsOpen} />
      </Modal>

      <div className="text-white mt-20 max-w-2xl mx-auto">
        <SearchBar />
        <div className="flex justify-end">
          <button
            onClick={() => setModalIsOpen(true)}
            className="mt-2 bg-gray-800  text-teal-400 bg-opacity-25 py-1 px-2 text-xs sm:text-sm font-bold shadow-md rounded-md focus:outline-none"
          >
            Start conversation +
          </button>
        </div>
        {loading ? (
          <div className="flex mt-16 justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div>
            {user &&
              data &&
              chats &&
              chats.map((chat) => {
                const profilePic =
                  user.username === chat.sendTo.username
                    ? chat.owner.profilePic
                    : chat.sendTo.profilePic;
                const username =
                  user.username === chat.sendTo.username
                    ? chat.owner.username
                    : chat.sendTo.username;
                const sendToId = user.id === chat.sendTo.id ? chat.owner.id : chat.sendTo.id;
                const body = chat.messages[0] ? chat.messages.slice(-1)[0].body : "";

                const createdAt = chat.messages[0]
                  ? moment(chat.messages.slice(-1)[0].createdAt).fromNow()
                  : "";
                return (
                  <NavLink key={chat.id} to={`/messages/${chat.id}-${sendToId}`} className="">
                    <ContactCard
                      onClick={() => {
                        setShowMsgContainer(true);
                      }}
                      profilePic={profilePic}
                      username={capitalizeFirstLetter(username)}
                      body={body}
                      createdAt={createdAt}
                      isCollaborating={true}
                    />
                  </NavLink>
                );
              })}
          </div>
        )}
      </div>
    </Page>
  );
}

const GET_USER_CHATS = gql`
  query getUserChats($userId: ID!) {
    getUserChats(userId: $userId) {
      createdAt
      owner {
        id
        username
        profilePic
      }
      id
      sendTo {
        id
        username
        profilePic
      }
      messages {
        id
        createdAt
        body
      }
    }
  }
`;

export default Message;
