import axios from "axios";


const REST_API_BASE_URL = 'http://localhost:8080/customer/tracks';

export const getTrackByUserId = (userId) => axios.get(`${REST_API_BASE_URL}/user/${userId}`)

export const getTrackById = (trackId) => axios.get(`${REST_API_BASE_URL}/${trackId}`)

export const createTrack = (track) => axios.post(REST_API_BASE_URL, track, { 
    headers: {
                'Content-Type': 'multipart/form-data'
            }
 });

export const listGenre = () => axios.get(`${REST_API_BASE_URL}/getAllGenre`);

export const updateTrack = (trackId, track) => {
    const formData = new FormData();

    // thêm dulieu
    formData.append("name", track.name);
    formData.append("description", track.description);
    formData.append("status", track.status || false);
    formData.append("report", track.report || false);
    formData.append("user", track.userId);
    formData.append("genreId", track.genreId); // Giả sử genre là ID

    // Ghi hình ảnh vào formData
    if (Array.isArray(track.trackImage)) {
        track.trackImage.forEach((file) => {
            if (file instanceof File) {
                formData.append("trackImage", file);
            } else {
                const byteCharacters = atob(file); 
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: 'image/jpeg' });
                formData.append('trackImage', blob);
            }
        });
    }

    // Ghi file nhạc vào formData
    if (track.trackFile instanceof File) {
        formData.append("trackFile", track.trackFile);
    } else if (typeof track.trackFile === 'string') {
        const byteCharacters = atob(track.trackFile);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'audio/mpeg' }); //Đối với file MP3, loại MIME là audio/mpeg, không phải /mp3.
        formData.append("trackFile", blob);
    }

    // Gửi yêu cầu PUT để cập nhật track
    return axios.put(`${REST_API_BASE_URL}/${trackId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
