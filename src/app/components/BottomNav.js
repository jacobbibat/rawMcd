'use client';

import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SearchIcon from "@mui/icons-material/Search";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LogoutIcon from "@mui/icons-material/Logout";

export default function BottomNav() {
    const [value, setValue] = React.useState(0);
    const [weather, setWeather] = React.useState(null);

    React.useEffect(() => {
        const path = window.location.pathname;

        if (path === "/customer/dashboard") setValue(0);
        else if (path === "/customer/search") setValue(1);
        else if (path === "/customer/view_cart") setValue(2);
        else if (path === "/customer/orders") setValue(3);
    }, []);

    // -------------------------------------------------
    // LOGOUT
    // -------------------------------------------------
    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    }

    // -------------------------------------------------
    // WEATHER FETCH
    // -------------------------------------------------
    const fetchWeather = async () => {
        try {
            const res = await fetch("/api/weather", {
                method: "POST",
                body: JSON.stringify({ location: "Dublin" }),
            });

            const data = await res.json();
            if (data.weather) {
                setWeather(data.weather.current);
            }
        } catch (err) {
            console.error("Weather fetch error:", err);
        }
    };

    React.useEffect(() => {
        fetchWeather();
    }, []);

    return (
        <Box
            sx={{
                width: "100%",
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: "1px solid #ddd",
                backgroundColor: "#FFFBEA",
                zIndex: 1000,
            }}
        >
            <Box sx={{ position: "relative" }}>
                <BottomNavigation
                    showLabels
                    value={value}
                    onChange={(event, newValue) => setValue(newValue)}
                    sx={{
                        "& .Mui-selected": {
                            color: "#FFC300 !important",
                        },
                    }}
                >
                    <BottomNavigationAction
                        label="Home"
                        icon={<HomeIcon />}
                        onClick={() => (window.location.href = "/customer/dashboard")}
                        sx={{ "&.Mui-selected": { color: "#FFC300" } }}
                    />

                    <BottomNavigationAction
                        label="Search"
                        icon={<SearchIcon />}
                        onClick={() => (window.location.href = "/customer/search")}
                        sx={{ "&.Mui-selected": { color: "#FFC300" } }}
                    />

                    <BottomNavigationAction
                        label="Cart"
                        icon={<ShoppingCartIcon />}
                        onClick={() => (window.location.href = "/customer/view_cart")}
                        sx={{ "&.Mui-selected": { color: "#FFC300" } }}
                    />

                    <BottomNavigationAction
                        label="Orders"
                        icon={<ReceiptIcon />}
                        onClick={() => (window.location.href = "/customer/orders")}
                        sx={{ "&.Mui-selected": { color: "#FFC300" } }}
                    />

                    <BottomNavigationAction
                        label="Logout"
                        icon={<LogoutIcon />}
                        onClick={handleLogout}
                        sx={{ "&.Mui-selected": { color: "#FF5733" } }}
                    />
                </BottomNavigation>

                {/* WEATHER BADGE (styled) */}
                <Box
                    sx={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#FFF3C4",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "13px",
                        fontWeight: 600,
                        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
                        color: "#333",
                    }}
                >
                    <WbSunnyIcon sx={{ fontSize: 18, marginRight: 0.5, color: "#FFB300" }} />
                    {weather ? `${weather.temp_c}°C` : "--°C"}
                </Box>
            </Box>
        </Box>
    );
}
