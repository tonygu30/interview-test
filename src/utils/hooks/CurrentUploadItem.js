import { useState, useEffect } from "react";

export const CurrentUploadItem = () => {
  const [isUpload, setIsUpload] = useState(false);
  const [elements, setElements] = useState([]);
  let currentTimer;

  const getElements = (selector) => {
    if (elements.length > 1 && isUpload) {
      setIsUpload(false);
      return;
    }
    setElements(
      selector.length > 0
        ? selector.map((item) => document.querySelector(item))
        : []
    );
  };

  const handleUpload = () => {
    setIsUpload(true);
  };

  const handleScroll = () => {
    const [scrollContent, scrollBar] = elements;
    const triggerLine =
      scrollBar.clientHeight - scrollContent.clientHeight - 50;
    if (scrollContent.scrollTop > triggerLine) {
      clearTimeout(currentTimer);
      currentTimer = setTimeout(() => {
        handleUpload();
      }, 400);
    }
  };
  useEffect(() => {
    const [scrollContent] = elements;
    if (scrollContent) {
      scrollContent.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [elements]);
  return [isUpload, getElements];
};

export default CurrentUploadItem;
