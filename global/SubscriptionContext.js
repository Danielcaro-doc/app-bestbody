// src/global/SubscriptionContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosConfig';

const SubscriptionContext = createContext();

export const SubscriptionProvider = ({ children }) => {
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        const fetchSubscriptionStatus = async () => {
            try {
                const response = await axiosInstance.get('/estadoSuscripcion');
                const activeSubscription = response.data.data.some(sub => sub.estado);
                setSubscription(activeSubscription);
            } catch (error) {
                console.error('Error fetching subscription status', error);
                setSubscription(false);
            }
        };

        fetchSubscriptionStatus();
    }, []);

    return (
        <SubscriptionContext.Provider value={{ subscription, setSubscription }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => useContext(SubscriptionContext);
