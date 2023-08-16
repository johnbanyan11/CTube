import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginFailure,
  loginSuccess,
  storeToken,
} from "../app/userSlice";
import { useNavigate, NavLink } from "react-router-dom";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../firebase";
import { API } from "../api/api";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 200px);
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 30px 0px;
  padding-right: 40px;
  width: 30vw;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
  margin-bottom: 20px;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
  margin: 5px 20px;
  background-color: transparent;
  width: 100%;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.textSoft};
`;

const More = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 12px;
  color: ${({ theme }) => theme.textSoft};
`;

const Links = styled.div`
  margin-left: 50px;
`;

const Link = styled.span`
  margin-left: 30px;
`;

const SignUpWrapper = styled.div`
  display: flex;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 0px;
  padding-left: 20px;
`;

const WrapLabel = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: left;

  width: 70%;
  gap: 5px;
`;

const SignUserUp = () => {
  const [inputs, setInputs] = useState();
  const [img, setImg] = useState(undefined);
  const [imagePercentage, setImagePercentage] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
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
        if (urlType === "img") {
          setImagePercentage(Math.round(progress));
        }

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
    img && UploadFile(img, "img");
  }, [img]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await API.post("/auth/signup", inputs);
      dispatch(loginSuccess(res.data.others));
      dispatch(storeToken(res.data.token));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign Up</Title>
        <SubTitle>to continue to CTube</SubTitle>
        <WrapLabel>
          <Label>User Name:</Label>
          <Input
            name="name"
            type="text"
            placeholder="Username"
            onChange={handleChange}
          />
        </WrapLabel>

        <WrapLabel>
          <Label>User Image:</Label>
          {imagePercentage > 0 ? (
            "Uploading: " + imagePercentage + "%"
          ) : (
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImg(e.target.files[0])}
            />
          )}
        </WrapLabel>

        <WrapLabel>
          <Label>Email:</Label>
          <Input
            name="email"
            type="email"
            placeholder="email"
            onChange={handleChange}
          />
        </WrapLabel>

        <WrapLabel>
          <Label>Password:</Label>
          <Input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
        </WrapLabel>

        <Button type="submit" onClick={handleSignUp}>
          Sign up
        </Button>

        <SignUpWrapper>
          <span>Already have an account?</span>
          <NavLink
            style={{ color: "white", fontSize: "15px", marginLeft: "3px" }}
            to="/signin"
          >
            SignIn
          </NavLink>
        </SignUpWrapper>
      </Wrapper>

      <More>
        English(USA)
        <Links>
          <Link>Help</Link>
          <Link>Privacy</Link>
          <Link>Terms</Link>
        </Links>
      </More>
    </Container>
  );
};

export default SignUserUp;
