import type { PageServerLoad, RequestEvent, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { User } from '$lib/server/models/User';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { DBClient } from '$lib/server/database';

export const load: PageServerLoad = ({locals}) => {
    if (locals.user) {
        return redirect(302, '/');
    } else {
        return redirect(303, '/auth/login');
    }
};

export const actions: Actions = {
    // Log someone in
    login: async ({cookies, request}: RequestEvent) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString()?? '';
        const password = formData.get('password')?.toString()?? '';
        // Fetch the user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return fail(400, { message: 'Invalid email or password' });
        }
        // Check the password
        // TODO: Figure out how to do error handling here
        const result = await compare(password, user.password);
        if (result) {
            // Log user in
            const token = jwt.sign({ id: user.id }, JWT_SECRET,
                { expiresIn: '24h' });
            cookies.set('auth_token', token, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: 'strict',
                path: '/'
            });
            // Redirect to the home page
            return redirect(303, '/profile');
        } else {
            return fail(400, { message: 'Invalid email or password' });
        }
        return fail(500, { error: 'Internal Server Error' });
    },
    // Register a new user
    register: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email')?.toString()?? '';
        const password = formData.get('password')?.toString()?? '';
        const first_name = formData.get('first_name')?.toString()?? '';
        const last_name = formData.get('last_name')?.toString()?? '';
        // Check to make sure all required fields are present
        if (!email || !password || !first_name || !last_name) {
            return fail(400, { error: 'All fields are required' });
        }
        // Fetch the user
        let user = await User.findOne({ where: { email } });
        if (user) {
            return fail(400, { email, taken: true });
        }
        // Hash the password
        try {
            const hashedPassword = await hash(password, 10);
            // Create the user
            // TODO: Don't assume that this worked
            await User.create({
                email,
                password: hashedPassword,
                first_name,
                last_name
            });
            // return a response and redirect to /
            return { success: true };
        } catch (err) {
            return {
                status: 500,
                body: { error: 'Internal Server Error' }
            };
        }
    },
    logout: async ({cookies}) => {
        cookies.delete('auth_token', { path: '/' });
        return redirect(303, '/');
    }
};