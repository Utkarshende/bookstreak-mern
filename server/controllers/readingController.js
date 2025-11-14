// server/controllers/readingController.js (ES MODULE CORRECTED)

import moment from 'moment'; // Import moment
import User from '../models/User.js'; // Must include .js extension
import ReadingSession from '../models/ReadingSession.js'; // Must include .js extension

// Helper function to check if two dates are the same day (in UTC for simplicity)
const isSameDay = (date1, date2) => {
    return moment(date1).startOf('day').isSame(moment(date2).startOf('day'));
};

// Helper function to check if date1 is exactly one day before date2
const isYesterday = (date1, date2) => {
    return moment(date1).startOf('day').add(1, 'day').isSame(moment(date2).startOf('day'));
};

// =========================================================================
// Reward Logic: Check Streak Milestones and Award Badges
// =========================================================================
const checkAndAwardBadges = (user, newStreak) => {
    const badgesAwarded = [];
    const BADGE_POINTS = {
        'Novice Reader': 50,
        'Consistent Reader': 100,
        'Streak Master': 250,
    };
    
    // Define the streak milestones
    const milestones = [
        { streak: 7, name: 'Novice Reader' },
        { streak: 30, name: 'Consistent Reader' },
        { streak: 100, name: 'Streak Master' }
    ];

    for (const milestone of milestones) {
        // Check if the user's NEW streak matches or surpasses the milestone AND
        if (newStreak >= milestone.streak && !user.badges.includes(milestone.name)) {
            user.badges.push(milestone.name);
            user.points += BADGE_POINTS[milestone.name]; // Add bonus points
            badgesAwarded.push(milestone.name);
        }
    }
    
    // Check total pages milestone 
    const newTotalPages = user.totalPages + 1; 
    const pageMilestone = 100;
    
    if (newTotalPages % pageMilestone === 0) {
        user.points += 50; // Award 50 bonus points every 100 pages
    }
    
    return badgesAwarded;
};


// =========================================================================
// POST /api/readings — Mark page/day completed
// =========================================================================
export const markPageCompleted = async (req, res) => { // Use named export
    // req.user is set by the authMiddleware
    const { _id: userId } = req.user; 
    const { bookId, pagesRead = 1 } = req.body;
    
    const today = new Date(); 
    // ... (rest of markPageCompleted logic remains the same)
    
    try {
        let user = req.user;
        const lastUpdate = user.streakLastUpdate;
        let pointsAwarded = 0;
        let badgesAwarded = [];

        // --- 1. Streak Update Logic ---
        
        if (lastUpdate && isSameDay(lastUpdate, today)) {
            pointsAwarded = 0; 
        } else {
            if (lastUpdate && isYesterday(lastUpdate, today)) {
                user.streak += 1;
                pointsAwarded = 10; 
            } 
            else {
                user.streak = 1; 
                pointsAwarded = 10;
            }
            
            user.points += pointsAwarded;
            user.streakLastUpdate = today;

            badgesAwarded = checkAndAwardBadges(user, user.streak);
        }
        
        user.totalPages += pagesRead;

        // --- 2. Create/Update ReadingSession ---
        let session = await ReadingSession.findOne({ 
            userId, 
            date: { 
                $gte: moment(today).startOf('day'),
                $lt: moment(today).endOf('day')
            }
        });

        if (session) {
            session.pagesRead += pagesRead;
            await session.save();
        } else {
            session = await ReadingSession.create({ 
                userId, 
                bookId, 
                date: today, 
                pagesRead 
            });
        }
        
        // --- 3. Save User Updates ---
        await user.save();

        // --- 4. Send Response ---
        res.status(200).json({ 
            success: true, 
            message: 'Page marked completed.',
            streak: user.streak,
            points: user.points,
            session,
            pointsAwarded,
            badgesAwarded, 
            badges: user.badges 
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'You have already marked a page completed today. Session updated.' });
        }
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
};

// =========================================================================
// GET /api/streaks/leaderboard — Get top users by streak
// =========================================================================
export const getLeaderboard = async (req, res) => { // Use named export
    const limit = 50; 
    
    try {
        const leaderboard = await User.find({})
            .sort({ streak: -1, totalPages: -1 }) 
            .limit(limit)
            .select('name avatarUrl streak totalPages points') 
            .lean();

        res.status(200).json(leaderboard);

    } catch (error) {
        res.status(500).json({ error: 'Server error while fetching leaderboard: ' + error.message });
    }
};

// You no longer need the 'module.exports' block or the extra definitions at the end.