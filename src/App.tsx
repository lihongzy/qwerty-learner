import React, { lazy, Suspense, useEffect } from "react";
import { useAtomValue } from "jotai";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import "./App.css";
import Loader from "./components/Loading";
import AnalysisPage from "./pages/Analysis";
import ErrorBookPage from "./pages/ErrorBook";
import FriendLinkPage from "./pages/FriendLink";
import GalleryPage from "./pages/Gallery";
import TypingPage from "./pages/Typing";
import { isOpenDarkModeAtom } from "./store";

function App() {
  // const Demo = lazy(
  //   () =>
  //     new Promise<{ default: React.ComponentType }>((resolve) =>
  //       setTimeout(
  //         () => resolve({ default: () => <div>真实页面内容</div> }),
  //         2000,
  //       ),
  //     ),
  // );

  const darkMode = useAtomValue(isOpenDarkModeAtom);
  useEffect(() => {
    darkMode
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  }, [darkMode]);
  return (
    <React.StrictMode>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          {/* <Demo /> */}
          <Routes>
            <Route path="/" element={<TypingPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/error-book" element={<ErrorBookPage />} />
            <Route path="/friend-link" element={<FriendLinkPage />} />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
