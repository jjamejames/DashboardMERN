import { useGetIdentity } from "@refinedev/core";
import React, { useEffect, useState } from "react";
import Form from "../components/common/form";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";

function CreateProperties() {
  const { data: user } = useGetIdentity<any>(); // เข้าถึง data.user 
  // console.log('user',user)
  const [properImage, setProperImage] = useState({ name: "", url: "" });
  const {
    refineCore: { onFinish, formLoading },
    register,
    handleSubmit,
  } = useForm();

  const handleImageChange = async (file: File) => {
    const reader = (readFile: File) => {
      return new Promise<string>((resolve, rejects) => {
        const fileReader = new FileReader();
        fileReader.onload = () => resolve(fileReader.result as string);
        fileReader.onerror = () => rejects("Error");
        fileReader.readAsDataURL(readFile);
      });
    };
    const result = await reader(file);
    setProperImage({ name: file?.name, url: result });
  };

  const onFinishHandler = async (data: FieldValues) => {
    if (!properImage.name) {
      return alert("Please upload an image");
    }
    await onFinish({ ...data, photo: properImage.url, email: user.email }); // ทำการ call API ออกไปโดยเลือก method ขึ้นอยู่กับ type form โดยในที่นี้ จะทำการยิง api ไปในหน้าที่ /properties ถ้าอยู่ในหน้า create (เช่น /properties/create) และ submit ฟอร์ม → refine จะยิง POST ไปที่ /properties
  }; // ข้อมูล { ...data, photo: properImage.url, email: user.email } จะถูกส่งเป็น body ของ HTTP request 

  return (
    <Form
      type="create"
      register={register}
      onFinish={onFinish}
      formLoading={formLoading}
      handleSubmit={handleSubmit}
      handleImageChange={handleImageChange}
      onFinishHandler={onFinishHandler}
      propertyImages={properImage}
    />
  );
}

export default CreateProperties;
