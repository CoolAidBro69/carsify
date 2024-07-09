import React from "react";
import { BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./components/Home";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import About from "./components/About";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./components/CreateListing";
import UpdateListing from "./components/UpdateListing";
import Listing from "./components/Listing";
import Search from "./components/Search";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/about" element={<About />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/search" element={<Search />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
