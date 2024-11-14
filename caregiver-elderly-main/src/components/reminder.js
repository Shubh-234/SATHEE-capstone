import { db } from "@/config/firebase";
import {
    Box, Center, HStack, Spinner, Drawer,
    DrawerOverlay, DrawerContent, DrawerHeader,
    DrawerBody, Text, VStack, Flex, Icon,
    Button, AlertDialog, AlertDialogOverlay,
    AlertDialogContent, AlertDialogHeader,
    AlertDialogBody, AlertDialogFooter,
    Heading,
    Image
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { collection, doc, onSnapshot, query, updateDoc, where } from "firebase/firestore";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import Checkbox from "./ui/Checkbox";

export default function Reminder({ isOpenReminder, onCloseReminder, email, userRef }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [popupReminder, setPopupReminder] = useState(null); // State for popup reminder
    const cancelRef = useRef();

    useEffect(() => {
        if (userRef) {
            const q = query(
                collection(db, "reminder"),
                where("elderlyId", "==", userRef)
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                let list = [];
                const today = moment().startOf("day");

                querySnapshot.forEach(async (doc) => {
                    const reminderData = doc.data();
                    const reminderDate = moment(reminderData.reminderTime);

                    if (reminderData.recursive) {
                        if (
                            reminderData.status === "Completed" &&
                            (!reminderData.lastCompletedDate ||
                                !moment(reminderData.lastCompletedDate).isSameOrBefore(today, "day"))
                        ) {
                            const updatedTime = today
                                .set({
                                    hour: reminderDate.hour(),
                                    minute: reminderDate.minute(),
                                    second: reminderDate.second(),
                                    millisecond: reminderDate.millisecond(),
                                })
                                .valueOf();

                            await updateDoc(doc.ref, {
                                status: "Pending",
                                reminderTime: updatedTime,
                                notificationStatus: "Pending"
                            });

                            reminderData.status = "Pending";
                            reminderData.reminderTime = updatedTime;
                            reminderData.notificationStatus = "Pending";
                        }
                    }

                    if (reminderData.notificationStatus === "Pending") {
                        list.push({ ...reminderData, id: doc.id });
                    }


                });

                setLoading(false);
                setData(list);
            });

            return () => unsubscribe();
        }
    }, [userRef]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = moment();
            data.forEach((reminderData) => {
                const reminderDate = moment(reminderData.reminderTime);
                if (reminderData.notificationStatus === "Pending" && reminderData?.closed === false) {
                    const now = moment();
                    if (reminderDate.isSameOrBefore(now, 'minute') && reminderData.status === "Pending") {
                        const reminderMoment = moment(reminderData.reminderTime);
                        if (reminderMoment.isSame(now, 'minute')) {
                            setPopupReminder({ ...reminderData });
                        }
                    }
                }
            });
        }, 10000);
        return () => clearInterval(interval);
    }, [data]);

    const handleNotificationDone = async (id) => {
        try {
            await updateDoc(doc(db, "reminder", id), {
                notificationStatus: "Done"
            });
        } catch (error) {
            console.error("Error updating notification status:", error);
        }
    };

    async function handlePopupDone() {
        if (popupReminder) {
            await updateDoc(doc(db, "reminder", popupReminder.id), {
                status: "Completed",
                lastCompletedDate: moment().valueOf()
            });
            setPopupReminder(null);
        }
    };

    async function handlePopupClose() {
        if (popupReminder) {
            setPopupReminder(null)
            await updateDoc(doc(db, "reminder", popupReminder.id), {
                closed: true,
            })

        }
    }

    const RenderEachCard = ({ item }) => {
        const [rowLoading, setRowLoading] = useState(false);

        async function handleStatusUpdate(isChecked) {
            setRowLoading(true);
            await updateDoc(doc(db, "reminder", item.id), {
                status: isChecked ? "Completed" : "Pending",
                lastCompletedDate: moment().valueOf()
            })
                .then(() => {
                    setRowLoading(false);
                })
                .catch(() => {
                    setRowLoading(false);
                });
        }

        return (
            <Box
                key={item.id}
                borderWidth="1px"
                borderRadius="8px"
                overflow="hidden"
                boxShadow="sm"
                p={4}
                mb={4}
                bg={item.status === "Completed" ? "#E0FFE0" : "#FFFFFF"}
            >
                <HStack justify="space-between" align="center">
                    <Text fontSize="18px" fontWeight="bold" textDecoration={item.status === "Completed" ? "line-through" : "none"}>
                        {item.reminder}
                    </Text>
                    {rowLoading ? (
                        <Spinner size={"sm"} />
                    ) : (
                        item?.status === 'Completed'
                            ? <Icon boxSize={3} as={CloseIcon} onClick={() => handleNotificationDone(item.id)} _hover={{ opacity: 0.7, cursor: 'pointer' }} />
                            : <Checkbox isChecked={item.status === "Completed"} onChange={(e) => handleStatusUpdate(e.target.checked)} />
                    )}
                </HStack>
                <Text fontSize="12px" color="gray.600">
                    {item.reminderTime && moment(item.reminderTime).format("DD/MM/YYYY hh:mm A")}
                </Text>
            </Box>
        );
    };

    return (
        <>
            <Drawer isOpen={isOpenReminder} placement="right" onClose={onCloseReminder}>
                <DrawerOverlay />
                <DrawerContent minW={"400px"} bgGradient='linear(to-br, #FFFFFF, #fbf5e7)'>
                    <DrawerHeader>Reminders</DrawerHeader>
                    <DrawerBody>
                        {loading ? (
                            <Center>
                                <Spinner />
                            </Center>
                        ) : (
                            <VStack spacing={4} align="stretch" overflowY={'auto'}>
                                <Flex direction="column">
                                    {data.sort((a, b) => a.reminderTime - b.reminderTime).sort((a, b) => {
                                        if (a.status === "Completed" && b.status !== "Completed") {
                                            return 1;
                                        }
                                        if (a.status !== "Completed" && b.status === "Completed") {
                                            return -1;
                                        }
                                    }).map((item) => (
                                        moment(new Date(item.reminderTime)).format("DD/MM/YYYY") === moment().format("DD/MM/YYYY") &&
                                        <RenderEachCard key={item.id} item={item} />
                                    ))}
                                </Flex>
                            </VStack>
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>


            {popupReminder && (
                <AlertDialog
                    isOpen={Boolean(popupReminder)}
                    leastDestructiveRef={cancelRef}
                    onClose={() => setPopupReminder(null)}
                    closeOnOverlayClick={false}
                    isCentered
                >
                    <AlertDialogOverlay>
                        <AlertDialogContent
                            p={0}
                            bg={'transparent'}
                            animation="pop 0.5s ease-out"
                            border={'none'}
                            shadow={'none'}
                        >
                            {/* <AlertDialogHeader
                         fontSize="3xl"
                         fontWeight="bold"
                         textAlign="center"
                         color="white"
                         fontFamily="Pacifico, cursive"
                         paddingTop="30px"
                         mb={4}
                     >
                         🌟 Reminder Time! 🌟
                     </AlertDialogHeader> */}
                            <AlertDialogBody
                                fontFamily="Poppins, sans-serif"
                            >
                                <Box display={'flex'} flexDir={'column'} alignItems={'center'} justifyContent={'center'}>
                                    <Box rounded={'full'} p={4} bg={'#FCFCF0FF'} zIndex={1} shadow={'lg'}>
                                        <Image width={'60px'} src={"/icons/reminder.png"} />
                                    </Box>
                                    <Box textAlign="center"
                                        fontSize="18px"
                                        color="black"
                                        bgGradient="linear(to-b, #FEFFD3FF, #FFFFFF)"
                                        shadow={'md'}
                                        py={6}
                                        px={12}
                                        width={'350px'}
                                        height={'250px'}
                                        borderRadius={'8px'}
                                        mt={-7}
                                        display={'flex'}
                                        flexDir={'column'}
                                        justifyContent={'space-between'}
                                    >
                                        <VStack flex={1} align={'center'} justify={'center'}>
                                            <Text fontSize="xl" fontWeight="semibold" fontFamily="Pacifico, cursive">
                                                {popupReminder.reminder}
                                            </Text>
                                            <Text fontSize="sm" >
                                                ⏰ {moment(popupReminder.reminderTime).format("MMMM Do YYYY, h:mm a")}
                                            </Text>
                                        </VStack>


                                        <HStack>
                                            <Button
                                                ref={cancelRef}
                                                onClick={() => handlePopupClose()}
                                                bg="#ff6347"
                                                color="white"
                                                fontWeight="bold"
                                                fontFamily="Poppins, sans-serif"
                                                borderRadius="50px"
                                                _hover={{ bg: "#ff4500" }}
                                                _active={{ bg: "#ff4500" }}
                                                padding="12px 30px"
                                                marginRight={4}
                                                transition="all 0.3s ease"
                                            >
                                                ✖ Close
                                            </Button>
                                            <Button
                                                colorScheme="teal"
                                                onClick={() => handlePopupDone()}
                                                bg="#32cd32"
                                                color="white"
                                                fontWeight="bold"
                                                fontFamily="Poppins, sans-serif"
                                                borderRadius="50px"
                                                _hover={{ bg: "#2e8b57" }}
                                                _active={{ bg: "#2e8b57" }}
                                                padding="12px 30px"
                                                transition="all 0.3s ease"
                                            >
                                                ✅ Done
                                            </Button>
                                        </HStack>
                                    </Box>



                                </Box>


                            </AlertDialogBody>

                        </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>


            )}
        </>
    );
}
