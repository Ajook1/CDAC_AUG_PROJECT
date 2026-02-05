import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function UserLayout({ cartCount }) {
  return (
    <>
      <Navbar cartCount={cartCount} />
      <Outlet />
    </>
  );
}

export default UserLayout;
