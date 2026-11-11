// authValidation.js
type user = {
    name:string;
    email:string;
    password:string;
}
type userLogin = {
    email:string;
    password:string;
}
export const validateRegister = (user:user) => {

    const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!user.email.trim()) {
        return "Email is required";
    }

   if (!emailRegex.test(user.email.trim())) {
        return "Please enter a valid email";
    }

    if (!user.password) {
        return "Password is required";
    }

    if (user.password.length < 8) {
        return "Password must be at least 8 characters";
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(user.password)) {
        return "Password must contain at least one uppercase letter";
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(user.password)) {
        return "Password must contain at least one lowercase letter";
    }

    // Check for at least one number
    if (!/[0-9]/.test(user.password)) {
        return "Password must contain at least one number";
    }

    // Check for at least one special character
    if (!/[^A-Za-z0-9\s]/.test(user.password)) {
        return "Password must contain at least one special character";
    }

    if(!user.name.trim()){
        return "Name is required";
    }
    return null
};

export const validateLogin = (userLogin:userLogin) => {

    if (!userLogin.email.trim()) {
        return "Email is required";
    }

    if (!userLogin.password) {
        return "Password is required";
    }

    return null;
};