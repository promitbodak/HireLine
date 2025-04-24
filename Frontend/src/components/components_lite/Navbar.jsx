

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { LogOut, User2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios"; // Import axios
import { setUser } from "@/redux/authSlice";
import { USER_API_ENDPOINT } from "@/utils/data";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.post(`${USER_API_ENDPOINT}/logout`, {
        withCredentials: true,
      });
      if (res && res.data && res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      } else {
        console.error("Error logging out:", res.data);
      }
    } catch (error) {
      console.error("Axios error:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
      toast.error("Error logging out. Please try again.");
    }
  };

  return (
    <div className="bg-[#6A38C2]  text-white m-3 rounded-lg">
      <div className="flex items-center justify-between mx-auto max-w-8xl h-16 px-4 sm:px-6 lg:px-20">
        <div>
          <h1 className="text-3xl font-bold">
            <Link to="/Home" className="cursor-pointer">
              <span className="bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">HireLine</span>
            </Link>
          </h1>
        </div>
        <div className="flex  ml-auto gap-4">
          <ul className="flex flex-wrap font-medium items-center gap-4 sm:gap-6">
            {user && user.role === "Recruiter" ? (
              <>
                <li>
                  <Link to={"/admin/companies"}>Companies</Link>
                </li>
                <li>
                  <Link to={"/admin/jobs"}>Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to={"/Home"}>Home</Link>
                </li>
                <li>
                  <Link to={"/Browse"}>Browse</Link>
                </li>
                <li>
                  <Link to={"/Jobs"}>Jobs</Link>
                </li>
              </>
            )}
          </ul>
          {!user ? (
            <div className="flex flex-wrap  gap-2">
              <Link to={"/login"}>
                <Button className="bg-gray-700 hover:bg-gray-900">
                  Login
                </Button>
              </Link>
              <Link to={"/register"}>
                <Button className="bg-black hover:bg-gray-700">Register</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={user?.profile?.profilePhoto}
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-white text-black">
                <div className="flex items-center gap-4 space-y-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt="@shadcn"
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{user?.fullname}</h3>
                    <p className="text-sm text-gray-600">{user?.profile?.bio}</p>
                  </div>
                </div>

                <div className="flex flex-col my-2 text-gray-600">
                  {user && user.role === "Student" && (
                    <div className="flex w-fit items-center gap-2 cursor-pointer">
                      <User2 />
                      <Button variant="link">
                        <Link to={"/Profile"}> Profile</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button onClick={logoutHandler} variant="link">
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
