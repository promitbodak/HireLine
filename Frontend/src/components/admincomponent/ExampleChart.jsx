import React from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#6366f1", "#14b8a6"];

const ExampleChart = ({ type, data, xKey, yKey, lineColor = "#4f46e5", lines = [] }) => {
    if (!data || data.length === 0) return <p className="text-center">No data</p>;

    switch (type) {
        case "line":
            return (
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={data}>
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={yKey}
                            stroke={lineColor}
                            strokeWidth={2}
                            isAnimationActive={true}
                        />
                    </LineChart>
                </ResponsiveContainer>
            );

        case "multi-line":
            return (
                <ResponsiveContainer width="100%" height={250} >
                    <LineChart data={data}>
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {lines.map((line, index) => (
                            <Line
                                key={index}
                                type="monotone"
                                dataKey={line.dataKey}
                                stroke={line.color || COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                name={line.name || line.dataKey}
                                isAnimationActive={true}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            );

        case "bar":
            return (
                <ResponsiveContainer width="100%" height={250} >
                    <BarChart data={data}>
                        <XAxis dataKey={xKey} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey={yKey} fill={lineColor} isAnimationActive={true} />
                    </BarChart>
                </ResponsiveContainer>
            );

        case "pie":
            return (
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Tooltip />
                        <Legend layout="vertical" verticalAlign="middle" align="right" />
                        <Pie
                            data={data}
                            dataKey={yKey}
                            nameKey={xKey}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                            isAnimationActive={true}
                        >
                            {data.map((_, index) => (
                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            );

        default:
            return <p className="text-center">Invalid chart type</p>;
    }
};

export default ExampleChart;
