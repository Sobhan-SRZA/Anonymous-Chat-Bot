import { getToggleButton, PermissionNames, permissionsInfo, permissionsMapping, UserGender } from "../types/UserProfile";
import { CallbackQuery, Update, Message, InlineKeyboardButton } from "telegraf/typings/core/types/typegram";
import { CtxCallbackQuery, MyContext } from "../types/MessageContext";
import { startMessageButtons } from "../utils/startMessage";
import { readFileSync } from "fs";
import { Collection } from "../classes/Collection";
import { Context } from "telegraf";
import deleteClickedInlineKeyBoard from "../utils/deleteClickedInlineKeyBoard";
import getUserIdByReferralCode from "../utils/getUserIdByReferralCode";
import getOrCreateReferralCode from "../utils/getOrCreateReferralCode";
import getRecentlyActiveUsers from "../utils/getRecentlyActiveUsers";
import updateInlineKeyboard from "../utils/updateInlineKeyBoard";
import generateReferralLink from "../utils/generateReferralLink";
import updateUserLastSeen from "../utils/updateUserLastSeen";
import getUserProfile from "../utils/getUserProfile";
import markdownToHtml from "../functions/markdownToHtml";
import setUserProfile from "../utils/setUserProfile";
import chooseRandom from "../functions/chooseRandom";
import cleanupUser from "../utils/cleanupUser";
import EventType from "../types/EventType";
import error from "../utils/error";

