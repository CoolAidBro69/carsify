import React from "react";
import { Link } from "react-router-dom";
import { ImRoad } from "react-icons/im";

export default function ListingItem({ listing }) {
  return (
    <div className="bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden rounded-lg">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={listing.imageUrls[0]}
          alt="listing cover"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
        />
        <div className="p-3">
          <p className="truncate w-full sm:w-[330px] text-lg font-semibold text-slate-700">
            {listing.brand} {listing.variant}
          </p>
          <div>
            <p className="truncate w-full sm:w-[330px] text-lg font-semibold text-slate-700">
              Year of Purchase:
            </p>
            <p className="font-medium">{listing.year}</p>
          </div>
          <p className="pt-2 w-full sm:w-[330px] text-sm font-semibold text-slate-700">
            Price:
          </p>
          <div className="flex flex-row items-center gap-2">
            <p className="font-bold">Rs.</p>
            <p>{listing.askingPrice}</p>
          </div>
          <p className="pt-2 w-full sm:w-[330px] text-sm font-semibold text-slate-700">
            Kilometer Driven:
          </p>
          <div className="flex flex-row items-center gap-2">
            <ImRoad className="text-slate-700" />
            <p> {listing.kmsDriven} kms</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
