/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useEffect, useRef, useState } from "react";
import { randomID } from "@/lib/utils";
import { useClerk } from "@clerk/nextjs";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export function getUrlParams(url = window.location.href) {
	const urlStr = url.split("?")[1];
	return new URLSearchParams(urlStr);
}

export default function VideoUIKit() {
	const roomID = getUrlParams().get("roomID") || randomID(5);
	const { user } = useClerk();
	const [isInitialized, setIsInitialized] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const initMeeting = async () => {
			// Ngăn việc khởi tạo lại
			if (isInitialized || !containerRef.current) return;

			const res = await fetch(`/api/zegocloud?userID=${user?.id}`);
			const { token, appID } = await res.json();

			const username = user?.fullName || user?.emailAddresses[0].emailAddress.split("@")[0];

			const kitToken = ZegoUIKitPrebuilt.generateKitTokenForProduction(
				appID,
				token,
				roomID,
				user?.id!,
				username
			);

			const zp = ZegoUIKitPrebuilt.create(kitToken);
			zp.joinRoom({
				container: containerRef.current,
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
					mode: ZegoUIKitPrebuilt.GroupCall, // Thay đổi nếu cần 1-on-1 call
				},
			});

			setIsInitialized(true); // Đánh dấu đã khởi tạo
		};

		initMeeting();
	}, [isInitialized, user, roomID]);

	return (
		<div
			className="myCallContainer"
			ref={containerRef}
			style={{ width: "100vw", height: "100vh" }}
		></div>
	);
}
