import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useEffect, useRef } from "react";

export function getUrlParams(url = window.location.href) {
	const urlStr = url.split("?")[1];
	return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
	const roomID = getUrlParams().get("roomID") || randomID(5);
	const { user } = useClerk();
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// Ensure user is loaded
		if (!user) {
			console.error("User not available yet.");
			return;
		}

		const initMeeting = async () => {
			try {
				const res = await fetch(`/api/zegocloud?userID=${user.id}`);
				if (!res.ok) {
					throw new Error("Failed to fetch ZegoCloud token");
				}
				const { token, appID } = await res.json();

				const username = user.fullName || user.emailAddresses[0].emailAddress.split("@")[0];
				const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
					appID,
					token,
					roomID,
					user.id,
					username
				);

				const zp = ZegoUIKitPrebuilt.create(kitToken);
				zp.joinRoom({
					container: containerRef.current!,
					sharedLinks: [
						{
							name: "Personal link",
							url:
								window.location.protocol +
								"//" +
								window.location.host +
								window.location.pathname +
								"?roomID=" +
								roomID,
						},
					],
					scenario: {
						mode: ZegoUIKitPrebuilt.GroupCall, // Or OneONoneCall as needed
					},
				});
			} catch (error) {
				console.error("Error initializing meeting:", error);
			}
		};

		initMeeting();
	}, [user]);

	return <div className="myCallContainer" ref={containerRef} style={{ width: "100vw", height: "100vh" }}></div>;
}
