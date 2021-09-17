import { request } from "./_http";

/* Auth */
export const login = async (data) => {
    try {
        const res = await request("post", "/auth/login", {}, data);
        if (res.success) {
            const { data, success, message } = res;
            return {
                success,
                data,
                message
            }
        }

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};

export const logout = async () => {
    try {
        const res = await request("get", "/auth/logout", {});
        if (res.success) {
            const { data, success, message } = res;
            return {
                success,
                data,
                message
            }
        }

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};

/* Users */
/* Products */
/* Newsletters */
/* Notifications */
/* Home */
/* Contacts */