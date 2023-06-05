import React, { useState } from 'react';
import {
  Input,
  Button,
  Box,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Grid,
  Textarea
} from '@chakra-ui/react';

export const TaskChat = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    const [fields, setFields] = useState([]);

    const [inputText, setInputText] = useState('');

    var messages = [{role: 'system', content: 'You are a helpful assistant.'}];

    const addTextField = () => {
      setFields(prevFields => [...prevFields, inputText]);
      sendChatRequest(inputText);
      setInputText('');
    };

    const handleInputChange = (event) => {
      setInputText(event.target.value);
    };

    async function sendChatRequest(text) {
      //var resp = "";
      const userMessage = { role: 'user', content: inputText };
      messages.push(userMessage)
      
      Meteor.call('sendChatGPTRequest', messages, (error, result) => {
        if (error) {
          console.error('ChatGPT API request error:', error);
          setFields(prevFields => [...prevFields, error]);
        } else {
          // Process the response
          messages.push({ role: 'assistant', content: result })
          setFields(prevFields => [...prevFields, result]);
        }
      });
      }
  
    return (
      <>

       <Grid container>
       <Grid item sm={6}>
       <Box display="flex" justifyContent="flex-end">
       <Button ref={btnRef} colorScheme='teal' onClick={onOpen} >
            Assistent
         </Button>
       </Box>
       </Grid>
       </Grid>

        <Drawer
          isOpen={isOpen}
          placement='right'
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Assistent</DrawerHeader>
  
            <DrawerBody>
            {fields.map((field, index) => (
               <Textarea isDisabled key={index} type="text" value={field} readOnly style={{ cursor: "default" }}/>
            ))}
            </DrawerBody>
  
            <DrawerFooter>
              <Input id="message"
                     name="message"
                     placeholder='Type here...'
                     type="text"
                     value={inputText}
                     onChange={handleInputChange}
                     onKeyPress={e=> {
                        if (e.key === 'Enter') {
                            addTextField();
                        }
                     }} />
              <Button onClick={addTextField} colorScheme='blue'>Send</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    )
};
  