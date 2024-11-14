// "use client";

// import {
//   Box,
//   Flex,
//   Text,
//   Wrap,
//   WrapItem,
//   Spacer,
//   HStack,
//   VStack,
//   useToast,
//   Spinner,
//   Heading,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { useCallback, useContext, useEffect, useRef, useState } from "react";
// import TopNav from "@/components/TopNav";
// import Checkbox from "@/components/ui/Checkbox";
// import { DangerButton } from "@/components/ui/Button";
// import moment from "moment";
// import useCheckSession from "@/config/checkSession";
// import { UserContext } from "@/store/context/UserContext";
// import {
//   addDoc,
//   collection,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import { showToastSuccess } from "@/utils/toastUtils";
// import Loading from "../loading";
// import Preferences from "@/components/preferences";
// import Reminder from "@/components/reminder";

// export default function Page() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const checkSession = useCheckSession();
//   const { state: UserState, setUser } = useContext(UserContext);
//   const toast = useToast();
//   const toastIdRef = useRef(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const {
//     isOpen: isOpenReminder,
//     onOpen: onOpenReminder,
//     onClose: onCloseReminder,
//   } = useDisclosure();

//   // useEffect(() => {
//   //   checkSession().then((val) => {
//   //     if (val.user) {
//   //       setUser(val.user);
//   //       setLoading(false);
//   //     }
//   //   });
//   // }, []);

//   useEffect(() => {
//     if (process.env.NODE_ENV === "development") {
//       // In development mode, bypass login check
//       const mockUser = {
//         /* user data as in step 2 */
//       };
//       setUser(mockUser);
//       setLoading(false);
//     } else {
//       // In production, run the usual checkSession
//       checkSession().then((val) => {
//         if (val.user) {
//           setUser(val.user);
//           setLoading(false);
//         }
//       });
//     }
//   }, []);

//   async function handleEmergency() {
//     await addDoc(collection(db, "emergency"), {
//       elderlyId: UserState.value.data?.ref,
//       status: "Pending",
//       name: UserState.value.data?.name,
//       number: UserState.value.data?.number,
//     }).then(() => {
//       showToastSuccess(toast, toastIdRef, "Emergency", "Caretaker informed");
//     });
//   }

//   return loading ? (
//     <Loading />
//   ) : (
//     <>
//       <TopNav
//         username={UserState.value.data?.email}
//         role={UserState.value.data?.role}
//         reference={UserState.value.data?.ref}
//         onOpenPreferences={onOpen}
//         onOpenReminder={onOpenReminder}
//       />
//       <Flex flex={1} overflowX="auto" p="32px" flexDir="column" gap={5}>
//         <Box
//           bgGradient="linear(to-r, purple.600, purple.400)"
//           color="white"
//           p={8}
//           borderRadius="lg"
//           boxShadow="md"
//           mb={8}
//         >
//           <Heading>Welcome, {UserState.value.data?.name}</Heading>
//           <Text mt={4} fontSize="lg">
//             Your personal healthcare center
//           </Text>
//         </Box>
//         <Wrap>
//           <WrapItem>
//             <Preferences
//               isOpen={isOpen}
//               onClose={onClose}
//               email={UserState.value.data?.email}
//             />
//           </WrapItem>
//           <Spacer />
//           <WrapItem>
//             <DangerButton
//               onClick={handleEmergency}
//               bgColor="#FF6347"
//               color="white"
//               _hover={{ bg: "#FF4500" }}
//               borderRadius="8px"
//               padding="12px 20px"
//               fontSize="16px"
//             >
//               Emergency
//             </DangerButton>
//           </WrapItem>
//         </Wrap>
//         {/* <RenderUpcomingReminder /> */}
//       </Flex>
//       <Reminder
//         isOpenReminder={isOpenReminder}
//         onCloseReminder={onCloseReminder}
//         email={UserState.value.data?.email}
//         userRef={UserState.value.data?.ref}
//       />
//     </>
//   );
// }

"use client";

