import { useEffect, useRef, useState } from "react";

import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Box, Container, LinearProgress, Typography } from "@mui/material";
import axiosInstance from "./axios";
import { LinearProgressWithLabel } from "./components/progressbar";

function App() {
  const [image, setImage] = useState();
  const [allImages, setAllImages] = useState([]);
  const [imageUploadStatus, setImageUploadStatus] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState();

  const containerProperties = {
    display: "flex",
    gap: 3,
    marginTop: "20px",
    width: "70%",
    flexWrap: "wrap",
  };

  const displayAllImagesProperty = {
    width: "200px",
    height: "200px",
    objectFit: "cover",
  };

  const previewImgaeStyle = {
    width: "200px",
    height: "200px",
    marginBottom: "30px",
    objectFit: "cover",
  };

  const inputRef = useRef(null);
  const imageUploadHandler = () => {
    inputRef.current.click();
  };

  const handleFileChange = (e) => {
    let img = e.target.files[0];
    setImage(img);
    let preview = URL.createObjectURL(e.target.files[0]);
    setPreview(preview);
  };

  const imageSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      let formData = new FormData();
      formData.append("file", image);
      let response = await axiosInstance.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (data) => {
          //Set the progress value to show the progress bar
          setProgress(Math.round((100 * data.loaded) / data.total));
        },
      });
      if (response.status === 200) {
        setPreview("");
        setProgress(0);
        setImageUploadStatus((prev) => !prev);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllData = async () => {
    try {
      let allData = await axiosInstance.get("/");
      setAllImages(allData.data.images);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, [imageUploadStatus]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Photo Gallary </h1>
        <h5>A picture is worth thousand words</h5>
        {preview && (
          <Box>
            <img src={preview} alt="preview" style={{ ...previewImgaeStyle }} />
          </Box>
        )}

        <Box onClick={preview ? imageSubmitHandler : imageUploadHandler}>
          <AddCircleOutlineOutlinedIcon />
        </Box>

        {preview && (
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={progress} />
          </Box>
        )}
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
      <Container sx={{ ...containerProperties }}>
        {allImages.length === 0 && <Typography>Gallary is empty</Typography>}
        {allImages?.map((item) => {
          return (
            <Box>
              <img
                src={`http://localhost:3000/images/${item}`}
                style={{ ...displayAllImagesProperty }}
                alt=""
              />
            </Box>
          );
        })}
      </Container>
    </Box>
  );
}

export default App;
