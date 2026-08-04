import { RegisterForm } from "~/features/auth/components/RegisterForm";

export const action = async (args: ActionFunctionArgs) => {
	return await registerAction(args);
};

export default function RegisterRoute() {
	return <RegisterForm />;
}
