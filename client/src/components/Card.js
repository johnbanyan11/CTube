import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "timeago.js";
import { API } from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ContextMenu from "./ContextMenu";

const Container = styled.div`
  width: ${(props) => props.type !== "sm" && "320px"};
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
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props) => props.type !== "sm" && "16px"};
`;

const DetailsWrapper = styled.div`
  display: flex;
`;

const IconWrapper = styled.div`
  color: white;
  padding: 5px 8px;

  &:hover {
    background-color: gray;
    border-radius: 50%;
  }
`;

const ChannelImage = styled.img`
  min-width: 36px;
  height: 36px;
  object-fit: contain;
  border-radius: 50%;
  background-color: #999;
  display: ${(props) => props.type === "sm" && "none"};
`;

const TextCon = styled.div`
  margin-left: 10px;
`;

const Title = styled.h1`
  font-size: ${(props) => (props.type === "sm" ? "5px" : "14px")};
  font-weight: ${(props) => (props.type === "sm" ? 200 : 400)};
  color: ${({ theme }) => theme.text};
`;

const ChannelName = styled.h2`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
  margin: 6px 0px;
`;

const Info = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.textSoft};
`;

const Card = ({ type, video }) => {
  const { token } = useSelector((state) => state.user);
  const [channel, setChannel] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [contextMenuCoords, setContextMenuCoords] = useState({
    x: 0,
    y: 0,
  });
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCoords({ x: e.pageX - 50, y: e.pageY + 20 });
    setIsMenuVisible(true);
  };

  const menuOptions = [
    {
      name: "Delete",
      callback: () => {
        deleteVideo();
      },
    },
  ];

  useEffect(() => {
    const fetchChannel = async () => {
      const res = await API.get(`/users/find/${video.userId}`);
      setChannel(res.data);
    };
    fetchChannel();
  }, [video.userId]);

  const deleteVideo = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    console.log("config", config);
    try {
      await API.delete(`/videos/${video._id}`, config);
      // navigate("/");
    } catch (error) {}
  };

  return (
    <Container type={type}>
      <Link to={`/video/${video?._id}`} style={{ textDecoration: "none" }}>
        <Image type={type} src={video?.imgUrl} />
      </Link>
      <Details type={type}>
        <DetailsWrapper>
          <ChannelImage type={type} src={channel?.img} />
          <TextCon>
            <Title>{video?.title}</Title>
            <ChannelName>{channel?.name}</ChannelName>
            <Info>
              {video?.views} views • {format(video?.createdAt)}
            </Info>
          </TextCon>
        </DetailsWrapper>
        <IconWrapper>
          <MoreVertIcon
            id="context-opener"
            onClick={(e) => showContextMenu(e)}
          />
        </IconWrapper>
        {isMenuVisible && (
          <ContextMenu
            options={menuOptions}
            coords={contextMenuCoords}
            menu={isMenuVisible}
            setMenu={setIsMenuVisible}
          />
        )}

        {console.log("isMenuVisible", isMenuVisible)}
      </Details>
    </Container>
  );
};

export default Card;
