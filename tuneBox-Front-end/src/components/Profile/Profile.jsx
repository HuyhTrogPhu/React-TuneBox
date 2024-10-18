import React, { useState, useEffect } from "react";
import { images } from "../../assets/images/images";
import Cookies from 'js-cookie';
import { getUserSetting } from "../../service/UserService";

const Profile = () => {
    const [days, setDays] = useState([]);
    const [months, setMonths] = useState([]);
    const [years, setYears] = useState([]);
    const [userData, setUserData] = useState([]);

    // Lấy userId từ cookie và fetch avatar
    useEffect(() => {
        const userIdCookie = Cookies.get('userId');
        if (userIdCookie) {
            const fetchUserSetting = async () => {
                try {
                    const response = await getUserSetting(userIdCookie);
                    setUserData(response); // Set đường dẫn avatar
                } catch (error) {
                    console.error("Error fetching avatar:", error);
                }
            };
            fetchUserSetting();
        }
    }, []);

    // Hàm để populate các ngày
    const populateDays = () => {
        const dayList = [];
        for (let i = 1; i <= 31; i++) {
            dayList.push(i);
        }
        setDays(dayList);
    };

    // Hàm để populate các tháng
    const populateMonths = () => {
        const monthList = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];
        setMonths(monthList);
    };

    // Hàm để populate các năm
    const populateYears = () => {
        const yearList = [];
        const currentYear = new Date().getFullYear();
        for (let i = currentYear; i >= 1900; i--) {
            yearList.push(i);
        }
        setYears(yearList);
    };

    // Thực hiện populate các dropdown khi component mount
    useEffect(() => {
        populateDays();
        populateMonths();
        populateYears();
    }, []);

    return (
        <div>
            <div>
                <h3>
                    <b>Profile setting</b>
                </h3>
            </div>
            <div className="profile-container">
                <div className="profile-avatar">
                    <img src={userData.avatar} className="avatar-setting" alt="Avatar" />
                </div>
                <div className="profile-container">
                    <form className="row g-3">
                        <div className="row">
                            <label htmlFor="name" style={{ marginLeft: -40 }}>
                                <h6>
                                    <b>Name</b>
                                </h6>
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Name"
                                id="name"
                                defaultValue={userData.userName}
                                style={{
                                    backgroundColor: 'rgba(64, 102, 128, 0.078)',
                                    height: 40,
                                    width: 600,
                                    marginTop: -20,
                                }}
                            />
                        </div>
                        <div className="row">
                            <label htmlFor="location" style={{ marginLeft: -40 }}>
                                <h6>
                                    <b>Location</b>
                                </h6>
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Search City"
                                id="location"
                                style={{
                                    backgroundColor: "rgba(64, 102, 128, 0.078)",
                                    height: 40,
                                    width: 600,
                                    marginTop: -20,
                                }}
                            />
                        </div>
                        <div>
                            <div
                                className="row g-3 "
                                style={{ marginLeft: -20, marginRight: 160 }}
                            >
                                {/* Gender Selection */}
                                <div className="col-md-4 form-group">
                                    <label htmlFor="genderSelect" style={{ marginLeft: -30 }}>
                                        <h6>
                                            <b>Gender</b>
                                        </h6>
                                    </label>
                                    <select
                                        id="genderSelect"
                                        className="form-select"
                                        style={{ marginTop: -20 }}
                                    >
                                        <option defaultValue="" disabled hidden>
                                            Add Gender
                                        </option>
                                        <option defaultValue="Female">Female</option>
                                        <option defaultValue="Male">Male</option>
                                        <option defaultValue="Other">Other</option>
                                    </select>
                                </div>
                                {/* Date Selection */}
                                <div className="col-md-8">
                                    <div className="date-selectors">
                                        <section className="form-group">
                                            <label htmlFor="daySelect" style={{ marginLeft: -25 }}>
                                                <h6>
                                                    <b>Day</b>
                                                </h6>
                                            </label>
                                            <div style={{ marginTop: -20 }}>
                                                <select id="daySelect" className="form-select">
                                                    {days.map((day, index) => (
                                                        <option key={index} value={day}>
                                                            {day}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </section>
                                        <section className="form-group">
                                            <label htmlFor="monthSelect" style={{ marginLeft: -25 }}>
                                                <h6>
                                                    <b>Month</b>
                                                </h6>
                                            </label>
                                            <div style={{ marginTop: -20 }}>
                                                <select id="monthSelect" className="form-select">
                                                    {months.map((month, index) => (
                                                        <option key={index} value={index + 1}>
                                                            {month}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </section>
                                        <section className="form-group">
                                            <label htmlFor="yearSelect">
                                                <h6>
                                                    <b>Year</b>
                                                </h6>
                                            </label>
                                            <div style={{ marginTop: -20 }}>
                                                <select id="yearSelect" className="form-select">
                                                    {years.map((year, index) => (
                                                        <option key={index} value={year}>
                                                            {year}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div style={{ marginLeft: 180, marginRight: 170 }}>
                <label htmlFor="About" style={{ marginLeft: -25 }}>
                    <h6>
                        <b>About</b>
                    </h6>
                </label>
                <div className="profile-container">
                    <textarea
                        className="custom-textarea"
                        name="about"
                        id="About"
                        defaultValue={userData.description}
                    />
                </div>

                <div className="mt-3 update">
                    <button className="btn border">Update</button>
                </div>
            </div>


        </div>
    );
}

export default Profile;
