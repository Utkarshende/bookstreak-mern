// client/src/stores/authStore.js

import { create } from 'zustand';
import localforage from 'localforage'; // Use localforage for async storage

// Define the store
export const useAuthStore = create((set, get) => ({
    // State
    user: null, // Stores user object (_id, name, email, streak, etc.)
    token: null, // Stores the JWT
    isAuthenticated: false,

    // Actions

    // 1. Initial hydration: Load user/token from storage on app load
    initialize: async () => {
        const storedToken = await localforage.getItem('auth_token');
        const storedUserJSON = await localforage.getItem('auth_user'); // Get JSON string

        if (storedToken && storedUserJSON) {
            try {
                const storedUser = JSON.parse(storedUserJSON); // Parse back to object
                set({ 
                    token: storedToken, 
                    user: storedUser, 
                    isAuthenticated: true 
                });
            } catch (e) {
                // If parsing fails, log out to clear corrupted data
                console.error("Failed to parse user data from storage:", e);
                await get().logout(); 
            }
        }
    },

    // 2. Login action: Saves token and user data
    login: async (token, user) => {
        // CRITICAL FIX: Explicitly serialize the user object to a string
        const userJSON = JSON.stringify(user);
        
        await localforage.setItem('auth_token', token);
        await localforage.setItem('auth_user', userJSON);

        set({ token, user, isAuthenticated: true });
    },

    // 3. Logout action: Clears state and storage
    logout: async () => {
        await localforage.removeItem('auth_token');
        await localforage.removeItem('auth_user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    // 4. Update user data (e.g., after a streak update)
    updateUser: (newUserData) => {
        // Merge existing data with new data
        const updatedUser = { ...get().user, ...newUserData };
        
        // CRITICAL FIX: Explicitly serialize the updated user object to a string
        const userJSON = JSON.stringify(updatedUser);
        localforage.setItem('auth_user', userJSON);
        
        set({ user: updatedUser });
    }
}));