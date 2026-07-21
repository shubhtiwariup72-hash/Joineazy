import React from 'react';

const Loader = () => {
    return (
        <div style={containerStyle}>
            {/* Circular Spinner */}
            <div style={spinnerStyle}></div>
            <style>{keyframes}</style>
            <p style={textStyle}>Loading...</p>
        </div>
    )
}

const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '300px',
    width: '100%',
    padding: '40px',
    boxSizing: 'border-box'
};

const spinnerStyle = {
    width: '44px',
    height: '44px',
    border: '3px solid rgba(31, 122, 108, 0.15)',
    borderTop: '3px solid #1f7a6c',
    borderRadius: '50%',
    animation: 'spin 0.85s linear infinite'
};

const textStyle = {
    marginTop: '16px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'rgba(18, 38, 42, 0.65)',
    fontFamily: "'Outfit', sans-serif",
    letterSpacing: '0.5px'
};

const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;


export default Loader;