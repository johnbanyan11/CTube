import React, { useState } from "react";
import { useSelector } from "react-redux";
import styled, { ThemeProvider } from "styled-components";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { darkTheme, lightTheme } from "./utils/Theme";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Video from "./pages/Video";
import Search from "./components/Search";
import SignUserIn from "./pages/SignUserIn";
import SignUserUp from "./pages/SignUserUp";
import History from "./pages/History";

const Container = styled.div`
  display: flex;
`;

const Main = styled.div`
  flex: 7;
  background-color: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Container>
        <BrowserRouter>
          <Menu darkMode={darkMode} setDarkMode={setDarkMode} />
          <Main>
            <Navbar />
            <Wrapper>
              <Routes>
                <Route path="/">
                  <Route index element={<Home type="random" />} />
                  <Route path="trends" element={<Home type="trend" />} />
                  <Route path="subscriptions" element={<Home type="sub" />} />
                  <Route path="search" element={<Search />} />
                  <Route
                    path="signin"
                    element={currentUser ? <Home /> : <SignUserIn />}
                  />
                  <Route
                    path="signup"
                    element={currentUser ? <Home /> : <SignUserUp />}
                  />
                  <Route path="video">
                    <Route path=":id" element={<Video />} />
                  </Route>
                  <Route path="history" element={<History />} />
                </Route>
              </Routes>
            </Wrapper>
          </Main>
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;
