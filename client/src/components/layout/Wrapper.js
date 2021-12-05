import React from "react";
import ScrollToTop from "../post/ScrollToTop";
import Header from "./Header";
import Userpanel from "./Userpanel";

function Wrapper({ children }) {
  return (
    <>
      <Header />
      <div
        className="flex flex-col limit-width xl:mx-auto
       lg:flex-row-reverse min-h-screen bg-gray-200"
      >
        <div className="lg:w-1/3 md:w-4/5 md:mx-auto sm:w-full">
          <Userpanel />
        </div>

        <main className="xl:w-1/2 lg:w-2/3 md:w-4/5 md:mx-auto sm:w-full">
          {children}
        </main>
        <ScrollToTop />
        <div id="offset" className="xl:w-1/6 sm:w-0" />
      </div>
    </>
  );
}

export default Wrapper;
