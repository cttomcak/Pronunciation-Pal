import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { User } from '$lib/server/models/User';

/**
 * Hook for adding user (if logged in) to locals store
 * @param {object} params - Parameters object.
 * @param {object} params.event - The incoming event object.
 * @param {function} params.resolve - Function to resolve the event.
 * @returns {Promise<object>} - Promise that resolves with the modified event object.
 */
export const handle: Handle = async ({ event, resolve }) => {
    const auth_token = event.cookies.get('auth_token');
    if (auth_token) {
        try {
            const decoded = jwt.verify(auth_token, JWT_SECRET);
            const user = await User.findOne({ where: { id: decoded.id } });
            if (user) {
                event.locals.user = user.get({ plain: true });
            }
        } catch (err) {
            console.error(err);
        }
    }
    return resolve(event);
};