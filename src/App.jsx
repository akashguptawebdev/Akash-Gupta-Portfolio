import React from "react";
import "./App.css";
import HomePage from "./Pages/HomePage";
import Header from "./components/Header";
const App = () => {
  return (
    <div className="font-['Nunito']  mx-auto">
      <Header />
      <HomePage />
    </div>
  );
};

export default App;
