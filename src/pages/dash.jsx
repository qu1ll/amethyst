import { withIronSessionSsr } from 'iron-session/next';
import { plaidClient, sessionOptions } from '../lib/plaid';

export default function Dashboard({ balance, transactions }) {
  return (
    <div>
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
      <h2>Transactions</h2>
      {transactions && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Amount (USD)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.transactions.map((transaction, i) => (
              <tr key={i}>
                <td>{transaction.date}</td>
                <td>{transaction.name}</td>
                <td>
                  {transaction.amount.toFixed(2)} {/* Format amount with 2 decimals */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
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

    // Fetch account balance
    const balanceResponse = await plaidClient.accountsBalanceGet({ access_token });

    // Fetch transactions (replace with desired options)
    const transactionsResponse = await plaidClient.transactionsGet({
      access_token,
      // Add options here (e.g., start_date, end_date, count)
      start_date: '2015-06-01', // June 1st, 2024
      end_date: '2024-07-01',
    });

    return {
      props: {
        balance: balanceResponse.data,
        transactions: transactionsResponse.data, // Add transactions data
      },
    };
  },
  sessionOptions
);
