import React from 'react';
import ReactDOM from 'react-dom';

type PopupProps = {
  isOpen: boolean;
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const Popup: React.FC<PopupProps> = ({ isOpen, title, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.title}>{title}</div>
        <div style={styles.buttons}>
          <button onClick={onConfirm} style={styles.confirmBtn}>confirm</button>
          <button onClick={onCancel} style={styles.cancelBtn}>cancel</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    fontFamily: 'WaterBrush',
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: '20vh',
    zIndex: 9999,
  },
  popup: {
    // backgroundColor: '#2774b6',
    borderRadius: '10px',
    padding: '20px',
    minWidth: '300px',
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white'
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
  },
  confirmBtn: {
    padding: '8px 16px',
     backgroundColor: 'rgba(238,228,218,.5)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  cancelBtn: {
    padding: '8px 16px',
    backgroundColor: 'rgba(238,228,218,.5)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default Popup;
