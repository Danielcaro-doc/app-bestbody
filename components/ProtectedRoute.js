// src/components/ProtectedRoute.js
import React, { useEffect, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSubscription } from '../global/SubscriptionContext';

const ProtectedRoute = ({ children }) => {
    const { subscription } = useSubscription();
    const navigation = useNavigation();

    useEffect(() => {
        if (subscription === false) {
            navigation.navigate('PlanExpired');
        }
    }, [subscription, navigation]);

    return subscription ? children : null;
};

export default ProtectedRoute;
