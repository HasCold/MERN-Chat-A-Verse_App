import React, {useContext} from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,Button,Text,ListItem,OrderedList,Link    
} from '@chakra-ui/react';
import { ChatContext } from '../Context/ChatProvider';


const InstructionModal = () => {
  const {email} = useContext(ChatContext);

  const OverlayTwo = () => (
    <ModalOverlay
      // bg='none'
      bg= "rgb(232,230,238, 0.5)"
      backdropFilter='auto'
      backdropInvert='100%'
      backdropBlur='2px'
    />
  )

  const { isOpen, onOpen, onClose } = useDisclosure({ defaultIsOpen: true }); // set defaultIsOpen to true to show modal on initial render
  const [overlay, setOverlay] = React.useState(<OverlayTwo />);

  return (
    <>
      <Button
        ml='4'
        width="70%"
        colorScheme = "red"
        fontWeight = "bold"
        fontSize = "17px"
        onClick={() => {
          setOverlay(<OverlayTwo />)
          onOpen()
        }}
      >
        Instructions
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        {overlay}
        <ModalContent>
          <ModalHeader ml="6rem">Access to the Token</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
            <OrderedList spacing={3}>
            <ListItem>
            {`After sending reset password link to your ${email}.`}
            </ListItem>
            <ListItem>
            Go to <Link>https://mailtrap.io</Link> 
            </ListItem>
            <ListItem>Here you can login from the developer account.</ListItem>
            <ListItem fontWeight= "bold">Email : acrypt351645@gmail.com</ListItem>
            <ListItem fontWeight= "bold">Password : testingforyou</ListItem>
            <ListItem>Now after successful login then go to the email testing section</ListItem>
            <ListItem>There is a Project named MERN Chat-A-Verse App, Click on it.</ListItem>
            <ListItem>There you can find your email and then go to Text header</ListItem>
            <ListItem>There is a url like this <Link>http://localhost:3000/resetpassword/token</Link></ListItem>
            <ListItem>After copy the token from the end of a url, you can successfully reset your password again</ListItem>

          </OrderedList>
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default InstructionModal