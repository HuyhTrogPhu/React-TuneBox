import axios from "axios";

//load userDetail
export const LoadUserDetail = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUs/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("API back detail user:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//load User track
export const LoadUserTrack = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/customer/tracks/user/${id}`,
      { withCredentials: true }
    );
    const data = response;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
//load User Albums
export const LoadUserAlbums = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUserAlbums/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//load User PlayList
export const LoadUserPlayList = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUserPlayList/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//load user
export const LoadUser = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUs/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("user:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


//load all user
export const LoadAllUser = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAllUser`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
//load all Track
export const LoadTrack = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAllTrack`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
//load track by ID
export const LoadTrackById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrack/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//load comment by TrackID
export const LoadCommentByTrackID = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrackCommentbyId/${id}`,
      { withCredentials: true }
    );

    return response;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
//load replies dua tren commentID
export const getRepliesByComment = async (commentId) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/comment/${commentId}`
    );
    console.log(response.data);
    return response.data; // Trả về danh sách replies
  } catch (error) {
    throw new Error(error.response.data.message || "Error fetching replies");
  }
};
//load all PLayList
export const LoadPLayList = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAllPlayList`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//load PlayList by ID
export const LoadPlayListById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getPLayList/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//load all Album
export const LoadAlbum = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAllAlbums`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//load all Track<Report>
export const LoadTrackReport = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrackReport?page=${page}&size=${size}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
//load all Post<Report>
export const LoadPostReport = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getPostReport?page=${page}&size=${size}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
//load all Album<Report>
export const LoadAlbumReport = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAlbumReport?page=${page}&size=${size}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
//load Report
export const LoadReportDetail = async (id) => {
  try {
    const response = await axios.get(`http://localhost:8082/SocialAdmin/static/getReport/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//DeniedRP
export const DeniedRP = async (id) => {
  try {
    const response = await axios.put(
      `http://localhost:8082/SocialAdmin/static/DeniedRP/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

//ApproveRP
export const ApproveRP = async (id) => {
  try {
    const response = await axios.put(
      `http://localhost:8082/SocialAdmin/static/ApproveRP/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};


//load Albums by ID
export const LoadAlbumsById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAlbums/${id}`,
      { withCredentials: true }
    );
    const data = response.data;
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};
// load user count between dates
export const LoadUserCountBetweenDates = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUserBeetWeen/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("User count between dates:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};


// load Track Genre count between dates
export const LoadTrackCountBetweenDatesGenre = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrackGenreBeetWeen/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("Genre:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
// load User count between week
export const LoadUserCountBetweenWeek = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUserBeetWeenWeek/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("User count between week:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};// load User count between month
export const LoadUserCountBetweenMonth = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUserBetweenMonth/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("Track count between month:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};


// load Track count between dates
export const LoadTrackCountBetweenDates = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrackBeetWeen/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("post count between dates:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
// load Track count between week
export const LoadTrackCountBetweenWeek = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrackBeetWeenWeek/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("User count between week:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};// load Track count between month
export const LoadTrackCountBetweenMonth = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrackBetweenMonth/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("Track count between month:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};


// load Album count between dates
export const LoadAlbumCountBetweenDates = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAlbumBeetWeen/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("Album count between dates:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

// load Album count between week
export const LoadAlbumCountBetweenWeek = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAlbumBeetWeenWeek/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("User Album between week:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};// load Album count between month
export const LoadAlbumCountBetweenMonth = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAlbumBetweenMonth/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("Album count between month:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

//playlist
// load PlayList count between dates
export const LoadPlayListCountBetweenDates = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getPlayListBeetWeen/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("PlayList count between dates:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

// load PlayList count between week
export const LoadPlayListountBetweenWeek = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getPlayListBeetWeenWeek/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("User PlayList between week:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

// load PlayList count between month
export const LoadPlayListCountBetweenMonth = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getPlayListBetweenMonth/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("Album count between month:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
// load most followed
export const LoadMostFollowed = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getMostFollowed`,
      { withCredentials: true }
    );
    const data = response.data;
    console.log("LoadMostFollowed:", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};

// load most track uploader
export const LoadMostUploader = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getMostTrackUploader/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data.data;
    console.log("MostTrackUploader", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
// load PlayList for table
export const LoadPlayListFortable = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getPlayListToTable/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data.data;
    console.log("LoadPlayListFortable", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
// load  user for table
export const LoadUserForTable = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getUserToTable/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data.data;
    const mess = response.data.message;
    console.log("getUserToTable", data);
    console.log("Log", mess );
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
// load track for table
export const LoadTrackForTable = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getTrackToTable/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data.data;
    console.log("getTrackToTable", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
// load  Album for table
export const LoadAlbumForTable = async (startDate, endDate) => {
  try {
    const response = await axios.get(
      `http://localhost:8082/SocialAdmin/static/getAlbumToTable/${startDate}/${endDate}`,
      { withCredentials: true }
    );
    const data = response.data.data;
    console.log("getAlbumToTable", data);
    return data;
  } catch (error) {
    console.error("Error fetching user count:", error);
    throw error;
  }
};
