import {
  Button,
  Container,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";

export default function HomeSection() {
  return (
    <Container
      as={"section"}
      id="home"
      maxW="100%" // Make the container full width
      minH={"100vh"}
      py={16}
      textAlign={"center"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      color="white" // White text for contrast
      px={4} // Add some horizontal padding for smaller screens
    >
      <Heading as="h1" size="3xl" mb={4}>
        <Text
          display="inline" // Display inline for text wrapping
          fontWeight="bold" // Make the word "Sathee" stand out
        >
          <Text
            as="span"
            bgGradient="linear(to-br, #fbf5e7, #f4756c)"
            bgClip="text"
            fontWeight="bold"
          >
            SATHEE{" "}
          </Text>
        </Text>
        <br />
        <Text display="inline" color={"white"}>
          Social assisstive Technology for Health and Engagement of the Elderly
        </Text>
      </Heading>
      <Text fontSize="lg" mb={8} color="gray.300" maxW={"800px"}>
        SATHEE is a supportive companion for the elderly, offering an engaging
        environment through text and voice-based interactions. Helping to
        alleviate loneliness and promote emotional health.
      </Text>
      <Stack direction="row" justify="center" spacing={4}>
        <Button
          as={Link}
          href="/login"
          size="lg"
          _hover={{ textDecoration: "none" }}
          bgGradient="linear(to-br, purple.500, purple.700)" // Gradient for button
          color="white"
        >
          Get Started
        </Button>
      </Stack>
    </Container>
  );
}
