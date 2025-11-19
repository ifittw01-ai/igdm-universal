import React, { useState } from 'react';
import './AccountSwitcher.css';

function AccountSwitcher({ accounts, currentAccount, onSwitch, onAdd, onRemove }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');

  const handleAdd = () => {
    if (newAccountName.trim()) {
      onAdd(newAccountName.trim());
      setNewAccountName('');
      setShowAddDialog(false);
    }
  };

  return (
    <div className="account-switcher">
      <button 
        className="current-account"
        onClick={() => setShowMenu(!showMenu)}
      >
        <span className="account-icon">👤</span>
        {currentAccount ? currentAccount.name : '添加账户'}
        <span className="arrow">{showMenu ? '▲' : '▼'}</span>
      </button>

      {showMenu && (
        <>
          <div className="menu-backdrop" onClick={() => setShowMenu(false)} />
          <div className="account-menu">
            <div className="menu-header">账户管理</div>
            
            {accounts.length === 0 && (
              <div className="empty-state">
                <p>还没有账户</p>
                <p className="hint">点击下方添加您的第一个账户</p>
              </div>
            )}
            
            {accounts.map(account => (
              <div key={account.id} className="account-item">
                <button 
                  className={currentAccount?.id === account.id ? 'active' : ''}
                  onClick={() => {
                    onSwitch(account);
                    setShowMenu(false);
                  }}
                >
                  <span className="account-icon">👤</span>
                  <span className="account-name">{account.name}</span>
                  {currentAccount?.id === account.id && (
                    <span className="check-icon">✓</span>
                  )}
                </button>
                <button 
                  className="remove-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`确定要删除账户 "${account.name}" 吗？`)) {
                      onRemove(account.id);
                    }
                  }}
                  title="删除账户"
                >
                  ×
                </button>
              </div>
            ))}
            
            <div className="menu-divider" />
            
            <button 
              className="add-account-btn"
              onClick={() => {
                setShowAddDialog(true);
                setShowMenu(false);
              }}
            >
              <span className="plus-icon">+</span>
              添加账户
            </button>
          </div>
        </>
      )}

      {showAddDialog && (
        <div className="dialog-overlay" onClick={() => setShowAddDialog(false)}>
          <div className="dialog" onClick={e => e.stopPropagation()}>
            <h3>添加新账户</h3>
            <p className="dialog-desc">为您的 Instagram 账户设置一个名称，方便识别</p>
            <input
              type="text"
              placeholder="例如：个人账户、工作账户"
              value={newAccountName}
              onChange={e => setNewAccountName(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleAdd()}
              autoFocus
              maxLength={30}
            />
            <div className="dialog-buttons">
              <button 
                onClick={() => {
                  setShowAddDialog(false);
                  setNewAccountName('');
                }}
              >
                取消
              </button>
              <button 
                onClick={handleAdd} 
                className="primary"
                disabled={!newAccountName.trim()}
              >
                添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSwitcher;

