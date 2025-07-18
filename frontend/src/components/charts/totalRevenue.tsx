import { ArrowCircleUpRounded } from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import ReactApexChart from "react-apexcharts";
import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";

function TotalRevenue() {
  return (
    <Box
      p={4}
      flex={1}
      bgcolor={"#fcfcfc"}
      display={"flex"}
      flexDirection={"column"}
      borderRadius={"15px"}
    >
      <Typography fontSize={18} fontWeight={600} color="#11142d">
        Total Revenue
      </Typography>
      <Stack my={"20px"} flexDirection={"row"} flexWrap={"wrap"} gap={4}>
        <Typography fontSize={28} fontWeight={700} color="#11142d">
          $235,555
        </Typography>
        <Stack direction={"row"} alignItems={"center"} gap={1}>
          <ArrowCircleUpRounded
            sx={{ fontSize: 25, color: "#475be8" }}
          ></ArrowCircleUpRounded>
          <Stack>
            <Typography fontSize={15} color="#475be8">
              0.8%
            </Typography>
            <Typography fontSize={12} color="#808191">
              Than Last Month
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <ReactApexChart series={TotalRevenueSeries} type="bar" height={310} options={TotalRevenueOptions}></ReactApexChart>
    </Box>
  );
}

export default TotalRevenue;
