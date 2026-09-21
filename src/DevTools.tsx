import React, { useEffect, useState } from 'react';

export const Nff747DevTools = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Only render in development mode
    if (process.env.NODE_ENV === 'development') {
      setVisible(true);
      console.log('%c⚡ nff747 Infrastructure DevTools initialized.', 'color: #00ffff; font-weight: bold;');
    }
  }, []);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0, 0, 0, 0.9)',
      border: '1px solid #00ffff',
      borderRadius: '8px',
      padding: '12px',
      color: '#00ffff',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 999999,
      boxShadow: '0 0 15px rgba(0,255,255,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <strong>⚙️ nff747 DevTools</strong>
        <span style={{ color: '#00ff00' }}>Active</span>
      </div>
      <div style={{ color: '#888' }}>
        <div>Memory KV: <span style={{ color: '#fff' }}>0ms overhead</span></div>
        <div>RSC Radar: <span style={{ color: '#fff' }}>Monitoring</span></div>
        <div>WASM Lexer: <span style={{ color: '#fff' }}>Ready</span></div>
      </div>
    </div>
  );
};
