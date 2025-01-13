import { Lock } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

const ChatPlaceHolder = () => {
	return (
		<div className='w-3/4 bg-gray-secondary flex flex-col items-center justify-center py-10'>
			<div className='flex flex-col items-center w-full justify-center py-10 gap-4'>
				<Image src={"/desktop-hero.png"} alt='Hero' width={320} height={188} />
				<p className='text-3xl mt-5 mb-2 font-bold'>Whatsapp Clone</p>
				<p className='w-1/2 text-center text-gray-primary text-sm text-muted-foreground'>
					Ứng dụng trò chuyện, chia sẻ màn hình, gọi video thời gian thực và tích hợp trí tuệ nhân tạo
				</p>

				<Button className='rounded-full my-5 bg-green-primary hover:bg-green-secondary'>
					Xem các dự án khác của tôi
				</Button>
			</div>
			<p className='w-1/2 mt-auto text-center text-gray-primary text-xs text-muted-foreground flex items-center justify-center gap-1'>
				<Lock size={10} /> Bảo mật tối đa thông tin của bạn
			</p>
		</div>
	);
};
export default ChatPlaceHolder;