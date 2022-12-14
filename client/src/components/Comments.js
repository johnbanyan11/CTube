import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Comment from "./Comment";
import { useSelector } from "react-redux";
import { API } from "../api/api";

const Container = styled.div``;

const NewComment = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: transparent;
  outline: none;
  padding: 5px;
  width: 100%;
`;

const SubmitButton = styled.button`
  background-color: gray;
  color: white;
  border-radius: 5px;
  padding: 10px 5px;
  cursor: pointer;
`;

const ValidateLikeDiv = styled.span`
  color: white;
  font-size: 15px;
  border: 1px solid white;
  padding: 5px;
`;

const Comments = ({ videoId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { currentVideo } = useSelector((state) => state.video);
  const { token } = useSelector((state) => state.user);

  const [desc, setDesc] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await API.get(`/comments/${videoId}`);
        setComments(res.data);
      } catch (error) {}
    };
    fetchComments();
  }, [videoId]);

  const handleUploadComment = async (e) => {
    const userId = currentVideo.userId;
    const videoId = currentVideo._id;

    e.preventDefault();

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        desc,
        userId,
        videoId,
      },
    };

    try {
      const newComment = await API.post("/comments", config);

      if (newComment.status === 200) {
        setDesc("");
        setComments((oldComments) => [...oldComments, newComment.data]);
      }
    } catch (error) {}
  };

  const orderedComments = comments
    .slice()
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Container>
      {currentUser ? (
        <NewComment>
          <Avatar src={currentUser.img} />
          <Input
            type="text"
            value={desc}
            placeholder="Add Comment..."
            onChange={(e) => setDesc(e.target.value)}
          />
          <SubmitButton onClick={handleUploadComment}>Comment</SubmitButton>
        </NewComment>
      ) : (
        <ValidateLikeDiv>Sign In to Like,Comment and Subscribe</ValidateLikeDiv>
      )}
      {orderedComments.map((comment) => (
        <Comment key={comment._id} comment={comment} />
      ))}
    </Container>
  );
};

export default Comments;
