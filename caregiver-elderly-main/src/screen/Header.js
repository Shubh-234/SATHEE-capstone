import Logo from '@/components/logo';
import { Box, Button, Flex, Link, LinkBox, Text } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';

function Header() {
  const pathname = usePathname()
  return (
    <Flex as="header" align="center" justify="space-between" px={{ base: 8, md: 20 }} py={4} pos={'fixed'} w={'100%'} zIndex={1}>
      <Logo />
      <Flex
        display={{ base: 'none', md: "flex" }}
        as={Box}
        color={'whiteAlpha.900'}
        gap={10}
        px={10}
        py={4}
        rounded={'full'}
        bgColor={'rgba(255, 255, 255, 0.1)'}
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.3)"
      >
        <Text as={Link} href="/#home" fontSize={'lg'} fontWeight={'600'} _hover={{ textDecoration: 'none', color: 'gray.400' }}>Home</Text>
        <Text as={Link} href="/#feature" fontSize={'lg'} fontWeight={'600'} _hover={{ textDecoration: 'none', color: 'gray.400' }}>Features</Text>
        <Text as={Link} href="/#how" fontSize={'lg'} fontWeight={'600'} _hover={{ textDecoration: 'none', color: 'gray.400' }}>How</Text>
        <Text as={Link} href="/#testimonial" fontSize={'lg'} fontWeight={'600'} _hover={{ textDecoration: 'none', color: 'gray.400' }}>Testimonials</Text>
        <Text as={Link} href="/#why" fontSize={'lg'} fontWeight={'600'} _hover={{ textDecoration: 'none', color: 'gray.400' }}>Why</Text>
      </Flex>
      <Flex gap={6}>
        {pathname.includes("login") || pathname.includes("signup") || pathname.includes("forgetpassword")
          ?
          null
          :
          <Button
            as={Link}
            href="/login"
            rounded={"full"}
            variant="solid"
            size="lg"
            colorScheme='purple'
            color="white"
            _hover={{ textDecoration: 'none' }}
            _active={{
              transform: 'scale(0.95)',
            }}
          >
            Login
          </Button>
        }

      </Flex>
    </Flex>
  );
}

export default Header;
