import { Box, Button, Menu, MenuButton, Text, Tooltip,MenuItem,MenuDivider, DrawerOverlay, DrawerContent, DrawerHeader, Spinner} from '@chakra-ui/react';
import {MenuList} from '@chakra-ui/menu';
import React,{useState} from 'react'
import {BellIcon,ChevronDownIcon} from '@chakra-ui/icons'
import { Avatar } from "@chakra-ui/avatar";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Drawer,
  DrawerBody,

} from "@chakra-ui/modal";

import {Input} from "@chakra-ui/input"
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "../ChatLoading"
import UserListItem from '../userAvatar/UserListItem';


const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const {user,setSelectedChat,chats,setChats,selectedChat} = ChatState();
    const history = useHistory()
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const logoutHandler = () =>{
        localStorage.removeItem("userInfo");
        history.push("/")
    }


    const accessChat = async (userId) => {
        console.log(userId);

        try {
        setLoadingChat(true);
        const config = {
            headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
            },
        };
        const { data } = await axios.post(`http://localhost:5000/api/chat`, { userId }, config);

        if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
        //COMMENTX basically theres two possiblity and that is if theres pre-existing 1-1 chat with that fella and other possibility
        // is if it doesnt exist in which case, the await above will create it(see backend code) but either ways the await will return a 1-1 chat
        //and thus we have to do a check if context api "chats" have or not.
        setSelectedChat(data);
        console.log("Oliver",selectedChat)
        setLoadingChat(false);
        onClose();
        } catch (error) {
        toast({
            title: "Error fetching the chat",
            description: error.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
        });
        }
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);

            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };
            //COMMENTX we need this config to have authorization because in the backend, it is protected by the protect middleware(SEE AUTH MIDDLEWARE)
            const { data } = await axios.get(`http://localhost:5000/api/user?search=${search}`, config);
            console.log("data",data)
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };
  
    return (
        <>
            <Box display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
                <Tooltip label = "Search Users to chat" hasArrow placement="bottom-end">
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fa fa-search" aria-hidden="true"></i>
                        <Text display = {{base:"none",md:"flex"}} px = "4">Search</Text>
                        
                    </Button>
                </Tooltip>

                <Text fontSize="2xl" fontFamily="Work sans">
                    Hello
                </Text>
                <div>
                    <Menu>
                        <MenuButton p={1}>
                            <BellIcon fontSize="2xl" />
                        </MenuButton>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                        <Avatar
                            size="sm"
                            cursor="pointer"
                            name={user.name}
                            src={user.pic}
                        />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user = {user}>
                                <MenuItem >My Profile</MenuItem>
                            </ProfileModal>
                        
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement = 'left' onClose={onClose} isOpen = {isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                        <Input
                                        placeholder="Search by name or email"
                                        mr={2}
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                        <Button onClick = {handleSearch}>Go</Button>
                        </Box>
                        {loading? (<ChatLoading/>):searchResult?.map((user) => (
                            <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => accessChat(user._id)}
                            />
                        ))}
                        {loadingChat && <Spinner ml="auto" d="flex" />}
                        
                    </DrawerBody>
                </DrawerContent>
                
            </Drawer>
            
        </>
    )
}

export default SideDrawer
