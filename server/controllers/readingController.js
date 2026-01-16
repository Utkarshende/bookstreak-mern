import moment from 'moment';
import User from '../models/User.js'; 
import ReadingSession from '../models/ReadingSession.js'; 

const isSameDay = (date1, date2) => {
    return moment(date1).startOf('day').isSame(moment(date2).startOf('day'));
};

const isYesterday = (date1, date2) => {
    return moment(date1).startOf('day').add(1, 'day').isSame(moment(date2).startOf('day'));
};

const checkAndAwardBadges = (user, newStreak) => {
    const badgesAwarded = [];
    const BADGE_POINTS = {
        'Novice Reader': 50,
        'Consistent Reader': 100,
        'Streak Master': 250,
    };
    
    const milestones = [
        { streak: 7, name: 'Novice Reader' },
        { streak: 30, name: 'Consistent Reader' },
        { streak: 100, name: 'Streak Master' }
    ];

    for (const milestone of milestones) {
        if (newStreak >= milestone.streak && !user.badges.includes(milestone.name)) {
            user.badges.push(milestone.name);
            user.points += BADGE_POINTS[milestone.name]; 
            badgesAwarded.push(milestone.name);
        }
    }
    
    const newTotalPages = user.totalPages + 1; 
    const pageMilestone = 100;
    
    if (newTotalPages % pageMilestone === 0) {
        user.points += 50; 
    }
    
    return badgesAwarded;
};


export const markPageCompleted = async (req, res) => { 
    const { _id: userId } = req.user; 
    const { bookId, pagesRead = 1 } = req.body;
    
    const today = new Date(); 
    
    try {
        let user = req.user;
        const lastUpdate = user.streakLastUpdate;
        let pointsAwarded = 0;
        let badgesAwarded = [];

        
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
        
        await user.save();

        // Always return the updated user object for frontend state update
        res.status(200).json({ 
            success: true, 
            message: 'Page marked completed.',
            user, // <-- updated user object
            streak: user.streak,
            points: user.points,
            totalPages: user.totalPages,
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


export const getLeaderboard = async (req, res) => { 
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
