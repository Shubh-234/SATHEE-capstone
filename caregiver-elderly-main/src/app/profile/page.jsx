"use client";

import {
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  HStack,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Box,
  Text,
  Icon,
  useToast,
} from "@chakra-ui/react";

import { SmallCloseIcon } from "@chakra-ui/icons";
import TopNav from "@/components/TopNav";
import Link from "next/link";
import { Calendar } from "primereact/calendar";
import { CiCalendar } from "react-icons/ci";
import { theme } from "@/data/data";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Button, { GhostButton } from "@/components/ui/Button";
import { FaFile } from "react-icons/fa";
import { collection, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "@/config/firebase";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";
import { UserContext } from "@/store/context/UserContext";
import useCheckSession from "@/config/checkSession";
import moment from "moment";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export default function Page() {
  const [data, setData] = useState({ name: "", dob: new Date(), dp: "" });
  const toastIdRef = useRef(null);
  const toast = useToast();
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const handleFileChange = (event) => {
    setData((prevState) => ({
      ...prevState,
      dp: URL.createObjectURL(event.target.files[0]),
    }));
  };
  const checkSession = useCheckSession();
  const { state: UserState, setUser } = useContext(UserContext);

  useEffect(() => {
    checkSession().then((val) => {
      if (val.user) {
        setUser(val.user);
        setData({
          name: val.user?.name,
          dob: val.user?.dob,
          dp: val.user?.dp,
        });
      }
    });
  }, []);

  async function handleSave() {
    try {
      const response = await fetch(data.dp);
      const blob = await response.blob();
      const metadata = {
        contentType: "image/png",
    };
      const storageRef = ref(storage, `${UserState.value.data?.email}/dp/` + "dp.png");
      const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setLoading(false);
          showToastFailed(toast, toastIdRef, "Failed", error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateDb(downloadURL);
          });
        }
      );
    } catch (error) {
      setLoading(false)
    }

   

  }

  async function updateDb(imgLink) {
    await updateDoc(doc(db, "users", UserState.value.data?.id), {
      dp: imgLink,
      name: data.name,
      dob: data.dob,
    })
      .then(() => {
        setLoading(false);
        showToastSuccess(toast, toastIdRef, "Success", "Profile updated");
      })
      .catch((e) => {
        showToastFailed(toast, toastIdRef, "Failed", e.message);
      });
  }

  const RenderButton = useCallback(() => {
    return (
      <GhostButton
        w={"full"}
        rounded={"md"}
        onClick={() => {
          if (inputRef.current) inputRef.current.click();
        }}
        leftIcon={<FaFile />}
      >
        Change picture
        <input
          style={{ display: "none" }}
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileChange(e)}
        ></input>
      </GhostButton>
    );
  }, [data]);
  return (
    <>
      <TopNav username={UserState.value.data?.email} role={UserState.value.data?.role} reference={UserState.value.data?.ref}/>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile
          </Heading>
          <FormControl id="userName">
            <FormLabel>User Picture</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                
                <Avatar size="xl" src={data?.dp ? data.dp : ""}>
                  {/* <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                  /> */}
                </Avatar>
              </Center>
              <Center w="full">
                <RenderButton />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>{data?.name}</FormLabel>
            <Input
              value={data?.name}
              onChange={(e) =>
                setData((prevState) => ({ ...prevState, name: e.target.value }))
              }
              placeholder="Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text variant="subheading">
              {data?.dob ? moment(new Date(data.dob)).format("DD/MM/YYYY") : ""}
            </Text>
            <Box
              display={"flex"}
              width={"100%"}
              height={10}
              borderRadius={"0.375rem"}
              outline={"2px solid transparent"}
              border={"1px solid"}
              borderColor={theme.color.shadowColor}
              paddingInlineStart={"1rem"}
              paddingInlineEnd={"1rem"}
              alignItems={"center"}
              _hover={{ borderColor: theme.color.shadowColor }}
              _focusWithin={{
                boxShadow: `0px 0px 3px 3px ${theme.color.shadowColor}`,
                borderColor: theme.color.shadowColor,
              }}
            >
              <Calendar
                className="custom-datepicker"
                value={data?.dob ? new Date(data.dob) : ""}
                onChange={(e) => {
                  setData((prevState) => ({
                    ...prevState,
                    dob: e.value.getTime(),
                  }));
                }}
              />
              <Icon as={CiCalendar} size={20} />
            </Box>
          </Stack>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              as={Link}
              href={`/${UserState.value.data?.role}`}
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
            isDisabled={!UserState.value.data?.email}
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                if(UserState.value.data?.dp === data.dp){
                  updateDb(data.dp)
                } else {
                  handleSave();
                }
               
              }}
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </>
  );
}