const event: EventType = {
    name: "callback_query",
    run: async (
        client,
        ctx: Context<Update.CallbackQueryUpdate<CallbackQuery>> & Omit<MyContext, keyof Context<Update>> & {
            match: RegExpExecArray;
        }
    ) => {
        try {
            const
                db = client.db!,
                callbackQuery: CtxCallbackQuery = ctx.callbackQuery as any,
                userId = callbackQuery.from.id,
                profile = await getUserProfile(db, userId) || {},
                welcome_message_text = "برای تغییر پیغام خوش آمد گویی چت، مثل مورد نظر رو ارسال کنید.",
                nickname_text = "برای تغییر نام نمایشی، نام را ارسال کنید.",
                callback_data = callbackQuery.data,
                FaqButtons = [
                    [{ text: "🤔 این ربات چیه؟", callback_data: "faq_about" }],
                    [{ text: "🔗 چطور لینک ناشناس بسازم؟", callback_data: "faq_link" }],
                    [{ text: "📬 چطور پیام ناشناس دریافت کنم؟", callback_data: "faq_receive" }],
                    [{ text: "⚙ تنظیمات ربات", callback_data: "faq_settings" }],
                    [{ text: "🚫 چطوری افراد بلاک‌شده رو آزاد کنم؟", callback_data: "faq_unblock" }],
                    [{ text: "بازگشت 🔙", callback_data: "return_start" }]
                ];


            // Reset lastMessage
            ctx.session = {
                __scenes: {
                    lastMessage: new Collection()
                }
            };

            // Set last activity
            await updateUserLastSeen(db, userId);

            // Set gender 
            if (callback_data.startsWith("set_gender_")) {
                const gender = callback_data.replace("set_gender_", "") as UserGender;
                profile.gender = gender;
                await setUserProfile(db, userId, profile);
                await ctx.answerCbQuery("پروفایل شما به‌روزرسانی شد!");
                return await ctx.editMessageText(`پروفایل شما تنظیم شد: جنسیت شما ${gender} است.`);
            }

            switch (callback_data) {

                // Start Buttons
                case "setting": {
                    await ctx.answerCbQuery("تنظیمات پروفایل شما در ربات.");
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

                    inline_keyboard.push([{ text: "مسدودی ها ⛔", callback_data: "blocked_list" }]);
                    inline_keyboard.push([{ text: "بازگشت ↩", callback_data: "return_start" }]);

                    return await ctx.editMessageText("تنظیمات:", {
                        reply_markup: { inline_keyboard },
                    });
                }

                // Setting buttons
                case "delete_nickname":
                case "change_nickname": {
                    if (callback_data === "delete_nickname") {
                        await ctx.answerCbQuery("نام نمایشی در چت خصوصی حذف شد.");
                        if (profile && profile.nickname) {
                            profile.nickname = undefined;
                            await setUserProfile(db, userId, profile)
                        };
                    }

                    else
                        await ctx.answerCbQuery("تغییر نام نمایشی در چت خصوصی");

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
                    const msg = await ctx.editMessageText(
                        markdownToHtml(nickname_text + `${ifNickname ? `\nنام نمایشی فعلی شما: \`\`\`\n**${profile.nickname}**\n\`\`\`` : ""}`),
                        {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: buttons
                            }
                        }
                    ) as Update.Edited & Message.TextMessage;
                    ctx.session.__scenes!.lastMessage!.set(msg.from!.id, {
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
                    });

                    await ctx.scene.enter("change_nickname");
                    return;
                }

                case "delete_welcome_message":
                case "change_welcome_message": {
                    if (callback_data === "delete_welcome_message") {
                        await ctx.answerCbQuery("پیام خوش آمد گویی حذف شد.");
                        if (profile && profile.welcome_message) {
                            profile.welcome_message = undefined;
                            await setUserProfile(db, userId, profile)
                        };
                    }

                    else
                        await ctx.answerCbQuery("تغییر پیغام خوش آمد گویی در چت.");

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
                    const msg = await ctx.editMessageText(
                        markdownToHtml(welcome_message_text + `${ifWelcomeMessage ? `\nپیغام فعلی شما: \`\`\`\n**${profile.welcome_message}**\n\`\`\`` : ""}`),
                        {
                            parse_mode: "HTML",
                            reply_markup: {
                                inline_keyboard: buttons
                            }
                        }
                    ) as Update.Edited & Message.TextMessage;
                    ctx.session.__scenes!.lastMessage!.set(msg.from!.id, {
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
                    });

                    await ctx.scene.enter("change_welcome_message");
                    return;
                }

                case "return_start": {
                    await ctx.answerCbQuery("بازگشت به منوی شروع");
                    return await ctx.editMessageText("چه کاری برات انجام بدم؟", { reply_markup: startMessageButtons });
                }

                // My referral link
                case "my_referral_link": {
                    const
                        referralLink = await generateReferralLink(client, userId),
                        bannerText = `👤 لینک ناشناس من\n\nسلام ${profile.nickname || callbackQuery.from.first_name} هستم 👋\nلینک زیر رو لمس کن و هر حرفی که تو دلت هست یا هر انتقادی که نسبت به من داری رو راحت بنویس و بفرست. قطعا نظرات و پیام‌هات برام ارزشمنده! 😊\n\n**🔗 لینک ناشناس من:**\n`;

                    const msg = await ctx.editMessageText(markdownToHtml(bannerText) + referralLink, {
                        parse_mode: "HTML"
                    }) as Update.Edited & Message.TextMessage;
                    return await ctx.reply(markdownToHtml("👆 پیام بالا رو به دوستات و گروه‌هایی که می‌شناسی فوروارد کن تا بتونن بهت پیام ناشناس بفرستن. پیام‌ها از طریق همین ربات بهت می‌رسه."), {
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
                                [
                                    { text: "بازگشت 🔙", callback_data: "return_start" }
                                ]
                            ]
                        }
                    })
                }

                // Faq
                case "faq": {
                    return await ctx.editMessageText(markdownToHtml("💡 لیست سوالات متداول:"), {
                        parse_mode: "HTML",
                        reply_markup: {
                            inline_keyboard: FaqButtons
                        }
                    });
                }

                // Anonymous chat
                case "anonymous_chat": {
                    return await ctx.editMessageText(readFileSync("./storage/AnonymousChatText.txt").toString(), {
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

                // Anonymous chat
                case "anonymous_chat_male":
                case "anonymous_chat_female":
                case "anonymous_chat_random": {
                    const
                        msg = await ctx.reply(
                            `در انتظار یافتن شریک چت هستیم...`,
                            { reply_parameters: { message_id: ctx.msgId! } }
                        ),
                        gender = callback_data.endsWith("_female") || callback_data.endsWith("_male") ? callback_data.replace("anonymous_chat_", "") : null;

                    let getActiveUsers = await getRecentlyActiveUsers(db);

                    getActiveUsers = getActiveUsers.filter(a => a.id !== callbackQuery.from.id);
                    if (gender)
                        getActiveUsers = getActiveUsers.filter(a => a.gender === gender);

                    const getRandomActiveUser = chooseRandom(getActiveUsers);
                    if (getActiveUsers.length > 0) {
                        const
                            partnerId = getRandomActiveUser.id!,
                            partnerProfile = await getUserProfile(db, partnerId),
                            getUserCode = await getOrCreateReferralCode(db, userId),
                            getPartnerCode = await getOrCreateReferralCode(db, partnerId);

                        await client.activeChats.set(`${userId}`, partnerId);
                        await client.activeChats.set(`${partnerId}`, userId);
                        await client.telegram.editMessageText(
                            msg.chat.id,
                            msg.message_id,
                            ctx.inlineMessageId,
                            `شما با یک کاربر ناشناس ${gender ? `با جنسیت ${gender} ` : ""}جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید.`
                        );
                        if (partnerProfile)
                            await ctx.reply(markdownToHtml(`شما با کاربر **${partnerProfile.nickname || `User_${getPartnerCode}`}** جفت شده اید.${"\n\n" + (partnerProfile.welcome_message || "")}`), {
                                parse_mode: "HTML",
                                reply_parameters: { message_id: msg.message_id }
                            })

                        try {

                            const msg = await client.telegram.sendMessage(
                                partnerId,
                                "شما با یک کاربر ناشناس جفت شدید! اکنون می‌توانید پیام‌هایتان را رد و بدل کنید."
                            );
                            if (profile)
                                await client.telegram.sendMessage(
                                    partnerId,
                                    markdownToHtml(`شما با کاربر **${profile.nickname || `User_${getUserCode}`}** جفت شده اید.${"\n\n" + (profile.welcome_message || "")}`),
                                    {
                                        parse_mode: "HTML",
                                        reply_parameters: { message_id: msg.message_id }
                                    }
                                );

                            return;
                        } catch {
                            await cleanupUser(client, userId);
                            return await client.telegram.editMessageText(
                                msg.chat.id,
                                msg.message_id,
                                ctx.inlineMessageId,
                                "متاسفانه پیام به کاربر مقابل ارسال نشد."
                            );
                        }
                    }

                    else
                        return await client.telegram.editMessageText(
                            msg.chat.id,
                            msg.message_id,
                            ctx.inlineMessageId,
                            "متاسفانه کاربری که اخیرا آنلاین باشد یافت نشد."
                        );
                }

                // Cancel sending message
                case "cancel_sending": {
                    await ctx.answerCbQuery("ارسال پیغام لغو شد.");
                    ctx.session.__scenes!.lastMessage!.delete(client.botInfo!.id);
                    await ctx.deleteMessage();
                    await ctx.scene.leave();
                    return;
                }
            }

            // Show permissions information
            if (callback_data.startsWith("info_")) {
                const
                    permission_name = callback_data.replace("info_", "") as PermissionNames,
                    permission_information = permissionsInfo[permission_name];

                return await ctx.answerCbQuery(permission_information, { show_alert: true });
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
                await ctx.answerCbQuery(action_text);
                return await ctx.editMessageReplyMarkup({ inline_keyboard: newButtons });
            }

            // Faq list
            if (callback_data.startsWith("faq_")) {
                const
                    clickedButton = FaqButtons.find(a => {
                        const button = a[0] as InlineKeyboardButton.CallbackButton
                        return button.callback_data === callback_data;
                    })![0],
                    inline_keyboard = FaqButtons.filter(a => {
                        const button = a[0] as InlineKeyboardButton.CallbackButton
                        return button.callback_data !== callback_data;
                    }),
                    text = readFileSync(`./storage/${callback_data}.txt`).toString();

                await ctx.answerCbQuery(clickedButton.text);
                return await ctx.editMessageText(markdownToHtml(text.replace("{username}", client.botInfo!.first_name)), {
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard
                    }
                })
            }

            // Anonymous chat end conversion
            if (callback_data.startsWith("end_chat_")) {
                const
                    getPartnerCode = callback_data.replace("end_chat_", ""),
                    partnerId = (await getUserIdByReferralCode(db, getPartnerCode))!;

                if (!(await client.activeChats.has(`${userId}`))) {
                    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
                    return await ctx.answerCbQuery("چت قبلاً بسته شده است.");
                }

                await client.activeChats.delete(`${userId}`);
                await client.activeChats.delete(`${partnerId}`);

                await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
                await ctx.answerCbQuery("چت با موفقیت بسته شد.");
                return await ctx.reply("حذف تاریخچه چت", {
                    reply_parameters: {
                        message_id: ctx.msgId!
                    },
                    reply_markup: {
                        inline_keyboard: [
                            [
                                { text: "🗑 پاکسازی تاریخچه چت", callback_data: `delete_messages_${getPartnerCode}` }
                            ]
                        ]
                    }
                })
            }

            // Anonymous chat delete conversion
            if (callback_data.startsWith("delete_messages_")) {
                const
                    getPartnerCode = callback_data.replace("delete_messages_", ""),
                    partnerId = (await getUserIdByReferralCode(db, getPartnerCode))!,
                    userMessageDB = `${userId}.${partnerId}`,
                    userMessages = await client.chatMessages.get(userMessageDB),
                    partnerMessages = userMessages?.map(a => a[1])!;

                if (!userMessages) {
                    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
                    return await ctx.answerCbQuery("تاریخچه چت قبلا پاکسازی شده است.");
                }

                try {
                    await ctx.telegram.deleteMessages(partnerId, partnerMessages);
                    await ctx.telegram.deleteMessages(userId, userMessages.map(a => a[0]));
                    await client.chatMessages.delete(userMessageDB);
                    await ctx.answerCbQuery("تاریخچه چت شما پاک شد.");
                } catch {
                    await ctx.answerCbQuery("خطایی پیش آمد.");
                }
                await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
                return await ctx.reply("تاریخچه چت با موفقیت پاک شد.", {
                    reply_parameters: {
                        message_id: ctx.msgId!
                    }
                })
            }

            // Anonymous chat delete conversion
            if (callback_data.startsWith("delete_message_")) {
                const
                    [forwardMessageId, userMessageId] = callback_data.replace("delete_message_", "").split("-"),
                    partnerId = (await client.activeChats.get(`${userId}`))!,
                    inline_keyboard = await deleteClickedInlineKeyBoard(callbackQuery, (button) => {
                        return button.callback_data !== callbackQuery.data && !button.callback_data.startsWith("edit_message_");
                    });

                try {
                    await client.telegram.deleteMessage(userId, +userMessageId).catch(null);
                    await client.telegram.deleteMessage(partnerId, +forwardMessageId).catch(null);
                    await ctx.answerCbQuery("پیام حذف شد.");
                } catch {
                    await ctx.answerCbQuery("خطا در حذف پیام!");
                }

                return await ctx.editMessageReplyMarkup({ inline_keyboard }).catch(null);
            }

            // Anonymous chat edit message
            if (callback_data.startsWith("edit_message_")) {
                await ctx.answerCbQuery("خیلی خوب، پیام ویرایش شده ی خودتون رو بفرستید.");
                const
                    messageId = callback_data.replace("edit_message_", ""),
                    msg = await ctx.reply(
                        "پیام خودتون رو ارسال کنید تا برای کاربر ویرایش شود.",
                        {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text: "انصراف", callback_data: "cancel_sending" }
                                    ]
                                ]
                            },
                            reply_parameters: {
                                message_id: ctx.msgId!
                            }
                        }
                    ) as Update.Edited & Message.TextMessage;

                // Set last message to answer  
                ctx.session.__scenes!.lastMessage!.set(msg.from!.id, {
                    text: msg.text,
                    message_id: msg.message_id,
                    chat: {
                        id: msg.chat.id,
                        type: msg.chat.type
                    },
                    from: {
                        id: msg.from!.id,
                        username: msg.from!.username
                    },
                    to: +messageId
                });

                await ctx.scene.enter("edit_message");
                return;
            }

            // Anonymous chat contnue conversion or answer
            if (callback_data.startsWith("continue_chat_") || callback_data.startsWith("answer_")) {
                await ctx.answerCbQuery("خیلی خوب، پیام خودتون رو بفرستید.");
                const
                    partnerId = (await getUserIdByReferralCode(db, callback_data.replace("continue_chat_", "").replace("answer_", "")))!,
                    msg = await ctx.reply(
                        "پیام خودتون رو ارسال کنید تا برای کاربر ارسال بشه.",
                        {
                            reply_markup: {
                                inline_keyboard: [
                                    [
                                        { text: "انصراف", callback_data: "cancel_sending" }
                                    ]
                                ]
                            },
                            reply_parameters: {
                                message_id: ctx.msgId!
                            }
                        }
                    ) as Update.Edited & Message.TextMessage;

                // Set last message to answer  
                ctx.session.__scenes!.lastMessage!.set(msg.from!.id, {
                    text: msg.text,
                    message_id: msg.message_id,
                    chat: {
                        id: msg.chat.id,
                        type: msg.chat.type
                    },
                    from: {
                        id: msg.from!.id,
                        username: msg.from!.username
                    },
                    to: partnerId
                });

                await ctx.scene.enter("continue_or_answer_chat");
                return;
            }

            // Anonymous chat delete conversion
            if (callback_data.startsWith("block_")) {
                const
                    getPartnerCode = callback_data.replace("block_", ""),
                    partnerId = (await getUserIdByReferralCode(db, getPartnerCode))!,
                    userMessageDB = `${userId}.${partnerId}`,
                    userMessages = await client.chatMessages.get(userMessageDB),
                    partnerMessages = userMessages?.map(a => a[1])!;

                if (!userMessages) {
                    await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
                    return await ctx.answerCbQuery("تاریخچه چت قبلا پاکسازی شده است.");
                }

                try {
                    await ctx.telegram.deleteMessages(partnerId, partnerMessages);
                    await ctx.telegram.deleteMessages(userId, userMessages.map(a => a[0]));
                    await client.chatMessages.delete(userMessageDB);

                    await ctx.answerCbQuery("تاریخچه ");
                } catch {
                    await ctx.answerCbQuery("خطایی پیش آمد.");
                }
                await ctx.editMessageReplyMarkup({ inline_keyboard: [] });
                return await ctx.reply("تاریخچه چت با موفقیت پاک شد.", {
                    reply_parameters: {
                        message_id: ctx.msgId!
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