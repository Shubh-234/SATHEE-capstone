import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Box,
  Image,
  Flex,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { FaHandPointRight, FaComments, FaHeart } from "react-icons/fa";

const MotionBox = motion(Box);
const MotionImage = motion(Image);

export default function HowSection() {
  return (
    <Container
      as="section"
      id="how"
      maxW="100vw"
      py={20}
      display="flex"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      bg="gray.900" // Dark background for the section
      color="white" // White text for contrast
    >
      <Heading as="h2" size="2xl" textAlign="center" mb={12}>
        <Text display={'inline'}>
          How <Text
            as="span"
            bgGradient="linear(to-br, #fbf5e7, #f4756c)"
            bgClip="text"
            fontWeight="bold"
          >
          {" "}  Sathee {" "}
          </Text>
          Works
        </Text>
      </Heading>
      <Flex direction={['column', 'row']} align="flex-start" justify="center" wrap="wrap">
        <VStack  align="center" justify="center" >
          <HowItWorksStep
            icon={FaHandPointRight}
            title="1. Connect"
            description="Set up a profile and meet your virtual companion. Customize settings for personalized engagement."
            align="left"
          />
          <HowItWorksStep
            icon={FaComments}
            title="2. Engage"
            description="Interact through text or video. Sathee responds empathetically, fostering companionship."
            align="right"
          />
          <HowItWorksStep
            icon={FaHeart}
            title="3. Monitor & Support"
            description="Caregivers access health insights, set reminders, and receive alerts through the caregiver dashboard."
            align="left"
          />
        </VStack>

        {/* Image Section */}
        <MotionImage
        display={{base : "none", md : "block"}}
          src="/assets/image1.jpeg"
          alt="Sathee App Preview"
          boxSize={["250px", "300px", "400px", "500px"]}
          borderRadius="md"
          boxShadow="2xl"
          ml={[0, 10]}
          mt={[8, 0]}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </Flex>
    </Container>
  );
}

function HowItWorksStep({ icon, title, description, align }) {
  return (
    <MotionBox
      p={6}
      rounded="lg"
      shadow="lg"
      bg="gray.800" // Dark background for each step
      color="white"
      w="100%"
      maxW="md" // More compact width
      position="relative"
      overflow="hidden"
      whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
      transition={{ duration: 0.3 }}
      mt={align === 'right' ? { base: 10, md: 0 } : { base: 0, md: 2 }} // Adjust top margin for zigzag effect
      mb={align === 'right' ? { base: 10, md: 0 } : { base: 0, md: 2 }} // Adjust bottom margin for zigzag effect
      ml={align === 'right' ? [0, 5] : [5, 0]} // Adjust left margin for alignment
      mr={align === 'right' ? [5, 0] : [0, 5]} // Adjust right margin for alignment
    >
      <HStack spacing={4} zIndex={1}>
        <Box as={icon} w={10} h={10} color="cyan.300" /> {/* Icon color for contrast */}
        <Heading as="h4" size="md" color="cyan.200"> {/* Softer cyan for the title */}
          {title}
        </Heading>
      </HStack>
      <Text mt={4} fontSize="sm" color="gray.300"> {/* Light gray for the description */}
        {description}
      </Text>
    </MotionBox>
  );
}
