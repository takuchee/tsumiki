export type UserId = string;

export type User = {
	id: UserId;
	name: string;
	email: string;
	avatarUrl: string;
	isLoggedIn: boolean;
};
