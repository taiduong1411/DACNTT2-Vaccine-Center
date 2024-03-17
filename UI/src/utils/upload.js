import axios from "axios";
const upload = async (file, folder) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "DACNTT2");
    data.append('folder', folder);

    try {
        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/de0cr9ny3/image/upload",
            data);

        const { url } = res.data;
        console.log(url);
        return url;
    } catch (err) {
        console.log(err);
    }
};

export default upload;