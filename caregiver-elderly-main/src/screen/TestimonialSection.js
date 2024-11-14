import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export default function TestimonialSection() {
  return (
    <Container
      as={"section"}
      id='testimonial'
      maxW="100vw"
      py={20}
      bg={'gray.800'} // Darker background for better contrast
      display={'flex'}
      flexDir={'column'}
      alignItems={'center'}
      justifyContent={'center'}
    >
      <Heading as="h2" size="2xl" textAlign="center" color="whitesmoke">
        Testimonials
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={8} mt={10}>
        <Testimonial
          name="John D."
          feedback="Sathee has been an incredible support, making me feel connected and understood."
        />
        <Testimonial
          name="Sarah K."
          feedback="The caregiver dashboard gives me peace of mind, knowing my mom is engaged and cared for."
        />
        <Testimonial
          name="Linda M."
          feedback="Emotion detection is spot on! Sathee feels like a true friend."
        />
      </SimpleGrid>
    </Container>
  );
}

function Testimonial({ name, feedback }) {
  return (
    <MotionBox
      p={6}
      bg="gray.800"
      rounded="lg"
      shadow="lg"
      border="1px solid"
      borderColor="gray.700"
      textAlign="center"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      _hover={{ shadow: "2xl" }}
      maxW="300px"
      position="relative"
      overflow="hidden"
    >

      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        background="linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0))"
        zIndex={0}
        rounded="lg"
      />
      <VStack spacing={4} zIndex={1}>
        <Text fontSize="md" color="gray.300" fontStyle="italic">
          &quot;{feedback}&quot;
        </Text>
        <Text fontWeight="bold" color="purple.500">
          {name}
        </Text>
      </VStack>
    </MotionBox>
  );
}
