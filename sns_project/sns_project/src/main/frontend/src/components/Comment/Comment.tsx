import { useSelector } from "react-redux";
import "./Comment.css";
import { RootState } from "../../redux";
import { authInstance } from "../../interceptors/interceptors";
import { useInfiniteQuery } from "@tanstack/react-query";
import Loading from "../Common/Loading/Loading";
import CommentInput from "./CommentInput/CommentInput";
import { useS3 } from "../../hook/useS3";
import { useState } from "react";
import Button from "../Common/Button/Button";

interface childProps {
  boardId: number;
}

interface commentResponse {
  message: string;
  statusCode: number;
  result: comment[];
}

interface comment {
  commentId?: number;
  boardId: number;
  content: string;
  createAt: string;
  state: string;
  member: MemberDTO;
}

interface MemberDTO {
  id: number;
  username: string;
  password: string;
  name: string;
  email: string;
  birth: string;
  createAt: string;
  provider: string;
  profile: FileDTO;
}

interface FileDTO {
  id: number;
  path: string;
  name: string;
  type: string;
  size: number;
}

const Comment = ({ boardId }: childProps) => {
  const isdarkmode = useSelector((state: RootState) => state.darkmodeSlice.isDarkmode);
  const loginUserId = useSelector((state: RootState) => state.loginSlice.id);
  const [hasPage, setHasPage] = useState(true);
  const pageCount = 50;
  const { getUrl } = useS3();
  const getComment = async (page: number) => {
    const res = await authInstance.get(
      `/comment/${boardId}?pageStart=${page}&pageCount=${pageCount}`,
    );
    if (res.data.result === null) {
      setHasPage(false);
    }
    return res.data;
  };

  const deleteComment = async (commentId: number | undefined) => {
    if (commentId) {
      await authInstance.delete(`/comment`, { data: { id: commentId } });
    }
  };

  const commentData = useInfiniteQuery(
    ["comment", boardId],
    ({ pageParam = 0 }) => getComment(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + pageCount;
        return lastPage.result?.length !== 0 ? nextPage : undefined;
      },
    },
  );
  console.log(commentData.data?.pages, hasPage);

  return (
    <div className={`commentList_container ${isdarkmode && "darkmode"}`}>
      {commentData.isLoading ? (
        <Loading />
      ) : commentData.data?.pages.length === 0 ? (
        <div className={`notification_container ${isdarkmode && "darkmode"}`}>
          <p className={`notification ${isdarkmode && "darkmode"}`}>작성된 댓글이 없습니다.</p>
        </div>
      ) : (
        commentData.data?.pages.map(
          (el: commentResponse) =>
            el.result?.map((el: comment) => (
              <div className={`comment ${isdarkmode && "darkmode"}`} key={el.commentId}>
                <div className="comment_author_container">
                  <img className="comment_author" src={getUrl(el.member.profile.path)} />
                  <p className="comment_author_name">{el.member.name}</p>
                </div>
                <p className="comment_content">{el.content}</p>
                {el.member.id === loginUserId && (
                  <Button
                    text="삭제"
                    type="button"
                    design="black"
                    onClick={() => deleteComment(el.commentId)}
                  />
                )}
              </div>
            )),
        )
      )}
      <CommentInput boardId={boardId} />
    </div>
  );
};

export default Comment;
