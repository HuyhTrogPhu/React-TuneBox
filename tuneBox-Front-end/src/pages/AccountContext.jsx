import React, { createContext, useState } from 'react';

// Tạo context
export const AccountContext = createContext();

// Cung cấp context cho các component con
export const AccountProvider = ({ children }) => {
  const [isAccountBanned, setIsAccountBanned] = useState(false);

  return (
    <AccountContext.Provider value={{ isAccountBanned, setIsAccountBanned }}>
      {children}
    </AccountContext.Provider>
  );
};
