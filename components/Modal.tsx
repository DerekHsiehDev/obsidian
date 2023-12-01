import { useState } from 'react';

const Modal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <button onClick={openModal}>Open Modal</button>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center">
          <button onClick={closeModal}>Close Modal</button>
          {children}
        </div>
      )}
    </>
  );
};

export default Modal;
