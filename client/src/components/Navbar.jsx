import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Navbar() {
  const {currentUser}=useSelector(state=>state.user);
  const navigate=useNavigate();
  const [search,setSearch]=useState("");
  function handleSearch(e){
    e.preventDefault();
    const urlParams= new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',search);
    const searchQuery=urlParams.toString();
    navigate(`/search?${searchQuery}`)
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearch = urlParams.get("searchTerm");
    if (urlSearch) {
      setSearch(urlSearch);
    }
  }, [location.search]);
  return (
    <div>
      <header className="bg-neutral-400 shadow-lg rounded-sm">
        <div className="flex justify-around sm:justify-between items-center max-w-6xl py-2 sm:mx-7">
          <Link to="/">
            <h1 className="font-bold text-sm md:text-xl flex flex-wrap">
              <span className="text-cyan-200 text-2xl">Cars</span>
              <span className="text-cyan-700 text-2xl">ify</span>
            </h1>
          </Link>
          <div>
            <form onSubmit={handleSearch} className="flex items-center shadow-md rounded p-1 bg-slate-200 w-24 sm:w-64">
              <input
                type="text"
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by variant...."
                value={search}
                className="placeholder-opacity-100 placeholder-black outline-none flex-grow bg-slate-200 w-20 sm:w-60"
              />
              <button>
                <FaSearch className="text-black" />
              </button>
            </form>
          </div>
          <ul className="flex gap-4">
            <li className="hidden sm:inline hover:underline text-slate-700">
              <Link to="/">Home</Link>
            </li>
            <li className="hidden sm:inline hover:underline text-slate-700">
              <Link to="/about">About</Link>
            </li>
            <Link to="/profile">
              {currentUser ? (
                <li className="inline hover:underline text-slate-700">
                  {currentUser.username[0].toUpperCase() +
                    currentUser.username.slice(1)}
                </li>
              ) : (
                <li className="inline hover:underline text-slate-700">
                  Sign In
                </li>
              )}
            </Link>
          </ul>
        </div>
      </header>
    </div>
  );
}
