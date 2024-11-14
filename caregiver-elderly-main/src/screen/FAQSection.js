import {
  Box,
  Container,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
} from '@chakra-ui/react';

export default function FAQSection() {
  return (
    <Container maxW="container.md" py={16} bg={'gray.900'}>
      <Heading as="h2" size="2xl" textAlign="center" mb={8} color="white">
        Frequently Asked Questions
      </Heading>
      <Accordion allowToggle>
        <FAQItem question="How does Sathee detect emotions?">
          Sathee uses advanced AI technology to analyze facial expressions and text, providing a compassionate response.
        </FAQItem>
        <FAQItem question="Is my data secure with Sathee?">
          Yes, Sathee prioritizes privacy, ensuring that all data is securely stored and protected.
        </FAQItem>
        <FAQItem question="Can caregivers set custom reminders?">
          Yes, caregivers can set reminders for medications, routines, and more through the caregiver dashboard.
        </FAQItem>
      </Accordion>
    </Container>
  );
}

function FAQItem({ question, children }) {
  return (
    <AccordionItem borderBottom="1px solid" borderColor="gray.700" rounded={'full'} color={'white'}>
      <AccordionButton
      rounded={'full'}
        _expanded={{ bg: "cyan.600"  }}
        _hover={{ bg: "cyan.500" }}
        px={6}
        py={4}
      >
        <Box flex="1" textAlign="left" fontWeight="semibold" color="white">
         {question}
        </Box>
        <AccordionIcon color="white" />
      </AccordionButton>
      <AccordionPanel pb={4} p={6} bg="gray.900" border={"0px"}>
        <Text color="gray.300">Answer: <br />{children}</Text>
      </AccordionPanel>
    </AccordionItem>
  );
}
