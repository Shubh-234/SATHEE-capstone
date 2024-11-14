"use client";

import {
  Flex,
  Text,
  useDisclosure,
  Center,
  Wrap,
  WrapItem,
  Spacer,
  HStack,
  VStack,
  Icon,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  Input,
  Spinner,
  AlertDialogFooter,
  Heading,
  useColorModeValue,
  Box,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import TopNav from "@/components/TopNav";
import Button, { DangerButton } from "@/components/ui/Button";
import useCheckSession from "@/config/checkSession";
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { UserContext } from "@/store/context/UserContext";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";
import { MdOutlineEmergencyShare } from "react-icons/md";
import Loading from "../loading";

export default function Page() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const toastIdRef = useRef(null);
  const [data, setData] = useState([]);
  const checkSession = useCheckSession();
  const { state: UserState, setUser } = useContext(UserContext);
  const [newElderly, setNewElderly] = useState("");
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const bgColor = useColorModeValue("white", "gray.800");

  useEffect(() => {
    checkSession().then((val) => {
      if (val?.user) {
        setUser(val.user);
        fetchData(val.user.email);
      }
    });
  }, []);

  async function fetchData(val) {
    await getDocs(
      query(collection(db, "users"), where("email", "==", val), limit(1))
    ).then((snapshot) => {
      let list = [];
      snapshot.forEach((docs) => {
        list.push({ ...docs.data(), id: docs.id });
      });
      setLoading(false);
      if (list.length > 0 && list[0].pair) {
        setData(list[0].pair);
      }
    });
  }

  const RenderEachCard = ({ item, index }) => {
    const [rowLoading, setRowLoading] = useState(false);

    async function handleDeleteRow(item) {
      const temp = UserState.value.data?.pair;
      let newData = temp.filter((eachUser) => eachUser.id !== item.id);
      await updateDoc(doc(db, "users", UserState.value.data?.id), {
        pair: newData,
      }).then(() => {
        fetchData(UserState.value.data?.email);
        setRowLoading(false);
      });
    }

    return (
      <Box
        key={index}
        bg={"white"}
        borderRadius="lg"
        py={12}
        px={20}
        boxShadow="lg"
        maxW="280px"
        w="full"
        textAlign="center"
        transform="scale(1)"
        transition="transform 0.3s"
        _hover={{
          transform: "scale(1.05)",
          boxShadow: "xl",
        }}
        border={"2px solid"}
        borderColor={"purple.100"}
      >
        <VStack spacing={3}>
          <Heading color="blue.600">{item?.name}</Heading>
          <Text fontSize="sm" color="gray.600">
            {item?.ref}
          </Text>
          {rowLoading ? (
            <Spinner size="md" color="purple.400" />
          ) : (
            <HStack spacing={4} mt={4}>
              <Button as={Link} href={`/caregiver/detail?id=${item.ref}`}>
                Open Details
              </Button>
              <Icon
                as={DeleteIcon}
                boxSize={6}
                color="red.400"
                _hover={{ cursor: "pointer", opacity: 0.8 }}
                onClick={() => {
                  setRowLoading(true);
                  handleDeleteRow(item);
                }}
              />
            </HStack>
          )}
        </VStack>
      </Box>
    );
  };

  async function handleSave() {
    if (UserState.value.data?.id) {
      await getDocs(
        query(collection(db, "users"), where("ref", "==", newElderly))
      ).then(async (snapshot) => {
        let list = [];
        snapshot.forEach((docs) => {
          list.push({ ...docs.data(), id: docs.id });
        });
        if (list.length == 0) {
          setUploading(false);
          showToastFailed(toast, toastIdRef, "Failed", "Elderly not found");
        } else {
          let newList = [];
          if (
            UserState.value.data?.pair &&
            UserState.value.data?.pair.length > 0
          ) {
            newList = [...UserState.value.data?.pair];
          } else {
            newList.push({
              name: list[0].name,
              id: list[0].id,
              ref: list[0].ref,
              created: new Date().getTime(),
            });
          }
          await updateDoc(doc(db, "users", UserState.value.data?.id), {
            pair: [...newList],
          }).then(() => {
            showToastSuccess(toast, toastIdRef, "Success", "Elderly saved");
            setUploading(false);
            onClose();
            fetchData(UserState.value.data?.email);
          });
        }
      });
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <TopNav
        username={UserState.value.data?.email}
        role={UserState.value.data?.role}
      />
      <Flex
        flex={1}
        p={6}
        flexDir="column"
        gap={6}
        bgGradient="linear(to-r, purple.100, orange.100)"
        minH={"100vh"}
      >
        <Box
          bgGradient="linear(to-r, purple.600, purple.400)"
          color="white"
          p={8}
          borderRadius="lg"
          boxShadow="md"
          mb={8}
        >
          <Heading>Welcome, {UserState.value.data?.name}</Heading>
          <Text mt={4} fontSize="lg">
            {`Your personal healthcare center`}
          </Text>
        </Box>
        <Flex justify={"flex-end"}>
          <Button
            onClick={onOpen}
            size="sm"
            boxShadow="sm"
            _hover={{ boxShadow: "md" }}
          >
            Add New Elderly
          </Button>
        </Flex>

        <Wrap spacing="24px" justify="center">
          {data.map((item, index) => (
            <WrapItem key={index}>
              <RenderEachCard item={item} index={index} />
            </WrapItem>
          ))}
        </Wrap>
      </Flex>

      <AlertDialog
        motionPreset="slideInBottom"
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxW={"90%"} width={"600px"}>
          <AlertDialogBody mb={5}>
            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
              <VStack width={"100%"} gap={5}>
                <Text fontSize={"18px"} fontWeight={"500"} color={"#101828"}>
                  Add new elderly
                </Text>

                <Input
                  value={newElderly}
                  onChange={(e) => setNewElderly(e.target.value)}
                  placeholder="Enter reference number"
                />
              </VStack>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter w={"100%"}>
            <Button
              isDisabled={!newElderly}
              isLoading={uploading}
              w={"100%"}
              onClick={() => {
                setUploading(true);
                handleSave();
              }}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
