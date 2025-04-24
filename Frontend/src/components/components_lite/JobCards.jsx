// import React from "react";
// import { Badge } from "../ui/badge";
// import { useNavigate } from "react-router-dom";


// const JobCards = ({job}) => {
//   console.log(job);
//   const navigate = useNavigate();

//   return (
//     <div onClick={()=>navigate(`/description/${job._id}`)} className="p-5 rounded-md shadow-xl bg-white  border border-gray-200 cursor-pointer hover:shadow-2xl hover:shadow-blue-200 hover:p-3 ">
//       <div>

//         <h1 className="text-lg font-medium"> {job.name} </h1>

//         <p className="text-sm text-gray-600">India</p>
//       </div>
//       <div>
//         <h2 className="font-bold text-lg my-2">{job.title}</h2>
//         <p className="text-sm text-gray-600">
//           {
//             job.description
//           }
//         </p>
//       </div>
//       <div className=" flex gap-2 items-center mt-4 ">
//         <Badge className={" text-blue-600 font-bold"} variant={"ghost"}>
//           {job.position} Open Positions
//         </Badge>
//         <Badge className={" text-[#FA4F09] font-bold"} variant={"ghost"}>
//           {job.salary}LPA
//         </Badge>
//         <Badge className={" text-[#6B3AC2]  font-bold"} variant={"ghost"}>
//           {job.location}
//         </Badge>
//         <Badge className={" text-black font-bold"} variant={"ghost"}>
//           {job.jobType}
//         </Badge>
//       </div>
//     </div>
//   );
// };

// export default JobCards;
import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

const JobCards = ({ job }) => {
  console.log(job);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/description/${job._id}`)}
      className="flex flex-col w-full sm:w-[300px] md:w-[300px] lg:w-[420px] h-[400px] p-5 rounded-md shadow-xl bg-white bg-opacity-50 backdrop-blur-md text-black border border-gray-300 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:scale-105 overflow-hidden"
    >
      {/* <div>
        <h1 className="text-lg  font-medium">{job.name}</h1>
        <p className="text-sm text-black-200">India</p>
      </div> */}

      {/* Avatar & Company Name */}
      <div className="flex items-center gap-2 mb-3">
        <Button className="p-2 bg-white bg-opacity-20 rounded-full" variant="outline" size="icon">
          <Avatar className="w-10 h-10">
            <AvatarImage src={job?.company?.logo} />
          </Avatar>
        </Button>
        <div>
          <h1 className="text-lg font-medium">{job?.company?.name}</h1>
          <p className="text-sm text-gray-600">India</p>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-lg my-2">{job.title}</h2>
        <p className="text-sm text-black text-justify max-h-40 overflow-y-auto">{job.description}</p>
      </div>
      <div className="flex flex-wrap justify-between items-end mt-auto gap-x-0 gap-y-2 w-full">
        <Badge className="text-[#6A38C2] font-bold bg-white bg-opacity-20 text-center py-2 h-10 min-w-[80px] flex items-center justify-center" variant="ghost">
          {job.position} Open Positions
        </Badge>
        <Badge className="text-[#6A38C2] font-bold bg-white bg-opacity-20 text-center py-2 h-10 min-w-[80px] flex items-center justify-center" variant="ghost">
          {job.salary} LPA
        </Badge>
        <Badge className="text-[#6A38C2] font-bold bg-white bg-opacity-20 text-center py-2 h-10 min-w-[80px] flex items-center justify-center" variant="ghost">
          {job.location}
        </Badge>
        <Badge className="text-[#6A38C2] font-bold bg-white bg-opacity-20 text-center py-2 h-10 min-w-[80px] flex items-center justify-center" variant="ghost">
          {job.jobType}
        </Badge>
      </div>

    </div>
  );
};

export default JobCards;
