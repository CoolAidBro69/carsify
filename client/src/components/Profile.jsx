import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserFail,
  deleteUserStart,
  deleteUserSuccess,
  logoutUserFail,
  logoutUserStart,
  logoutUserSuccess,
  updateUserFail,
  updateUserStart,
  updateUserSuccess,
} from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate=useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [done, setDone] = useState(false);
  const [formData, setFormData] = useState({});
  const [showError,setShowError]=useState(false);
  const [userListings,setUserListings]=useState([]);
  const dispatch = useDispatch();
  function onChangeHandler(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  async function onSubmitHandle(e) {
    e.preventDefault();
    setDone(false);
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFail(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setDone(true);
    } catch (err) {
      dispatch(updateUserFail(error.message));
    }
  }
  async function handleDelete(e){
    setDone(false);
    try{
      dispatch(deleteUserStart());
      const res=await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data=await res.json();
      if(data.success===false){
        dispatch(deleteUserFail(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    }
    catch(err){
      dispatch(deleteUserFail(err.message));
    }
  }
  async function handleSignOut(){
    try{
      dispatch(logoutUserStart);
      const res=await fetch('/api/auth/signout');
      const data=await res.json();
      if(data.success===false){
        dispatch(logoutUserFail(data.message));
        return ;
      }
      dispatch(logoutUserSuccess());
    }
    catch(err){
      dispatch(logoutUserFail(err.message));
    }
  }
  async function handleShow(e){
    try{
      setShowError(false);
      const res=await fetch(`/api/user/listings/${currentUser._id}`);
      const data=await res.json();
      if(data.success===false){
        setShowError(true);
        return;
      }
      setUserListings(data);
    }
    catch(err){
      setShowError(true);
    }
  }
  async function handleDeleteListing(id){
    try{
      const res=await fetch(`/api/listing/delete/${id}`,{
        method:'DELETE',
      });
      const data=await res.json();
      if(data.success===false){
        return;
      }
      setUserListings(userListings.filter((listing)=>listing._id!==id));
    }
    catch(err){
      
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5" onSubmit={onSubmitHandle}>
        <input
          type="text"
          placeholder="Username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-3 rounded-lg mt-8"
          onChange={onChangeHandler}
        />
        <input
          type="email"
          placeholder="Email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-3 rounded-lg"
          onChange={onChangeHandler}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={onChangeHandler}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Updating data..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
          to="/create-listing"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDelete}
          className="text-red-600 cursor-pointer hover:text-red-800"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-600 cursor-pointer hover:text-red-800"
        >
          Sign Out
        </span>
      </div>
      <div className="flex items-center justify-center">
        {error && <p className="text-red-500 mt-5">{error}</p>}
        {done && (
          <p className="text-green-600 mt-5">Data updated successfully</p>
        )}
      </div>
      <button
        onClick={handleShow}
        className="text-green-700 w-full hover:text-green-900 mt-2"
      >
        Show Listings
      </button>
      <p className="text-red-600 text-center py-5">
        {showError ? "Error Showing Listings" : ""}
      </p>
      {userListings &&
        userListings.length > 0 &&
        <div className="flex flex-col gap-4"> 
          <h1 className="text-center font-bold text-2xl mt-1">Your Listings</h1>
        {userListings.map((listing)=>(
          <div
            key={listing._id}
            className="border rounded-lg p-3 flex justify-between items-center gap-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing"
                className="w-16 h-16 object-contain"
              />
            </Link>
            <Link
              to={`/listing/${listing._id}`}
              className="flex-1 text-zinc-600 font-semibold hover:underline truncate"
            >
              <p>{`${listing.brand} ${listing.variant} (${listing.year})`}</p>
            </Link>
            <div className="flex flex-col items-center">
              <button onClick={()=>handleDeleteListing(listing._id)} className="text-red-700 uppercase hover:text-red-800"> Delete </button>
              <button onClick={()=>navigate(`/update-listing/${listing._id}`)}className="text-green-700 uppercase hover:text-green-900"> Edit </button>
            </div>
          </div>
        ))}
        </div>
      }
    </div>
  );
}
