import type {PageServerLoad} from './$types';
import {redirect} from '@sveltejs/kit';

export const load: PageServerLoad = ({locals}) => {
    if (locals.user) {
        return redirect(302, '/');
    }
};