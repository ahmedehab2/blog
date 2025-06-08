import { Route, Routes } from "react-router";
// import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import PostForm from "./pages/Post-form";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit/:id" element={<PostForm />} />
        <Route path="/new" element={<PostForm />} />
      </Routes>
    </>
  );
}

export default App;
