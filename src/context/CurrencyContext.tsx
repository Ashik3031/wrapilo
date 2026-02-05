'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'AED';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    formatPrice: (price: number) => string;
    convertPrice: (price: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Exchange rates (mocked for now, in real app could be fetched)
// Base currency: USD
const RATES: Record<CurrencyCode, number> = {
    USD: 1,
    INR: 83.5,
    EUR: 0.92,
    AED: 3.67,
};

const SYMBOLS: Record<CurrencyCode, string> = {
    USD: '$',
    INR: '₹',
    EUR: '€',
    AED: 'AED ', // AED usually prefix
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>('USD');

    // Load from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wrapilo_currency') as CurrencyCode;
        if (saved && RATES[saved]) {
            setCurrency(saved);
        }
    }, []);

    const handleSetCurrency = (c: CurrencyCode) => {
        setCurrency(c);
        localStorage.setItem('wrapilo_currency', c);
    };

    const convertPrice = (price: number) => {
        return price * RATES[currency];
    };

    const formatPrice = (price: number) => {
        const converted = convertPrice(price);
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: currency === 'INR' ? 0 : 2,
        }).format(converted);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, formatPrice, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
