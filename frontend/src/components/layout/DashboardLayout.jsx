import React, { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import Navbar from "@layout/Navbar";
import Sidebar, { drawerWidth } from "@layout/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleMenuToggle = () => {
        setMobileOpen((prev) => !prev);
    };

    return (
        <Box sx={{ display: "flex" }}>
            {/* ✅ Navbar */}
            <Navbar onMenuToggle={handleMenuToggle} />

            {/* ✅ Sidebar */}
            <Sidebar mobileOpen={mobileOpen} onMenuToggle={handleMenuToggle} />

            {/* ✅ Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    mt: 8,
                }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default DashboardLayout;
