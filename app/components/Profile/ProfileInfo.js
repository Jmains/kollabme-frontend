import React from "react";

function ProfileInfo({ user, profileData, setModalIsOpen }) {
  let hideOpenModalButton = "hidden";
  if (user && user.username === profileData.username) {
    hideOpenModalButton = "mt-3 flex justify-end";
  }
  return (
    <div className="bg-cardBg rounded-sm shadow-lg text-sm px-4 lg:px-3 py-3 text-gray-50 font-bold tracking-wider">
      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div className="">
          <p className="md:text-sm text-sm">Main Platforms</p>
          {profileData.mainPlatforms &&
            profileData.mainPlatforms.map((platform, i) => (
              <div key={i}>
                {platform && (
                  <p className="mt-2 text-gray-400 font-medium font md:text-sm text-xs">
                    - {platform}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div>
          <p className="md:text-sm text-sm">Genres</p>
          {profileData.genres &&
            profileData.genres.map((genre, i) => (
              <div key={i}>
                {genre && (
                  <p className="mt-2 text-gray-400 font-medium md:text-sm text-xs">
                    - {genre}
                  </p>
                )}
              </div>
            ))}
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div>
          <p className="md:text-sm text-sm">Business Email</p>

          <div>
            {profileData.businessEmail && (
              <p className="mt-2 text-gray-400 font-medium font md:text-sm text-xs">
                - {profileData.businessEmail}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div>
          <p className="md:text-sm text-sm">Name</p>
          {profileData.firstName && profileData.lastName && (
            <p className="text-gray-400 font-medium md:text-sm text-xs max-w-xs ">{`${profileData.firstName} ${profileData.lastName}`}</p>
          )}
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div>
          <p className="md:text-sm text-sm">Age</p>
          <p className="text-gray-400 font-medium md:text-sm text-xs mt-1">
            - {profileData.age}
          </p>
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div>
          <p className="md:text-sm text-sm">City</p>
          <p className="text-gray-400 font-medium md:text-sm text-xs mt-1">
            - {profileData.city}
          </p>
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div>
          <p className="md:text-sm text-sm">State</p>
          <p className="text-gray-400 font-medium md:text-sm text-xs mt-1">
            - {profileData.state}
          </p>
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div>
          <p className="md:text-sm text-sm">Gender</p>
          <p className="text-gray-400 font-medium md:text-sm text-xs mt-1">
            - {profileData.gender}
          </p>
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div className="">
          <p className="md:text-sm text-sm">Inspiration</p>
          <p className="text-gray-400 font-medium mt-2 md:text-sm text-xs">
            {profileData.inspiration}
          </p>
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div className="">
          <p className="md:text-sm text-sm">Biography</p>
          <p className="text-gray-400 font-medium mt-2 md:text-sm text-xs">
            {profileData.bio}
          </p>
        </div>
      </div>

      <div className="shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div className="">
          <p className="md:text-sm text-sm">Current Favorite Song</p>
          <p className="text-gray-400 font-medium mt-2 md:text-sm text-xs">
            {profileData.currentFavSong}
          </p>
        </div>
      </div>

      <div className=" shadow-md rounded-sm p-2 bg-black bg-opacity-25">
        <div className="">
          <p className="md:text-sm text-sm">Favorite Childhood Song</p>
          <p className="text-gray-400 font-medium mt-2 md:text-sm text-xs">
            {profileData.favChildhoodSong}
          </p>
        </div>
      </div>

      <div className={hideOpenModalButton}>
        <button
          onClick={() => {
            setModalIsOpen(true);
          }}
          className="py-1 px-3 text-xs md:text-sm text-gray-900 bg-gradient-to-r from-teal-400 to-teal-700 hover:bg-gradient-to-r hover:from-teal-300 hover:to-teal-600 font-semibold rounded-full tracking-wide shadow-md  border-gray-600 transition ease-out duration-500"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ProfileInfo;
