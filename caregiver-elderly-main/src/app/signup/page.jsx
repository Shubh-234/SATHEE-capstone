"use client";
import {
  Box,
  Flex,
  Text,
  Input,
  Stack,
  Icon,
  Select,
  HStack,
  useToast,
  Image,
  Heading,
  Center,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/ui/Button";
import { CiCalendar } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { Calendar } from "primereact/calendar";
import {
  Select as SearchableSelect,
  useChakraSelectProps,
} from "chakra-react-select";
import { CountriesList, theme } from "@/data/data";
import Link from "next/link";
import { addDoc, collection } from "firebase/firestore";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";
import generateNumericReferenceNumber from "@/lib/generateReference";
import useCheckSession from "@/config/checkSession";
import Loading from "../loading";
import Header from "@/screen/Header";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [code, setCode] = useState({ value: "", label: "" });
  const [data, setData] = useState({
    email: "",
    password: "",
    name: "",
    number: "",
    role: "",
    dob: new Date(),
  });
  const toast = useToast();
  const toastIdRef = useRef(null);
  const checkSession = useCheckSession();
  const [dataLoading, setDataLoading] = useState(true);

  const codeSelectProps = useChakraSelectProps({
    value: code,
    onChange: setCode,
  });

  const customChakraStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: theme.color.shadowColor,
    }),
  };

  useEffect(() => {
    checkSession().then(() => {
      setDataLoading(false);
    });
  }, []);

  async function handleSignup() {
    const referenceNumber = await generateNumericReferenceNumber(data.email);

    await addDoc(collection(db, "users"), {
      email: data.email,
      name: data.name,
      number: code.value + data.number,
      role: data.role,
      dob: data.dob.getTime(),
      ref: referenceNumber,
    })
      .then(() => {
        createUserWithEmailAndPassword(auth, data.email, data.password)
          .then(() => {
            setLoading(false);
            showToastSuccess(
              toast,
              toastIdRef,
              "Success",
              "Registration successfull"
            );
            if (data.role.toLocaleLowerCase() === "caregiver") {
              router.push("/caregiver");
            } else {
              router.push("/elderly");
            }
          })
          .catch((e) => {
            setLoading(false);
            showToastFailed(toast, toastIdRef, "Failed", e.message);
          });
      })
      .catch((e) => {
        setLoading(false);
        showToastFailed(toast, toastIdRef, "Failed", e.message);
      });
  }

  return dataLoading ? (
    <Loading />
  ) : (
<>
<Header />
<Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-br, purple.700, pink.500, blue.600)"
      color="white"
      px={4}
    >
      <Box
        maxW="lg"
        w="full"
        p={10}
        mx="auto"
        borderRadius="xl"
        bg="white"
        color="gray.800"
        boxShadow="2xl"
        border={"3px solid"}
        borderColor={"purple.500"}
      >
        <VStack>
          <Heading
            as="h2"
            size="lg"
            textAlign="center"
            mb={6}
            color={"purple.600"}
          >
            Create an Account
          </Heading>
          
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text variant="subheading">Name</Text>
            <Input
              placeholder="Enter name"
              value={data.name}
              onChange={(e) =>
                setData((prevState) => ({ ...prevState, name: e.target.value }))
              }
            />
          </Stack>

          <Stack dir="column" spacing={1} width={"100%"}>
            <Text variant="subheading">Email</Text>
            <Input
              placeholder="Enter email"
              type="email"
              value={data.email}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  email: e.target.value,
                }))
              }
            />
          </Stack>
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text variant="subheading">Password</Text>
            <Input
              placeholder="Enter password"
              type="password"
              value={data.password}
              onChange={(e) =>
                setData((prevState) => ({
                  ...prevState,
                  password: e.target.value,
                }))
              }
            />
          </Stack>
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text variant="subheading">Phone number</Text>
            <HStack>
              <div style={{ width: "200px" }}>
                <SearchableSelect
                  id="code"
                  useBasicStyles
                  chakraStyles={customChakraStyles}
                  colorScheme="blue"
                  options={CountriesList.map((item) => {
                    return {
                      value: item.num,
                      label: item.num,
                    };
                  })}
                  {...codeSelectProps}
                />
              </div>
              <Input
                placeholder="Enter phone number"
                type="number"
                value={data.number}
                onChange={(e) =>
                  setData((prevState) => {
                    const newState = { ...prevState };
                    newState.number = e.target.value;
                    return newState;
                  })
                }
              />
            </HStack>
          </Stack>
          <Stack dir="column" spacing={1} width={"100%"}>
            <Text variant="subheading">Registration type</Text>
            <Select
              id="role"
              value={data.role}
              onChange={(e) =>
                setData((prevState) => ({ ...prevState, role: e.target.value }))
              }
            >
              <option value={""}>Select one</option>
              <option value={"caregiver"}>Caregiver</option>
              <option value={"elderly"}>Elderly</option>
            </Select>
          </Stack>

          <Stack dir="column" spacing={1} width={"100%"}>
            <Text variant="subheading">Date of birth</Text>
            <Box
              display={"flex"}
              width={"100%"}
              height={10}
              borderRadius={"0.375rem"}
              outline={"2px solid transparent"}
              border={"1px solid"}
              borderColor={"#DDDDDD"}
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
                value={data?.dob}
                onChange={(e) => {
                  setData((prevState) => ({ ...prevState, dob: e.value }));
                }}
              />
              <Icon as={CiCalendar} size={20} />
            </Box>
          </Stack>
          <Button
            isDisabled={
              !data.email ||
              !code.value ||
              !data.dob ||
              !data.number ||
              !data.password ||
              !data.role
            }
            width={"100%"}
            isLoading={loading}
            onClick={() => {
              setLoading(true);
              handleSignup();
            }}
          >
            Sign up
          </Button>
          {/* </Link> */}
          <HStack width={"auto"} alignSelf={"center"}>
            <Text variant="description">Already have an account?</Text>

            <Text
              as={Link}
              href={"/login"}
              variant="link"
              fontWeight={"500"}
              color={"purple.500"}
            >
              Login
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
</>
    
  );
}
