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

/* Notifications */
export const load_notifications = async (userId) => {
    try {
        const res = await request("get", `/notifications/${userId}`, {});
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

export const delete_notification = async (notificationId) => {
    try {
        const res = await request("delete", `/notifications/delete/${notificationId}`, {});
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

export const hide_notification = async(notificationId) => {
    try {
        const res = await request("put", `/notifications/hide/${notificationId}/${'hidden'}`, {});
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
/* Home */
/* Contacts */