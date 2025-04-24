import React from "react";

const ChartCard = ({ title, children }) => {
    return (
        <div className="bg-white rounded-2xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <div>{children}</div>
        </div>
    );
};

export default ChartCard;
