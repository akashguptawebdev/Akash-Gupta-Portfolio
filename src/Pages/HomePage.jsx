import React, { useContext, useEffect } from "react";
import Hero from "../components/Hero";
import Projects from "../components/Projects";
import { AppContext } from "../ContextApi.jsx";

const HomePage = () => {
  const { state, setState } = useContext(AppContext);

  return (
    <div className={`h-screen sm:${state?"bg-white":"bg-black"}`}>
      <Hero />
      <Projects />
    </div>
  );
};

export default HomePage;
