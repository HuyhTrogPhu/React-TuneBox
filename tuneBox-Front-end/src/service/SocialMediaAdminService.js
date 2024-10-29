import axios from "axios";


//load userDetail
export const LoadUserDetail = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/userInfor/get/${id}`,
        { withCredentials: true }
      );
      const data = response.data;
      console.log("userDetail:", data);
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

    //get all post API
    export const LoadAllPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8082/SocialAdmin/static/getAllpost`,
          { withCredentials: true }
        );
        const data = response.data;
        console.log("AllPost:", data);
        return data;
      } catch (error) {
        console.error("Error fetching user posts:", error);
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
    const response = await axios.get(`http://localhost:8082/SocialAdmin/static/comment/${commentId}`);
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
