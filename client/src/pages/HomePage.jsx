import React from 'react';
import { useAuthStore } from '../stores/authStore';
import QuickComplete from '../components/QuickComplete';

const HomePage = () => {
    const user = useAuthStore(state => state.user);

    if (!user) {
        return <div className="loading-message">Loading user data...</div>;
    }

    return (
        <div className="home-page-container">
            <header className="page-header">
                <h1 className="header-title">
                    Welcome back, {user.name}!
                </h1>
                <p className="header-subtitle">Your mission: Keep the Streak Alive!</p>
            </header>

            <div className="stats-grid">
                <StatCard
                    title="Current Streak 🔥"
                    value={`${user.streak} days`}
                    color="red"
                />
                <StatCard
                    title="Total Pages Read 📖"
                    value={user.totalPages || 0}
                    color="green"
                />
                <StatCard
                    title="Total Points ✨"
                    value={user.points || 0}
                    color="yellow"
                />
            </div>

            <section className="section-card action-section">
                <h2 className="section-title">
                    Daily Reading Action
                </h2>
                <QuickComplete />
            </section>

    

            <style jsx>{`
                .home-page-container {
                    display: flex;
                    flex-direction: column;
                    gap: 40px; /* space-y-10 */
                }

                .loading-message {
                    text-align: center;
                    padding: 40px;
                }

                .page-header {
                    background-color: white; /* bg-white */
                    padding: 32px; /* p-8 */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-xl */
                    text-align: center; /* text-center */
                }

                .header-title {
                    font-size: 36px; /* text-4xl */
                    font-weight: 800; /* font-extrabold */
                    color: #4338ca; /* text-indigo-700 */
                    margin: 0;
                }

                .header-subtitle {
                    margin-top: 8px; /* mt-2 */
                    font-size: 18px; /* text-lg */
                    color: #6b7280; /* text-gray-500 */
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 24px; /* gap-6 */
                }

                @media (min-width: 768px) {
                    .stats-grid {
                        grid-template-columns: repeat(3, 1fr); /* md:grid-cols-3 */
                    }
                }

                .section-card {
                    background-color: white; /* bg-white */
                    padding: 24px; /* p-6 */
                    border-radius: 8px; /* rounded-lg */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); /* shadow-md */
                }

                .action-section {
                    text-align: center;
                }

                .section-title {
                    font-size: 24px; /* text-2xl */
                    font-weight: 600; /* font-semibold */
                    color: #1f2937; /* text-gray-800 */
                    margin-bottom: 16px; /* mb-4 */
                    margin-top: 0;
                }

                .reading-placeholder-text {
                    color: #6b7280; /* text-gray-500 */
                }
            `}</style>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className="stat-card">
        <h3 className="stat-title">{title}</h3>
        <p className={`stat-value ${color}`}>{value}</p>

        <style jsx>{`
            .stat-card {
                background-color: white; /* bg-white */
                padding: 24px; /* p-6 */
                border-radius: 8px; /* rounded-lg */
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1); /* shadow-md */
                border-left: 4px solid #6366f1; /* border-l-4 border-indigo-500 */
            }

            .stat-title {
                font-size: 18px; /* text-lg */
                font-weight: 500; /* font-medium */
                color: #6b7280; /* text-gray-500 */
                margin-top: 0;
                margin-bottom: 0;
            }

            .stat-value {
                margin-top: 4px; /* mt-1 */
                font-size: 48px; /* text-5xl */
                font-weight: bold; /* font-bold */
                line-height: 1;
            }

            .stat-value.red {
                color: #dc2626; /* text-red-600 */
            }

            .stat-value.green {
                color: #059669; /* text-green-600 */
            }

            .stat-value.yellow {
                color: #ca8a04; /* text-yellow-600 */
            }
        `}</style>
    </div>
);

export default HomePage;