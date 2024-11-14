"use client";
import Button from "@/components/ui/Button";
import Logo from "@/components/logo";
import {
  Flex,
  HStack,
  Input,
  Stack,
  Text,
  VStack,
  Image,
  useToast,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import useCheckSession from "@/config/checkSession";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/config/firebase";
import Loading from "../loading";
import { showToastFailed, showToastSuccess } from "@/utils/toastUtils";
import Header from "@/screen/Header";

export default function Page() {
  const [email, setEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const toast = useToast();
  const toastIdRef = useRef(null);
  const [loading, setLoading] = useState(false);
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
  }, [email]);

  async function handleResetEmail() {
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        setLoading(false);
        showToastSuccess(
          toast,
          toastIdRef,
          "Success",
          "Check your email for reset link"
        );
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
          <VStack spacing={6}>
            <Heading
              as="h2"
              size="xl"
              textAlign="center"
              mb={4}
              color="purple.700"
            >
              Reset Password
            </Heading>

            <Text textAlign="center" color="gray.500" mb={4}>
              Enter your email address below and we’ll send you a link to reset
              your password.
            </Text>

            <Stack dir="column" spacing={4} width="100%">
              <Text fontWeight="semibold">Email</Text>
              <Input
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                focusBorderColor="purple.500"
                size="lg"
                rounded="md"
                bg="gray.100"
                color="gray.800"
              />
            </Stack>

            <Button
              isLoading={loading}
              onClick={() => {
                setLoading(true);
                handleResetEmail();
              }}
              width="100%"
              colorScheme="purple"
              size="lg"
              rounded="md"
              isDisabled={!isEmailValid}
            >
              Reset Password
            </Button>

            <HStack align="center" mt={6}>
              <Text color="gray.500">Already have an account?</Text>
              <Text
                as={Link}
                href="/login"
                fontWeight="bold"
                color="purple.500"
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