import {
  Box,
  Flex,
  Text,
  Wrap,
  WrapItem,
  Spacer,
  HStack,
  VStack,
  useToast,
  Spinner,
  Heading,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import TopNav from "@/components/TopNav";
import Checkbox from "@/components/ui/Checkbox";
import { DangerButton } from "@/components/ui/Button";
import moment from "moment";
import useCheckSession from "@/config/checkSession";
import { UserContext } from "@/store/context/UserContext";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { showToastSuccess } from "@/utils/toastUtils";
import Loading from "../loading";
import Preferences from "@/components/preferences";
import Reminder from "@/components/reminder";
import { getHumeAccessToken } from "@/utils/getHumeAccessToken"; //I added new 1041
import dynamic from "next/dynamic";

// Dynamically import Chat component to disable SSR for it
const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false); // State for toggling Chat visibility
  const [accessToken, setAccessToken] = useState(null); // State for storing the access token

  const checkSession = useCheckSession();
  const { state: UserState, setUser } = useContext(UserContext);
  const toast = useToast();
  const toastIdRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenReminder,
    onOpen: onOpenReminder,
    onClose: onCloseReminder,
  } = useDisclosure();

  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     const mockUser = {
  //       /* mock user data */
  //     };
  //     setUser(mockUser);
  //     setLoading(false);
  //   } else {
  //     checkSession().then((val) => {
  //       if (val.user) {
  //         setUser(val.user);
  //         setLoading(false);
  //       }
  //     });
  //   }
  // }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (process.env.NODE_ENV === "development") {
        const mockUser = {
          /* mock user data */
        };
        setUser(mockUser);
        setLoading(false);
      } else {
        const sessionVal = await checkSession();
        if (sessionVal.user) {
          setUser(sessionVal.user);
          setLoading(false);
        }
      }

      // Fetch access token after user session is loaded
      const token = await getHumeAccessToken();
      setAccessToken(token);
    };

    fetchData();
  }, []);

  async function handleEmergency() {
    await addDoc(collection(db, "emergency"), {
      elderlyId: UserState.value.data?.ref,
      status: "Pending",
      name: UserState.value.data?.name,
      number: UserState.value.data?.number,
    }).then(() => {
      showToastSuccess(toast, toastIdRef, "Emergency", "Caretaker informed");
    });
  }

  return loading ? (
    <Loading />
  ) : (
    <>
      <TopNav
        username={UserState.value.data?.email}
        role={UserState.value.data?.role}
        reference={UserState.value.data?.ref}
        onOpenPreferences={onOpen}
        onOpenReminder={onOpenReminder}
      />
      <Flex flex={1} overflowX="auto" p="32px" flexDir="column" gap={5}>
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
            Your personal healthcare center
          </Text>
        </Box>
        <Wrap>
          <WrapItem>
            <Preferences
              isOpen={isOpen}
              onClose={onClose}
              email={UserState.value.data?.email}
            />
          </WrapItem>
          <Spacer />
          <WrapItem>
            <DangerButton
              onClick={handleEmergency}
              bgColor="#FF6347"
              color="white"
              _hover={{ bg: "#FF4500" }}
              borderRadius="8px"
              padding="12px 20px"
              fontSize="16px"
            >
              Emergency
            </DangerButton>
          </WrapItem>
        </Wrap>
      </Flex>

      <Reminder
        isOpenReminder={isOpenReminder}
        onCloseReminder={onCloseReminder}
        email={UserState.value.data?.email}
        userRef={UserState.value.data?.ref}
      />

      {/* Button to toggle Chat visibility */}
      <Box position="fixed" bottom="20px" right="20px">
        <Button
          onClick={() => setShowChat(!showChat)}
          bg="blue.500"
          color="white"
          _hover={{ bg: "blue.600" }}
        >
          {showChat ? "Close Chat" : "Open Chat"}
        </Button>
      </Box>

      {/* Render Chat component conditionally */}
      {showChat && accessToken && (
        <Box
          position="fixed"
          bottom="80px"
          right="20px"
          width="600px"
          height="70vh"
          bg="white"
          boxShadow="md"
          borderRadius="lg"
          zIndex="10"
          overflowY="auto"
        >
          <Chat accessToken={accessToken} />
        </Box>
      )}
    </>
  );
}

// "use client";
// import {
//   Box,
//   Flex,
//   Text,
//   Wrap,
//   WrapItem,
//   Spacer,
//   HStack,
//   VStack,
//   useToast,
//   Spinner,
//   Heading,
//   useDisclosure,
// } from "@chakra-ui/react";
// import { useCallback, useContext, useEffect, useRef, useState } from "react";
// import TopNav from "@/components/TopNav";
// import Checkbox from "@/components/ui/Checkbox";
// import { DangerButton } from "@/components/ui/Button";
// import moment from "moment";
// import useCheckSession from "@/config/checkSession";
// import { UserContext } from "@/store/context/UserContext";
// import {
//   addDoc,
//   collection,
//   doc,
//   onSnapshot,
//   query,
//   where,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "@/config/firebase";
// import { showToastSuccess } from "@/utils/toastUtils";
// import Loading from "../loading";
// import Preferences from "@/components/preferences";
// import Reminder from "@/components/reminder";

