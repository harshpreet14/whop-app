import { whopSdk } from "@/lib/whop-sdk";
import { headers } from "next/headers";
import Calculator from '@/app/calculator/page';

export default async function ExperiencePage({
	params,
}: {
	params: Promise<{ experienceId: string }>;
}) {
	// The headers contains the user token
	const headersList = await headers();

	// The experienceId is a path param
	const { experienceId } = await params;

	// The user token is in the headers
	const { userId } = await whopSdk.verifyUserToken(headersList);

	const result = await whopSdk.access.checkIfUserHasAccessToExperience({
		userId,
		experienceId,
	});

	const user = await whopSdk.users.getUser({ userId });
	const experience = await whopSdk.experiences.getExperience({ experienceId });

	// Either: 'admin' | 'customer' | 'no_access';
	// 'admin' means the user is an admin of the whop, such as an owner or moderator
	// 'customer' means the user is a common member in this whop
	// 'no_access' means the user does not have access to the whop
	const { accessLevel } = result;

	// Check if user has access
	if (!result.hasAccess) {
		return (
			<div className="flex justify-center items-center h-screen px-8">
				<h1 className="text-xl text-red-600">
					You do not have access to this experience.
				</h1>
			</div>
		);
	}

	// If user has access, show the calculator
	return (
		<div>
			{/* Optional: Show user info at the top */}
			<div className="bg-gray-800 text-white p-4 text-center">
				<p className="text-sm">
					Welcome <strong>{user.name}</strong>! You have <strong>{accessLevel}</strong> access to <strong>{experience.name}</strong>
				</p>
			</div>
			
			{/* Your Calculator */}
			<Calculator />
		</div>
	);
}
