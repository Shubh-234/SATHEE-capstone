import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  HStack,
  Stack,
  useBreakpointValue,
  MotionBox,
  Link,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  FaHeart,
  FaClipboardCheck,
  FaSmile,
  FaBell,
  FaShieldAlt,
} from 'react-icons/fa';

const AnimatedBox = motion(Box);

export default function WhySection() {
  return (
    <Container maxW="container.md" py={20} textAlign="center" as={"section"} id='why'>
      <Heading as="h2" size="2xl" textAlign="center" mb={12} color={'white'}>
        <Text display={'inline'}>
          Why Choose <Text
            as="span"
            bgGradient="linear(to-br, #fbf5e7, #f4756c)"
            bgClip="text"
            fontWeight="bold"
          >
          {" "}  Sathee?
          </Text> 
        </Text>
      </Heading>
      <Text fontSize="lg" mb={8} color="gray.400" mt={10}>
        Sathee offers more than just companionship—it fosters emotional support, caregiver connection, and a simple, accessible experience.
      </Text>
      <SimpleGrid columns={[1, 2]} spacing={8}>
        <WhyChooseItem icon={FaHeart} title="Companionship" />
        <WhyChooseItem icon={FaClipboardCheck} title="Caregiver Support" />
        <WhyChooseItem icon={FaSmile} title="Advanced AI" />
        <WhyChooseItem icon={FaShieldAlt} title="Privacy & Security" />
      </SimpleGrid>
      <Button as={Link} href='/login'  colorScheme="purple" mt={10} size="lg" _hover={{ textDecoration:'none' }}>
        Join Sathee Today
      </Button>
    </Container>
  );
}

function WhyChooseItem({ icon, title }) {
  return (
    <AnimatedBox
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
      bg="gray.800"
      rounded="md"
      boxShadow="lg"
      whileHover={{ scale: 1.1 }}
      transition={{ duration: 0.3 }}
      
    >
      <HStack spacing={4}>
        <Icon as={icon} color="cyan.300" w={8} h={8} />
        <Text fontWeight="bold"  fontSize="lg" color={'whitesmoke'}>
          {title}
        </Text>
      </HStack>
    </AnimatedBox>
  );
}
