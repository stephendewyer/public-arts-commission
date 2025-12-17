import Stripe from 'stripe';
import { STRIPESECRETAPIKey } from '$env/static/private';

// export the stripe instance
export const stripe = new Stripe(STRIPESECRETAPIKey, {
    // pin the api version
    apiVersion: '2023-10-16'
});