import styled from "@emotion/styled";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Card from "./Card";

const Container = styled.div`
  flex: 2;
`;

const Recommendations = ({ tags }) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/videos/tags?tags=${tags}`);
      setVideos(res.data);
    };
    fetchVideos();
  }, [tags]);

  return (
    <Container>
      {videos.map((video) => (
        <Card type="sm" key={video._id} video={video} />
      ))}
    </Container>
  );
};

export default Recommendations;
