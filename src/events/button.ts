import { getToggleButton, PermissionNames, permissionsInfo, permissionsMapping, UserGender } from "../types/UserProfile";
import { CtxCallbackQuery, MyContext } from "../types/MessageContext";
import { CallbackQuery, Update, Message, InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { startMessageButtons } from "../utils/startMessage";
import { readFileSync } from "fs";
import { Context } from "telegraf";
import updateInlineKeyboard from "../utils/updateInlineKeyBoard";
import getUserProfile from "../utils/getUserProfile";
import markdownToHtml from "../functions/markdownToHtml";
import setUserProfile from "../utils/setUserProfile";
import EventType from "../types/EventType";
import error from "../utils/error";
import generateReferralLink from "../utils/generateReferralLink";
import updateUserLastSeen from "../utils/updateUserLastSeen";

const event: EventType = {
    name: "callback_query",
    run: async (
        client,
        message: Context<Update.CallbackQueryUpdate<CallbackQuery>> & Omit<MyContext, keyof Context<Update>> & {
            match: RegExpExecArray;
        }
    ) => {
        try {
            const
                db = client.db!,
                callbackQuery: CtxCallbackQuery = message.callbackQuery as any,
                userId = callbackQuery.from.id,
                profile = await getUserProfile(db, userId) || {},
                welcome_message_text = "برای تغییر پیغام خوش آمد گویی چت، مثل مورد نظر رو ارسال کنید.",
                nickname_text = "برای تغییر نام نمایشی، نام را ارسال کنید.",
                callback_data = callbackQuery.data,
                FaqButtons = [
                    [{ text: "🤔 این ربات چیه؟", callback_data: "faq_about" }],
                    [{ text: "🔗 چطور لینک ناشناس بسازم؟", callback_data: "faq_link" }],
                    [{ text: "📬 چطور پیام ناشناس دریافت کنم؟", callback_data: "faq_receive" }],
                    [{ text: "👥 چطور به یه گروه پیام ناشناس بفرستم؟", callback_data: "faq_group" }],
                    [{ text: "⚙ تنظیمات ربات", callback_data: "faq_settings" }],
                    [{ text: "🚫 چطوری افراد بلاک‌شده رو آزاد کنم؟", callback_data: "faq_unblock" }],
                    [{ text: "بازگشت 🔙", callback_data: "return_start" }]
                ];


            // Reset lastMessage
            message.session = {};

            // Set last activity
            await updateUserLastSeen(db, userId);

            // Set gender 
            if (callback_data.match(/set_gender_(.+)/)) {
                const
                    gender = callback_data.replace("set_gender_", "") as UserGender,
                    userId = message.from!.id;

                profile.gender = gender;
                await setUserProfile(db, userId, profile);
                await message.answerCbQuery("پروفایل شما به‌روزرسانی شد!");
                return await message.editMessageText(`پروفایل شما تنظیم شد: جنسیت شما ${gender} است.`);
            }

            switch (callback_data) {

                // Start Buttons
                case "setting": {
                    await message.answerCbQuery("تنظیمات پروفایل شما در ربات.");
                    const inline_keyboard: { text: string; callback_data: string }[][] = [];
                    if (!profile.permissions) {

                        // Default permissions 
                        profile.permissions = {
                            found_user_link: true,
                            random_chat: true,
                            send_circule_video: true,
                            send_file: true,
                            send_gif: true,
                            send_image: true,
                            send_music: true,
                            send_sticker: true,
                            send_text: true,
                            send_video: true,
                            send_voice: true
                        };

                        await setUserProfile(db, userId, profile);
                    }

                    inline_keyboard.push([{ text: "تغییر نام نمایشی 👤", callback_data: "change_nickname" }]);
                    inline_keyboard.push([{ text: "پیام خوش آمدگویی 👋🏻", callback_data: "change_welcome_message" }]);
                    for (const permissionKey in permissionsMapping) {
                        const
                            key = permissionKey as PermissionNames,
                            mapping = permissionsMapping[key],
                            isEnabled = !!profile.permissions[key];

                        inline_keyboard.push([
                            getToggleButton(key, isEnabled),
                            { text: mapping.label, callback_data: mapping.infoCallback },
                        ]);
                    }

                    inline_keyboard.push([{ text: "بازگشت ↩", callback_data: "return_start" }]);

                    return await message.editMessageText("تنظیمات:", {
                        reply_markup: { inline_keyboard },
                    });
                }

                // Setting buttons
                case "delete_nickname":
                case "change_nickname": {
                    if (callback_data === "delete_nickname") {
                        await message.answerCbQuery("نام نمایشی در چت خصوصی حذف شد.");
                        if (profile && profile.nickname) {
                            profile.nickname = undefined;
                            await setUserProfile(db, userId, profile)
                        };
                    }

                    else
                        await message.answerCbQuery("تغییر نام نمایشی در چت خصوصی");

                    const
                        buttons: { text: string; callback_data: string }[][] = [],
                        ifNickname = profile && profile.nickname && callback_data !== "delete_nickname";

                    if (ifNickname)
                        buttons.push([
                            { text: "حذف 🗑", callback_data: callback_data.replace("change", "delete") }
                        ]);

                    buttons.push([
                        { text: "بازگشت ↩", callback_data: "setting" }
                    ]);
                    const msg = await message.editMessageText(
                        markdownToHtml(nickname_text + `${ifNickname ? `\nنام نمایشی فعلی شما: \`\`\`\n**${profile.nickname}**\n\`\`\`` : ""}`),
                        {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: buttons
                            }
                        }
                    ) as Update.Edited & Message.TextMessage;
                    message.session.lastMessage = {
                        text: msg.text,
                        message_id: msg.message_id,
                        chat: {
                            id: msg.chat.id,
                            type: msg.chat.type
                        },
                        from: {
                            id: msg.from!.id,
                            username: msg.from!.username
                        }
                    }
                    return;
                }

                case "delete_welcome_message":
                case "change_welcome_message": {
                    if (callback_data === "delete_welcome_message") {
                        await message.answerCbQuery("پیام خوش آمد گویی حذف شد.");
                        if (profile && profile.welcome_message) {
                            profile.welcome_message = undefined;
                            await setUserProfile(db, userId, profile)
                        };
                    }

                    else
                        await message.answerCbQuery("تغییر پیغام خوش آمد گویی در چت.");

                    const
                        buttons: { text: string; callback_data: string }[][] = [],
                        ifWelcomeMessage = profile && profile.welcome_message && callback_data !== "delete_welcome_message";

                    if (ifWelcomeMessage)
                        buttons.push([
                            { text: "حذف 🗑", callback_data: callback_data.replace("change", "delete") }
                        ]);

                    buttons.push([
                        { text: "بازگشت ↩", callback_data: "setting" }
                    ]);
                    const msg = await message.editMessageText(
                        markdownToHtml(welcome_message_text + `${ifWelcomeMessage ? `\nپیغام فعلی شما: \`\`\`\n**${profile.welcome_message}**\n\`\`\`` : ""}`),
                        {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: buttons
                            }
                        }
                    ) as Update.Edited & Message.TextMessage;
                    message.session.lastMessage = {
                        text: msg.text,
                        message_id: msg.message_id,
                        chat: {
                            id: msg.chat.id,
                            type: msg.chat.type
                        },
                        from: {
                            id: msg.from!.id,
                            username: msg.from!.username
                        }
                    }
                    return;
                }

                case "return_start": {
                    await message.answerCbQuery("بازگشت به منوی شروع");
                    return await message.editMessageText("چه کاری برات انجام بدم؟", { reply_markup: startMessageButtons });
                }

                // My referral link
                case "my_referral_link": {
                    const
                        referralLink = await generateReferralLink(client, userId),
                        bannerText = `👤 لینک ناشناس من\n\nسلام ${profile.nickname || callbackQuery.from.first_name} هستم 👋\nلینک زیر رو لمس کن و هر حرفی که تو دلت هست یا هر انتقادی که نسبت به من داری رو راحت بنویس و بفرست. قطعا نظرات و پیام‌هات برام ارزشمنده! 😊\n\n**🔗 لینک ناشناس من:**\n`;

                    const msg = await message.editMessageText(markdownToHtml(bannerText) + referralLink, {
                        parse_mode: "HTML"
                    }) as Update.Edited & Message.TextMessage;
                    return await message.reply(markdownToHtml("👆 پیام بالا رو به دوستات و گروه‌هایی که می‌شناسی فوروارد کن تا بتونن بهت پیام ناشناس بفرستن. پیام‌ها از طریق همین ربات بهت می‌رسه."), {
                        parse_mode: "HTML",
                        reply_parameters: {
                            message_id: msg.message_id
                        },
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "تغییر نام نمایشی 👤", callback_data: "change_nickname" },
                                    { text: "پیام خوش آمدگویی 👋🏻", callback_data: "change_welcome_messge" }
                                ],
                                [{ text: "بازگشت 🔙", callback_data: "return_start" }]
                            ]
                        }
                    })
                }

                // Faq
                case "faq": {
                    return await message.editMessageText(markdownToHtml("💡 لیست سوالات متداول:"), {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: FaqButtons
                        }
                    });
                }

                // Anonymous chat
                case "anonymous_chat": {
                    return await message.editMessageText(readFileSync("./storage/AnonymousChatText.txt").toString(), {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: [
                                [{ text: "چت شانسی 🎲", callback_data: "anonymous_chat_random" }],
                                [
                                    { text: "تماس شانسی با آقا 👨🏻", callback_data: "anonymous_chat_male" },
                                    { text: "تماس شانسی با خانم 👩🏻", callback_data: "anonymous_chat_female" }
                                ],
                                [
                                    getToggleButton("random_chat", !!profile.permissions?.random_chat),
                                    { text: "🔁 چت شانسی دو طرفه:", callback_data: "info_random_chat" }
                                ],
                                [{ text: "بازگشت 🔙", callback_data: "return_start" }]
                            ]
                        }
                    })
                }
            }

            // Show permissions information
            if (callback_data.startsWith("info_")) {
                const
                    permission_name = callback_data.replace("info_", "") as PermissionNames,
                    permission_information = permissionsInfo[permission_name];

                return await message.answerCbQuery(permission_information, { show_alert: true });
            }

            // Do settings button actions
            if (callback_data.endsWith("_on") || callback_data.endsWith("_off")) {
                const
                    permission_name = callback_data.replace("_on", "").replace("_off", "") as PermissionNames,
                    action = !profile.permissions![permission_name],
                    action_text = action ? "فعال ✅" : "غیر فعال ❌",
                    new_callback_data = action ? permission_name + "_off" : permission_name + "_on",
                    newButtons = await updateInlineKeyboard(callbackQuery, { text: action_text, callback_data: new_callback_data });

                profile.permissions![permission_name] = action;
                await setUserProfile(db, userId, profile);
                await message.answerCbQuery(action_text);
                return await message.editMessageReplyMarkup({ inline_keyboard: newButtons });
            }

            // Faq list
            if (callback_data.startsWith("faq_")) {
                const
                    getMainButtonText = FaqButtons.find(a => {
                        const button = a[0] as InlineKeyboardButton.CallbackButton
                        return button.callback_data === callback_data;
                    })![0],
                    inline_keyboard = FaqButtons.filter(a => {
                        const button = a[0] as InlineKeyboardButton.CallbackButton
                        return button.callback_data !== callback_data;
                    }),
                    text = readFileSync(`./storage/${callback_data}.txt`).toString();

                await message.answerCbQuery(getMainButtonText.text);
                return await message.editMessageText(markdownToHtml(text.replace("{username}", client.botInfo!.first_name)), {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard
                    }
                })
            }

        } catch (e: any) {
            error(e);
        }
    }
};

export default event;
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */