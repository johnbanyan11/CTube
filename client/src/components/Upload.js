import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import axios from "axios";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: #2c2e2c;
  color: #f5faf5;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  cursor: pointer;
`;

const Title = styled.h2`
  text-decoration: underline;
`;

const Input = styled.input`
  border: 1px solid #f5faf5;
  color: #f5faf5;
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const Desc = styled.textarea`
  border: 1px solid #f5faf5;
  color: #f5faf5;
  border-radius: 3px;
  padding: 10px;
  background-color: transparent;
`;

const UploadButton = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
  cursor: pointer;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 0px;
`;

const WrapLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Upload = ({ setOpen }) => {
  const [image, setImage] = useState(undefined);
  const [video, setVideo] = useState(undefined);
  const [videoPercentage, setVideoPercentage] = useState(0);
  const [imagePercentage, setImagePercentage] = useState(0);
  const [inputs, setInputs] = useState({});
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleTags = (e) => {
    setTags(e.target.value.split(","));
  };

  const UploadFile = (file, urlType) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        urlType === "imgUrl"
          ? setImagePercentage(Math.round(progress))
          : setVideoPercentage(Math.round(progress));
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setInputs((prev) => {
            return { ...prev, [urlType]: downloadURL };
          });
        });
      }
    );
  };

  useEffect(() => {
    video && UploadFile(video, "videoUrl");
  }, [video]);

  useEffect(() => {
    image && UploadFile(image, "imgUrl");
  }, [image]);

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/videos", { ...inputs, tags });
      setOpen(false);
      res.status === 200 && navigate(`/video/${res.data._id}`);
    } catch (error) {
      console.error(error.response.data);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Close onClick={() => setOpen(false)}>X</Close>
        <Title>Upload a New Video</Title>
        <WrapLabel>
          <Label>Video:</Label>
          {videoPercentage > 0 ? (
            "Uploading: " + videoPercentage + "%"
          ) : (
            <Input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          )}
        </WrapLabel>

        <WrapLabel>
          <Label>Title:</Label>
          <Input
            type="text"
            name="title"
            placeholder="Title"
            onChange={handleChange}
          />
        </WrapLabel>
        <WrapLabel>
          <Label>Description:</Label>
          <Desc
            placeholder="Description"
            name="desc"
            rows={8}
            onChange={handleChange}
          />
        </WrapLabel>

        <WrapLabel>
          <Label>Tags:</Label>
          <Input
            type="text"
            placeholder="Separate the tags with commas..."
            onChange={handleTags}
          />
        </WrapLabel>

        <WrapLabel>
          {" "}
          <Label>Image:</Label>
          {imagePercentage > 0 ? (
            "Uploading: " + imagePercentage + "%"
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          )}
        </WrapLabel>

        <UploadButton
          onClick={(e) => {
            handleUpload(e);
          }}
        >
          Upload
        </UploadButton>
      </Wrapper>
    </Container>
  );
};

export default Upload;
