import React, { createContext, useContext } from 'react';

const CollapsedContext = createContext<CollapsedContextProps | undefined>(
  undefined
);

export const CollapsedProvider: React.FC<{
  children: React.ReactNode;
  value: CollapsedContextProps;
}> = ({ children, value }) => {
  return (
    <CollapsedContext.Provider value={value}>
      {children}
    </CollapsedContext.Provider>
  );
};

export const useCollapsed = () => {
  console.log("hwer we are ")
  const context = useContext(CollapsedContext);
  if (!context) {
    throw new Error('useCollapsed must be used within a CollapsedProvider');
  }
  return context;
};
