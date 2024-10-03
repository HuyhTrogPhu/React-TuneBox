import axios from 'axios';
import Cookies from 'js-cookie';

// const categoryButtons = document.querySelectorAll('.btn-category');
                    
// categoryButtons.forEach(button => {
//     button.addEventListener('click', () => {
//         // Toggle the 'active' class for the button
//         button.classList.toggle('active');
//     });
// });
export const checkSignup = async (formData) => {
  try {
    const response = await axios.post('http://localhost:8080/User/check', formData);
    return response.data; 
  } catch (error) {
    throw error; 
  }
};



export const fetchDataNgheSi = async () => {
  try {
    const response = await axios.get('http://localhost:8080/inspired/getall');
    const data = response.data;
    return data;
  } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    
}
};


export const fetchDataTheLoai = async () => {
  try {
    const response = await axios.get('http://localhost:8080/Genre/getall');
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const fetchDataSoThich = async () => {
  try {
    const response = await axios.get('http://localhost:8080/talent/getall');
    const data = response.data;
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
export const saveToLocalStorage = (formData) => {
  
  const jsonFormattedData = {
    userDto: {
      email: formData.email,
      password: formData.password,
      userName: formData.userName,
      userNickname:formData.userNickname
    },
    listInspiredBy: formData.listInspiredBy,  
    listTalent: formData.listTalent,
    genreBy: formData.genreBy
  };

 localStorage.setItem('userData', JSON.stringify(jsonFormattedData));
  
  console.log(localStorage)
};

export const sendDataToAPI = async (formData)  => {
  const jsonFormattedData = {
    userDto: {
      email: formData.email,
      password: formData.password,
      userName: formData.userName,
      userNickname:formData.userNickname
    },
    listInspiredBy: formData.listInspiredBy,
    listTalent: formData.listTalent,
    genreBy: formData.genreBy
  };

  await axios.post('http://localhost:8080/User/sign-up', jsonFormattedData,{withCredentials:true})
    .then(response => {
      console.log('Data sent to API:', response.data);
        Cookies.set("UserID", response.data.data.id, { expires: 7 }); // Cookie sẽ hết hạn sau 7 ngày
        console.log('Dữ liệu đã được lưu vào cookie:', "UserID", response.data.data.id);
  return response.data.status;
    })
    .catch(error => {
      if (error.response) {
        // Phản hồi từ server với mã lỗi
        console.error('Lỗi từ server:', error.response.status, error.response.data);
      } else if (error.request) {
        // Yêu cầu đã được gửi đi nhưng không có phản hồi từ server
        console.error('Không nhận được phản hồi từ server:', error.request);
      } else {
        // Lỗi khi cấu hình yêu cầu
        console.error('Lỗi trong quá trình cấu hình yêu cầu:', error.message);
      }
      console.error('Config lỗi:', error.config);
    });
};
