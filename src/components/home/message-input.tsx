/* eslint-disable @typescript-eslint/no-explicit-any */
import { Laugh, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, { Theme } from "emoji-picker-react";
import MediaDropdown from "./media-dropdown";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const [isSending, setIsSending] = useState(false); // State to track sending status
  const sendTextMsg = useMutation(api.messages.sendTextMessage);
  const { selectedConversation } = useConversationStore();
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const me = useQuery(api.users.getMe);

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending || msgText.length === 0) return; // Prevent sending if already sending or message is empty

    setIsSending(true); // Set sending state to true to disable the button

    try {
      await sendTextMsg({
        content: msgText,
        conversation: selectedConversation!._id,
        sender: me!._id,
      });
      setMsgText(""); // Clear the message input after sending
          // eslint-disable-next-line @typescript-eslint/no-explicit-any

    } catch (error: unknown) {
      toast.error(error.message); // Show error if sending fails
      console.log(error);
    } finally {
      setIsSending(false); // Reset sending state after request is complete
    }
  };

  return (
    <div className="bg-gray-primary p-2 flex gap-4 items-center">
      <div className="relative flex gap-2 ml-2">
        {/* EMOJI PICKER */}
        <div ref={ref} onClick={() => setIsComponentVisible(true)}>
          {isComponentVisible && (
            <EmojiPicker
              theme={Theme.DARK}
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "1rem",
                zIndex: 1000,
              }}
              onEmojiClick={(emojiObject) => {
                setMsgText((prev) => prev + emojiObject.emoji);
              }}
            />
          )}
          <Laugh className="text-gray-600 dark:text-gray-400" />
        </div>
        <MediaDropdown />
      </div>
      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Nhập tin nhắn"
            className="py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
        </div>
        <div className="mr-4 flex items-center">
          <Button
            type="submit"
            size={"sm"}
            className={`bg-transparent hover:bg-transparent ${
              msgText.length > 0 && !isSending ? "text-foreground" : "text-gray-400 cursor-not-allowed"
            }`}
            disabled={msgText.length === 0 || isSending} // Disable button if input is empty or if already sending
          >
            <Send className={`${msgText.length > 0 && !isSending ? "text-foreground" : "text-gray-400"}`} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
