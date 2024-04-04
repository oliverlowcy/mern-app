import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { useEffect } from "react";

const UserBadgeItem = ({user,handleFunction}) => {
  
  useEffect(() => {
    console.log(user)
  }, []);
  
    return (
        <Badge
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        colorScheme="purple"
        cursor="pointer"
        
        >
        <span style={{ textTransform: 'none' }}>{user.name}</span>
        <CloseIcon pl={1} onClick={handleFunction}/>
        </Badge>
  )
}

export default UserBadgeItem
