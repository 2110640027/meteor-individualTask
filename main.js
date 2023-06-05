import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import './db/migrations';
import './tasks/tasks.resolvers';
import './tasks/tasks.publications';
import { HTTP } from 'meteor/http';

/**
 * This is the server-side entry point
 */
const sendChatGPTRequest = (messages) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const apiKey = Meteor.settings.private.SECRET_KEY; // Replace with your actual API key

  try {
    const response = HTTP.post(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        model: 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: 50, // Adjust the max_tokens parameter as needed
        temperature: 0.7 // Adjust the temperature parameter as needed
      }
    });

    if (response.statusCode === 200) {
      // Process the response from the API
      const { choices } = response.data;
      const completion = choices[0].message.content.trim();

      return completion;
    } else {
      throw new Error(`ChatGPT API request failed with status code ${response.statusCode}`);
    }
  } catch (error) {
    throw new Error(`ChatGPT API request failed: ${error.message}`);
  }
};

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  Meteor.methods({
    sendChatGPTRequest: sendChatGPTRequest
  });
});


/*   Meteor.methods({
    'getSecretKey': function() {
      // Retrieve the secret key from your environment or configuration file
      const secretKey = Meteor.settings.private.SECRET_KEY;
      return secretKey;
    },
  });*/