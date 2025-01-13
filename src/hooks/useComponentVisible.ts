/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";

// Định nghĩa interface để mô tả cấu trúc của giá trị trả về từ custom hook.
interface ComponentVisibleHook {
	ref: React.RefObject<any>; // Một ref để gán vào DOM element cần kiểm tra sự hiển thị.
	isComponentVisible: boolean; // Biến trạng thái kiểm tra xem component có đang hiển thị hay không.
	setIsComponentVisible: React.Dispatch<React.SetStateAction<boolean>>; // Hàm để cập nhật trạng thái isComponentVisible.
}

// Custom hook `useComponentVisible` giúp quản lý trạng thái hiển thị của một component.
export default function useComponentVisible(initialIsVisible: boolean): ComponentVisibleHook {
	// Khởi tạo trạng thái để theo dõi component có đang hiển thị hay không.
	const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);

	// Sử dụng useRef để tạo một tham chiếu đến DOM element. Ref này sẽ được sử dụng để kiểm tra sự kiện click bên ngoài.
	const ref = useRef<any>(null);

	// Hàm xử lý khi click bên ngoài component.
	const handleClickOutside = (event: MouseEvent) => {
		// Nếu ref hiện tại không null và event xảy ra bên ngoài DOM element được ref tham chiếu:
		if (ref.current && !ref.current.contains(event.target as Node)) {
			// Đặt trạng thái isComponentVisible thành false để ẩn component.
			setIsComponentVisible(false);
		}
	};

	// Sử dụng useEffect để thêm và loại bỏ sự kiện click trong document.
	useEffect(() => {
		// Thêm sự kiện click vào document. `true` nghĩa là sự kiện này được xử lý trong pha capture.
		document.addEventListener("click", handleClickOutside, true);

		// Cleanup function: loại bỏ sự kiện khi component bị unmount để tránh rò rỉ bộ nhớ.
		return () => {
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, []); // Mảng phụ thuộc rỗng: useEffect chỉ chạy một lần khi component mount.

	// Trả về các giá trị cần thiết để sử dụng hook: ref, trạng thái hiển thị, và hàm cập nhật trạng thái.
	return { ref, isComponentVisible, setIsComponentVisible };
}
