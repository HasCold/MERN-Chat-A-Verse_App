import { ViewIcon } from '@chakra-ui/icons'
import { IconButton, Image, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from '@chakra-ui/react'

const ProfileModal = ({user, children}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
    {
      children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton 
        display={{ base : "flex"}}
        icon={<ViewIcon/>}
         onClick={onOpen}          
        />
      )}
      <Modal size="lg" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
          fontSize="40px"
          fontFamily="Work sans"
          display="flex"
          justifyContent="center"          
    // justify-content: longer word: horizontal alignment
    // align-items: shorter word: vertical alignment
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          >
            <Image
            borderRadius="full"
            boxSize="160px"
            fontSize="30px"
            display="flex"
            alignItems="center"
            src={user.pic} 
            alt={user.name} 

             />
             <Text
             py={3.5}
             fontSize={{base : "20px", md : "30px"}}
             fontFamily="Work sans"
             >
              Email : {user.email}
             </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal