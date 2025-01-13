import OpenAI from "openai";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey });

export const chat = action({
	args: {
		messageBody: v.string(),
		conversation: v.id("conversations"),
	},
	handler: async (ctx, args) => {
		const res = await openai.chat.completions.create({
			model: "gpt-4-turbo", // gpt 4, gpr-3.5-turbo nếu muốn đổi mô hình
			messages: [
				{
					role: "system",
					content: "You are a terse bot in a group chat responding to questions with 1-sentence answers",
				},
				{
					role: "user",
					content: args.messageBody,
				},
			],
		});

		const messageContent = res.choices[0].message.content;

		await ctx.runMutation(api.messages.sendChatGPTMessage, {
			content: messageContent ?? "Xin lỗi, tôi không hiểu yêu cầu của bạn",
			conversation: args.conversation,
			messageType: "text",
		});
	},
});

export const dall_e = action({
	args: {
		conversation: v.id("conversations"),
		messageBody: v.string(),
	},
	handler: async (ctx, args) => {
		const res = await openai.images.generate({
			model: "dall-e-3",
			prompt: args.messageBody,
			n: 1,
			size: "1024x1024",
		});

		const imageUrl = res.data[0].url;
		await ctx.runMutation(api.messages.sendChatGPTMessage, {
			content: imageUrl ?? "/poopenai.png",
			conversation: args.conversation,
			messageType: "image",
		});
	},
});

// 1 token ~= 4 ký tự tiếng Anh
// 1 mã thông báo ~= 3/4 từ
// 100 token ~= 75 từ
//Hoặc
// 1-2 câu ~= 30 token
// 1 đoạn ~= 100 token
// 1.500 từ ~= 2048 token

// 1 hình ảnh sẽ có giá $0,04(4 xu) => dall-e-3
// 1 hình ảnh sẽ có giá $0,02(2 xu) => dall-e-2