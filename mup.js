module.exports = {
  servers: {
    one: {
      host: '<your-ip>',  //EC2 IP address
      username: 'ubuntu',  //username of every ubuntu instance
      pem: '<PEM file location>' //key (also used for ssh)
    }
  },

  app: {
    name: '<yourname>',  //name of your application
    path: '../.', //location

    servers: {
      one: {},
    },

    buildOptions: {
      serverOnly: true,
    },

    env: {
      ROOT_URL: 'https://<your domainname>',  //enter your created DNS record as URL
                 //             user      :password @DB-Name .connection string
      MONGO_URL: '<your DB connection string>', //connection to the Atlas MongoDB
    },

    docker: {
      image: 'zodern/meteor:root',
    },

    // Show progress bar while uploading bundle to server
    // You might need to disable it on CI servers
    enableUploadProgressBar: true
  },

  // (Optional)
  // Use the proxy to setup ssl or to route requests to the correct
  // app when there are several apps
  proxy: {
    domains: '<your domainname>', //your domain name
  
    ssl: {
        // Enable Let's Encrypt
        letsEncryptEmail: '<your email address>' //your email-address for lets encrypt
      }
    }
};
