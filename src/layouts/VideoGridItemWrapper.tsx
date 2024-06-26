import { useCallback, useRef } from "react";
import { PopularVideoGridItem } from "../components/PopularVideoGridItem";
import { useDataContext } from "../hooks/useDataContext";
import { maxSearchResults } from "../utils/http";
import LoadingGridItem from "../components/LoadingGridItem";
import { SearchResultsGridItem } from "../components/SearchResultsGridItem";

export default function VideoGridItemWrapper() {
  const { state, loadMoreData } = useDataContext();
  const { videoData, isLoading, action } = state;
  const lastCardObserver = useRef<IntersectionObserver | null>(null);

  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (isLoading) return;

      if (lastCardObserver.current) {
        lastCardObserver.current.disconnect();
      }

      lastCardObserver.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreData();
          }
        },
        { threshold: 1 }
      );

      if (node) lastCardObserver.current.observe(node);
    },
    [isLoading, loadMoreData]
  );

  if (action === "POPULAR") {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        {videoData.map((video, index) => {
          if (videoData.length === index + 1) {
            return (
              <PopularVideoGridItem
                ref={lastVideoElementRef}
                key={`popular-${video.id}-${index}`}
                {...video}
              />
            );
          } else {
            return (
              <PopularVideoGridItem
                key={video ? `popular-${video.id}-${index}` : index}
                {...video}
              />
            );
          }
        })}
        {isLoading &&
          Array.from({ length: maxSearchResults }).map((_, index) => (
            <LoadingGridItem action="POPULAR" key={`loading-${index}`} />
          ))}
      </div>
    );
  }
  if (action === "SEARCH") {
    return (
      <div className="flex flex-col gap-4 items-center">
        {videoData.map((video, index) => {
          if (videoData.length === index + 1) {
            return (
              <SearchResultsGridItem
                ref={lastVideoElementRef}
                key={`search-${video.id}-${index}`}
                {...video}
              />
            );
          } else {
            return (
              <SearchResultsGridItem
                key={video ? `search-${video.id}-${index}` : index}
                {...video}
              />
            );
          }
        })}
        {isLoading &&
          Array.from({ length: maxSearchResults }).map((_, index) => (
            <LoadingGridItem key={`loading-${index}`} action="SEARCH" />
          ))}
      </div>
    );
  }
}
