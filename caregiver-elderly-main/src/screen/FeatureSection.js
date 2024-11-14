import { Container, Heading, Icon, SimpleGrid, VStack, Text } from "@chakra-ui/react";
import { FaBell, FaClipboardCheck, FaHeart, FaShieldAlt, FaSmile } from "react-icons/fa";
import { motion } from "framer-motion";

const MotionVStack = motion(VStack);

export default function FeatureSection() {
  return (
    <Container 
      as="section" 
      id="feature" 
      maxW="100%" 
      py={20} 
      bg="gray.800" 
      display="flex" 
      flexDir="column" 
      alignItems="center" 
      justifyContent="center"
    >
      <Heading as="h2" size="2xl" textAlign="center" mb={10} color="white">
        Key Features
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={8} mt={10}>
        <FeatureCard
          icon={FaSmile}
          title="Multi-Modal Chat Interface"
          description="Engage through text and video, with real-time emotion detection to ensure meaningful interactions."
        />
        <FeatureCard
          icon={FaClipboardCheck}
          title="Dedicated Caregiver Dashboard"
          description="Monitor emotional and physical health data, keeping caregivers informed and connected."
        />
        <FeatureCard
          icon={FaHeart}
          title="Emotion Detection & Sentiment Analysis"
          description="Advanced AI analyzes mood, tailoring responses for a compassionate experience."
        />
        <FeatureCard
          icon={FaBell}
          title="Reminders for Daily Activities"
          description="Caregivers can set reminders for routines, medications, and appointments."
        />
        <FeatureCard
          icon={FaShieldAlt}
          title="Privacy & Security at the Core"
          description="User data is securely stored, ensuring privacy for elderly users and their caregivers."
        />
      </SimpleGrid>
    </Container>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <MotionVStack
      whileHover={{
        scale: 1.18,
        boxShadow: "0px 15px 30px rgba(0, 0, 0, 0.3)", // Enhanced shadow effect
      }}
      transition={{ duration: 0.3 }}
      bg="gray.900" // Dark background for the card
      p={6}
      rounded="lg" // Softer rounded corners
      shadow="lg"
      align="start"
      spacing={4}
      borderRadius="20px" // Added border radius for a softer look
      maxW="300px"
      color="white" // Set text color to white for contrast
      border="1px solid"
      borderColor="#4E4E4EFF"
    >
      <Icon as={icon} w={8} h={8} color="cyan.300" /> {/* Icon color for better visibility */}
      <Heading as="h4" size="md">
        <Text 
        color={'cyan.300'}
          // bgClip="text"
          fontSize="lg"
          fontWeight="bold"
        >
          {title}
        </Text>
      </Heading>
      <Text fontSize="sm" color="gray.300"> {/* Light gray for better readability */}
        {description}
      </Text>
    </MotionVStack>
  );
}
