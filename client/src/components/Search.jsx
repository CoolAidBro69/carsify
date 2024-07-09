import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "./ListingItem";

export default function Search() {
  const [sideData, setSideData] = useState({
    searchTerm: "",
    fuelType: true,
    transmissionType: true,
    sort: "createdAt",
    order: "desc",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const urlSearchTerm = urlParams.get("searchTerm");
    const urlFuelType = urlParams.get("fuelType");
    const urlTransmissionType = urlParams.get("transmissionType");
    const urlOrder = urlParams.get("order");
    const urlSort = urlParams.get("sort");
    if (
      urlSearchTerm ||
      urlFuelType ||
      urlTransmissionType ||
      urlOrder ||
      urlSort
    ) {
      setSideData({
        searchTerm: urlSearchTerm || "",
        fuelType: urlFuelType === "true",
        transmissionType: urlTransmissionType === "true",
        sort: urlSort || "createdAt",
        order: urlOrder || "desc",
      });
    }

    async function fetchListing() {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      setListings(data);
      setLoading(false);
    }

    fetchListing();
  }, [location.search]);

  function handleChange(e) {
    if (e.target.id === "petrol" || e.target.id === "diesel") {
      const toSet = e.target.id === "petrol";
      setSideData({ ...sideData, fuelType: toSet });
    }
    if (e.target.id === "automatic" || e.target.id === "manual") {
      const toSet = e.target.id === "automatic";
      setSideData({ ...sideData, transmissionType: toSet });
    }
    if (e.target.id === "searchTerm") {
      setSideData({ ...sideData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSideData({ ...sideData, sort, order });
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sideData.searchTerm);
    urlParams.set("fuelType", sideData.fuelType);
    urlParams.set("transmissionType", sideData.transmissionType);
    urlParams.set("sort", sideData.sort);
    urlParams.set("order", sideData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen md:w-96">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              {" "}
              Variant:{" "}
            </label>
            <input
              type="text"
              id="searchTerm"
              value={sideData.searchTerm}
              onChange={handleChange}
              placeholder="Search....."
              className="border rounded-lg p-3 w-full"
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Fuel Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="petrol"
                className="w-5"
                onChange={handleChange}
                checked={sideData.fuelType === true}
              />
              <span>Petrol</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="diesel"
                className="w-5"
                onChange={handleChange}
                checked={sideData.fuelType === false}
              />
              <span>Diesel</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Transmission Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="automatic"
                className="w-5"
                onChange={handleChange}
                checked={sideData.transmissionType === true}
              />
              <span>Automatic</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="manual"
                className="w-5"
                onChange={handleChange}
                checked={sideData.transmissionType === false}
              />
              <span>Manual</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"createdAt_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
            { loading ? "Searching..." : "Search"}
          </button>
        </form>
        <button onClick={()=>(navigate("/search?searchTerm="))} disabled={loading} className="bg-slate-700 text-white mt-2 p-3 rounded-lg uppercase hover:opacity-90 disabled:opacity-80">
            See all Listing
        </button>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
        {!loading && listings.length===0 &&(
            <p className="text-xl text-slate-700 text-center w-full">No result found</p>
        )}
        {loading &&(
            <p className="text-xl text-slate-700 text-center w-full">Loading....</p>
        )}
        {
            !loading && listings && listings.map((listing)=>(
                <ListingItem key={listing._id} listing={listing}/>
            ))
        }
        </div>
      </div>
    </div>
  );
}
