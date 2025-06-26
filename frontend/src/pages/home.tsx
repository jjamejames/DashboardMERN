import React from "react";
import { PieChart, PropertyReferral, TotalRevenue } from "../components";
import { Box, Stack, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        Dashboard
      </Typography>
      <Box mt={"20px"} display={"flex"} flexWrap={"wrap"} gap={4}>
        <PieChart
          title="Properties For Sale"
          value={30}
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        ></PieChart>
        <PieChart
          title="Properties For Rent"
          value={450}
          series={[60, 40]}
          colors={["#275be8", "#c4e8ef"]}
        ></PieChart>
        <PieChart
          title="Total Customers"
          value={720}
          series={[10, 90]}
          colors={["#275be8", "#c4e8ef"]}
        ></PieChart>
        <PieChart
          title="Properties For City"
          value={500}
          series={[50, 50]}
          colors={["#275be8", "#c4e8ef"]}
        ></PieChart>
      </Box>
      <Stack
        mt={"25px"}
        width={"100%"}
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <TotalRevenue></TotalRevenue>
        <PropertyReferral></PropertyReferral>
      </Stack>
    </Box>
  );
};

export default Home;
