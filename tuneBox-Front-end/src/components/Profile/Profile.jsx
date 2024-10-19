import React, { useState, useEffect } from "react";
import { images } from "../../assets/images/images";
import './Profile.css';
import Cookies from 'js-cookie';
import { getUserProfileSetting, listGenres } from "../../service/UserService";
import { listTalents, listInspiredBys } from "../../service/LoginService";

const Profile = () => {
    const [listTalent, setListTalent] = useState([]);
    const [listGenre, setListGenre] = useState([]);
    const [listInspiredBy, setListInspiredBy] = useState([]);
    const [searchInspiredBy, setSearchInspiredBy] = useState('');

    const [avatar, setAvatar] = useState(images.logoTuneBox);
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [location, setLocation] = useState('');
    const [about, setAbout] = useState('');
    const [userInspiredBy, setInspiredBy] = useState([]);
    const [userTalent, setTalent] = useState([]);
    const [userGenre, setGenre] = useState([]);

    // Quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [filteredInspiredBy, setFilteredInspiredBy] = useState([]);

    // Fetch danh sách Talent, Genre, InspiredBy từ server
    useEffect(() => {
        const fetchTalents = async () => {
            try {
                const response = await listTalents();
                setListTalent(response.data);
            } catch (error) {
                console.log("Error fetching talents", error);
            }
        };
        fetchTalents();
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await listGenres();
                setListGenre(response.data);
            } catch (error) {
                console.log("Error fetching genres", error);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        const fetchInspiredBys = async () => {
            try {
                const response = await listInspiredBys();
                setListInspiredBy(response.data);
                setFilteredInspiredBy(response.data);
            } catch (error) {
                console.log("Error fetching inspiredBys", error);
            }
        };
        fetchInspiredBys();
    }, []);

    // Fetch thông tin user
    useEffect(() => {
        const userIdCookie = Cookies.get('userId');
        if (userIdCookie) {
            const fetchUserSetting = async () => {
                try {
                    const response = await getUserProfileSetting(userIdCookie);
                    const { avatar, name, userName, location, about, inspiredBy, talent, genre } = response;
                    setAvatar(avatar || images.logoTuneBox);
                    setName(name || '');
                    setUserName(userName || '');
                    setLocation(location || '');
                    setAbout(about || '');
                    setInspiredBy(inspiredBy || []);
                    setTalent(talent || []);
                    setGenre(genre || []);
                    console.log(response);
                } catch (error) {
                    console.error("Error fetching user setting:", error);
                }
            };
            fetchUserSetting();
        }
    }, []);

    // Xử lý tìm kiếm InspiredBy
    const handleSearch = (e) => {
        setSearchInspiredBy(e.target.value);
        const filtered = listInspiredBy.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
        setFilteredInspiredBy(filtered);
    };

    // Xử lý chọn InspiredBy từ danh sách
    const handleAddInspiredBy = (inspiredById) => {
        const selectedInspiredBy = listInspiredBy.find(item => item.id === inspiredById);
        if (selectedInspiredBy && !inspiredBy.includes(selectedInspiredBy.name)) {
            setInspiredBy([...inspiredBy, selectedInspiredBy.name]);
        }
    };

    // Mở modal
    const openModal = () => {
        setShowModal(true);
    };

    // Đóng modal
    const closeModal = () => {
        setShowModal(false);
    };


    return (
        <div>
            <div>
                <h3>
                    <b>Profile setting</b>
                </h3>
            </div>
            <div className="profile-container">
                <div className="row d-flex">
                    {/* Avatar */}
                    <div className="profile-avatar col-3">
                        <img src={avatar} className="avatar-setting border" alt="Avatar" />
                    </div>
                    <div className="profile-container col-9">
                        {/* Form */}
                        <form className="g-3">
                            {/* Name */}
                            <div className="mt-3">
                                <label htmlFor="name" style={{ marginLeft: -40 }}>
                                    <h6><b>Name</b></h6>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Name"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        backgroundColor: 'rgba(64, 102, 128, 0.078)',
                                        height: 40,
                                        width: 600,
                                        marginTop: -20,
                                    }}
                                />
                            </div>
                            {/* Username */}
                            <div className="mt-3">
                                <label htmlFor="userName" style={{ marginLeft: -40 }}>
                                    <h6><b>Username</b></h6>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Username"
                                    id="userName"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    style={{
                                        backgroundColor: 'rgba(64, 102, 128, 0.078)',
                                        height: 40,
                                        width: 600,
                                        marginTop: -20,
                                    }}
                                />
                            </div>
                            {/* Location */}
                            <div className="mt-3">
                                <label htmlFor="location" style={{ marginLeft: -40 }}>
                                    <h6><b>Location</b></h6>
                                </label>
                                <input
                                    className="form-control"
                                    type="text"
                                    placeholder="Search City"
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    style={{
                                        backgroundColor: "rgba(64, 102, 128, 0.078)",
                                        height: 40,
                                        width: 600,
                                        marginTop: -20,
                                    }}
                                />
                            </div>
                            {/* About */}
                            <div className='mt-3'>
                                <label htmlFor="about" style={{ marginLeft: -25 }}>
                                    <h6><b>About</b></h6>
                                </label>
                                <textarea
                                    className="form-control"
                                    id="about"
                                    value={about}
                                    onChange={(e) => setAbout(e.target.value)}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Music Interests */}
            <div className="music-interests">
                <h5>Music Interests</h5>

                {/* Inspired By Section */}
                <div className="inspired-by-section">
                    <h7><b>Inspired by</b></h7>
                    <div className="inspired-by-list mt-3">
                        {userInspiredBy.length > 0 ? (
                            userInspiredBy.map((inspired, index) => (
                                <div key={index} className="chip">
                                    <span>{inspired}</span>
                                    <i className="fa fa-times" aria-hidden="true"></i>
                                </div>
                            ))
                        ) : (
                            <p>No artists added yet.</p>
                        )}
                    </div>
                    <button className="add-inspired-by" onClick={openModal}>
                        <i className="fa fa-plus" aria-hidden="true"></i> Add Artist
                    </button>
                </div>

                {/* Modal Inspired By */}
                {showModal && (
                    <div className="modal fade show d-block" role="dialog">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Artists</h5>
                                    <button className="close btn-close" onClick={closeModal} data-bs-dismiss="modal" aria-label="Close" style={{ width: '10px', height: '10px' }}>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <input
                                        type="text"
                                        placeholder="Search Artists..."
                                        value={searchInspiredBy}
                                        onChange={handleSearch}
                                        className="form-control"
                                    />

                                    {/* Chỉ hiển thị danh sách select nếu có từ khóa */}
                                    {searchInspiredBy && filteredInspiredBy.length > 0 && (
                                        <div className="artist-list mt-3">
                                            <select
                                                name="artist"
                                                id="artist"
                                                size="5"  // Hiển thị 5 dòng cùng lúc
                                                className="form-control"
                                                onChange={(e) => handleAddInspiredBy(e.target.value)}  // Bắt sự kiện khi chọn nghệ sĩ
                                            >
                                                {filteredInspiredBy.map((artist) => (
                                                    <option key={artist.id} value={artist.id}>
                                                        {artist.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    {/* inspiredBy user */}
                                    <div className="mt-5">
                                        <div className="inspired-by-list">
                                            {userInspiredBy.length > 0 ? (
                                                userInspiredBy.map((inspired, index) => (
                                                    <div key={index} className="chip">
                                                        <span>{inspired}</span>
                                                        <i className="fa fa-times" aria-hidden="true"></i>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No artists added yet.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer" onClick={closeModal}>
                                    <button className="btn-update">
                                        Done
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Talents Section */}
                <div className="talents-section">
                    <h7><b>Talents</b></h7>
                    <div className="talent-list mt-3">
                        {userTalent.length > 0 ? (
                            userTalent.map((talentItem, index) => (
                                <div key={index} className="chip talent">
                                    <i className="fa fa-music" aria-hidden="true"></i>
                                    <span>{talentItem}</span>
                                </div>
                            ))
                        ) : (
                            <p>No talents added yet.</p>
                        )}
                    </div>
                </div>

                {/* Genres Section */}
                <div className="genres-section">
                    <h7><b>Favorite genres</b></h7>
                    <div className="genre-list mt-3">
                        {userGenre.length > 0 ? (
                            userGenre.map((genreItem, index) => (
                                <div key={index} className="chip genre">
                                    <i className="fa fa-music" aria-hidden="true"></i>
                                    <span>{genreItem}</span>
                                </div>
                            ))
                        ) : (
                            <p>No genres added yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="update mt-5">
                <button className="btn text-white">Update</button>
            </div>
        </div >
    );
};

export default Profile;
