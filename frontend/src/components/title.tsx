import React from "react";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import { Box, Typography } from "@mui/material";

function title({ collapsed }: any) {
  return (
    <Box display={"flex"} alignContent={"center"} justifyItems={"center"}>
      <SpaceDashboardIcon
        sx={{ marginRight: collapsed ? 0 : 2 }}
      ></SpaceDashboardIcon>
      <Typography
        fontSize={14}
        fontWeight={700}
        display={collapsed ? "none" : "block"}
        alignContent={"center"}
        justifyContent={"center"}
      >
        DashboardMERN
      </Typography>
    </Box>
  );
}

export default title;
