import React from "react";
import Footer from "./Footer";
import Userpannel from "./Userpannel";

function Wrapper({ children }) {
  return (
    <>
      <div className="flex flex-col-reverse limit-width xl:mx-auto lg:flex-row min-h-screen bg-gray-200">
        <div id="offset" className="xl:w-1/6 sm:w-0"></div>
        <main className="xl:w-1/2 lg:w-2/3 md:w-4/5 md:mx-auto sm:w-full">
          {children}
        </main>
        <div className="lg:w-1/3 md:w-4/5 md:mx-auto sm:w-full">
          <Userpannel />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Wrapper;
