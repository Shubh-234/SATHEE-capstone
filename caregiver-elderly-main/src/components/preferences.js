"use client";
import React, { useState, useEffect } from "react";
import {
    Box,
    Button,
    Flex,
    Text,
    VStack,
    Select,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    Center,
    Wrap,
    WrapItem,
} from "@chakra-ui/react";
import * as XLSX from "xlsx";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export default function Preferences({ isOpen, onClose, email }) {
    const [preferences, setPreferences] = useState({
        songType: "",
        movieType: "",
        exerciseType: "",
    });
    const [recommendation, setRecommendation] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);

    const [exerciseData, setExerciseData] = useState([]);
    const [excerciseDataType, setExcerciseDataType] = useState([]);
    const [movieData, setMovieData] = useState([]);
    const [movieDataType, setMovieDataType] = useState([]);
    const [songData, setSongData] = useState([]);
    const [songDataType, setSongDataType] = useState([]);
    const [saveLoading, setSaveLoading] = useState(false);

    useEffect(() => {
        if (email) {
            loadData(
                "Elderly_Exercises_With_Links.xlsx",
                setExerciseData,
                setExcerciseDataType
            );
            loadData("Elderly_Movies_With_Links.xlsx", setMovieData, setMovieDataType);
            loadData("Elderly_Songs_With_Links.xlsx", setSongData, setSongDataType);
            fetchData()
        }

    }, [email]);

    async function fetchData() {
        await getDoc(doc(db, "preferences", email))
            .then((doc) => {
                if (doc.data()) {
                    setPreferences(doc.data())
                }
            })
    }

    const loadData = async (fileName, setData, setType) => {
        const response = await fetch(`/data/${fileName}`);
        const data = await response.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        const uniqueTypesSet = new Set(parsedData.map((item) => item.Type));
        setData(parsedData);
        setType([...uniqueTypesSet]);
    };

    const handlePreferenceChange = async (e) => {
        const { name, value } = e.target;
        setPreferences((prev) => ({ ...prev, [name]: value }));
    };

    const recommendItem = (type) => {
        let data;
        if (type === "exercise") data = exerciseData;
        else if (type === "movie") data = movieData;
        else if (type === "song") data = songData;

        const filteredItems = data.filter(
            (item) => item.Type === preferences[`${type}Type`]
        );
        const randomItem =
            filteredItems[Math.floor(Math.random() * filteredItems.length)];
        setRecommendation({ type, item: randomItem });
        setModalOpen(true);
    };

    const getYouTubeEmbedUrl = (url) => {
        const videoId = url.split("v=")[1];
        return `https://www.youtube.com/embed/${videoId}`;
    };

    async function handleSavePreferences() {
        await setDoc(doc(db, "preferences", email), preferences)
            .then(() => {
                setSaveLoading(false);
                onClose();
            })
            .catch((e) => {
                setSaveLoading(false);
                console.log(e.message);
            });
    }

    return (
        <>
            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent minW={"400px"} bgGradient='linear(to-br, #FFFFFF, #fbf5e7)'>
                    <DrawerHeader>Set Your Preferences</DrawerHeader>
                    <DrawerBody>
                        <VStack spacing={4} align="stretch">
                            <Flex>
                                <Text mr={4} >Song type:</Text>
                                <Select
                                    name="songType"
                                    value={preferences.songType}
                                    onChange={handlePreferenceChange}
                                    placeholder="Select Song Type"
                                >
                                    {songDataType.length > 0 &&
                                        songDataType.map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                </Select>
                            </Flex>
                            <Flex>
                                <Text mr={4}>Movie type:</Text>
                                <Select
                                    name="movieType"
                                    value={preferences.movieType}
                                    onChange={handlePreferenceChange}
                                    placeholder="Select Movie Type"
                                >
                                    {movieDataType.length > 0 &&
                                        movieDataType.map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                </Select>
                            </Flex>
                            <Flex>
                                <Text mr={4}>Exercise type:</Text>
                                <Select
                                    name="exerciseType"
                                    value={preferences.exerciseType}
                                    onChange={handlePreferenceChange}
                                    placeholder="Select Exercise Type"
                                >
                                    {excerciseDataType.length > 0 &&
                                        excerciseDataType.map((item, index) => (
                                            <option key={index} value={item}>
                                                {item}
                                            </option>
                                        ))}
                                </Select>
                            </Flex>
                        </VStack>
                    </DrawerBody>
                    <DrawerFooter>
                        <Button
                            isLoading={saveLoading}
                            colorScheme="purple"
                            onClick={() => {
                                setSaveLoading(true);
                                handleSavePreferences();
                            }}
                        >
                            Save Preferences
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

            <Wrap gap={4} mb={8}>
                <WrapItem>
                    <Button colorScheme="teal" onClick={() => recommendItem("movie")}>
                        Recommend Movie
                    </Button>
                </WrapItem>
                <WrapItem>
                    <Button colorScheme="blue" onClick={() => recommendItem("song")}>
                        Recommend Song
                    </Button>
                </WrapItem>
                <WrapItem>
                    <Button colorScheme="green" onClick={() => recommendItem("exercise")}>
                        Recommend Exercise
                    </Button>
                </WrapItem>
            </Wrap>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                closeOnOverlayClick={false}
            >
                <ModalOverlay />
                <ModalContent maxW={"90vw"} minH={'400px'}>
                    <ModalHeader>Recommendation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {recommendation.item ? (
                            <>
                                <Text fontSize="lg">
                                    <strong>
                                        {recommendation.type.charAt(0).toUpperCase() +
                                            recommendation.type.slice(1)}
                                        :
                                    </strong>{" "}
                                    {recommendation.item["Name"] || recommendation.item.Name}
                                </Text>
                                {recommendation.item["YouTube Link"] && (
                                    <Box my={4}>
                                        <iframe
                                            width="100%"
                                            height="500px"
                                            src={getYouTubeEmbedUrl(
                                                recommendation.item["YouTube Link"]
                                            )}
                                            title="YouTube video player"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Center>
                                <Text>No recommendation available.</Text>
                            </Center>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
