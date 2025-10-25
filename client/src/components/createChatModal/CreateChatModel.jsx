import { useState } from 'react';
import './createChatModel.css';

const CreateChatModal = ({ onClose, onSave }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSave = () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please provide both first and last name');
      return;
    }
    onSave({ firstName: firstName.trim(), lastName: lastName.trim() });
    setFirstName('');
    setLastName('');
  };

  return (
    <div className="modal">
      <div className="modalContent">
        <h2>Create New Chat</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={handleSave}>Create</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default CreateChatModal;
