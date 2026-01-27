import { getAccessToken } from "@/lib/auth-cookies";

import { useRouter } from "next/navigation";

export type CreateEventPayload = {
  name: string;
  date_time: string;
  location: string;
  people_capacity: number;
  joining_fee: number;
};

export type UpdateEvent = Partial<CreateEventPayload> & {
  id: string;
};

export const useCreate = () => {
  const router = useRouter();
  const createEvent = async (payload: CreateEventPayload) => {
    const res = await fetch("http://localhost:5000/api/event/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${await getAccessToken()}`,
      },
      credentials: "include",
      body: JSON.stringify({
        ...payload,
        managerId: "jfyRvWpN85x5lpwDoMJXpyEYgvP2Qge5",
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Event creation failed");
    }

    router.refresh();
    // router.push("/my-events");
  };
  const updateEvent = async (payload: UpdateEvent) => {
    const res = await fetch("http://localhost:5000/api/event/edit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${await getAccessToken()}`,
      },
      credentials: "include",
      body: JSON.stringify({
        ...payload,
        id: payload.id,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Event creation failed");
    }

    router.refresh();
    router.push("/my-events");
  };

  return { createEvent, updateEvent };
};