// // Import VoiceProvider from the Hume SDK
// import { VoiceProvider, useVoice, VoiceReadyState } from "@humeai/voice-react";

// export default function Page() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const checkSession = useCheckSession();
//   const { state: UserState, setUser } = useContext(UserContext);
//   const toast = useToast();
//   const toastIdRef = useRef(null);
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const {
//     isOpen: isOpenReminder,
//     onOpen: onOpenReminder,
//     onClose: onCloseReminder,
//   } = useDisclosure();

//   // useEffect(() => {
//   //   checkSession().then((val) => {
//   //     if (val.user) {
//   //       setUser(val.user);
//   //       setLoading(false);
//   //     }
//   //   });
//   // }, []);
//   useEffect(() => {
//     if (process.env.NODE_ENV === "development") {
//       // In development mode, bypass login check
//       const mockUser = {
//         /* user data as in step 2 */
//         data: {
//           name: "Puneet", // Add the elderly user’s details here
//           email: "puneet@example.com",
//           role: "elderly",
//           ref: "12345", // Some reference ID if needed
//         },
//       };
//       setUser(mockUser);
//       setLoading(false);
//     } else {
//       // In production, run the usual checkSession
//       checkSession().then((val) => {
//         if (val.user) {
//           setUser(val.user);
//           setLoading(false);
//         }
//       });
//     }
//   }, []);

//   async function handleEmergency() {
//     await addDoc(collection(db, "emergency"), {
//       elderlyId: UserState.value.data?.ref,
//       status: "Pending",
//       name: UserState.value.data?.name,
//       number: UserState.value.data?.number,
//     }).then(() => {
//       showToastSuccess(toast, toastIdRef, "Emergency", "Caretaker informed");
//     });
//   }

//   return loading ? (
//     <Loading />
//   ) : (
//     <VoiceProvider
//       auth={{
//         type: "accessToken",
//         value: process.env.NEXT_PUBLIC_HUME_ACCESS_TOKEN,
//       }}
//     >
//       <TopNav
//         username={UserState.value.data?.email}
//         role={UserState.value.data?.role}
//         reference={UserState.value.data?.ref}
//         onOpenPreferences={onOpen}
//         onOpenReminder={onOpenReminder}
//       />
//       <Flex flex={1} overflowX="auto" p="32px" flexDir="column" gap={5}>
//         <Box
//           bgGradient="linear(to-r, purple.600, purple.400)"
//           color="white"
//           p={8}
//           borderRadius="lg"
//           boxShadow="md"
//           mb={8}
//         >
//           <Heading>Welcome, {UserState.value.data?.name}</Heading>
//           <Text mt={4} fontSize="lg">
//             Your personal healthcare center
//           </Text>
//         </Box>
//         <Wrap>
//           <WrapItem>
//             <Preferences
//               isOpen={isOpen}
//               onClose={onClose}
//               email={UserState.value.data?.email}
//             />
//           </WrapItem>
//           <Spacer />
//           <WrapItem>
//             <DangerButton
//               onClick={handleEmergency}
//               bgColor="#FF6347"
//               color="white"
//               _hover={{ bg: "#FF4500" }}
//               borderRadius="8px"
//               padding="12px 20px"
//               fontSize="16px"
//             >
//               Emergency
//             </DangerButton>
//           </WrapItem>
//         </Wrap>
//         {/* Additional content, reminders, or other components */}
//         <Reminder
//           isOpenReminder={isOpenReminder}
//           onCloseReminder={onCloseReminder}
//           email={UserState.value.data?.email}
//           userRef={UserState.value.data?.ref}
//         />
//       </Flex>
//       {/* Button to control voice chat */}
//       <ChatControls />
//     </VoiceProvider>
//   );
// }

// // Component to start/end a voice chat session
// function ChatControls() {
//   const { connect, disconnect, readyState } = useVoice();
//   return readyState === VoiceReadyState.OPEN ? (
//     <button onClick={disconnect}>End Chat</button>
//   ) : (
//     <button onClick={connect}>Start Chat</button>
//   );
// }
