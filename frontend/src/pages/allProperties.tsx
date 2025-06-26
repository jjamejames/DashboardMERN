import React, { useMemo } from "react";
import { CustomButton, PropertyCard } from "../components";
import { useNavigate } from "react-router";
import { Add } from "@mui/icons-material";
import { useTable } from "@refinedev/core";
import {
  Box,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function AllProperties() {
  const navigate = useNavigate();
  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    pageCount,
    sorters,
    setSorters,
    filters,
    setFilters,
    setPageSize,
  } = useTable(); // useTable() จะดึงข้อมูล (fetch data) จาก backend API โดยอัตโนมัติ จะยิง request GET ไปที่ endpoint ที่กำหนดใน dataProvider (เช่น /api/v1/properties)
  const allProperties = data?.data ?? []; // ถ้าไม่มีข้อมูลให้เป็น array ว่าง
  const currentPrice = sorters.find((item) => item.field === "price")?.order;
  const toggleSort = (field: string) => {
    setSorters([{ field, order: currentPrice === "asc" ? "desc" : "asc" }]);
  };
  const currentFilters = useMemo(() => {
    const logical = filters.flatMap((item) => ("field" in item ? item : []));
    return {
      title: logical.find((item) => item.field === "title")?.value || "",
      propertyType:
        logical.find((item) => item.field === "propertyType")?.value || "",
    };
  }, [filters]);

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (isError) {
    return <Typography>Error...</Typography>;
  }

  return (
    <Box>
      <Box mt={"20px"} sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction={"column"} width={"100%"}>
          <Typography mt={1} fontSize={25} fontWeight={600} color="#11142d">
            {allProperties.length > 0 ? "All Properties" : "No Properties"}
          </Typography>
          <Box
            mb={2}
            mt={1}
            display={"flex"}
            width={"84%"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
          >
            <Box
              display={"flex"}
              gap={2}
              flexWrap={"wrap"}
              mb={{ xs: "20px", sm: "0px" }}
            >
              <CustomButton
                title={`Sort Price ${currentPrice === "asc" ? "↓" : "↑"}`}
                backgroundColor={"#475be8"}
                color={"#fcfcfc"}
                handleClick={() => toggleSort("price")}
              ></CustomButton>
              <TextField
                variant="outlined"
                color="info"
                placeholder="Search Property"
                value={currentFilters.title}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "title",
                      operator: "contains",
                      value: e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                  ]);
                }}
              ></TextField>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue={""}
                value={currentFilters.propertyType}
                onChange={(e: any) => {
                  setFilters(
                    [
                      {
                        field: "propertyType",
                        operator: "eq",
                        value: e.target.value,
                      },
                    ],
                    "replace"
                  );
                }}
              >
                <MenuItem value="">All</MenuItem>
                {["villa", "apartment", "farmhouse", "condo", "studio"].map(
                  (type) => (
                    <MenuItem key={type} value={type.toLowerCase()}>
                      {type}
                    </MenuItem>
                  )
                )}
              </Select>
            </Box>
          </Box>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <CustomButton
              title={"Add Property"}
              handleClick={() => navigate("/properties/create")}
              icon={<Add></Add>}
              backgroundColor={"#475be8"}
              color={"#fcfcfc"}
            ></CustomButton>
          </Stack>
        </Stack>
        {allProperties.map((property) => {
          return (
            <PropertyCard
              key={property._id}
              id={property._id}
              title={property.title}
              location={property.location}
              price={property.price}
              photo={property.photo}
            ></PropertyCard>
          );
        })}
      </Box>
      {allProperties.length > 0 && (
        <Box display={"flex"} gap={2} mt={3} flexWrap={"wrap"}>
          <CustomButton
            title={"Previous"}
            handleClick={() => setCurrent((prev) => prev - 1)}
            backgroundColor={"#475be8"}
            color={"#fcfcfc"}
            disabled={!(current > 1)}
          ></CustomButton>
          <Box
            display={{ xs: "hidden", sm: "flex" }}
            alignItems={"center"}
            gap={"5px"}
          >
            Page{" "}
            <strong>
              {current} of {pageCount}
            </strong>
          </Box>
          <CustomButton
            title={"Next"}
            backgroundColor={"#475be8"}
            color={"#fcfcfc"}
            handleClick={() => setCurrent((prev) => prev + 1)}
            disabled={current === pageCount}
          ></CustomButton>
          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={5}
            onChange={(e: any) => {
              setPageSize(e.target.value ? Number(e.target.value) : 10);
            }}
          >
            <MenuItem value="">All</MenuItem>
            {[5, 10, 20, 30].map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
}

export default AllProperties;
