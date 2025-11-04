// src/components/SubscriptionChecker.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useSubscription } from '../global/SubscriptionContext';
import { navigate } from '../navigation/RootNavigation';

const SubscriptionChecker = ({ children }) => {
    const { subscription } = useSubscription();

    if (subscription === null) {
        // Still loading subscription status
        return <ActivityIndicator size="large" color="#00ff00" />;
    }

    if (subscription === false) {
        navigate('PlanExpired');
        return null;
    }

    return children;
};

export default SubscriptionChecker;
