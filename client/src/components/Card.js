import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import { API } from "../api/api";
import { useDispatch } from "react-redux";
import { incrementView } from "../app/videoSlice";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "355px"};
  margin-bottom: ${(props) => (props.type === "sm" ? "10px" : "45px")};
  cursor: pointer;
  display: ${(props) => props.type === "sm" && "flex"};
  gap: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: ${(props) => (props.type === "sm" ? "120px" : "202px")};
  background-color: #999;
  object-fit: cover;
  flex: 1;
`;

const Details = styled.div`
  display: flex;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
  gap: 12px;
  flex: 1;
`;

const ChannelImage = styled.img`
  width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const TextCon = styled.div``;

const Title = styled.h1`
  font-size: ${(props) => (props.type === "sm" ? "5px" : "16px")};
  font-weight: ${(props) => (props.type === "sm" ? 300 : 800)};
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 9px 0px;
`;
const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  const [channel, setChannel] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await API.get(`/users/find/${video.userId}`);
      setChannel(res.data);
      console.log(res.data);
      console.log(video);
    };
    fetchChannel();
  }, [video.userId]);

  const IncView = async () => {
    try {
      await API.put(`/videos/view/${video._id}`);
      dispatch(incrementView(video._id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link to={`/video/${video._id}`} style={{ textDecoration: "none" }}>
      <Container type={type} onClick={IncView}>
        <Image type={type} src={video.imgUrl} />
        <Details type={type}>
          <ChannelImage type={type} src={channel.img} />
          <TextCon>
            <Title>{video.title}</Title>
            <ChannelName>{channel.name}</ChannelName>
            <Info>
              {video.views} views • {format(video.createdAt)}
            </Info>
          </TextCon>
        </Details>
      </Container>
    </Link>
  );
};

export default Card;
