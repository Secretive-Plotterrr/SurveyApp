import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const currentYear = new Date().getFullYear(); // Get current year dynamically

  // Trigger fade-in animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <footer
      className="bg-blue-500 text-white py-4 text-center transition-opacity duration-500 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <p>&copy; {currentYear} KnowYou Survey App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;