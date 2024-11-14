'use client'
import Button from "@/components/ui/Button"
import { DeleteIcon } from "@chakra-ui/icons"
import { Center, HStack, Icon, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, Flex, Wrap, Spacer, WrapItem, useDisclosure, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogBody, Input, VStack, AlertDialogFooter, Box, Image, Spinner, useToast, Heading } from "@chakra-ui/react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Dropzone from "@/components/DropZone"
import { theme } from "@/data/data"
import { deleteObject, getDownloadURL, listAll, ref, uploadBytesResumable } from "firebase/storage"
import { db, storage } from "@/config/firebase"
import { showToastSuccess } from "@/utils/toastUtils"
import Loading from "@/app/loading"
import { HiOutlineDocumentReport } from "react-icons/hi"
import { IoIosArrowBack } from "react-icons/io"


export default function DocumentPage({ id, onBackClick }) {
    const [data, setData] = useState([])
    const [newEntry, setNewEntry] = useState({ name: "", link: '', path: "" })
    const [uploading, setUploading] = useState(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [loading, setLoading] = useState(true)
    const toastIdRef = useRef(null);
    const toast = useToast()

    useEffect(() => {
        if (id) {
            fetchData()
        }

    }, [id])

    const RenderEachRow = ({ item, index }) => {
        const [rowLoading, setRowLoading] = useState(false);
        async function handleDeleteRow(fileRef) {
            try {
                await deleteObject(fileRef);
                let list = data.filter((file) => file => file.reference !== fileRef)
                setData([...list])
                setRowLoading(false)
            } catch (error) {
                console.error("Error deleting file: ", error);
                setRowLoading(false)
            }
        }

        return (
            <Tr key={index} backgroundColor={index % 2 == 0 ? "#F9FAFB" : "white"}>
                <Td color="blue" _hover={{ cursor: 'pointer', opacity: 0.7 }} fontSize={"14px"} fontWeight={"400"}>
                    <Text as={Link} href={item?.url} target="_blank" >
                        {item?.name}
                    </Text>
                </Td>
                <Td>
                    {rowLoading ? (
                        <Spinner size={"sm"} />
                    ) : (
                        <Icon
                            onClick={() => {
                                setRowLoading(true)
                                handleDeleteRow(item.reference)
                            }}
                            _hover={{ cursor: "pointer", opacity: 0.7 }}
                            as={DeleteIcon}
                            boxSize={5}
                            color={"red"}
                        />

                    )}
                </Td>
            </Tr>
        );
    };

    async function handleSave(path) {
        const response = await fetch(newEntry.link);
        const blob = await response.blob();
        const name = path;
        const storageRef = ref(storage, `${id}/documents/` + name);
        const uploadTask = uploadBytesResumable(storageRef, blob);
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
                setUploading(false);

            },
            () => {

                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    showToastSuccess(toast, toastIdRef, "Success", "Document uploaded")
                    fetchData()
                });
            }
        );
    }
    const listAllFiles = async (path) => {
        try {
            const listRef = ref(storage, path);
            const res = await listAll(listRef);
            const fileUrls = res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    name: itemRef.name,
                    url: url,
                    reference: itemRef,
                };
            });
            return await Promise.all(fileUrls);
        } catch (error) {
            console.error("Error listing files: ", error);
        }
    };

    async function fetchData() {
        listAllFiles(`${id}/documents`).then(files => {
            onClose()
            setLoading(false)
            setUploading(false)
            setData(files)
        });
    }


    return (
        loading ?
            <Loading />
            :
            <Flex
            flex={1}
            gap={"20px"}
            p={"32px"}
            flexDir="column"
            overflowX={"auto"}
            bgColor="#F9FAFB" 
            borderRadius="md"  
            boxShadow="md"     
            minH={'100vh'}
        >
        <HStack mb={5}>
        <Icon as={IoIosArrowBack } boxSize={10} color="#2B6CB0" _hover={{cursor : 'pointer'}} onClick={()=>{
            onBackClick()
        }}/>
        <Icon as={HiOutlineDocumentReport} boxSize={10} color="#2B6CB0" />
        <Heading
            color="#2B6CB0"

        >
            Documents
        </Heading>
    </HStack>
            <Wrap>
                <Spacer />
                <WrapItem>
                    <Button 
                      
                        size="md"
                        onClick={() => {
                            setNewEntry({ link: "", name: "", path: "" })
                            onOpen()
                        }}
                    >
                        Add New Document
                    </Button>
                </WrapItem>
            </Wrap>
            {data.length === 0 ? (
                <Center>
                    <Text fontSize="16px" color="#6B7280">No documents uploaded</Text>
                </Center>
            ) : (
                <TableContainer borderRadius="md" overflow="hidden">
                    <Table variant="striped" colorScheme="gray">  {/* Striping for better readability */}
                        <Thead>
                            <Tr>
                                {["Document", "Action"].map((item, index) => (
                                    <Th
                                        key={index}
                                        fontSize={"14px"}      // Slightly larger font size for headers
                                        fontWeight={"bold"}     // Bold headers for emphasis
                                        color="#4B5563"        // Darker header color
                                    >
                                        {item}
                                    </Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {data.map((item, index) => (
                                <RenderEachRow key={index} item={item} index={index} />
                            ))}
                        </Tbody>
                    </Table>
                </TableContainer>
            )}
        
            <AlertDialog
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <AlertDialogOverlay bg={"rgba(52, 64, 84, 0.8)"} />  {/* Semi-transparent overlay */}
        
                <AlertDialogContent maxW={"90%"} width={"600px"} borderRadius="md" boxShadow="lg">
                    <AlertDialogBody mb={5}>
                        <HStack align={"flex-start"} w={"100%"} gap={10} mt={5}>
                            <VStack width={"100%"} gap={5}>
                                <Text fontSize={"18px"} fontWeight={"bold"} color={"#101828"}>Add New Document</Text>
                                <VStack align={"flex-start"} w={"inherit"} gap={0}>
                                    {newEntry?.link ? (
                                        <HStack spacing={5}>
                                            <Text
                                                color="#4F46E5"  // Primary color for the link
                                                fontSize={"14px"}
                                                fontWeight={"500"}
                                            >
                                                {newEntry?.path}
                                            </Text>
                                            <Text
                                                _hover={{ cursor: "pointer", textDecoration: "underline" }} // Underline on hover
                                                color="#6B7280"
                                                fontSize={"14px"}
                                                fontWeight={"500"}
                                                onClick={() => setNewEntry((prevState) => ({ ...prevState, link: "" }))}
                                            >
                                                Delete
                                            </Text>
                                        </HStack>
                                    ) : (
                                        <Dropzone
                                            onDrop={(file) => {
                                                setNewEntry((prevState) => ({
                                                    ...prevState,
                                                    link: URL.createObjectURL(file),
                                                    path: file.path,
                                                }));
                                            }}
                                            title="Click to upload"
                                            subheading="or drag and drop"
                                            description="Docx, PDF, PNG, JPG or GIF"
                                            drag="Drop the files here..."
                                        />
                                    )}
                                </VStack>
                            </VStack>
                        </HStack>
                    </AlertDialogBody>
        
                    <AlertDialogFooter w={"100%"}>
                        <Button
                            isDisabled={!newEntry.link}
                            isLoading={uploading}
                            w={"100%"}
                            colorScheme="blue" // Consistent button color
                            onClick={() => {
                                setUploading(true);
                                handleSave(newEntry.path);
                            }}
                        >
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Flex>
    )
}