"use client";

import { useEffect, useState } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import ManagerBottomNav from "../../components/ManagerBottomNav";

export default function SimpleCharts() {
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);
    const [totalRevenue, setTotalRevenue] = useState(0);

    const loadMetrics = async () => {
        const res = await fetch("/api/metrics");
        const data = await res.json();

        setLabels(data.labels);
        setValues(data.values);
        setTotalRevenue(data.totalRevenue || 0);
    };

    useEffect(() => {
        loadMetrics();
    }, []);

    return (
        <div
            style={{
                paddingBottom: "80px",
                padding: "20px"
            }}
        >
            <h2 style={{ marginBottom: "10px" }}>
                Orders in the Last 7 Days
            </h2>

            {/* TOTAL REVENUE CARD */}
            <div
                style={{
                    background: "#FFE55C",
                    padding: "15px",
                    borderRadius: "15px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    marginBottom: "25px",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: "18px",
                    border: "2px solid #FFCC00"
                }}
            >
                Total Revenue (7 days):
                <span style={{ fontSize: "22px", marginLeft: "8px" }}>
                    €{totalRevenue.toFixed(2)}
                </span>
            </div>

            {/* BAR CHART */}
            <BarChart
                xAxis={[
                    {
                        id: "days",
                        data: labels,
                    },
                ]}
                series={[
                    {
                        data: values,
                    },
                ]}
                height={300}
            />

            <ManagerBottomNav />
        </div>
    );
}
