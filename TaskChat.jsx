import React, { useState } from 'react';
import {
  FormControl,
  Input,
  Button,
  FormErrorMessage,
  Box,
  InputGroup,
  InputRightElement,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Grid,
  GridItem,
  Stack,
  Textarea
} from '@chakra-ui/react';
import { ErrorStatus } from '../lib/ErrorStatus';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { insertTask } from '../../api/tasks/tasks.mutations';
import axios from 'axios';

export const TaskChat = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    const [fields, setFields] = useState([]);

    const [inputText, setInputText] = useState('');

    const addTextField = () => {
      setFields(prevFields => [...prevFields, inputText]);
      sendChatRequest(inputText);
      setInputText('');
    };

    const handleInputChange = (event) => {
      setInputText(event.target.value);
    };

    async function sendChatRequest(text) {
      var resp = "";
      try {
          const { Configuration, OpenAIApi } = require("openai");
          const configuration = new Configuration({
            apiKey: "***************************",
          });
          const openai = new OpenAIApi(configuration);
          response = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0,
            messages: [
              {
                role: 'user',
                content: text,
              },
            ]
          });
          const { choices } = response.data;
          resp = choices[0].message.content;
          
          setFields(prevFields => [...prevFields, resp]);
        } catch (error) {
          console.error(error);
          console.log(typeof(error.message) + " " + error.message);
          resp = error.message;
          setFields(prevFields => [...prevFields, resp]);
          // Handle error
        } finally { 
        }
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
               <Textarea isDisabled key={index} type="text" value={field} readOnly style={{ overflow: 'hidden' }}/>
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
  