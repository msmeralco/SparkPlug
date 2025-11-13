import { useEffect, useState } from "react";

/**
 * Custom hook to get the current height of the navbar/header.
 * Returns the height in pixels as a string with 'px' suffix (e.g., '56px').
 * Usage: const headerHeight = useGetHeaderHeight();
 */
export function useGetHeaderHeight() {
  const [headerHeight, setHeaderHeight] = useState("0px");

  useEffect(() => {
    function updateHeight() {
      // Prefer a dashboard nav specifically if present
      const dashboardNav = document.querySelector(
        "#dashboard-navbar"
      ) as HTMLElement | null;
      const target =
        dashboardNav ?? (document.querySelector("nav") as HTMLElement | null);
      const px = target ? `${target.getBoundingClientRect().height}px` : "0px";
      setHeaderHeight(px);
    }

    updateHeight();

    // Also observe mutations in case the nav height changes due to content changes
    const observer = new MutationObserver(updateHeight);
    const dashboardNavEl = document.querySelector("#dashboard-navbar");
    if (dashboardNavEl)
      observer.observe(dashboardNavEl, {
        childList: true,
        subtree: true,
        attributes: true,
      });

    window.addEventListener("resize", updateHeight);

    // run a short timeout to catch any late layout changes
    const id = window.setTimeout(updateHeight, 120);

    return () => {
      window.clearTimeout(id);
      window.removeEventListener("resize", updateHeight);
      observer.disconnect();
    };
  }, []);

  return headerHeight;
}
