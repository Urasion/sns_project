import { useState } from "react";
import "./Post.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import Comment from "../Comment/Comment";
import { useS3 } from "../../hook/useS3";
import Button from "../Common/Button/Button";
import { authInstance } from "../../interceptors/interceptors";
import { useQueryClient } from "@tanstack/react-query";

interface childProps {
  info: board;
  isProfilePost: boolean;
  profileId: number;
}

interface board {
  id: number;
  title: string;
  content: string;
  createAt: string;
  hashTag?: string;
  boardFiles?: FileDTO[];
}

interface FileDTO {
  id: number;
  name: string;
  size: number;
  path: string;
  type: string;
}

const Post = ({ info, isProfilePost, profileId }: childProps) => {
  const [open, setOpen] = useState(false);
  const isdarkmode = useSelector((state: RootState) => state.darkmodeSlice.isDarkmode);
  const loginUserName = useSelector((state: RootState) => state.loginSlice.username);
  const loginUserId = useSelector((state: RootState) => state.loginSlice.id);
  const { getUrl } = useS3();
  const queryClient = useQueryClient();

  const deletePost = async (post: board) => {
    const res = await authInstance.delete(`/board`, { data: { id: post.id } });
    if (res.data.statusCode === 200) {
      queryClient.refetchQueries(["profileUserPostList", loginUserName, loginUserId]);
    }
  };

  return (
    <div
      className={`post_container ${isdarkmode && "darkmode"} ${
        isProfilePost && "profile_user_post"
      }`}
    >
      <div className="title_container">
        <p className={`post_title ${isdarkmode && "darkmode"}`}>{info.title}</p>
        {profileId === loginUserId && isProfilePost === true && (
          <Button text="삭제" design="black" type="button" onClick={() => deletePost(info)} />
        )}
      </div>
      <div className={`post_content ${isdarkmode && "darkmode"}`}>{info.content}</div>
      <div className={`post_media_container ${isdarkmode && "darkmode"}`}>
        {info.boardFiles?.map((el) => (
          <img className="post_media" src={getUrl(el.path)} alt={`${el.name} img`} key={el.id} />
        ))}
      </div>
      <div
        className={`display_comment_button ${isdarkmode && "darkmode"} ${open ? "open" : "close"}`}
        onClick={() => setOpen(!open)}
      >
        {open ? <p>댓글 접기</p> : <p>댓글 펼치기</p>}
      </div>
      {open && <Comment boardId={info.id} />}
    </div>
  );
};

export default Post;
