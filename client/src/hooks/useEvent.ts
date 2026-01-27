import { useState } from "react";

export type Event = {
  id: string;
  name: string;
  date_time: string;
  location: string;
  people_capacity: number;
  joining_fee: number;
};

const API_URL = "http://localhost:5000/api/event";

export function useEvent() {
  const [loading, setLoading] = useState(false);

  // 🔹 Get single event by ID (FOR UPDATE FORM)
  async function getEventById(eventId: string): Promise<Event> {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${eventId}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to fetch event");
      }

      return await res.json();
    } finally {
      setLoading(false);
    }
  }
  return {getEventById};
}
