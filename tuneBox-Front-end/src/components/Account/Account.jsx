import React, { useState, useEffect } from 'react';
import './Account.css';
import Cookies from 'js-cookie';
import { getUserAccountSetting, updateUserEmail, updateUserBirthday, updateUserGender, updateUserPhoneNumber } from '../../service/UserService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Account = () => {
  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const [userEmail, setEmail] = useState('');
  const [userPhoneNum, setPhoneNum] = useState('');
  const [userBirthDay, setBirthDay] = useState('');
  const [userGender, setGender] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');

  // Fetch thông tin user
  useEffect(() => {
    const userIdCookie = Cookies.get('userId');
    if (userIdCookie) {
      const fetchUserSetting = async () => {
        try {
          const response = await getUserAccountSetting(userIdCookie);
          const { email, phoneNumber, birthDay, gender } = response;
          setEmail(email || '');
          setPhoneNum(phoneNumber || '');
          setNewEmail(email || '');
          setNewPhone(phoneNumber || '');
          setBirthDay(birthDay || '');
          setGender(gender || 'Male');

          // Tách ngày, tháng, năm từ birthDay (định dạng yyyy-MM-dd)
          const birthDate = new Date(birthDay);
          setSelectedDay(birthDate.getDate());
          setSelectedMonth(birthDate.getMonth() + 1);
          setSelectedYear(birthDate.getFullYear());
          console.log(response);
        } catch (error) {
          console.error("Error fetching user setting:", error);
        }
      };
      fetchUserSetting();
    }
  }, []);

  // Populate các ngày
  const populateDays = () => {
    const dayList = [];
    for (let i = 1; i <= 31; i++) {
      dayList.push(i);
    }
    setDays(dayList);
  };

  // Populate các tháng
  const populateMonths = () => {
    const monthList = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];
    setMonths(monthList);
  };

  // Populate các năm
  const populateYears = () => {
    const yearList = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      yearList.push(i);
    }
    setYears(yearList);
  };

  // Thực hiện populate dropdown khi component mount
  useEffect(() => {
    populateDays();
    populateMonths();
    populateYears();
  }, []);

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức chính quy đơn giản cho email
    return regex.test(email);
  };

  // Hàm cập nhật email
  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    if (!isValidEmail(newEmail)) {
      toast.error("Email không hợp lệ");
      return;
    }
    try {
      const userIdCookie = Cookies.get('userId');
      const result = await updateUserEmail(userIdCookie, newEmail);
      toast.success(result);
      setEmail(newEmail);
    } catch (error) {
      console.error('Error updating email:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      toast.error("Cập nhật email không thành công");
    }
  };

  function isValidPhoneNumber(phoneNumber) {
    if (!phoneNumber) return false;

    // Biểu thức regex kiểm tra số điện thoại
    const phoneRegex = /^[0-9]{10,15}$/; // Số điện thoại chỉ chứa 10-15 chữ số
    return phoneRegex.test(phoneNumber);
  }

  const handleUpdatePhoneNumber = async (e) => {
    e.preventDefault();
    if (!isValidPhoneNumber(newPhone)) {
      toast.error("Số điện thoại không hợp lệ");
      return;
    } try {
      const userIdCookie = Cookies.get('userId');
      const result = await updateUserPhoneNumber(userIdCookie, newPhone);
      toast.success(result);
      setPhoneNum(newPhone);
    } catch (error) {
      console.error('Error updating Phone:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      toast.error("Cập nhật Phone không thành công");
    }
  }


  // Hàm cập nhật ngày sinh
  const formatDate = (year, month, day) => {
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;
    return `${year}-${formattedMonth}-${formattedDay}`;
  };
  const handleUpdateBirthday = async (e) => {
    e.preventDefault();
    const updatedBirthday = formatDate(selectedYear, selectedMonth, selectedDay);
    console.log("Updated Birthday:", updatedBirthday); // Ghi log giá trị
    try {
      const userIdCookie = Cookies.get('userId');
      await updateUserBirthday(userIdCookie, updatedBirthday); // Gọi hàm cập nhật
      toast.success("Ngày sinh đã được cập nhật thành công!");
    } catch (error) {
      console.error('Error updating birthday:', error);
      toast.error("Cập nhật ngày sinh không thành công");
    }
  };
  // Hàm cập nhật giới tính
  const handleUpdateGender = async (e) => {
    e.preventDefault();
    const sanitizedGender = userGender.replace(/"/g, ''); // Xóa dấu ngoặc kép
    console.log('Updating gender to:', sanitizedGender); // Kiểm tra giá trị đã được làm sạch
    try {
      const userIdCookie = Cookies.get('userId');
      await updateUserGender(userIdCookie, sanitizedGender); // Sử dụng giá trị đã làm sạch
      toast.success("Giới tính đã được cập nhật thành công!");
    } catch (error) {
      console.error('Error updating gender:', error);
      toast.error("Cập nhật giới tính không thành công");
    }
  };

  return (
    <div>
      <ToastContainer />
      <div>
        <h3>
          <b>Account setting</b>
        </h3>
      </div>
      <div className='row mt-3'>
        <div className='container ps-5'>
          {/* Email */}
          <div className='update-email mt-3'>
            <form onSubmit={handleUpdateEmail}>
              <div className='mt-3'>
                <label className="form-label">Enter your email</label>
                <input
                  type="text"
                  className='form-control'
                  value={newEmail} // Sử dụng newEmail để nhập vào ô
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="update mt-5">
                <button type="submit" className='btn' style={{ color: 'white' }}>Update</button>
              </div>
            </form>
          </div>
          {/* Phone_num */}
          <div className='mt-3'>
            <form onSubmit={handleUpdatePhoneNumber}>
              <div className='mt-3'>
                <label className="form-label">Enter your number</label>
                <input
                  type="text"
                  className='form-control'
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <div className="update mt-5">
                <button type="submit" className='btn' style={{ color: 'white' }}>Update</button>
              </div>
            </form>
          </div>
          {/* Birth day */}
          <div className='update-birthDay mt-5'>
            <form onSubmit={handleUpdateBirthday}>
              <label className='form-label'>Birthday</label>
              {/* Date Selection */}
              <div className="row d-flex">
                <div className="date-selectors mt-5">
                  <section className="form-group">
                    <select
                      value={selectedDay}
                      onChange={(e) => setSelectedDay(e.target.value)}
                      className="form-select"
                    >
                      <option value="" disabled>Day</option>
                      {days.map((day, index) => (
                        <option key={index} value={day}>{day}</option>
                      ))}
                    </select>
                  </section>
                  <section className="form-group">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="form-select"
                    >
                      <option value="" disabled>Month</option>
                      {months.map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                      ))}
                    </select>
                  </section>
                  <section className="form-group">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="form-select"
                    >
                      <option value="" disabled>Year</option>
                      {years.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                      ))}
                    </select>
                  </section>
                </div>
              </div>
              <div className="update mt-5">
                <button type="submit" className='btn' style={{ color: 'white' }}>Update</button>
              </div>
            </form>
          </div>
          {/* Gender */}
          <div className="update-gender mt-5">
            <form onSubmit={handleUpdateGender}>
              <div className="mt-3">
                <label className="form-label mb-5">Gender</label>
                <select
                  id="genderSelect"
                  className="form-select"
                  value={userGender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="update mt-5">
                <button type="submit" className='btn' style={{ color: 'white' }}>Update</button>
              </div>
            </form>
          </div>
          {/* Set password */}
          <div className='changePassword mt-3'>
            <h5>Change Password</h5>
            <p>You will be asked to connect your email to this account to be able to change your password..</p>
            <a href='/forgot-password'>Continue to change password</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
