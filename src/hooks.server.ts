import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { User } from '$lib/server/models/User';

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