import { withIronSessionSsr } from 'iron-session/next';
import { plaidClient, sessionOptions } from '../lib/plaid';

export default function Dashboard({ balance }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Balance (USD)</th>
          <th>Subtype</th>
        </tr>
      </thead>
      <tbody>
        {balance.accounts.map((account, i) => (
          <tr key={i}>
            <td>{account.name}</td>
            <td>{account.balances.available}</td>
            <td>{account.subtype}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    const access_token = req.session.access_token;

    if (!access_token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const response = await plaidClient.accountsBalanceGet({ access_token });
    return {
      props: {
        balance: response.data,
      },
    };
  },
  sessionOptions
);
