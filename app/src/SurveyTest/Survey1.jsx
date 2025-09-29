import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Survey1 = () => {
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    yearLevel: '',
    socioEconomic: ''
  });
  const [showModal, setShowModal] = useState(false); // State for invalid form modal
  const [showSalaryWarningModal, setShowSalaryWarningModal] = useState(false); // State for salary warning modal
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'socioEconomic' && value > 50000) {
      setShowSalaryWarningModal(true); // Show warning modal if salary exceeds 50,000
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { age, sex, yearLevel, socioEconomic } = formData;
    if (
      age &&
      sex &&
      yearLevel &&
      socioEconomic &&
      !isNaN(socioEconomic) &&
      socioEconomic >= 0 &&
      socioEconomic <= 50000
    ) {
      navigate('/survey2'); // Directly navigate to Survey2 page
    } else {
      setShowModal(true); // Show modal for invalid input
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the invalid form modal
  };

  const closeSalaryWarningModal = () => {
    setShowSalaryWarningModal(false); // Close the salary warning modal
  };

  const handleBack = () => {
    navigate('/#home'); // Navigate to #home
  };

  // Automatically close salary warning modal after 3 seconds
  useEffect(() => {
    if (showSalaryWarningModal) {
      const timer = setTimeout(() => {
        setShowSalaryWarningModal(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSalaryWarningModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0F8FF] px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-lg sm:max-w-2xl transform transition-all ease-out duration-500 hover:shadow-2xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center text-black mb-4 sm:mb-6">
          Demographic Information
        </h2>
        <p className="text-center text-gray-500 mb-6 sm:mb-8 text-base sm:text-lg">
          Please fill out the questions below.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-black">
              a. Age
            </label>
            <select
              name="age"
              id="age"
              value={formData.age}
              onChange={handleChange}
              className="mt-2 block w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base"
              required
            >
              <option value="" disabled>
                Select your age
              </option>
              {['17-19 years old', '20-22 years old', '23 years old and above'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sex" className="block text-sm font-semibold text-black">
              b. Sex
            </label>
            <select
              name="sex"
              id="sex"
              value={formData.sex}
              onChange={handleChange}
              className="mt-2 block w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base"
              required
            >
              <option value="" disabled>
                Select your sex
              </option>
              {['Male', 'Female', 'Prefer not to say'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="yearLevel" className="block text-sm font-semibold text-black">
              c. Year Level
            </label>
            <select
              name="yearLevel"
              id="yearLevel"
              value={formData.yearLevel}
              onChange={handleChange}
              className="mt-2 block w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base"
              required
            >
              <option value="" disabled>
                Select your year level
              </option>
              {['1st Year', '2nd Year', '3rd Year', '4th Year'].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="socioEconomic" className="block text-sm font-semibold text-black">
              d. Socio-Economic Status (Family Monthly Income)
            </label>
            <input
              type="number"
              name="socioEconomic"
              id="socioEconomic"
              value={formData.socioEconomic}
              onChange={handleChange}
              className="mt-2 block w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-gray-50 text-black placeholder-gray-400 text-sm sm:text-base"
              placeholder="Enter monthly income (max 50,000)"
              min="0"
              max="50000"
              required
            />
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={handleBack}
              className="w-1/3 bg-gray-400 text-white p-3 rounded-lg hover:bg-gray-500 transition-colors font-semibold text-sm sm:text-base transform hover:scale-105"
            >
              Back
            </button>
            <button
              type="submit"
              className="w-1/3 bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold text-sm sm:text-base transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      {/* Modal for invalid form input */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300 scale-100 opacity-100">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-red-500 mb-4">
              Incomplete Form
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              Please fill in all fields with valid values. Monthly income must be a non-negative number and not exceed 50,000.
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeModal}
                className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for salary exceeding 50,000 */}
      {showSalaryWarningModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full transform transition-all ease-out duration-300 scale-100 opacity-100">
            <h3 className="text-xl sm:text-2xl font-bold text-center text-red-500 mb-4">
              Invalid Monthly Income
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm sm:text-base">
              Monthly income must not exceed 50,000. Please enter a valid value.
            </p>
            <div className="flex justify-center">
              <button
                onClick={closeSalaryWarningModal}
                className="bg-blue-400 text-white p-3 rounded-lg hover:bg-blue-500 transition-colors font-semibold text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Survey1;