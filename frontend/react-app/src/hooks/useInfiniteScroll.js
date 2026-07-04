import { useEffect, useRef, useState } from "react";

/**
 * Simple infinite scroll hook using IntersectionObserver.
 *
 * Usage:
 * const { sentinelRef, isLoadingMore } = useInfiniteScroll({
 *   hasMore,
 *   loading,
 *   onLoadMore: () => {...},
 * });
 */
export default function useInfiniteScroll({
  hasMore,
  loading,
  onLoadMore,
  root = null,
  rootMargin = "200px",
  threshold = 0,
}) {
  const sentinelRef = useRef(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    if (!hasMore) return;

    let cancelled = false;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        if (cancelled) return;
        if (loading || isLoadingMore) return;
        if (!hasMore) return;

        setIsLoadingMore(true);
        Promise.resolve(onLoadMore?.())
          .catch(() => {
            // swallow - UI will recover next time
          })
          .finally(() => {
            if (!cancelled) setIsLoadingMore(false);
          });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [hasMore, loading, onLoadMore, root, rootMargin, threshold, isLoadingMore]);

  return { sentinelRef, isLoadingMore };
}

