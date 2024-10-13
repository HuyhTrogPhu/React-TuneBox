import React, { createContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';

export const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const contextValue = useMemo(() => ({
    followerCount,
    setFollowerCount,
    followingCount,
    setFollowingCount
  }), [followerCount, followingCount]);

  return (
    <FollowContext.Provider value={contextValue}>
      {children}
    </FollowContext.Provider>
  );
};

FollowProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
