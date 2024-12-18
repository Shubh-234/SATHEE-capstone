"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import DocumentPage from "./DocumentPage";
import RecordPage from "./RecordPage";
import ReminderPage from "./ReminderPage";
import { FaBell, FaChartLine, FaFileAlt, FaFileMedical } from "react-icons/fa";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Text,
  useDisclosure,
  VStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@chakra-ui/react";
import { MdOutlineEmergencyShare } from "react-icons/md";
import { UserContext } from "@/store/context/UserContext";
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import Button from "@/components/ui/Button";
import useCheckSession from "@/config/checkSession";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { BiSolidLogOut } from "react-icons/bi";
import ChartPage from "./ChartPage";

export default function ElderlyPage({ id }) {
  const [currentPage, setCurrentPage] = useState("");
  const {
    isOpen: isOpenEmergency,
    onOpen: onOpenEmergency,
    onClose: onCloseEmergency,
  } = useDisclosure();
  const [emergency, setEmergency] = useState();
  const { state: UserState, setUser } = useContext(UserContext);
  const checkSession = useCheckSession();
  const router = useRouter();

  useEffect(() => {
    checkSession().then((val) => {
      if (val.user) {
        setUser(val.user);
      }
    });
  }, []);

  useEffect(() => {
    if (UserState.value.data?.email) {
      const q = query(
        collection(db, "emergency"),
        where("status", "==", "Pending")
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        if (UserState.value.data?.pair) {
          const myPair = [...UserState.value.data?.pair];
          myPair.map((eachUser) => {
            list.map((eachItem) => {
              if (eachUser.ref === eachItem.elderlyId) {
                setEmergency(eachItem);
                onOpenEmergency();
              }
            });
          });
        }
      });
      return () => unsubscribe();
    }
  }, [UserState.value.data]);

  async function handleClose() {
    await updateDoc(doc(db, "emergency", emergency.id), {
      status: "Completed",
    }).then(() => {
      onCloseEmergency();
    });
  }

  const Card = ({ title, description, icon, color, path }) => (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="lg"
      textAlign="center"
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "2xl",
        cursor: "pointer",
      }}
      maxW="300px"
      w="full"
      color={color}
      onClick={() => {
        setCurrentPage(path);
      }}
    >
      <VStack spacing={3}>
        <Icon as={icon} boxSize={12} color={color} />
        <Heading size="md">{title}</Heading>
        <Text color="gray.500">{description}</Text>
      </VStack>
    </Box>
  );

  const RenderPage = useCallback(() => {
    if (currentPage?.toLowerCase() === "record") {
      return <RecordPage id={id} onBackClick={() => setCurrentPage()} />;
    }
    if (currentPage?.toLowerCase() === "documents") {
      return <DocumentPage id={id} onBackClick={() => setCurrentPage()} />;
    }
    if (currentPage?.toLowerCase() === "reminder") {
      return <ReminderPage id={id} onBackClick={() => setCurrentPage()} />;
    }
    if (currentPage?.toLowerCase() === "chart") {
      return <ChartPage id={id} onBackClick={() => setCurrentPage()} />;
    }
  }, [currentPage]);

  return (
    <>
      {!currentPage ? (
        <Flex
          flex={1}
          p={8}
          flexDir="column"
          alignItems="center"
          justifyContent="center"
          bgGradient="linear(to-r, purple.100, orange.100)"
          minH="100vh"
        >
          <Box textAlign="center" mb={8}>
            <Heading>Welcome to Sathee Dashboard</Heading>
            <Text mt={4} color="gray.600">
              Manage your elderly health records, documents, and reminders here!
            </Text>
          </Box>

          <HStack spacing={8} wrap="wrap" justify="center">
            {cardData.map((card, index) => (
              <Card
                path={card.path}
                key={index}
                title={card.title}
                description={card.description}
                icon={card.icon}
                color={card.color}
              />
            ))}
          </HStack>
          <Icon
            mt={5}
            as={BiSolidLogOut}
            onClick={() => router.push("/caregiver")}
            boxSize={10}
            color={"purple.500"}
            _hover={{ cursor: "pointer", opacity: 0.7 }}
          />
        </Flex>
      ) : (
        <RenderPage />
      )}
      <AlertDialog
        closeOnEsc={false}
        motionPreset="slideInBottom"
        // onClose={onCloseEmergency}
        isOpen={isOpenEmergency}
        isCentered
      >
        <AlertDialogOverlay bg={"#344054B2"} />

        <AlertDialogContent maxW={"90%"} width={"600px"}>
          <AlertDialogHeader>
            <Icon as={MdOutlineEmergencyShare} boxSize={5} color={"red"} />
          </AlertDialogHeader>
          <AlertDialogBody mb={5}>
            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
              <VStack width={"100%"} gap={5}>
                <Heading color={"#101828"}>Emergency</Heading>
                <Text fontSize={"20px"} variant={"subheading"}>
                  {emergency?.name}
                </Text>
                <Text fontSize={"20px"} variant={"subheading"}>
                  {emergency?.number}
                </Text>
              </VStack>
            </HStack>
          </AlertDialogBody>

          <AlertDialogFooter w={"100%"}>
            <Button
              w={"100%"}
              onClick={() => {
                handleClose();
              }}
            >
              Done
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

const cardData = [
  {
    title: "Medical Record",
    description: "View and update medical history.",
    icon: FaFileMedical,
    color: "teal.400",
    path: "record",
  },
  {
    title: "Documents",
    description: "Access and manage documents.",
    icon: FaFileAlt,
    color: "orange.400",
    path: "documents",
  },
  {
    title: "Reminder",
    description: "Set and view health reminders.",
    icon: FaBell,
    color: "purple.400",
    path: "reminder",
  },
  {
    title: "Chart",
    description: "Analyze trends and variations in your health records.",
    icon: FaChartLine,
    color: "blue.400",
    path: "chart",
  },
];
