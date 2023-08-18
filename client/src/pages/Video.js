import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";

import ThumbUpOffAltOutlinedIcon from "@mui/icons-material/ThumbUpOffAltOutlined";
import ThumbDownAltOutlinedIcon from "@mui/icons-material/ThumbDownAltOutlined";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import AddTaskOutlinedIcon from "@mui/icons-material/AddTaskOutlined";

import Comments from "../components/Comments";
import Recommendations from "../components/Recommendations";

import {
  dislikeVideo,
  fetchVideoSuccess,
  incrementView,
  likeVideo,
} from "../app/videoSlice";
import { subscription } from "../app/userSlice";
import { API } from "../api/api";

const Container = styled.div`
  display: flex;
  margin-top: 8px;
  gap: 20px;
`;
const Content = styled.div`
  flex: 5;
  margin-left: 10px;
`;

const VideoWrapper = styled.div``;

const Title = styled.h1`
  font-size: 16px;
  font-weight: 400;
  margin-top: 20px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.text};
`;

const Details = styled.div`
  display: flex;
  margin-top: 10px;
  align-items: center;
  justify-content: space-between;
`;

const Info = styled.span`
  color: ${({ theme }) => theme.textSoft};
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
  color: ${({ theme }) => theme.text};
`;

const Button = styled.div`
  display: flex;
  gap: 10px;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
`;

const Hr = styled.hr`
  margin: 15px 0px;
  border: 0.5px solid ${({ theme }) => theme.soft};
`;

const Channel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ChannelInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const ChannelImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ChannelDetails = styled.div`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.span`
  font-weight: 500;
`;

const ChannelCounter = styled.span`
  margin-top: 5px;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textSoft};
`;
const ChannelDescription = styled.p`
  font-size: 14px;
`;

const Subscribe = styled.button`
  background-color: #cc1a00;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;
const UnSubscribe = styled.button`
  background-color: gray;
  font-weight: 500;
  color: white;
  border: none;
  border-radius: 3px;
  height: max-content;
  padding: 10px 20px;
  cursor: pointer;
`;

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const Video = () => {
  const { currentVideo } = useSelector((state) => state.video);
  const { currentUser } = useSelector((state) => state.user);
  const { token } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const path = useLocation().pathname.split("/")[2];

  const [currentVideochannel, setCurrentVideoChannel] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const videoRes = await API.get(`/videos/find/${path}`);
        const currentVideochannelRes = await API.get(
          `/users/find/${videoRes.data.userId}`
        );
        setCurrentVideoChannel(currentVideochannelRes.data);
        dispatch(fetchVideoSuccess(videoRes.data));
      } catch (error) {}
    };
    fetchData();
  }, [dispatch, path]);

  useEffect(() => {
    IncView();
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const IncView = async () => {
    try {
      await API.put(`/videos/view/${currentVideo._id}`);
      dispatch(incrementView(currentVideo._id));
    } catch (error) {}
  };

  const handleLike = async () => {
    try {
      await API.put(`/users/like/${currentVideo._id}`, config);
      dispatch(likeVideo(currentUser._id));
    } catch (error) {}
  };

  const handleDislike = async () => {
    await API.put(`/users/dislike/${currentVideo._id}`, config);
    dispatch(dislikeVideo(currentUser._id));
  };

  const handleSub = async () => {
    dispatch(subscription(currentVideochannel._id));
    currentUser.subscribedUsers.includes(currentVideochannel._id)
      ? await API.put(`/users/unsub/${currentVideochannel._id}`, config)
      : await API.put(`/users/sub/${currentVideochannel._id}`, config);
  };

  return (
    <Container>
      {/* {console.log("currentuser", currentUser)} */}
      {currentVideo && (
        <Content>
          <VideoWrapper>
            <VideoFrame src={currentVideo.videoUrl} controls />
          </VideoWrapper>
          <Title>{currentVideo.title}</Title>
          <Details>
            <Info>
              {currentVideo.views} views • {format(currentVideo.createdAt)}
            </Info>
            <Buttons>
              <Button onClick={handleLike}>
                {currentVideo.likes?.includes(
                  currentUser && currentUser._id
                ) ? (
                  <ThumbUpAltIcon />
                ) : (
                  <ThumbUpOffAltOutlinedIcon />
                )}{" "}
                {currentVideo.likes?.length}
              </Button>
              <Button onClick={handleDislike}>
                {currentVideo.dislikes?.includes(
                  currentUser && currentUser._id
                ) ? (
                  <ThumbDownAltIcon />
                ) : (
                  <ThumbDownAltOutlinedIcon />
                )}{" "}
                DISLIKE
              </Button>
              <Button>
                <ReplyOutlinedIcon /> SHARE
              </Button>
              <Button>
                <AddTaskOutlinedIcon /> SAVE
              </Button>
            </Buttons>
          </Details>
          <Hr />
          <Channel>
            <ChannelInfo>
              <ChannelImage src={currentVideochannel.img} />
              <ChannelDetails>
                <ChannelName>{currentVideochannel.name}</ChannelName>
                <ChannelCounter>
                  {currentUser.subscribers} Subscribers
                </ChannelCounter>
                <ChannelDescription>{currentVideo.desc}</ChannelDescription>
              </ChannelDetails>
            </ChannelInfo>
            <div>
              {currentUser &&
              currentUser.subscribedUsers?.includes(currentVideochannel._id) ? (
                <UnSubscribe onClick={handleSub}>SUBSCRIBED</UnSubscribe>
              ) : (
                <Subscribe onClick={handleSub}>SUBSCRIBE</Subscribe>
              )}
            </div>
          </Channel>
          <Hr />
          <Comments videoId={currentVideo._id} />
        </Content>
      )}
      {currentVideo && currentVideo.tags && (
        <Recommendations tags={currentVideo.tags} />
      )}
    </Container>
  );
};

export default Video;
