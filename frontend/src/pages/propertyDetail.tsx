import {
  ChatBubble,
  Delete,
  Edit,
  Phone,
  Place,
  Star,
} from "@mui/icons-material";
import { Box, Stack, Typography } from "@mui/material";
import { useDelete, useGetIdentity, useShow } from "@refinedev/core";
import React from "react";
import { useNavigate } from "react-router";
import Person2Icon from "@mui/icons-material/Person2";
import { CustomButton } from "../components";

const checkImage = (url: string) => {
  const image = new Image();
  image.src = url;
  return image.width !== 0 && image.height !== 0;
};
function PropertyDetail() {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity<any>();
  const {
    queryResult: { data, isLoading, isError },
  } = useShow<any>(); // ใช้สำหรับดึงข้อมูล "รายการเดียว" จะยิง GET ไปที่ endpoint /properties/:id เนื่องจากกำหนด ไว้ใน dataProvider แล้ว
  console.log(data);
  const { mutate } = useDelete<any>();
  const properties = data?.data ?? [];
  const isCurrentUser = user?.email === properties?.creator?.email;
  const handleDeleteProperty = () => {
    const response = confirm("Are you want to delete this property");
    if (response) {
      mutate(
        { resource: "properties", id: properties._id as string },
        {
          onSuccess: () => {
            navigate("/properties");
          },
        }
      );
    }
  };
  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }
  if (isError) {
    return <Typography>Error...</Typography>;
  }
  return (
    <Box
      borderRadius={"15px"}
      padding={"20px"}
      bgcolor={"#fcfcfc"}
      width={"100%"}
    >
      <Typography fontSize={25} fontWeight={500} color="#11142d">
        Detail
      </Typography>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", lg: "row" }}
        gap={10}
        mt={"10px"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box flex={1} width={'100%'} height={"auto"}>
          <img
            src={properties.photo}
            alt=""
            width={'100%'}
            height={"auto"}
            style={{
              objectFit: "cover",
              borderRadius: "10px",
            }}
          ></img>
          <Box mt={"15px"}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              flexWrap={"wrap"}
              alignItems={"center"}
            >
              <Typography
                fontSize={18}
                fontWeight={500}
                color="#11142d"
                textTransform={"capitalize"}
              >
                {properties.propertyType}
              </Typography>
              <Box>
                {[1, 2, 3, 4, 5].map((i) => {
                  return <Star key={i} sx={{ color: "#f2c94c" }}></Star>;
                })}
              </Box>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              flexWrap={"wrap"}
              alignItems={"center"}
            >
              <Box>
                <Typography
                  fontSize={22}
                  fontWeight={600}
                  color="#11142d"
                  mt={"10px"}
                >
                  {properties.title}
                </Typography>
                <Stack
                  mt={0.5}
                  direction={"row"}
                  alignItems={"center"}
                  gap={0.5}
                >
                  <Place sx={{ color: "#808191" }}></Place>
                  <Typography fontSize={14} color="#11142d">
                    {properties.location}
                  </Typography>
                </Stack>
              </Box>
              <Box>
                <Typography
                  fontSize={16}
                  fontWeight={600}
                  color="#11142d"
                  mt={"10px"}
                >
                  Price
                </Typography>
                <Stack direction={"row"} alignItems={"flex-end"} gap={1}>
                  <Typography fontSize={25} fontWeight={600} color="#475be8">
                    ${properties.price}
                  </Typography>
                  <Typography fontSize={14} color="#808191" mb={0.5}>
                    for one day
                  </Typography>
                </Stack>
              </Box>
            </Stack>
            <Stack direction={"column"} alignItems={"flex-start"} gap={1}>
              <Typography
                fontSize={16}
                fontWeight={600}
                color="#11142d"
                mt={"10px"}
              >
                Description
              </Typography>
              <Typography fontSize={16} fontWeight={600} color="#808191">
                {properties.description}
              </Typography>
            </Stack>
          </Box>
        </Box>
        <Box
          flex={1}
          maxWidth={{xs:"100%",lg:"350px"}}
          width={"100%"}
          display={"flex"}
          flexDirection={"column"}
          gap={"20px"}
          height={"auto"}
        >
          <Stack
            padding={2}
            width={"100%"}
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            border={"1px solid #e4e4e4"}
          >
            <Stack
              mt={2}
              justifyContent={"center"}
              alignItems={"center"}
              textAlign={"center"}
            >
              <img
                src={
                  checkImage(properties.creator.avatar) ? (
                    properties.creator.avatar
                  ) : (
                    <Person2Icon></Person2Icon>
                  )
                }
                alt=""
                width={90}
                height={90}
                style={{ borderRadius: "100%", objectFit: "cover" }}
              />
              <Box mt={"15px"}>
                <Typography fontSize={16} fontWeight={600} color="#11142d">
                  {properties.creator.name}
                </Typography>
                <Typography
                  mt={"2px"}
                  fontSize={16}
                  fontWeight={600}
                  color="#808191"
                >
                  Agent
                </Typography>
              </Box>
              <Stack mt={"15px"}>
                <Typography
                  mt={"2px"}
                  fontSize={14}
                  fontWeight={400}
                  color="#808191"
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Place sx={{ color: "#808191" }}></Place>
                  Bangkok, TH
                </Typography>
              </Stack>
              <Typography
                mt={"1px"}
                fontSize={16}
                fontWeight={600}
                color="#11142d"
              >
                {properties.creator.allProperties.length} Properties
              </Typography>
            </Stack>
            <Stack
              width={"100%"}
              mt={"25px"}
              direction={"row"}
              flexWrap={"wrap"}
              gap={2}
            >
              <CustomButton
                title={isCurrentUser ? "Edit" : "Message"}
                backgroundColor={"#475BE8"}
                color={"#fcfcfc"}
                fullWidth
                icon={isCurrentUser ? <Edit></Edit> : <ChatBubble></ChatBubble>}
                handleClick={() =>
                  navigate(`/properties/edit/${properties._id}`)
                }
              ></CustomButton>
              <CustomButton
                title={isCurrentUser ? "Delete" : "Call"}
                backgroundColor={isCurrentUser ? "#d42e2e" : "#2ed480"}
                color={"#fcfcfc"}
                fullWidth
                icon={isCurrentUser ? <Delete></Delete> : <Phone></Phone>}
                handleClick={() => {
                  if (isCurrentUser) {
                    handleDeleteProperty();
                  }
                }}
              ></CustomButton>
            </Stack>
          </Stack>
          <Stack>
            <img
              src="https://www.google.com/maps/d/thumbnail?mid=19meNl79P-NF_AthSSVTK-gswrTI"
              style={{ height:'auto', width: "100%" }}
            ></img>{" "}
          </Stack>
          <CustomButton
            title={"Book Now"}
            backgroundColor={"#475be8"}
            color={"#fcfcfc"}
            fullWidth
          ></CustomButton>
        </Box>
      </Box>
    </Box>
  );
}

export default PropertyDetail;
