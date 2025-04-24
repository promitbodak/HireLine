import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { PiBuildingOfficeBold } from "react-icons/pi";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchjobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  };
  return (
    <div>
      <div className="text-center">
        <div className="flex flex-col gap-5 my-10">
        


        <span className="px-8  flex justify-center items-center py-2 gap-2 rounded-full font-medium">
  <img src="/hirelinelogo.png" alt="Hireline Logo" className="h-34 w-48 object-contain" />
</span>



          <h2 className="text-5xl font-bold">
            Connecting <br />
            TALENT with <span className="text-[#6A38C2]">Opportunity</span>
          </h2>
          <p>
            A streamline hiring platform coneecting employers,recruiter and candidates for efficient job poting <br />
            ,application tracking and recruitment management
          </p>
          <div className="flex w-[40%] shadow-lg border border-gray-300 pl-3 rounded-full items-center gap-4 mx-auto bg-transparent">
  <input
    type="text"
    onChange={(e) => setQuery(e.target.value)}
    placeholder="Find Your Dream Job"
    className="outline-none border-none w-full bg-transparent"
  />
  <Button onClick={searchjobHandler} className="rounded-r-full">
    <Search className="h-5 w-5" />
  </Button>
</div>

        </div>
      </div>
    </div>
  );
};

export default Header;
