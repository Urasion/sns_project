import { useSelector } from "react-redux";
import "./ProfileuserPostList.css";
import { RootState } from "../../redux";
import { authInstance } from "../../interceptors/interceptors";
import { useInfiniteQuery } from "@tanstack/react-query";
import Post from "../Post/Post";
import Loading from "../Common/Loading/Loading";
import { useCallback, useEffect, useRef } from "react";

interface childProps {
  username: string | null;
  id: number;
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

const ProfileuserPostList = ({ username, id }: childProps) => {
  const isDarkmode = useSelector((state: RootState) => state.darkmodeSlice.isDarkmode);
  const pageCount = 9;
  const getProfilePostList = async (page: number) => {
    const res = await authInstance.get(
      `/board/user/${id}?pageStart=${page}&pageCount=${pageCount}`,
    );
    return res.data;
  };

  const profileUserPostList = useInfiniteQuery(
    ["profileUserPostList", username, id],
    ({ pageParam = 0 }) => getProfilePostList(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length + pageCount;
        return lastPage.result.length !== 0 ? nextPage : undefined;
      },
    },
  );
  const observer = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && profileUserPostList.hasNextPage) {
        profileUserPostList.fetchNextPage();
      }
    },
    [profileUserPostList.fetchNextPage, profileUserPostList.hasNextPage],
  );

  useEffect(() => {
    const now = observer.current;
    const option = { threshold: 0 };
    const newObserver = new IntersectionObserver(handleObserver, option);
    if (now !== null) {
      newObserver.observe(now);
      return () => newObserver.unobserve(now);
    }
  }, [profileUserPostList.fetchNextPage, profileUserPostList.hasNextPage, handleObserver]);

  return (
    <div className={`profile_user_postList_container ${isDarkmode && "darkmode"}`}>
      <div className="title_container">
        <p className="component_title">게시글</p>
      </div>
      <div className="profile_user_postList">
        {profileUserPostList.isLoading ? (
          <Loading />
        ) : profileUserPostList.data?.pages.length === 0 ? (
          <div className={`notification_container ${isDarkmode && "darkmode"}`}>
            <p className={`notification ${isDarkmode && "darkmode"}`}>작성한 글이 없습니다.</p>
          </div>
        ) : (
          profileUserPostList.data?.pages.map((el) =>
            el.result.map((el: Board) => (
              <Post info={el} isProfilePost={true} profileId={id} key={el.id} />
            )),
          )
        )}
        <div ref={observer}>
          {profileUserPostList.isFetching &&
          profileUserPostList.isFetchingNextPage &&
          profileUserPostList.hasNextPage ? (
            <Loading />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileuserPostList;
