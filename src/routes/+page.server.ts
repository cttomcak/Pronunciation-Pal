import type { PageServerLoad } from './$types';

/**
 * Gets user data during page load
 * @param event Event
 * @returns User Data
 */
export const load: PageServerLoad = async (event) => {
    return {
        user: event.locals.user
    }
};
