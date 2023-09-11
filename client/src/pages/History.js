import React, { useEffect } from "react";
import { API } from "../api/api";
import { useDispatch, useSelector } from "react-redux";

const History = () => {
  const { currentVideo } = useSelector((state) => state.video);
  const { token } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const history = await API.post(`/history/`, config);
      console.log("history", history);
      //   dispatch(likeVideo(currentUser._id));
    } catch (error) {}
  };

  return <div>History</div>;
};

export default History;
