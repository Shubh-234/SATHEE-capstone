"use client";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Logo from "@/components/logo";
import {
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  Image,
  useDisclosure,
  useToast,
  Box,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Icon,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { showToastFailed } from "@/utils/toastUtils";
import { collection, getDocs, query, where } from "firebase/firestore";
import useCheckSession from "@/config/checkSession";
import Loading from "../loading";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import Header from "@/screen/Header";

export default function Page() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const toastIdRef = useRef(null);
  const toast = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const checkSession = useCheckSession();

  useEffect(() => {
    checkSession().then(() => {
      setDataLoading(false);
    });
  }, []);

  useEffect(() => {
    if (email.includes("@") && email.includes(".")) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }

    if (password.length > 7) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  }, [email, password]);

  async function handleLogin() {
    await getDocs(
      query(collection(db, "users"), where("email", "==", email))
    ).then(async (snapshot) => {
      let list = [];
      snapshot.forEach((docs) => {
        list.push({ ...docs.data(), id: docs.id });
      });
      if (list.length === 0) {
        setLoading(false);
        showToastFailed(toast, toastIdRef, "Failed", "User not found");
      } else {
        await signInWithEmailAndPassword(auth, email, password)
          .then(() => {
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
            showToastFailed(toast, toastIdRef, "Failes", e.message);
          });
      }
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
      border={'3px solid'}
      borderColor={'purple.500'}
    >
        <Heading
          as="h2"
          size="lg"
          textAlign="center"
          mb={6}
          color={"purple.600"}
        >
          Welcome Back
        </Heading>
        <Stack spacing={2}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focusBorderColor="purple.400"
              bg={"gray.50"}
              color={"gray.800"}
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusBorderColor="purple.400"
              bg={"gray.50"}
              color={"gray.800"}
              _placeholder={{ color: "gray.500" }}
            />
          </FormControl>
          <Flex justify={"flex-end"}>
            <Text
              as={Link}
              href={"/forgetpassword"}
              color={"purple.500"}
              fontWeight={"600"}
              _hover={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Forgot your password?
            </Text>
          </Flex>
          <Button
            isLoading={loading}
            isDisabled={!email || !password}
            colorScheme="purple"
            variant="solid"
            onClick={() => {
              setLoading(true);
              handleLogin();
            }}
            size="lg"
            fontSize="md"
          >
            Sign In
          </Button>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Don’t have an account?{" "}
            <Button as={Link} href="/signup" variant="link" color="purple.500" fontWeight={"500"}>
              Sign up
            </Button>
          </Text>
        </Stack>
      </Box>
    </Box>
    </>
  
  );
}
