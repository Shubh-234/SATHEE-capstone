'use client'
import Button from "@/components/ui/Button"
import { DeleteIcon } from "@chakra-ui/icons"
import { Center, HStack, Icon, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Flex, Wrap, Spacer, WrapItem, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, Input, VStack, AlertDialogFooter, Box, Image, Spinner, useToast, Heading } from "@chakra-ui/react"
import Link from "next/link"
import { useContext, useEffect, useRef, useState } from "react"
import Dropzone from "@/components/DropZone"
import { theme } from "@/data/data"
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage"
import { db, storage } from "@/config/firebase"
import { addDoc, and, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils"
import { UserContext } from "@/store/context/UserContext"
import { Calendar } from "primereact/calendar"
import { CiCalendar, CiClock1, CiClock2 } from "react-icons/ci"
import moment from "moment"
import Loading from "@/app/loading"
import Checkbox from "@/components/ui/Checkbox"
import { IoIosArrowBack } from "react-icons/io"


export default function ReminderPage({ id, onBackClick }) {
    const [data, setData] = useState([])
    const [newEntry, setNewEntry] = useState("")
    const [time, setTime] = useState(new Date())
    const [uploading, setUploading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(true)
    const toastIdRef = useRef(null);
    const toast = useToast()
    const [recursive, setRecursive] = useState(false)
    const { state: UserState } = useContext(UserContext)

    useEffect(() => {
        if (UserState.value.data?.email) {
            fetchData()
        }

    }, [UserState.value.data])

    const RenderEachRow = ({ item, index }) => {
        const [rowLoading, setRowLoading] = useState(false);
        async function handleDeleteRow(item) {
            await deleteDoc(doc(db, "reminder", item.id))
                .then(() => {
                    setRowLoading(false)
                    setData((prevFiles) => prevFiles.filter(file => file.id !== item.id));
                    showToastSuccess(toast, toastIdRef, "Success", "Record deleted")
                }).catch((e) => {
                    showToastFailed(toast, toastIdRef, "Failed", e.message)
                    setRowLoading(false)
                })

        }

        return (
            <Box
                key={index}
                bg="white"
                borderRadius="16px"
                p="20px"
                width="300px"
                transition="transform 0.2s"
                border={`2px solid ${theme.color.shadowColor}`}
                position="relative"
                _hover={{ transform: 'scale(1.05)' }}
                overflow="hidden"
            >
                <Box
                    position="absolute"
                    top="-20px"
                    left="-20px"
                    width="calc(100% + 40px)"
                    height="calc(100% + 40px)"

                    borderRadius="20px"
                    zIndex="-1"
                />

                <Text fontSize="20px" fontWeight="bold" color="#2D3748" mb={2}>
                    {item.reminder}
                </Text>

                <Text fontSize="14px" color="#4A5568" >
                    {moment(new Date(item.reminderTime)).format("DD/MM/YYYY hh:mm A")}
                </Text>
                {item?.recursive ?
                    <Checkbox isDisabled isChecked={item.recursive}>Recursive</Checkbox>
                    :
                    <Checkbox isDisabled isChecked={false}>Recursive</Checkbox>
                }
                <HStack mt={3} spacing={4} justify="center">
                    {rowLoading ? <Spinner size={'sm'} /> :
                        <Button
                            onClick={() => {
                                setRowLoading(true)
                                handleDeleteRow(item)
                            }}
                            colorScheme="red"
                            size="sm"
                            borderRadius="10px"
                            px={4}
                        >
                            🗑️ Delete
                        </Button>
                    }
                </HStack>
            </Box>
        );
    };

    async function handleSave() {
        await addDoc(collection(db, "reminder"), {
            created: new Date().getTime(),
            addedBy: UserState.value.data?.email,
            reminder: newEntry,
            elderlyId: id,
            reminderTime: time.getTime(),
            status: "Pending",
            recursive: recursive,
            notificationStatus: "Pending",
            lastCompletedDate: null,
            closed : false
        }).then(() => {
            onClose();
            fetchData();
        }).catch((e) => {
            onClose();
            showToastFailed(toast, toastIdRef, "Failed", e.message);
        });
    }

    async function fetchData() {
        await getDocs(query(collection(db, "reminder"), where("addedBy", "==", UserState.value.data?.email))).then((snapshot) => {
            let list = []
            snapshot.forEach((docs) => {
                list.push({ ...docs.data(), id: docs.id })
            })
            setData([...list])
            setLoading(false)
            setUploading(false)
        }).catch(() => {
            setLoading(false)
            setUploading(false)
        })
    }


    return (
        loading ?
            <Loading />
            :
            <Flex flex={1} gap={"30px"} p={"32px"} flexDir="column" overflowX={"auto"} >
                <HStack mb={5}>
                    <Icon as={IoIosArrowBack} boxSize={10} color="#2B6CB0" _hover={{ cursor: 'pointer' }} onClick={() => {
                        onBackClick()
                    }} />
                    <Icon as={CiClock2} boxSize={10} color="#2B6CB0" />
                    <Heading
                        color="#2B6CB0"

                    >
                        Reminder
                    </Heading>
                </HStack>

                <Wrap justify="flex-end" mb={5}>
                    <WrapItem>
                        <Button
                            color="white"
                            fontSize="16px"
                            isDisabled={!UserState.value.data?.email}
                            onClick={() => {
                                setTime(new Date());
                                setNewEntry("");
                                onOpen();
                            }}
                        >
                            Add New Reminder
                        </Button>
                    </WrapItem>
                </Wrap>

                {data.length === 0 ? (
                    <Center>
                        <Heading color="#A0AEC0">🎉 No Reminders Set</Heading>
                    </Center>
                ) : (
                    <Wrap spacing="30px" justify="center">
                        {data.sort((a, b) => a.reminderTime - b.reminderTime).map((item, index) => (
                            <RenderEachRow item={item} key={index} />
                        ))}
                    </Wrap>
                )}

                <AlertDialog
                    motionPreset="slideInBottom"
                    onClose={onClose}
                    isOpen={isOpen}
                    isCentered
                >
                    <AlertDialogOverlay bg={"#344054B2"} />
                    <AlertDialogContent maxW={"90%"} width={"600px"} borderRadius="16px">
                        <AlertDialogBody mb={5}>
                            <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
                                <VStack width={"100%"} gap={5}>

                                    <Text fontSize={"24px"} fontWeight={"600"} color={"#2B6CB0"}>
                                        🌟 Add New Reminder
                                    </Text>

                                    <Input
                                        value={newEntry}
                                        onChange={(e) => setNewEntry(e.target.value)}
                                        placeholder="Set reminder for elderly"
                                        borderRadius="10px"
                                    />



                                    <VStack align={"flex-start"} gap={0} w={'100%'}>
                                        <Text fontSize={"16px"} fontWeight={"500"}>⏰ Reminder Date and Time</Text>
                                        <Box
                                            display={"flex"}
                                            width={"100%"}
                                            borderRadius={"10px"}
                                            border={"1px solid"}
                                            borderColor={theme.color.shadowColor}
                                            padding={"1rem"}
                                            alignItems={"center"}
                                            _hover={{ borderColor: "#84ADFF" }}
                                            _focusWithin={{
                                                boxShadow: "0px 0px 3px 3px #D1E0FF",
                                                borderColor: "#84ADFF",
                                            }}
                                        >
                                            <Calendar
                                                id="reminder-time"
                                                showTime
                                                hourFormat="12"
                                                dateFormat="dd/mm/yy"
                                                className="custom-datepicker"
                                                value={time}
                                                onChange={(e) => setTime(e.value)}
                                            />
                                            <Icon as={CiCalendar} size={20} />
                                        </Box>
                                    </VStack>
                                    <VStack align={"flex-start"} gap={0} w={'100%'}>
                                        <Text fontSize={"16px"} fontWeight={"500"}></Text>
                                        <Checkbox isChecked={recursive} onChange={(e) => setRecursive(e.target.checked)}>Recursive?</Checkbox>
                                    </VStack>
                                </VStack>
                            </HStack>
                        </AlertDialogBody>
                        <AlertDialogFooter w={"100%"}>
                            <Button
                                isDisabled={!newEntry}
                                isLoading={uploading}
                                w={"100%"}
                                color="white"
                                onClick={() => {
                                    setUploading(true);
                                    handleSave();
                                }}
                            >
                                💾 Save Reminder
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </Flex>

    )
}