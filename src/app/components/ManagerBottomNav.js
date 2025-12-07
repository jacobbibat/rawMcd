'use client';

import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import ListAltIcon from "@mui/icons-material/ListAlt";          // Orders
import InsightsIcon from "@mui/icons-material/Insights";        // Metrics
import LocalOfferIcon from "@mui/icons-material/LocalOffer";    // Promotions
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import LogoutIcon from "@mui/icons-material/Logout";

export default function ManagerBottomNav() {
    const [value, setValue] = React.useState(0);

    async function handleLogout() {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    }

    // Detect active route so the yellow state works
    React.useEffect(() => {
        const path = window.location.pathname;

        if (path === "/manager") setValue(0);
        else if (path === "/manager/metrics") setValue(1);
        else if (path === "/manager/promotion") setValue(2);
        else if (path === "/manager/menu") setValue(3);
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
                    label="Orders"
                    icon={<ListAltIcon />}
                    onClick={() => (window.location.href = "/manager")}
                    sx={{
                        "&.Mui-selected": {
                            color: "#FFC300",
                        },
                    }}
                />

                <BottomNavigationAction
                    label="Metrics"
                    icon={<InsightsIcon />}
                    onClick={() => (window.location.href = "/manager/metrics")}
                    sx={{
                        "&.Mui-selected": {
                            color: "#FFC300",
                        },
                    }}
                />

                <BottomNavigationAction
                    label="Promotions"
                    icon={<LocalOfferIcon />}
                    onClick={() => (window.location.href = "/manager/promotion")}
                    sx={{
                        "&.Mui-selected": {
                            color: "#FFC300",
                        },
                    }}
                />

                <BottomNavigationAction
                    label="Menu"
                    icon={<RestaurantMenuIcon />}
                    onClick={() => (window.location.href = "/manager/menu")}
                    sx={{
                        "&.Mui-selected": {
                            color: "#FFC300",
                        },
                    }}
                />

                <BottomNavigationAction
                    label="Logout"
                    icon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                        "&.Mui-selected": {
                            color: "#FF5733",
                        },
                    }}
                />
            </BottomNavigation>
        </Box>
    );
}
