import React from 'react';

function WebFrame({ account }) {
  return (
    <div style={{ 
      flex: 1, 
      display: 'flex',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <iframe
        key={account?.id || 'default'}
        src="https://www.instagram.com/direct/inbox/"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          background: 'white'
        }}
        title="Instagram DM"
        allow="camera; microphone; geolocation; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals"
      />
      
      {account && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          background: 'rgba(0,0,0,0.75)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '500',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {account.name}
        </div>
      )}
    </div>
  );
}

export default WebFrame;

