import React, { useState, useEffect } from 'react';
import './Account.css';
import Cookies from 'js-cookie';
import { getUserAccountSetting } from '../../service/UserService';

const Account = () => {
  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState([]);

  const [userEmail, setEmail] = useState('');
  const [userBirthDay, setBirthDay] = useState('');
  const [userGender, setGender] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [newBirthday, setNewBirthday] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
          const { email, birthDay, gender } = response;
          setEmail(email || '');
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

  return (
    <div>
      <div>
        <h3>
          <b>Account setting</b>
        </h3>
      </div>
      <div className='row mt-3'>
        <div className='container ps-5'>
          {/* Email */}
          <div className='update-email mt-3'>
            <form>
              <div className='mt-3'>
                <label className="form-label">Enter your email</label>
                <input
                  type="text"
                  className='form-control'
                  value={userEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="update mt-5">
                <button className='btn'>Update</button>
              </div>
            </form>
          </div>
          {/* Birth day */}
          <div className='update-birthDay mt-5'>
            <form>
              <label className='form-label'>Birthday</label>
              {/* Date Selection */}
              <div className="row d-flex">
                <div className="date-selectors mt-5">
                  <section className="form-group">
                    <div style={{ marginTop: -20 }}>
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
                    </div>
                  </section>
                  <section className="form-group">
                    <div style={{ marginTop: -20 }}>
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
                    </div>
                  </section>
                  <section className="form-group">
                    <div style={{ marginTop: -20 }}>
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
                    </div>
                  </section>
                </div>
              </div>
              <div className="update mt-5">
                <button className='btn'>Update</button>
              </div>
            </form>
          </div>
          {/* Gender */}
          <div className="update-gender mt-5">
            <form>
              <div className="mt-3">
                <label className="form-label mb-5">Gender</label>
                <select
                  id="genderSelect"
                  className="form-select"
                  value={userGender}
                  onChange={(e) => setNewGender(e.target.value)}
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="update mt-5">
                <button className='btn'>Update</button>
              </div>
            </form>
          </div>
          {/* Set password */}
          <div className='changePassword mt-3'>
            <h5>Set Password</h5>
            <p>As you have connected through social media, you will need to set a password.</p>
            <form>
              <div className='mt-3'>
                <label className="form-label">New password</label>
                <input
                  type="password"
                  className='form-control'
                  placeholder='Enter at least 4 characters'
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className='mt-3'>
                <label className="form-label">Confirm password</label>
                <input type="password" className='form-control' placeholder='Confirm password' />
              </div>
              <div className="update mt-5">
                <button className='btn'>Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
