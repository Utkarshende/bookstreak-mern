
import { create } from 'zustand';
import localforage from 'localforage'; 

export const useAuthStore = create((set, get) => ({
    user: null, 
    token: null, 
    isAuthenticated: false,

   
    initialize: async () => {
        const storedToken = await localforage.getItem('auth_token');
        const storedUserJSON = await localforage.getItem('auth_user'); 

        if (storedToken && storedUserJSON) {
            try {
                const storedUser = JSON.parse(storedUserJSON); 
                set({ 
                    token: storedToken, 
                    user: storedUser, 
                    isAuthenticated: true 
                });
            } catch (e) {
              
                console.error("Failed to parse user data from storage:", e);
                await get().logout(); 
            }
        }
    },

    
    login: async (token, user) => {
       
        const userJSON = JSON.stringify(user);
        
        await localforage.setItem('auth_token', token);
        await localforage.setItem('auth_user', userJSON);

        set({ token, user, isAuthenticated: true });
    },

   
    logout: async () => {
        await localforage.removeItem('auth_token');
        await localforage.removeItem('auth_user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    
    updateUser: (newUserData) => {
        
        const updatedUser = { ...get().user, ...newUserData };
        const userJSON = JSON.stringify(updatedUser);
        localforage.setItem('auth_user', userJSON);
        
        set({ user: updatedUser });
    }
}));