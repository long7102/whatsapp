import { GoogleGenerativeAI } from "@google/generative-ai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const geminiAI = new GoogleGenerativeAI(apiKey);

export const chat = action({
    args: {
        messageBody: v.string(),
        conversation: v.id("conversations"),
    },
    handler: async (ctx, args) => {
        const model = geminiAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const chatSession = model.startChat({
            generationConfig: {
                temperature: 1,
                topP: 0.95,
                topK: 40,
                maxOutputTokens: 8192,
                responseMimeType: "text/plain",
            },

        });

        const res = await chatSession.sendMessage(args.messageBody);
        const messageContent =
            res.response?.text() ?? "Xin lỗi bạn, tôi không hiểu câu hỏi của bạn";

        await ctx.runMutation(api.messages.sendGeminiMessage, {
            content: messageContent,
            conversation: args.conversation,
            messageType: "text",
        });
    },
});

// // DALL-E equivalent action
// export const geminiImage = action({
//     args: {
//       conversation: v.id("conversations"),
//       messageBody: v.string(),
//     },
//     handler: async (ctx, args) => {
//       try {
//         // Gọi phương thức tạo hình ảnh từ Gemini AI (Model imagen3)
//         const res = await geminiAI.getGenerativeModel({
//           prompt: args.messageBody, // Văn bản yêu cầu tạo hình ảnh
//           n: 1,                      // Số lượng hình ảnh cần tạo
//           size: "1024x1024",         // Kích thước hình ảnh
//         });
  
//         // Lấy URL hình ảnh được tạo ra
//         const imageUrl = res.generatedImages[0]?.url || "/default-image.png"; // Nếu không có URL, sử dụng hình ảnh mặc định
  
//         // Gửi URL hình ảnh đến cuộc trò chuyện
//         await ctx.runMutation(api.messages.sendChatGPTMessage, {
//           content: imageUrl,
//           conversation: args.conversation,
//           messageType: "image",
//         });
//       } catch (error) {
//         console.error("Error generating image with Gemini AI:", error);
//         await ctx.runMutation(api.messages.sendChatGPTMessage, {
//           content: "An error occurred while generating the image.",
//           conversation: args.conversation,
//           messageType: "text",
//         });
//       }
//     },
//   });
  