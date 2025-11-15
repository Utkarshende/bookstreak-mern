import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import api from '../utils/api';
import { useAuthStore } from '../stores/authStore';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login); 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await api.post('/api/auth/register', formData);
            
            const { token, user } = response.data;
            login(token, user); 
            
            navigate('/');
            
        } catch (err) {
            const errorMessage = err.response?.data?.error || 'Registration failed. Please check your network.';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const styles = {
        container: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f9fafb',
            padding: '20px',
            boxSizing: 'border-box',
        },
        card: {
            width: '100%',
            maxWidth: '448px',
            padding: '40px',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px', 
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        title: {
            fontSize: '1.875rem',
            fontWeight: '700',
            textAlign: 'center',
            color: '#4f46e5',
        },
        form: {
            marginTop: '32px', 
            display: 'flex',
            flexDirection: 'column',
            gap: '24px', 
        },
        input: {
            width: '100%',
            padding: '10px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
        },
        error: {
            fontSize: '0.875rem',
            color: '#ef4444', 
        },
        buttonBase: {
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '10px 16px',
            border: '1px solid transparent',
            borderRadius: '6px',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonPrimary: {
            backgroundColor: '#4f46e5',
        },
        buttonLoading: {
            backgroundColor: '#818cf8',
            cursor: 'not-allowed',
        },
        linkContainer: {
            fontSize: '0.875rem',
            textAlign: 'center',
            color: '#4b5563',
        },
        link: {
            fontWeight: '500',
            color: '#4f46e5',
            textDecoration: 'none',
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>
                    Join BookStreak
                </h2>
                <form style={styles.form} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Full Name"
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        required
                        placeholder="Email Address"
                        onChange={handleChange}
                        style={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        required
                        placeholder="Password (min 6 chars)"
                        onChange={handleChange}
                        style={styles.input}
                    />
                    
                    {error && <p style={styles.error}>{error}</p>}
                    
                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...styles.buttonBase,
                            ...(isLoading ? styles.buttonLoading : styles.buttonPrimary),
                        }}
                    >
                        {isLoading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                <div style={styles.linkContainer}>
                    <p>
                        Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;