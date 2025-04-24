
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "../ui/button";

const filterData = [
  {
    filterType: "Location",
    array: [
      "Delhi",
      "Mumbai",
      "Kolkata",
      "Pune",
      "Bangalore",
      "Hyderabad",
      "Chennai",
      "Remote",
    ],
  },
  {
    filterType: "Technology",
    array: [
      "Mern",
      "React",
      "Data Scientist",
      "Fullstack",
      "Node",
      "Python",
      "Java",
      "frontend",
      "backend",
      "mobile",
      "desktop",
    ],
  },
  {
    filterType: "Experience",
    array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
  },
  {
    filterType: "Salary",
    array: ["0-3 LPA", "4-10 LPA", "10-20 LPA", "20 LPA+"],
  },
];

const Filter = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const handleChange = (value) => {
    setSelectedValue(value);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setSearchedQuery(selectedValue));
  }, [selectedValue]);

  //Reset Filter
  const resetFilters = () => {
    setSelectedValue(""); // Reset local state
    dispatch(setSearchedQuery("")); // Clear search query in Redux
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#6A38C2] to-gray-400 text-white p-5 rounded-md shadow-lg bg-[length:200%] bg-[position:30%]">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3 border-gray-300" />
      {/* Reset Button */}
      <div className="mt-4">
        <Button onClick={resetFilters} className="bg-gray-400 hover:bg-gray-600 text-white px-4 py-2 rounded-md">
          Reset Filters
        </Button>
      </div>
      <RadioGroup value={selectedValue} onValueChange={handleChange}>
        {filterData.map((data, index) => (
          <div key={index} className="mt-4">
            <h2 className="font-bold text-lg">{data.filterType}</h2>
            {data.array.map((item, indx) => {
              const itemId = `Id${index}-${indx}`;
              return (
                <div key={itemId} className="flex items-center space-x-2 my-2">
                  <RadioGroupItem value={item} id={itemId} className="bg-white bg-opacity-20 border-white" />
                  <label htmlFor={itemId} className="cursor-pointer text-gray-200">{item}</label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Filter;



// import React, { useEffect, useState } from "react";
// import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
// import { useDispatch } from "react-redux";
// import { setSearchedQuery } from "@/redux/jobSlice";
// import { Button } from "../ui/button"; // Assuming Button component exists

// const filterData = [
//   {
//     filterType: "Location",
//     array: ["Delhi", "Mumbai", "Kolkata", "Pune", "Bangaluru", "Hyderabad", "Chennai", "Remote"],
//   },
//   {
//     filterType: "Technology",
//     array: ["Mern", "React", "Data Scientist", "Fullstack", "Node", "Python", "Java", "Frontend", "Backend", "Mobile", "Desktop"],
//   },
//   {
//     filterType: "Experience",
//     array: ["0-3 years", "3-5 years", "5-7 years", "7+ years"],
//   },
//   {
//     filterType: "Salary",
//     array: ["0-50k", "50k-100k", "100k-200k", "200k+"],
//   },
// ];

// const Filter = () => {
//   const [selectedValue, setSelectedValue] = useState("");
//   const dispatch = useDispatch();

//   // Handle change
//   const handleChange = (value) => {
//     setSelectedValue(value);
//   };

//   // Dispatch Redux action when selectedValue changes
//   useEffect(() => {
//     dispatch(setSearchedQuery(selectedValue));
//   }, [selectedValue, dispatch]);

//   // Reset Filter
//   const resetFilters = () => {
//     setSelectedValue(""); // Reset local state
//     dispatch(setSearchedQuery("")); // Clear search query in Redux
//   };

//   return (
//     <div className="w-full bg-gradient-to-r from-[#6A38C2] to-gray-400 text-white p-5 rounded-md shadow-lg bg-[length:200%] bg-[position:30%]">
//       <h1 className="font-bold text-lg">Filter Jobs</h1>
//       <hr className="mt-3 border-gray-300" />

//       <RadioGroup value={selectedValue} onValueChange={handleChange}>
//         {filterData.map((data, index) => (
//           <fieldset key={index} className="mt-4 border border-gray-300 rounded-md p-3">
//             <legend className="font-bold text-lg">{data.filterType}</legend>
//             {data.array.map((item, indx) => {
//               const itemId = `Id${index}-${indx}`;
//               return (
//                 <div key={itemId} className="flex items-center space-x-2 my-2">
//                   <RadioGroupItem value={item} id={itemId} className="bg-white bg-opacity-20 border-white" />
//                   <label htmlFor={itemId} className="cursor-pointer text-gray-200">{item}</label>
//                 </div>
//               );
//             })}
//           </fieldset>
//         ))}
//       </RadioGroup>

      // {/* Reset Button */}
      // <div className="mt-4">
      //   <Button onClick={resetFilters} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-md">
      //     Reset Filters
      //   </Button>
      // </div>
//     </div>
//   );
// };

// export default Filter;



