import { cookies } from "next/headers";
import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const isLoggedIn = (await cookies()).has("access_token");
  //   const token = (await cookies()).get("token");

  return <NavbarClient isLoggedIn={isLoggedIn} />;
}
