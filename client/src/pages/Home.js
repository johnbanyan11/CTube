import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { API } from "../api/api";
import Card from "../components/Card";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

export const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);
  const { token } = useSelector((state) => state.user);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    console.log("useEffect");
    const fetchVideos = async () => {
      const randomVideos = await API.get(`/videos/${type}`, config);
      console.log(randomVideos);
      setVideos(randomVideos.data);
    };
    fetchVideos();
  }, [type]);
  console.log(videos);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};
