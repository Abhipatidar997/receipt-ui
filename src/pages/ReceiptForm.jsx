import React, { useState, useEffect, useRef } from "react";
import customers from '../assets/customers.json';


function ReceiptForm() {
  const [customerName, setCustomerName] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // yyyy-mm-dd format
  
  });

  const [amount, setAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const suggestionsRef = useRef();

  useEffect(() => {
    // Close suggestions if clicked outside suggestions box
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onCustomerInputChange = (e) => {
    const val = e.target.value;
    setCustomerName(val);

    if (val.length > 0) {
      const filtered = customers.filter((c) =>
        c.name.toLowerCase().includes(val.toLowerCase())
      );
      setFilteredCustomers(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      setFilteredCustomers([]);
    }
  };

  const onSelectSuggestion = (name) => {
    setCustomerName(name);
    setShowSuggestions(false);
    setFilteredCustomers([]);
  };

  const generateWhatsAppMessage = () => {
    // Basic validation
    if (!customerName.trim()) {
      alert("Please enter Customer Name.");
      return;
    }
    if (!date) {
      alert("Please select Date of Transaction.");
      return;
    }
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("Please enter a valid Amount.");
      return;
    }
    if (!mobileNumber.trim()) {
      alert("Please enter Mobile Number.");
      return;
    }
    // Sanitize mobile number (remove spaces and dashes)
    const sanitizedNumber = mobileNumber.replace(/\D/g, "");

    // WhatsApp requires country code without +
    const waNumber = sanitizedNumber.startsWith("91")
      ? sanitizedNumber
      : "91" + sanitizedNumber; 

    //  %0A for new lines
    const url = `https://wa.me/${waNumber}?text=*Receipt Details*%0A*Customer Name:* ${encodeURIComponent(customerName)}%0A*Date of Transaction:* ${encodeURIComponent(date)}%0A*Amount:* ₹${encodeURIComponent(amount)}%0A*Mobile Number:* ${encodeURIComponent(mobileNumber)}%0A*Remarks:* ${encodeURIComponent(remarks || "N/A")}`;
    window.open(url, "_blank");
  };

  return (
    <div className="shadow-2xl flex items-center justify-center   bg-gray-50">
      <div className="w-full max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-8 lg:p-10 relative">
        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 tracking-tight">
            Receipt Details
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            generateWhatsAppMessage();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          autoComplete="off"
        >
          {/* Customer Name */}
          <div className="relative" ref={suggestionsRef}>
            <label className="absolute -top-3 left-3.5 bg-white px-1 text-sm font-medium text-slate-500">
              Customer Name
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={customerName}
              onChange={onCustomerInputChange}
              onFocus={() => {
                if (customerName.length > 0) setShowSuggestions(true);
              }}
              className="w-full mt-1 p-3 pl-10 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
            />
            {/* Suggestions Dropdown */}
            {showSuggestions && filteredCustomers.length > 0 && (
              <ul className="absolute z-50 top-[60px] left-0 right-0 max-h-48 overflow-y-auto border border-slate-200 bg-white rounded-xl shadow-lg">
                {filteredCustomers.map((cust, idx) => (
                  <li
                    key={idx}
                    onClick={() => onSelectSuggestion(cust.name)}
                    className="cursor-pointer px-4 py-2 hover:bg-emerald-100/70"
                  >
                    {cust.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date */}
          <div className="relative">
            <label className="absolute -top-3 left-3.5 bg-white px-1 text-sm font-medium text-slate-500">
              Date of Transaction
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
              </svg>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full mt-1 p-3 pl-10 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Amount */}
          <div className="relative">
            <label className="absolute -top-3 left-3.5 bg-white px-1 text-sm font-medium text-slate-500">
              Amount
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full mt-1 p-3 pl-10 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Mobile Number */}
          <div className="relative">
            <label className="absolute -top-3 left-3.5 bg-white px-1 text-sm font-medium text-slate-500">
              Mobile Number
            </label>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-slate-400"
              >
                <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                <path d="M12 18h.01" />
              </svg>
            </div>
            <input
              type="tel"
              placeholder="+91 XXXXXXXXXX"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="w-full mt-1 p-3 pl-10 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Remarks */}
          <div className="md:col-span-2 relative">
            <label className="absolute -top-3 left-3.5 bg-white px-1 text-sm font-medium text-slate-500">
              Remarks
            </label>
            <textarea
              placeholder="Add remarks here..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full mt-1 p-3 border-2 border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none"
            ></textarea>
          </div>

          {/* Button full width */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-emerald-600 transition-all duration-300 shadow-lg shadow-emerald-500/30"
            >
              Generate Receipt & Send via WhatsApp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReceiptForm;
