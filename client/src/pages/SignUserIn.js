import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  storeToken,
} from "../app/userSlice";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { useNavigate, NavLink } from "react-router-dom";
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
  flex-direction: column;
  background-color: ${({ theme }) => theme.bgLighter};
  border: 1px solid ${({ theme }) => theme.soft};
  padding: 30px 50px;
  width: 20vw;
  gap: 10px;
`;

const Title = styled.h1`
  font-size: 24px;
`;

const SubTitle = styled.h2`
  font-size: 20px;
  font-weight: 300;
`;

const Input = styled.input`
  border: 1px solid ${({ theme }) => theme.soft};
  border-radius: 3px;
  padding: 10px;
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

const FooterLink = styled.span`
  margin-left: 30px;
`;

const SignUpWrapper = styled.div`
  display: flex;
`;

const SignUserIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await API.post("/auth/signin", { email, password });
      dispatch(loginSuccess(res.data.others));
      dispatch(storeToken(res.data.token));
      res.status === 200 && navigate("/");
    } catch (error) {
      dispatch(loginFailure());
    }
  };

  const signInWithGoogle = async () => {
    dispatch(loginStart());
    signInWithPopup(auth, provider)
      .then((result) => {
        API.post("/auth/google", {
          name: result.user.displayName,
          email: result.user.email,
          img: result.user.photoURL,
        }).then((res) => {
          console.log(res);
          dispatch(loginSuccess(res.data?.savedUser || res.data?.user));
          dispatch(storeToken(res.data.token));
          navigate("/");
        });
      })
      .catch((error) => {
        dispatch(loginFailure());
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to CTube</SubTitle>
        <Input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
        <Input
          type="password"
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Sign in</Button>
        <Title>or</Title>
        <Button onClick={signInWithGoogle}>Signin with Google</Button>
        <SignUpWrapper>
          <span>Don't have an account? Create One...</span>
          <NavLink
            style={{ color: "white", fontSize: "15px", marginLeft: "3px" }}
            to="/signup"
          >
            SignUp
          </NavLink>
        </SignUpWrapper>
      </Wrapper>
      <More>
        English(USA)
        <Links>
          <FooterLink>Help</FooterLink>
          <FooterLink>Privacy</FooterLink>
          <FooterLink>Terms</FooterLink>
        </Links>
      </More>
    </Container>
  );
};

export default SignUserIn;
