import { Account, Client } from 'react-native-appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('6737282100305ba6f174')
    .setPlatform('com.looop.Looop')

    const account = new Account(client);

    export {
        client,
        account
    }
