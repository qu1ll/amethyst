import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const plaidClient = new PlaidApi(
  new Configuration({
    basePath: PlaidEnvironments[process.env.PLAID_ENV],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
        'PLAID-SECRET': process.env.PLAID_SECRET,
        'Plaid-Version': '2020-09-14',
      },
    },
  })
);

async function transactionsGet(accessToken, options = {}) {
  const response = await plaidClient.transactionsGet({
    access_token: accessToken,
    ...options, // Add optional arguments here (e.g., start_date, end_date)
  });
  return response.data;
}


const sessionOptions = {
  cookieName: 'myapp_cookiename',
  password: 'complex_password_at_least_32_characters_long',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export { plaidClient, transactionsGet, sessionOptions };
