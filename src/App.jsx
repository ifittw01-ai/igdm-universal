import React, { useState, useEffect } from 'react';
import './App.css';
import WebFrame from './components/WebFrame';
import AccountSwitcher from './components/AccountSwitcher';
import NotificationManager from './components/NotificationManager';

function App() {
  const [accounts, setAccounts] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    // 从本地存储加载账户
    const savedAccounts = localStorage.getItem('igdm_accounts');
    if (savedAccounts) {
      try {
        const parsed = JSON.parse(savedAccounts);
        setAccounts(parsed);
        if (parsed.length > 0) {
          setCurrentAccount(parsed[0]);
        }
      } catch (error) {
        console.error('Failed to load accounts:', error);
      }
    }
  }, []);

  const addAccount = (accountName) => {
    const newAccount = {
      id: Date.now(),
      name: accountName,
      addedAt: new Date().toISOString()
    };
    const updated = [...accounts, newAccount];
    setAccounts(updated);
    localStorage.setItem('igdm_accounts', JSON.stringify(updated));
    setCurrentAccount(newAccount);
  };

  const switchAccount = (account) => {
    setCurrentAccount(account);
  };

  const removeAccount = (accountId) => {
    const updated = accounts.filter(acc => acc.id !== accountId);
    setAccounts(updated);
    localStorage.setItem('igdm_accounts', JSON.stringify(updated));
    if (currentAccount?.id === accountId) {
      setCurrentAccount(updated[0] || null);
    }
  };

  return (
    <div className="app">
      <div className="header">
        <div className="header-left">
          <h1>IGDM Universal</h1>
          <span className="version">v1.0.0</span>
        </div>
        <AccountSwitcher
          accounts={accounts}
          currentAccount={currentAccount}
          onSwitch={switchAccount}
          onAdd={addAccount}
          onRemove={removeAccount}
        />
      </div>
      
      <WebFrame account={currentAccount} />
      
      <NotificationManager />
    </div>
  );
}

export default App;
