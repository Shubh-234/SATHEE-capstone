import { Box, Text } from "@chakra-ui/react";


export default function Footer() {

    return (
        <Box as="footer" py={8} bg="black" textAlign="center" color={'whitesmoke'}>
            <Text>&copy; {new Date().getFullYear()} Sathee. All rights reserved.</Text>
        </Box>
    )
}