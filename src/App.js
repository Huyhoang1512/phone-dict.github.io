// App.js
import React, { useState, useRef, useEffect, useMemo, useReducer, useContext } from 'react';
import './App.css';

const ThemeContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'DELETE_CONTACT':
      return { ...state, contacts: state.contacts.filter(contact => contact.id !== action.payload) };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        )
      };
    case 'TOGGLE_THEME':
      return { ...state, isDarkMode: !state.isDarkMode };
    default:
      return state;
  }
};

const initialContacts = [
  { id: 1, name: 'John Doe', phoneNumber: '123456789' },
  { id: 2, name: 'Jane Smith', phoneNumber: '987654321' }
];

const ContactManager = () => {
  const [state, dispatch] = useReducer(reducer, { contacts: initialContacts, isDarkMode: false });
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef();

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  const { contacts, isDarkMode } = state;

  const filteredContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.phoneNumber.includes(searchTerm)
    );
  }, [contacts, searchTerm]);

  const handleAddContact = () => {
    const name = prompt('Enter name:');
    const phoneNumber = prompt('Enter phone number:');
    if (name && phoneNumber) {
      dispatch({ type: 'ADD_CONTACT', payload: { id: Date.now(), name, phoneNumber } });
    }
  };

  const handleDeleteContact = (id) => {
    dispatch({ type: 'DELETE_CONTACT', payload: id });
  };

  const handleEditContact = (id) => {
    const contact = contacts.find(contact => contact.id === id);
    const newName = prompt('Enter new name:', contact.name);
    const newPhoneNumber = prompt('Enter new phone number:', contact.phoneNumber);
    if (newName !== null && newPhoneNumber !== null) {
      dispatch({ type: 'UPDATE_CONTACT', payload: { ...contact, name: newName, phoneNumber: newPhoneNumber } });
    }
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode }}>
      <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          ref={searchInputRef}
        />
        <button onClick={handleAddContact}>Add Contact</button>
        <button onClick={toggleTheme}>{isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</button>
        <ul className="contact-list">
          {filteredContacts.map(contact => (
            <li key={contact.id} className="contact-item">
              {contact.name} - {contact.phoneNumber}
              <button onClick={() => handleDeleteContact(contact.id)}>Delete</button>
              <button onClick={() => handleEditContact(contact.id)}>Edit</button>
            </li>
          ))}
        </ul>
      </div>
    </ThemeContext.Provider>
  );
};

export default ContactManager;
