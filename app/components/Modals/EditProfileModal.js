import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const formStyle = {
  resize: "none",
  background: "rgba(255, 255, 255, 0.07)",
};

function EditProfileModal(props) {
  const userInfo = props.userInfo;
  const [businessEmail, setBusinessEmail] = useState(userInfo.businessEmail);
  const [firstName, setFirstName] = useState(userInfo.firstName);
  const [lastName, setLastName] = useState(userInfo.lastName);
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [mainPlatform, setPlatform] = useState(userInfo.mainPlatforms);
  const [mainPlatform1, setPlatform1] = useState(userInfo.mainPlatforms[0]);
  const [mainPlatform2, setPlatform2] = useState(userInfo.mainPlatforms[1]);
  const [mainPlatform3, setPlatform3] = useState(userInfo.mainPlatforms[2]);
  const [genre1, setGenre1] = useState(userInfo.genres[0]);
  const [genre2, setGenre2] = useState(userInfo.genres[1]);
  const [genre, setGenre] = useState(userInfo.genres);
  const [age, setAge] = useState(userInfo.age);
  const [city, setCity] = useState(userInfo.city);
  const [state, setState] = useState(userInfo.state);
  const [gender, setGender] = useState(userInfo.gender);
  const [inspiration, setInspiration] = useState(userInfo.inspiration);
  const [bio, setBio] = useState(userInfo.bio);
  const [currentFavSong, setCurrentFavSong] = useState(userInfo.currentFavSong);
  const [favChildhoodSong, setFavChildhoodSong] = useState(userInfo.favChildhoodSong);

  const [updateProfile, { error, loading, data }] = useMutation(UPDATE_USER_PROFILE, {
    variables: {
      userId: props.userId,
      updateUserProfileInput: {
        businessEmail: businessEmail,
        displayName: displayName,
        firstName: firstName,
        lastName: lastName,
        mainPlatforms: mainPlatform,
        genres: genre,
        age: age,
        city: city,
        state: state,
        gender: gender,
        inspiration: inspiration,
        bio: bio,
        currentFavSong: currentFavSong,
        favChildhoodSong: favChildhoodSong,
      },
    },
  });
  if (error) {
    console.log("error", error.graphQLErrors[0]);
  }

  async function handleGenres() {
    setGenre([genre1, genre2]);
  }
  async function handlePlatforms() {
    setPlatform([mainPlatform1, mainPlatform2, mainPlatform3]);
  }
  async function updateUserFinal() {
    try {
      await handlePlatforms();
      await handleGenres();

      await updateProfile();
    } catch (err) {
      console.log("error:", err);
    }
  }

  async function submit(e) {
    e.preventDefault();
    document.body.style.overflow = "";
    await updateUserFinal();
    props.setModalIsOpen(false);
  }

  return (
    <div className="bg-cardBg mt-20">
      <form
        style={formStyle}
        className="rounded-lg shadow-lg text-sm md:text-base px-8 lg:px-5 py-5 text-gray-50 font-medium tracking-wider"
        onSubmit={submit}
      >
        {/* mainPlatform */}
        <div>
          <label htmlFor="Main Platforms">Main Platforms</label>
          <div className="grid grid-cols-3 gap-x-4">
            {/* first platform */}
            <div className="relative">
              <select
                name="mainPlatform 1"
                id="mainPlatform1"
                style={formStyle}
                onChange={(e) => setPlatform1(e.target.value)}
                value={mainPlatform1}
                className="block text-sm rounded-md text-gray-400 h-10 appearance-none w-full py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                placeholder="Select first platform--"
                required
              >
                {mainPlatforms &&
                  mainPlatforms.map(({ mainPlatform, value }, i) => {
                    return (
                      <option key={i} value={value} className="text-gray-700">
                        {mainPlatform}
                      </option>
                    );
                  })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {/* second platform */}

            <div className="relative">
              <select
                style={formStyle}
                onChange={(e) => setPlatform2(e.target.value)}
                value={mainPlatform2}
                className="block text-sm rounded-md text-gray-400 h-10 appearance-none w-full py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                name="mainPlatform 2"
                id="mainPlatform2"
                placeholder="(Optional) Select second platform--"
              >
                {mainPlatforms &&
                  mainPlatforms.map(({ mainPlatform, value }, i) => {
                    return (
                      <option key={i} value={value} className="text-gray-700">
                        {mainPlatform}
                      </option>
                    );
                  })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* third platform */}

            <div className="relative">
              <select
                style={formStyle}
                onChange={(e) => setPlatform3(e.target.value)}
                value={mainPlatform3}
                className="block text-sm rounded-md text-gray-400 h-10 appearance-none w-full py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                name="mainPlatform 3"
                id="mainPlatform3"
                placeholder="(Optional) Select third platform--"
              >
                {mainPlatforms &&
                  mainPlatforms.map(({ mainPlatform, value }, i) => {
                    return (
                      <option key={i} value={value} className="text-gray-700">
                        {mainPlatform}
                      </option>
                    );
                  })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* genre */}
        <div>
          <div className="grid grid-cols-2 gap-x-4">
            <label htmlFor="genres">Genres</label>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            {/* first genre */}
            <div className="relative">
              <select
                style={formStyle}
                onChange={(e) => setGenre1(e.target.value)}
                value={genre1}
                className="block rounded-md text-sm text-gray-400 h-10 appearance-none w-full py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                name="genre 1"
                id="genre1"
                placeholder="Select first genre--"
              >
                {genres &&
                  genres.map(({ genre, value }, i) => {
                    return (
                      <option key={i} className="text-gray-700" value={value}>
                        {genre}
                      </option>
                    );
                  })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            {/* second genre */}
            <div>
              <div className="relative">
                <select
                  style={formStyle}
                  onChange={(e) => setGenre2(e.target.value)}
                  value={genre2}
                  className="block rounded-md text-sm text-gray-400 h-10 appearance-none w-full py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                  name="genre 2"
                  placeholder="Select second genre (optional)--"
                  id="genre2"
                >
                  {genres &&
                    genres.map(({ genre, value }, i) => {
                      return (
                        <option key={i} className="text-gray-700" value={value}>
                          {genre}
                        </option>
                      );
                    })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* displayName */}
        <div>
          <label htmlFor="businessEmail">Business Email</label>
          <input
            name="businessEmail"
            id="businessEmail"
            className="block shadow text-sm border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            type="email"
            maxLength="50"
            onChange={(e) => setBusinessEmail(e.target.value)}
            value={businessEmail}
          ></input>
        </div>
        {/* displayName */}
        <div>
          <label htmlFor="displayName">Display Name</label>
          <input
            name="displayName"
            id="displayName"
            className="block shadow text-sm border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            maxLength="25"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
            required
          ></input>
        </div>
        {/* first name */}
        <div>
          <label htmlFor="firstName">First Name</label>
          <input
            name="firstName"
            id="firstName"
            className="block shadow text-sm border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            maxLength="50"
            onChange={(e) => setFirstName(e.target.value)}
            value={firstName}
            required
          ></input>
        </div>
        {/* last name */}
        <div>
          <label htmlFor="lastName">Last Name</label>
          <input
            name="lastName"
            id="lastName"
            className="block shadow text-sm border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            maxLength="50"
            onChange={(e) => setLastName(e.target.value)}
            value={lastName}
          ></input>
        </div>
        {/* age */}
        <div>
          <label htmlFor="age">Age</label>
          <input
            name="age"
            id="age"
            className="block shadow text-sm border-gray-200 placeholder-current h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            value={age}
            type="number"
            min="13"
            max="110"
            onChange={(e) => {
              setAge(e.target.value);
            }}
            required
            placeholder="--Select age--"
          ></input>
        </div>
        {/* city */}
        <div>
          <label htmlFor="city">City</label>
          <input
            name="city"
            id="city"
            className="block shadow text-sm border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            maxLength="85"
            onChange={(e) => setCity(e.target.value)}
            value={city}
            required
          ></input>
        </div>
        {/* state */}
        <div className="relative">
          <label htmlFor="state">State</label>

          <select
            style={formStyle}
            onChange={(e) => {
              setState(e.target.value);
            }}
            value={state}
            className="block rounded-md text-sm text-gray-400 h-10 appearance-none w-full py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
            name="state"
            id="state"
            placeholder="--Select state--"
            required
          >
            {states &&
              states.map(({ state, value }) => {
                return (
                  <option key={state} className="text-gray-700" value={value}>
                    {state}
                  </option>
                );
              })}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {/* gender */}
        <div className="relative">
          <label className="relative" htmlFor="gender">
            Gender
          </label>
          <select
            style={formStyle}
            onChange={(e) => setGender(e.currentTarget.value)}
            value={gender}
            className="block text-sm rounded-md text-gray-400 h-10 appearance-none w-full py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
            name="gender"
            id="gender"
            required
          >
            <option className="text-gray-800" value="">
              --Select a gender--
            </option>
            <option className="text-gray-800" value="Male">
              Male
            </option>
            <option className="text-gray-800" value="Female">
              Female
            </option>
            <option className="text-gray-800" value="Other">
              Other
            </option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        <div>
          <label htmlFor="inspiration">Inspiration</label>
          <input
            className="shadow text-sm mb-3 border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            type="text"
            name="inspiration"
            id="inspiration"
            maxLength="100"
            onChange={(e) => setInspiration(e.target.value)}
            value={inspiration}
          ></input>
        </div>
        <div>
          <label htmlFor="biography">Biography</label>
          <textarea
            className="shadow text-sm mb-3 border-gray-200 h-20 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            type="text"
            rows="10"
            cols="2"
            name="biography"
            id="biography"
            maxLength="325"
            resize="none"
            onChange={(e) => setBio(e.target.value)}
            value={bio}
          ></textarea>
        </div>
        <div>
          <label htmlFor="currentFavSong">Current Favorite Song</label>
          <input
            className="shadow text-sm mb-3 border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            type="text"
            name="current favorite song"
            id="currentFavoriteSong"
            maxLength="75"
            onChange={(e) => setCurrentFavSong(e.target.value)}
            value={currentFavSong}
          ></input>
        </div>
        <div>
          <label htmlFor="favorite childhood song">Favorite Childhood Song</label>
          <input
            name="favorite childhood song"
            id="favoriteChildhoodSong"
            className="shadow text-sm mb-3 border-gray-200 h-10 rounded w-full py-2 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
            style={formStyle}
            type="text"
            maxLength="75"
            onChange={(e) => setFavChildhoodSong(e.target.value)}
            value={favChildhoodSong}
          ></input>
        </div>
        <div className="flex justify-end">
          <button
            className="py-1 px-3 mr-5 font-semibold bg-opacity-50 rounded-md tracking-wide shadow-md text-gray-400 hover:bg-opacity-100 hover:text-gray-200 bg-red-600 transition ease-out duration-300"
            onClick={() => {
              document.body.style.overflow = "";
              props.setModalIsOpen(false);
            }}
          >
            Cancel
          </button>
          <button
            className="py-1 px-3 ml-1 bg-gradient-to-r font-semibold text-gray-900 bg-white hover:bg-opacity-60 transition duration-300 ease-out rounded-md tracking-wide shadow-md"
            type="submit"
            disabled={loading}
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
}

const UPDATE_USER_PROFILE = gql`
  mutation updateUserProfile($userId: ID!, $updateUserProfileInput: UpdateUserProfileInput) {
    updateUserProfile(userId: $userId, updateUserProfileInput: $updateUserProfileInput) {
      id
      mainPlatforms
      genres
      displayName
      firstName
      lastName
      age
      city
      businessEmail
      state
      gender
      bio
      favChildhoodSong
      currentFavSong
      inspiration
    }
  }
`;

const mainPlatforms = [
  { mainPlatform: "--Select main platform--", value: "" },
  {
    mainPlatform: "MC",
    value: "MC",
  },
  {
    mainPlatform: "Artist",
    value: "Artist",
  },
  {
    mainPlatform: "Lyricist",
    value: "Lyricist",
  },
  {
    mainPlatform: "MC/Rapper",
    value: "MC/Rapper",
  },
  {
    mainPlatform: "Singer",
    value: "Singer",
  },
  {
    mainPlatform: "Painter",
    value: "Painter",
  },
  {
    mainPlatform: "Musician",
    value: "Musician",
  },
  {
    mainPlatform: "Actor",
    value: "Actor",
  },
  {
    mainPlatform: "Comedian",
    value: "Comedian",
  },
  {
    mainPlatform: "Promoter",
    value: "Promoter",
  },
  {
    mainPlatform: "Poet",
    value: "Poet",
  },
  {
    mainPlatform: "Event Planner",
    value: "Event Planner",
  },
  {
    mainPlatform: "Manager/PR",
    value: "Manager/PR",
  },
  {
    mainPlatform: "Graphic Designer",
    value: "Graphic Designer",
  },
  {
    mainPlatform: "Interior Designer",
    value: "Interior Designer",
  },
  {
    mainPlatform: "Fashion Designer",
    value: "Fashion Designer",
  },
  {
    mainPlatform: "DJ/Beatmaker",
    value: "DJ/Beatmaker",
  },
  {
    mainPlatform: "Producer",
    value: "Producer",
  },
  {
    mainPlatform: "Cartoonist",
    value: "Cartoonist",
  },
  {
    mainPlatform: "Screenwriter",
    value: "Screenwriter",
  },
  {
    mainPlatform: "Video Editor",
    value: "Video Editor",
  },
  {
    mainPlatform: "Audio Engineer",
    value: "Audio Engineer",
  },
  {
    mainPlatform: "Label",
    value: "Label",
  },
  {
    mainPlatform: "Visual FX",
    value: "Visual FX",
  },
  {
    mainPlatform: "Studio Operator",
    value: "Studio Operator",
  },
  {
    mainPlatform: "Photography",
    value: "Photography",
  },
  {
    mainPlatform: "Videography",
    value: "Videography",
  },
  {
    mainPlatform: "Dancer",
    value: "Dancer",
  },
  {
    mainPlatform: "Illustrator",
    value: "Illustrator",
  },
  {
    mainPlatform: "Modeling",
    value: "Modeling",
  },
  {
    mainPlatform: "Animator",
    value: "Animator",
  },
  {
    mainPlatform: "Tattoo Artist",
    value: "Tattoo Artist",
  },
  {
    mainPlatform: "Stage Performer",
    value: "Stage Performer",
  },
  {
    mainPlatform: "Song Writing",
    value: "Song Writing",
  },
  {
    mainPlatform: "Other Business Type",
    value: "Other Business Type",
  },
];

const genres = [
  { genre: "--Select your genre--", value: "" },
  {
    genre: "Hip-hop",
    value: "Hip-hop",
  },
  {
    genre: "Pop",
    value: "Pop",
  },
  {
    genre: "Rock",
    value: "Rock",
  },
  {
    genre: "Jazz",
    value: "Jazz",
  },
  {
    genre: "Musical Theatre",
    value: "Musical Theatre",
  },
  {
    genre: "Folk Music",
    value: "Folk Music",
  },
  {
    genre: "Blues",
    value: "Blues",
  },
  {
    genre: "Country",
    value: "Country",
  },
  {
    genre: "Heavy Metal",
    value: "Heavy Metal",
  },
  {
    genre: "Rhythm and Blues",
    value: "Rhythm and Blues",
  },
  {
    genre: "Classical Music",
    value: "Classical Music",
  },
  {
    genre: "Soul",
    value: "Soul",
  },
  {
    genre: "Funk",
    value: "Funk",
  },
  {
    genre: "Reggae",
    value: "Reggae",
  },
  {
    genre: "Singing",
    value: "Singing",
  },
  {
    genre: "Punk Rock",
    value: "Punk Rock",
  },
  {
    genre: "World Music",
    value: "World Music",
  },
  {
    genre: "Dance Music",
    value: "Dance Music",
  },
  {
    genre: "Electronic Music",
    value: "Electronic Music",
  },
  {
    genre: "House Music",
    value: "House Music",
  },
  {
    genre: "Electronic Dance Music",
    value: "Electronic Dance Music",
  },
  {
    genre: "Instrumental",
    value: "Instrumental",
  },
  {
    genre: "Disco",
    value: "Disco",
  },
  {
    genre: "Gospel Music",
    value: "Gospel Music",
  },
  {
    genre: "Techno",
    value: "Techno",
  },
  {
    genre: "Popular Music",
    value: "Popular Music",
  },
  {
    genre: "Christian Music",
    value: "Christian Music",
  },
  {
    genre: "Orchestra",
    value: "Orchestra",
  },
  {
    genre: "Opera",
    value: "Opera",
  },
  {
    genre: "Progressive Rock",
    value: "Progressive Rock",
  },
  {
    genre: "Art Music",
    value: "Art Music",
  },
  {
    genre: "Contemporary Classical Music",
    value: "Contemporary Classical Music",
  },
  {
    genre: "Easy Listening",
    value: "Easy Listening",
  },
  {
    genre: "Pop Rock",
    value: "Pop Rock",
  },
  {
    genre: "Soundtrack",
    value: "Soundtrack",
  },
  {
    genre: "Trance Music",
    value: "Trance Music",
  },
  {
    genre: "Religious Music",
    value: "Religious Music",
  },
  {
    genre: "Alternative Rock",
    value: "Alternative Rock",
  },
  {
    genre: "Swing Music",
    value: "Swing Music",
  },
  {
    genre: "Medival Music",
    value: "Medival Music",
  },
  {
    genre: "Dance-Pop",
    value: "Dance-Pop",
  },
  {
    genre: "Ambient Music",
    value: "Ambient Music",
  },
  {
    genre: "Progressive Music",
    value: "Progressive Music",
  },
  {
    genre: "Psychedelic",
    value: "Psychedelic",
  },
  {
    genre: "Bluegrass",
    value: "Bluegrass",
  },
  {
    genre: "Rapping",
    value: "Rapping",
  },
  {
    genre: "Chant",
    value: "Chant",
  },
  {
    genre: "Baroque Music",
    value: "Baroque Music",
  },
  {
    genre: "Dub",
    value: "Dub",
  },
  {
    genre: "Dubstep",
    value: "Dubstep",
  },
  {
    genre: "Latin Music",
    value: "Latin Music",
  },
];

const states = [
  { state: "--Please select a state--", value: "" },
  {
    state: "Alabama",
    value: "AL",
  },
  {
    state: "Alaska",
    value: "AK",
  },
  {
    state: "Arizona",
    value: "AZ",
  },
  {
    state: "Arkansas",
    value: "AR",
  },
  {
    state: "California",
    value: "CA",
  },
  {
    state: "Colorado",
    value: "CO",
  },
  {
    state: "Connecticut",
    value: "CT",
  },
  {
    state: "Delaware",
    value: "DE",
  },
  {
    state: "District Of Columbia",
    value: "DC",
  },
  {
    state: "Florida",
    value: "FL",
  },
  {
    state: "Georgia",
    value: "GA",
  },
  {
    state: "Hawaii",
    value: "HI",
  },
  {
    state: "Idaho",
    value: "ID",
  },
  {
    state: "Illinois",
    value: "IL",
  },
  {
    state: "Indiana",
    value: "IN",
  },
  {
    state: "Iowa",
    value: "IA",
  },
  {
    state: "Kansas",
    value: "KS",
  },
  {
    state: "Kentucky",
    value: "KY",
  },
  {
    state: "Louisiana",
    value: "LA",
  },
  {
    state: "Maine",
    value: "ME",
  },
  {
    state: "Maryland",
    value: "MD",
  },
  {
    state: "Massachusetts",
    value: "MA",
  },
  {
    state: "Michigan",
    value: "MI",
  },
  {
    state: "Minnesota",
    value: "MN",
  },
  {
    state: "Mississippi",
    value: "MS",
  },
  {
    state: "Missouri",
    value: "MO",
  },
  {
    state: "Montana",
    value: "MT",
  },
  {
    state: "Nebraska",
    value: "NE",
  },
  {
    state: "Nevada",
    value: "NV",
  },
  {
    state: "New Hampshire",
    value: "NH",
  },
  {
    state: "New Jersey",
    value: "NJ",
  },
  {
    state: "New Mexico",
    value: "NM",
  },
  {
    state: "New York",
    value: "NY",
  },
  {
    state: "North Carolina",
    value: "NC",
  },
  {
    state: "North Dakota",
    value: "ND",
  },
  {
    state: "Ohio",
    value: "OH",
  },
  {
    state: "Oklahoma",
    value: "OK",
  },
  {
    state: "Oregon",
    value: "OR",
  },
  {
    state: "Pennsylvania",
    value: "PA",
  },
  {
    state: "Rhode Island",
    value: "RI",
  },
  {
    state: "South Carolina",
    value: "SC",
  },
  {
    state: "South Dakota",
    value: "SD",
  },
  {
    state: "Tennessee",
    value: "TN",
  },
  {
    state: "Texas",
    value: "TX",
  },
  {
    state: "Utah",
    value: "UT",
  },
  {
    state: "Vermont",
    value: "VT",
  },
  {
    state: "Virginia",
    value: "VA",
  },
  {
    state: "Washington",
    value: "WA",
  },
  {
    state: "West Virginia",
    value: "WV",
  },
  {
    state: "Wisconsin",
    value: "WI",
  },
  {
    state: "Wyoming",
    value: "WY",
  },
];

export default EditProfileModal;
