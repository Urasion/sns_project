import "./PostList.css";
import Post from "../Post/Post";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../../redux";
import { authInstance } from "../../interceptors/interceptors";
import Loading from "../Common/Loading/Loading";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";

interface BoardListResponse {
  message: string;
  statusCode: number;
  result: Board[];
}

interface Board {
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

const PostList = () => {
  const loginusername = useSelector((state: RootState) => state.loginSlice.username);
  const loginUserId = useSelector((state: RootState) => state.loginSlice.id);
  const isDarkmode = useSelector((state: RootState) => state.darkmodeSlice.isDarkmode);
  const [hasPage, setHasPage] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchOption = searchParams.get("searchoption");
  const keyword = searchParams.get("searchword");
  const pageCount = 10;

  const getPostList = async (page: number) => {
    if (searchOption === "author") {
      const res = await authInstance.get(
        `/board/${keyword}?pageStart=${page}&pageCount=${pageCount}`,
      );
      if (res.data.result === null) {
        setHasPage(false);
      }
      return res.data;
    } else if (searchOption === "content") {
      const res = await authInstance.get(
        `/board/content/${keyword}?pageStart=${page}&pageCount=${pageCount}`,
      );
      if (res.data.result === null) {
        setHasPage(false);
      }
      return res.data;
    } else {
      const res = await authInstance.get(`/board/friend?pageStart=${page}&pageCount=${pageCount}`);
      if (res.data.result === null) {
        setHasPage(false);
      }
      return res.data;
    }
  };

  const postList = useInfiniteQuery(
    ["postList", loginusername, searchOption, keyword],
    ({ pageParam = 0 }) => getPostList(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + pageCount;
        return lastPage.result?.length !== 0 ? nextPage : undefined;
      },
    },
  );
  const observer = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && postList.hasNextPage && hasPage) {
        postList.fetchNextPage();
      }
    },
    [postList.fetchNextPage, postList.hasNextPage, hasPage],
  );

  useEffect(() => {
    const now = observer.current;
    const option = { threshold: 0 };
    const newObserver = new IntersectionObserver(handleObserver, option);
    if (now !== null) {
      newObserver.observe(now);
      return () => newObserver.unobserve(now);
    }
  }, [postList.fetchNextPage, postList.hasNextPage, hasPage, handleObserver]);

  return (
    <div className="postList_container">
      {postList.isLoading ? (
        <Loading />
      ) : postList.data?.pages.length === 0 ? (
        <div className={`notification_container ${isDarkmode && "darkmode"}`}>
          <p className={`notification ${isDarkmode && "darkmode"}`}>작성된 글이 없습니다.</p>
        </div>
      ) : (
        postList.data?.pages.map(
          (el: BoardListResponse) =>
            el.result?.map((el: Board) => (
              <Post info={el} isProfilePost={false} profileId={loginUserId} key={el.id} />
            )),
        )
      )}
      <div ref={observer}>
        {postList.isFetching && postList.isFetchingNextPage && postList.hasNextPage && hasPage ? (
          <Loading />
        ) : null}
      </div>
    </div>
  );
};

export default PostList;
