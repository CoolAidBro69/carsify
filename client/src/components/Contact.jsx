import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [seller, setSeller] = useState(null);
  const [message, setMessage] = useState("");
  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setSeller(data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchDetail();
  }, [listing.userRef]);
  return (
    <>
      {seller && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold lowercase">{seller.username}</span>{" "}
            for{" "}
            <span className="font-semibold lowercase">
              {listing.brand} {listing.variant}
            </span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg"
            placeholder="Enter your message"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90"
            to={`mailto:${seller.email}?subject=Regarding listing of ${listing.brand} ${listing.variant}&body=${message}`}
          >
            Send message
          </Link>
        </div>
      )}
    </>
  );
}
