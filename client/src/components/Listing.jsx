import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { FaShare } from "react-icons/fa";
import { useSelector } from "react-redux";
import Contact from "./Contact";

SwiperCore.use([Navigation]);

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [contact,setContact]=useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const params = useParams();
  const currYear = new Date().getFullYear();
  const {currentUser}=useSelector(state=>state.user);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          setError(true);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, [params.listingId]);
  return (
    <main>
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center font-semibold my-7 text-2xl">
          Something Went Wrong
        </p>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation className="m-3 rounded">
            {listing.imageUrls &&
              listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="h-[400px]"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>
          <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
            <FaShare
              className="text-slate-500"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            />
          </div>
          {copied && (
            <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
              Link copied!
            </p>
          )}
          <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
            <p className="text-3xl font-semibold text-gray-900 mb-2">
              <span className="block text-4xl font-bold text-slate-600">
                {listing.brand}
              </span>
              <span className="text-3xl text-gray-400">{listing.variant}</span>
            </p>
            <div className="flex gap-4 mt-2">
              <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {listing.condition} / 5 Condition
              </p>
              <p className="bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                {+currYear - +listing.year} years old
              </p>
            </div>
            <div className="flex flex-col gap-2 border border-gray-500 rounded p-3 shadow">
              <p>
                <strong>Year:</strong> {listing.year}
              </p>
              <p>
                <strong>Fuel Type:</strong>{" "}
                {listing.fuelType ? "Petrol" : "Diesel"}
              </p>
              <p>
                <strong>Transmission:</strong>{" "}
                {listing.transmissionType ? "Automatic" : "Manual"}
              </p>
              <p>
                <strong>Kilometers Driven:</strong>{" "}
                {listing.kmsDriven.toLocaleString("en-US")} km
              </p>
              <p>
                <strong>Asking Price:</strong> ₹
                {listing.askingPrice.toLocaleString("en-US")}
              </p>
              <p>
                <strong>Condition:</strong> {listing.condition} / 5
              </p>
            </div>
            {currentUser && currentUser._id!==listing.userRef && !contact && (
                <>
                  <button onClick={()=>setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-90 p-3">
                    Contact Seller
                  </button>
                </>
              )}
              {!currentUser && (
                <p className="text-xl text-center font-semibold text-red-600">Login to contact seller</p>
              )}
            {contact && <Contact listing={listing}/>}
          </div>
        </>
      )}
    </main>
  );
}
