import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "./ListingItem";

export default function Home() {
  const [recentListing,setRecentLsting]=useState([]);
  SwiperCore.use([Navigation]);

  useEffect(()=>{
    async function fetchListing(){
      try{
        const res=await fetch('/api/listing/get?limit=8');
        const data=await res.json();
        setRecentLsting(data);
      }catch(err){
        console.log(err);
      }
    }
    fetchListing();
  },[])

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find cars at <span className="text-slate-500">best</span>
          <br />
          price with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Carsify is best place for you to find cars at best price.
          <br></br>
          Our expert are always available for you.
        </div>
        <div>
          <Link
            to="/search"
            className="text-xs sm:text-sm text-blue-600 font-semibold hover:font-bold"
          >
            Let's start now....
          </Link>
        </div>
      </div>
      <Swiper navigation>
        {recentListing &&
          recentListing.length > 1 &&
          recentListing.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imageUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[500px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {recentListing && recentListing.length > 0 && (
          <div>
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent Listings</h2>
              <Link className="text-sm text-blue-800 hover:underline" to={"/search"}>See more listings</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {recentListing.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
