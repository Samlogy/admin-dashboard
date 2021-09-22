import { request } from "./_http";

/* Auth */
export const login = async (data) => {
    try {
        const res = await request("post", "/auth/login", {}, data);
        if (res.success) return res

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
        if (res.success) return res

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
        if (res.success) return res

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
        if (res.success) return res

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
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};

/* Users */
export const load_users = async () => {
    try {
        const res = await request("get", `/users/getUsers`, {});
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};

export const create_user = async (data) => {
    try {
        const res = await request("post", `/users/createUser`, {}, data);
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const edit_user = async (userId, data) => {
    try {
        const res = await request("put", `/users/editUser/${userId}`, {}, data);
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const delete_user = async (userId) => {
    try {
        const res = await request("delete", `/users/deleteUser/${userId}`, {});
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const filter_user = async (value, filter_type) => {
    try {
        const res = await request("get", `/users/filterUsers?queryString=${value}&filterType=${filter_type}`, {});
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const block_user = async (userId, data) => {
    try {
        const res = await request("put", `/users/blockUser/${userId}`, {}, data);
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};

/* Products */
export const load_products = async () => {
    try {
        const res = await request("get", `/products/getProducts`, {});
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const create_product = async (data) => {
    try {
        const res = await request("post", `/products/createProduct`, {}, data);
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const edit_product = async (productId, data) => {
    try {
        const res = await request("put", `/products/editProduct/${productId}`, {}, data);
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const delete_product = async (productId, data) => {
    try {
        const res = await request("put", `/products/deleteProduct/${productId}`, {}, data);
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const filter_products = async (value, filterType) => {
    try {
        const res = await request("get", `/products/filterProducts?queryString=${value}&filterType=${filterType}`, {});
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};

/* Newsletters */
export const send_newsletter = async (data) => {
    try {
        const res = await request("post", `/newsletter/write`, {}, data);
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};
export const load_newsletters = async () => {
    try {
        const res = await request("get", `/newsletter/getNewsletters`, {});
        if (res.success) return res

    } catch (err) {
        console.log('Operation Error occured --> : ', err);
        return {
            success: false,
            error: err.message
        }
    }
};

/* Home */
/* Contacts */