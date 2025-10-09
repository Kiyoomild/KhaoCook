export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
}

export interface LoginCredentails {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}