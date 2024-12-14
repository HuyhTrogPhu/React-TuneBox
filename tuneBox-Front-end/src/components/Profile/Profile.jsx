import React, { useState, useEffect, useRef } from "react";
import { images } from "../../assets/images/images";
import './Profile.css';
import Cookies from 'js-cookie';
import { getUserProfileSetting, listGenres, updateUserInfo } from "../../service/UserService";
import { listTalents, listInspiredBys } from "../../service/LoginService";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Webcam from 'react-webcam';
import axios from "axios";


const Profile = () => {
    const [listTalent, setListTalent] = useState([]);
    const [listGenre, setListGenre] = useState([]);
    const [listInspiredBy, setListInspiredBy] = useState([]);
    const [searchInspiredBy, setSearchInspiredBy] = useState('');
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [avatar, setAvatar] = useState(images.logoTuneBox);
    const [name, setName] = useState('');
    const [userName, setUserName] = useState('');
    const [location, setLocation] = useState('');
    const [about, setAbout] = useState('');
    const [userInspiredBy, setUserInspiredBy] = useState([]);
    const [userTalent, setUserTalent] = useState([]);
    const [userGenre, setUserGenre] = useState([]);
    const [selectedTalents, setSelectedTalents] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedInspiredBy, setSelectedInspiredBy] = useState([]);
    const userId = Cookies.get("userId");
    const webcamRef = useRef(null);
    const [selectedFilter, setSelectedFilter] = useState('none');
    // Quản lý modal
    const [showModal, setShowModal] = useState(false);
    const [filteredInspiredBy, setFilteredInspiredBy] = useState([]);

    const [file, setFile] = useState(null);
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
    //Đổi avatar
    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setAvatar(e.target.result); // Cập nhật ảnh avatar hiển thị
                setFile(selectedFile); // Lưu file để upload sau
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        const token = localStorage.getItem('jwtToken');

        try {
            await axios.put(`http://localhost:8080/user/${userId}/avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}` // Thêm JWT token vào headers
                },
            });
        } catch (error) {
            console.error("Error updating avatar:", error);
        }
    };
    const openFileSelector = () => {
        document.getElementById('logoInput').click();
    };

    const openCamera = () => {
        setIsCameraOpen(true); // Mở camera
    };

    const handleCapture = (webcamRef) => {
        const screenshot = webcamRef.current.getScreenshot();
        if (screenshot) {
            // Tạo canvas để áp dụng bộ lọc
            const canvas = document.createElement('canvas');
            const img = new Image();

            img.onload = () => {
                // Cài đặt kích thước cho canvas giống với ảnh chụp
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');

                // Áp dụng bộ lọc cho canvas
                ctx.filter = selectedFilter;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                // Chuyển canvas thành data URL và cập nhật avatar
                const filteredScreenshot = canvas.toDataURL('image/png');
                setAvatar(filteredScreenshot); // Cập nhật ảnh avatar hiển thị

                // Chuyển ảnh có bộ lọc thành file và lưu
                setFile(dataURItoFile(filteredScreenshot, "avatar.png"));
            };

            img.src = screenshot; // Gán src để trigger sự kiện onload
        }
        setIsCameraOpen(false); // Đóng camera sau khi chụp
    };


    const dataURItoFile = (dataURI, filename) => {
        const arr = dataURI.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };
    // Danh sách bộ lọc để người dùng chọn
    const filters = [
        { name: 'None', value: 'none' },
        { name: 'Blur', value: 'blur(5px)' },
        { name: 'Brightness', value: 'brightness(1.5)' },
        { name: 'Contrast', value: 'contrast(2)' },
        { name: 'Grayscale', value: 'grayscale(100%)' },
        { name: 'Invert', value: 'invert(1)' },
        { name: 'Sepia', value: 'sepia(1)' },
        { name: 'Saturate', value: 'saturate(2)' },
        { name: 'Hue Rotate', value: 'hue-rotate(90deg)' },
        { name: 'Custom Combination', value: 'brightness(1.2) contrast(1.4) saturate(1.3)' },
        { name: 'Soft Glow', value: 'brightness(1.1) contrast(1.2) saturate(1.3) blur(1px)' },
        { name: 'Clarity', value: 'contrast(1.4) brightness(1.2) saturate(1.1)' },
        { name: 'Vintage', value: 'sepia(0.4) contrast(1.1) brightness(1.1)' },
        { name: 'Smooth Skin', value: 'blur(0.5px) brightness(1.1) saturate(1.2)' },
        { name: 'Warm Tone', value: 'brightness(1.15) contrast(1.05) saturate(1.4) sepia(0.1)' },
        { name: 'Cool Tone', value: 'brightness(0.9) contrast(1.2) hue-rotate(-15deg) saturate(1.3)' },
        { name: 'B&W High Contrast', value: 'grayscale(1) contrast(1.5) brightness(1.1)' },
        { name: 'Golden Hour', value: 'brightness(1.1) contrast(1.2) saturate(1.3) sepia(0.2) hue-rotate(10deg)' },
    ];

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await listGenres();
                setListGenre(response.data);
                console.log(response.data)
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
        listTalents().then(res => setListTalent(res.data)).catch(console.log);
        listGenres().then(res => setListGenre(res.data)).catch(console.log);
        listInspiredBys().then(res => {
            setListInspiredBy(res.data);
            setFilteredInspiredBy(res.data);
        }).catch(console.log);

        const userIdCookie = Cookies.get('userId');
        if (userIdCookie) {
            getUserProfileSetting(userIdCookie).then(response => {
                setAvatar(response.avatar || images.logoTuneBox);
                setName(response.name || '');
                setUserName(response.userName || '');
                setLocation(response.location || '');
                setAbout(response.about || '');
                setUserInspiredBy(response.inspiredBy || []);
                setUserTalent(response.talent || []);
                setUserGenre(response.genre || []);
                setSelectedInspiredBy(response.inspiredBy || []);
                setSelectedTalents(response.talent || []);
                setSelectedGenres(response.genre || []);
            }).catch(console.error);
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
        const selectedInspiredByItem = listInspiredBy.find(item => item.id === inspiredById);
        if (selectedInspiredByItem && !selectedInspiredBy.includes(selectedInspiredByItem.name)) {
            setSelectedInspiredBy([...selectedInspiredBy, selectedInspiredByItem.name]);
            console.log("Selected artist:", selectedInspiredByItem.name); // Kiểm tra xem nghệ sĩ đã được chọn chưa
        }
    };

    // Mở modal
    const openModal = () => {
        setFilteredInspiredBy(listInspiredBy); // Hiển thị tất cả khi mở modal
        setShowModal(true);
    };
    // Đóng modal
    const closeModal = () => {
        setUserInspiredBy(selectedInspiredBy);  // Cập nhật userInspiredBy với các lựa chọn trong selectedInspiredBy
        setShowModal(false);
    };

    // Cập Nhật Thông Tin Người Dùng
    const handleUpdateUserInfo = async () => {
        const userIdCookie = Cookies.get('userId');
        if (userIdCookie) {
            // Convert selected names to IDs
            const inspiredByIds = getIdsFromNames(selectedInspiredBy, listInspiredBy);
            const talentIds = getIdsFromNames(selectedTalents, listTalent);
            const genreIds = getIdsFromNames(selectedGenres, listGenre);

            const updatedUserInfo = {
                userName,
                userInformation: { name, location, about },
                inspiredBy: inspiredByIds,
                talent: talentIds,
                genre: genreIds,
            };

            console.log("Selected InspiredBy IDs:", inspiredByIds);
            console.log("Selected Talents IDs:", talentIds);
            console.log("Selected Genres IDs:", genreIds);
            console.log("updatedUserInfo:", updatedUserInfo);
            try {
                await updateUserInfo(userIdCookie, updatedUserInfo);
                toast.success("Thông tin đã được cập nhật thành công!");
            } catch (error) {
                console.error("Error updating user info:", error);
                toast.error(error.response?.data?.message || "Cập nhật thông tin không thành công.");
            }
        }
    };
    const handleToggleItem = (item, setSelected, selected) => {
        setSelected((prev) => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
    };
    const getIdsFromNames = (selectedNames, options) => {
        return options
            .filter(option => selectedNames.includes(option.name))
            .map(option => option.id);
    };

    const handleUpdate = (event) => {
        handleUpdateUserInfo(event); // Gọi hàm cập nhật thông tin người dùng
        handleSubmit(event); // Gọi hàm cập nhật avatar
    };

    return (
        <div style={{backgroundColor: 'white'}}>
            <ToastContainer />
            <div>
                <h3>
                    <b>Profile setting</b>
                </h3>
            </div>
            <div className="profile-container">
                <div className="row d-flex">
                    {/* Avatar */}
                    <div className="profile-avatar col-3" onClick={() => openFileSelector()}>
                        <img src={avatar || "/path/to/default/avatar.png"} className="avatar-setting border" alt="Avatar" />
                    </div>
                    {/* Input file để chọn file từ máy tính */}
                    <input
                        type="file"
                        id="logoInput"
                        style={{ display: "none" }}
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {/* Menu popup để chọn phương thức thay đổi avatar */}
                    <label htmlFor="name" style={{ marginLeft: -40 }}>
                        <h6><b>Change avatar</b></h6>
                    </label>
                    <div className="menu-popup " >
                        <button className="btn" onClick={openFileSelector}><i class="fa-solid fa-file"></i>  Select photo from device</button> <br />
                        <button className="btn" onClick={openCamera}><i class="fa-solid fa-camera"></i> Open the camera</button>
                    </div>

                    {/* Camera popup */}
                    {isCameraOpen && (
                        <div className="camera-popup ">
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                style={{ filter: selectedFilter }}
                            />
                            <div className="filter-select mt-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <label style={{ marginBottom: '0' }}>Chọn bộ lọc: </label>
                                <select
                                    className="form-select"
                                    style={{ width: '150px' }}  // Điều chỉnh độ rộng
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    value={selectedFilter}
                                >
                                    {filters.map((filter) => (
                                        <option key={filter.value} value={filter.value}>{filter.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mt-3" style={{ marginLeft: '250px' }}>
                                <button className="btn" onClick={() => handleCapture(webcamRef)}>Chụp ảnh</button>
                                <button className="btn" onClick={() => setIsCameraOpen(false)}>Đóng</button>
                            </div>

                        </div>
                    )}
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
                                    placeholder="Enter your city"
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
                    <div className="inspired-by-list">
                        {selectedInspiredBy.length > 0 ? (
                            selectedInspiredBy.map((inspired, index) => (
                                <div key={index} className="chip">
                                    <span>{inspired}</span>
                                    <i className="fa fa-times" aria-hidden="true" onClick={() => setSelectedInspiredBy(selectedInspiredBy.filter(item => item !== inspired))}></i>
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
                    <div className="custom-modal-overlay">
                        <div className="custom-modal">
                            <div className="custom-modal-content">
                                <div className="custom-modal-header">
                                    <h5 className="custom-modal-title">Add Artists</h5>
                                    <button className="custom-close-button" onClick={closeModal}>&times;</button>
                                </div>
                                <div className="custom-modal-body">
                                    <input
                                        type="text"
                                        placeholder="Search Artists..."
                                        value={searchInspiredBy}
                                        onChange={handleSearch}
                                        className="form-control"
                                    />

                                    {/* Hiển thị danh sách nghệ sĩ dưới dạng các mục có thể nhấn */}
                                    <div className="artist-list mt-3">
                                        {filteredInspiredBy.map((artist) => (
                                            <div
                                                key={artist.id}
                                                className="artist-item"
                                                onClick={() => handleAddInspiredBy(artist.id)}
                                                style={{ cursor: 'pointer', padding: '5px 0', borderBottom: '1px solid #ddd' }}
                                            >
                                                {artist.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="custom-modal-footer">
                                    <button className="custom-modal-button" onClick={closeModal}>Done</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* Talents Section */}
                <div className="talents-section">
                    <h7><b>Talents</b></h7>
                    <div className="talent-list mt-3">
                        {listTalent.map((talent) => (
                            <div key={talent.id} className={`chip ${selectedTalents.includes(talent.name) ? 'selected' : ''}`} onClick={() => handleToggleItem(talent.name, setSelectedTalents, selectedTalents)}>

                                <i className="fa fa-music pe-3" aria-hidden="true"></i>
                                <span value={talent.id}>{talent.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Genres Section */}
                <div className="genres-section">
                    <h7><b>Favorite genres</b></h7>
                    <div className="genre-list mt-3">
                        {listGenre.map((genre) => (
                            <div key={genre.id} className={`chip ${selectedGenres.includes(genre.name) ? 'selected' : ''}`} onClick={() => handleToggleItem(genre.name, setSelectedGenres, selectedGenres)}>
                                <i className="fa fa-music pe-3" aria-hidden="true"></i>
                                <span>{genre.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="update mt-5">
                <button className="btn text-white" onClick={handleUpdate}>Update</button>
            </div>
        </div >
    );
};
export default Profile; 