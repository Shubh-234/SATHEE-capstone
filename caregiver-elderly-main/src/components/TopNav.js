import {
    Box,
    Flex,
    Avatar,
    Text,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
  } from "@chakra-ui/react";
  import { MoonIcon, SunIcon } from "@chakra-ui/icons";
  import { useContext, useEffect } from "react";
  import generateNumericReferenceNumber from "@/lib/generateReference";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
import { UserContext } from "@/store/context/UserContext";
import { signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import Logo from "./logo";
import { theme } from "@/data/data";

const TopNav = ({ username, role, reference, onOpenPreferences, onOpenReminder }) => {
    const pathname = usePathname();
    // const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {state : UserState} = useContext(UserContext)

    async function handleLogout(){
      signOut(auth)
    }
    return (
      <>
        <Box bg={'purple.800'} px={4}>
          <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
            <Logo color={'white'}/>
  
            <Flex alignItems={"center"}>
              <Stack direction={"row"} spacing={7}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={"full"}
                    variant={"link"}
                    cursor={"pointer"}
                    minW={0}
                  >

                  {UserState.value.data?.dp ? <Avatar bg={"gray.300"} size={"md"} src={UserState.value.data?.dp} /> :   <Avatar bg={"gray.300"} size={"md"} name={username}  />}
                  </MenuButton>
                  <MenuList alignItems={"center"}>
                    <br />
                    <Center>
                    {UserState.value.data?.dp ? <Avatar bg={"gray.300"} size={"2xl"} src={UserState.value.data?.dp} /> :   <Avatar bg={"gray.300"} size={"2xl"} name={username}  />}
                    </Center>
                    <br />
                    <Center>
                      <p>{username}</p>
                    </Center>
                    <Center>
                      <Text fontSize={'12px'}>{reference}</Text>
                    </Center>
                    <br />
                    <MenuDivider />
                    {pathname.includes("profile") ? (
                      <MenuItem as={Link} href={`/${role}`}>
                        Dashboard
                      </MenuItem>
                    ) : (
                      <MenuItem as={Link} href={"/profile"}>
                        Profile
                      </MenuItem>
                    )}
                    {UserState.value.data?.role === 'elderly' &&
                    <>
                     <MenuItem onClick={onOpenPreferences}>Preferences</MenuItem>
                     <MenuItem onClick={onOpenReminder}>Reminders</MenuItem>
                    </>
                    
                    }
                    <MenuItem onClick={()=>{
                      handleLogout()
                    }}>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
        </Box>
      </>
    );
  };

  export default TopNav