"use client";
import Button, { GhostButton } from "@/components/ui/Button";
import { AddIcon } from "@chakra-ui/icons";

import {
  Flex,
  HStack,
  Text,
  useToast,
  VStack,
  Input,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Grid,
  Spacer,
  Center,
  Spinner,
  Heading,
  SimpleGrid,
  Icon,
} from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { HealthMonitoringCard } from "@/components/ui/HealthMonitoringCard";
import { UserContext } from "@/store/context/UserContext";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";
import moment from "moment";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";
import {
  addDoc,
  and,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import Loading from "@/app/loading";
import { RiFirstAidKitLine } from "react-icons/ri";
import { IoIosArrowBack } from "react-icons/io";

export default function RecordPage({ id, onBackClick }) {
  const toast = useToast();
  const toastIdRef = useRef(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const [loading, setLoading] = useState(false);
  const [newRecord, setNewRecord] = useState({
    bpleft: "",
    bpright: "",
    bloodpressure: "",
    heartrate: "",
    temperature: "",
    respiratory: "",
  });
  const { state: UserState } = useContext(UserContext);

  useEffect(() => {
    if (UserState.value.data?.email) {
      const q = query(
        collection(db, "record"),
        where("addedBy", "==", UserState.value.data?.email)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let list = [];
        querySnapshot.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        list.sort((a, b) => b.created - a.created);
        setDataLoading(false);
        setData(list);
      });
      return () => unsubscribe();
    }
  }, [UserState.value.data]);

  async function handleSaveHealthRecord() {
    await addDoc(collection(db, "record"), {
      bloodPressure: newRecord.bloodpressure,
      temperature: newRecord.temperature,
      heartRate: newRecord.heartrate,
      respiratoryRate: newRecord.respiratory,
      elderlyId: id,
      addedBy: UserState.value.data?.email,
      created: new Date().getTime(),
    })
      .then(() => {
        showToastSuccess(toast, toastIdRef, "Success", "Record added");
        setLoading(false);
        onClose();
      })
      .catch((e) => {
        showToastFailed(toast, toastIdRef, "Failed", e.message);
        setLoading(false);
      });
  }

  return dataLoading ? (
    <Loading />
  ) : (
    <Flex
      flex={1}
      gap="20px"
      p="24px"
      flexDir="column"
      overflowX="auto"
      bg="#F9FAFB"
      minH={"100vh"}
    >
      <HStack mb={5}>
        <Icon
          as={IoIosArrowBack}
          boxSize={10}
          color="#2B6CB0"
          _hover={{ cursor: "pointer" }}
          onClick={() => {
            onBackClick();
          }}
        />
        <Icon as={RiFirstAidKitLine} boxSize={10} color="#2B6CB0" />
        <Heading color="#2B6CB0">Medical Record</Heading>
      </HStack>

      <HStack width="100%" p={5} justify="space-between">
        <Spacer />
        <Button
          color="white"
          leftIcon={<AddIcon mt="-2px" boxSize={4} />}
          onClick={() => {
            setLoading(false);
            setNewRecord({
              bloodpressure: "",
              bpleft: "",
              bpright: "",
              heartrate: "",
              respiratory: "",
              temperature: "",
            });
            onOpen();
          }}
        >
          Add New Record
        </Button>
      </HStack>

      {data.length === 0 ? (
        <Center>
          <Heading color="#4A90E2" fontSize="20px">
            No record added yet!
          </Heading>
        </Center>
      ) : (
        <Grid
          width="100%"
          templateColumns={{
            base: "repeat(1, 1fr)",
            md: "repeat(1, 1fr)",
            lg: "repeat(2, 1fr)",
            xl: "repeat(2, 1fr)",
          }}
          gap={4}
          p={4}
        >
          {data.map((item, index) => (
            <HealthMonitoringCard key={index} data={item} />
          ))}
        </Grid>
      )}

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isOpen={isOpen}
        isCentered
      >
        <AlertDialogOverlay bg="rgba(52, 64, 84, 0.7)" />
        <AlertDialogContent
          p={5}
          borderRadius="xl"
          boxShadow="2xl"
          bg="yellow.100"
        >
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <VStack alignItems="flex-start" gap={5} width="inherit">
              <Text fontSize="xl" fontWeight="bold" color="blue.700">
                🩺 Regular Checkup
              </Text>

              {/* Blood Pressure Input */}
              <VStack alignItems="flex-start" spacing={0} width="inherit">
                <Text
                  variant="description"
                  fontWeight="medium"
                  color="blue.500"
                >
                  Blood Pressure
                </Text>
                <HStack w="inherit" justify="space-between">
                  <HStack>
                    <Input
                      width="100px"
                      value={newRecord.bpleft}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          bpleft: e.target.value,
                          bloodpressure: `${e.target.value}/${newRecord.bpright}`,
                        }))
                      }
                      bg="white"
                      borderRadius="lg"
                      boxShadow="md"
                      _hover={{ borderColor: "blue.300" }}
                    />
                    <Text fontSize="lg" fontWeight="bold" color="purple.600">
                      /
                    </Text>
                    <Input
                      width="100px"
                      value={newRecord.bpright}
                      onChange={(e) =>
                        setNewRecord((prev) => ({
                          ...prev,
                          bpright: e.target.value,
                          bloodpressure: `${newRecord.bpleft}/${e.target.value}`,
                        }))
                      }
                      bg="white"
                      borderRadius="lg"
                      boxShadow="md"
                      _hover={{ borderColor: "blue.300" }}
                    />
                  </HStack>
                  <Text fontWeight="bold" color="purple.600">
                    mmHg
                  </Text>
                </HStack>
              </VStack>

              {/* Heart Rate Input */}
              <VStack alignItems="flex-start" spacing={0} width="inherit">
                <Text fontWeight="medium" color="blue.500">
                  Heart Rate
                </Text>
                <HStack w="inherit" justify="space-between">
                  <Input
                    width="300px"
                    value={newRecord.heartrate}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        heartrate: e.target.value,
                      }))
                    }
                    bg="white"
                    borderRadius="lg"
                    boxShadow="md"
                    _hover={{ borderColor: "blue.300" }}
                  />
                  <Text fontWeight="bold" color="purple.600">
                    bpm
                  </Text>
                </HStack>
              </VStack>

              {/* Temperature Input */}
              <VStack alignItems="flex-start" spacing={0} width="inherit">
                <Text fontWeight="medium" color="blue.500">
                  Temperature
                </Text>
                <HStack w="inherit" justify="space-between">
                  <Input
                    width="300px"
                    value={newRecord.temperature}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        temperature: e.target.value,
                      }))
                    }
                    bg="white"
                    borderRadius="lg"
                    boxShadow="md"
                    _hover={{ borderColor: "blue.300" }}
                  />
                  <Text fontWeight="bold" color="purple.600">
                    °F
                  </Text>
                </HStack>
              </VStack>

              {/* SpO₂ Input */}
              <VStack alignItems="flex-start" spacing={0} width="inherit">
                <Text fontWeight="medium" color="blue.500">
                  SpO₂
                </Text>
                <HStack w="inherit" justify="space-between">
                  <Input
                    width="300px"
                    value={newRecord.respiratory}
                    onChange={(e) =>
                      setNewRecord((prev) => ({
                        ...prev,
                        respiratory: e.target.value,
                      }))
                    }
                    bg="white"
                    borderRadius="lg"
                    boxShadow="md"
                    _hover={{ borderColor: "blue.300" }}
                  />
                  <Text fontWeight="bold" color="purple.600">
                    %
                  </Text>
                </HStack>
              </VStack>
            </VStack>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              onClick={onClose}
              colorScheme="red"
              borderRadius="full"
              borderColor="#DDDDDD"
            >
              Cancel
            </Button>
            <Button
              ml={3}
              borderRadius="full"
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                handleSaveHealthRecord();
              }}
              isDisabled={!newRecord.respiratory || !newRecord.temperature}
            >
              Save
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Flex>
  );
}
