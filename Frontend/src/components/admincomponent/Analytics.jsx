import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/redux/applicationSlice";
import { APPLICATION_API_ENDPOINT } from "@/utils/data";
import Navbar from "../components_lite/Navbar";
import ChartCard from "./ChartCard";
import ExampleChart from "./ExampleChart";

const Analytics = () => {
    // Fetching all associated Applicant Data and updating the redux store
    const params = useParams();
    const dispatch = useDispatch();
    const { applicants } = useSelector((store) => store.application);

    useEffect(() => {
        const fetchAllApplicants = async () => {
            try {
                const res = await axios.get(
                    `${APPLICATION_API_ENDPOINT}/${params.id}/applicants`,
                    { withCredentials: true }
                );
                dispatch(setAllApplicants(res.data.job));
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllApplicants();
    }, [params.id]);





    // Functions for generating data to visualize charts/graphs
    // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv


    const getScoreDistribution = (arrayData) => {
        // Create 10 buckets for ranges of 100
        const scoreRanges = Array.from({ length: 10 }, (_, i) => ({
            range: `${i * 100}-${(i + 1) * 100}`,
            applicants: 0,
        }));

        arrayData.forEach((item) => {
            let fs = item.scores.final_weighted_score
            if (typeof fs !== 'number') return;

            // Clamp the score to 999 if it's exactly 1000 to fit in the last bucket
            const score = Math.min(fs, 999);

            // Determine which bucket (0–9) this score belongs to
            const index = Math.floor(score / 100);

            // Increment the count in the corresponding range
            if (scoreRanges[index]) {
                scoreRanges[index].applicants += 1;
            }
        });

        return scoreRanges;
    };


    function countUniversities(data) {
        const universityCount = {};

        // Count occurrences of each university
        data.forEach(item => {
            const uni = item.applicant.university;
            universityCount[uni] = (universityCount[uni] || 0) + 1;
        });

        // Convert to desired array format
        const result = Object.entries(universityCount).map(([university, number]) => ({
            university,
            number
        }));

        return result;
    }



    const getTop20PercentCandidates = (arrData) => {
        if (!Array.isArray(arrData) || arrData.length === 0) return [];

        const total = arrData.length;
        const topCount = Math.ceil(total * 0.2);

        return arrData
            .filter(item => typeof item.scores.final_weighted_score === 'number')
            .sort((a, b) => b.scores.final_weighted_score - a.scores.final_weighted_score)
            .slice(0, topCount)
            .map(x => ({
                name: x.applicant.fullname,
                score: x.scores.final_weighted_score,
            }));
    };


    const getCandidatesWithAverage = (arrData) => {
        if (!Array.isArray(arrData) || arrData.length === 0) return [];

        // Filter out invalid or missing scores
        const validApplicants = arrData.filter(
            (app) => typeof app.scores.final_weighted_score === "number"
        );

        // Calculate average score
        const totalScore = validApplicants.reduce((sum, app) => sum + app.scores.final_weighted_score, 0);
        const average = totalScore / validApplicants.length;

        // Map to include name, score, and average
        return validApplicants.map((app) => ({
            name: app.applicant.fullname,
            score: app.scores.final_weighted_score,
            averageScore: average,
        }));
    };




    // Candidate distribution data based on final scores
    const candidateDistribution = getScoreDistribution(applicants.applications);
    // University distribution
    const universityDistribution = countUniversities(applicants.applications);
    // Top 20% scored applicants
    const top20 = getTop20PercentCandidates(applicants.applications);
    // Plotting data for actual vs avg score
    const actualVSavg = getCandidatesWithAverage(applicants.applications);

    console.log(candidateDistribution)      // This log is only for debugging and verifying purpose
    console.log(universityDistribution)     // This log is only for debugging and verifying purpose
    console.log(top20)
    console.log(actualVSavg);


    const userGrowthData = [
        { month: "Jan", users: 400 },
        { month: "Feb", users: 300 },
        { month: "Mar", users: 500 },
        { month: "Apr", users: 600 },
    ];


    return (
        <div>
            <Navbar />
            <div className="p-6 bg-gray-100 min-h-screen">
                <h1 className="text-2xl font-bold mb-6">Analytics Dashboard of  [{applicants.title}]</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard title="Actual Vs Avg Scores">
                        <ExampleChart
                            type="multi-line"
                            data={actualVSavg}
                            xKey="name"
                            lines={[
                                { dataKey: "score", color: "#10b981", name: "Scores" },
                                { dataKey: "averageScore", color: "#e11d48", name: "Average" },
                            ]}
                        />
                    </ChartCard>

                    <ChartCard title="Applicant Score Distribution">
                        <ExampleChart
                            type="bar"
                            data={candidateDistribution}
                            xKey="range"
                            yKey="applicants"
                            lineColor="#e11d48"
                        />
                    </ChartCard>

                    <ChartCard title="University Distribution">
                        <ExampleChart
                            type="pie"
                            data={universityDistribution}
                            xKey="university"
                            yKey="number"
                        />
                    </ChartCard>
                    <ChartCard title="Top 20% Candidates">
                        <ExampleChart
                            type="bar"
                            data={top20}
                            xKey="name"
                            yKey="score"
                            lineColor="#10b981"
                        />
                    </ChartCard>

                    {/* Add more ChartCards with different chart components */}
                </div>
            </div>
        </div>
    );
};

export default Analytics;
