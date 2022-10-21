import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";

import { API } from "../api/api";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-column-gap: 3px;
`;

export const Home = ({ type }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const randomVideos = await API.get(`/videos/${type}`);
      setVideos(randomVideos.data);
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {videos.map((video) => (
        <Card key={video._id} video={video} />
      ))}
    </Container>
  );
};
