import React, { useState, useEffect } from 'react';
import { withIronSessionSsr } from 'iron-session/next';
import { plaidClient, sessionOptions } from '../lib/plaid';

export default function Dashboard({ balance, transactions }) {
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useEffect(() => {
    if (transactions && transactions.transactions) {
      const transactionsData = transactions.transactions.map((transaction) => ({
        ...transaction,
        category: transaction.category ? transaction.category[0] : 'Uncategorized', // Assuming first category for now
      }));

      const incomeTransactions = transactionsData.filter(
        (transaction) => transaction.amount > 0
      );
      const expenseTransactions = transactionsData.filter(
        (transaction) => transaction.amount < 0
      );

      setIncome(incomeTransactions.reduce((acc, curr) => acc + curr.amount, 0));
      setExpenses(Math.abs(expenseTransactions.reduce((acc, curr) => acc + curr.amount, 0)));
    }
  }, [transactions]);

  const budgetRemaining = 5000 - expenses;
  const expensePercentage = Math.min(expenses / 5000, 1) * 100; // Calculate expense percentage (capped at 100%)

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
      <h2>Budgets</h2>
      <div className="budgets flex justify-between mb-4">
        <div className="budget w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
          <h3>Income</h3>
          <p className="text-xl font-bold">{`$${income.toFixed(2)}`}</p>
        </div>
        <div className="budget w-full px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
          <h3>Expenses</h3>
          <p className="text-xl font-bold">{`$${expenses.toFixed(2)}`}</p>
          <div className="progress-bar mt-2 h-4 bg-gray-200 rounded-lg overflow-hidden">  <div className={`progress bg-red-500 h-full rounded-lg w-[${expensePercentage}%]`}></div>
          </div>
        </div>
      </div>
      <div>
        <p>Budget Remaining: ${budgetRemaining.toFixed(2)} (out of $5,000)</p>
      </div>
      {transactions && (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Name</th>
              <th>Amount (USD)</th>
              <th>Category</th>
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
                <td>{transaction.category}</td>
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
