const UserPermissionDescriptions: Record<PermissionNames, string> = {
    random_chat: "چت شانسی",
    found_user_link: "لینک یاب",
    send_text: "ارسال متن",
    send_image: "ارسال عکس",
    send_video: "ارسال ویدیو",
    send_circule_video: "ارسال ویدیو گرد",
    send_gif: "ارسال گیف",
    send_music: "ارسال موزیک",
    send_voice: "ارسال ویس",
    send_file: "ارسال فایل",
    send_sticker: "ارسال استیکر",
};

const permissionsMapping: Record<PermissionNames, { label: string; infoCallback: string }> = {
    random_chat: { label: "چت شانسی 🎲", infoCallback: "info_random_chat" },
    found_user_link: { label: "لینک یاب 🔍", infoCallback: "info_found_user_link" },
    send_text: { label: "ارسال متن 📝", infoCallback: "info_send_text" },
    send_image: { label: "ارسال عکس 🖼", infoCallback: "info_send_image" },
    send_video: { label: "ارسال ویدیو 🎥", infoCallback: "info_send_video" },
    send_circule_video: { label: "ارسال ویدیو گرد 📹", infoCallback: "info_send_circule_video" },
    send_gif: { label: "ارسال گیف 🎞", infoCallback: "info_send_gif" },
    send_music: { label: "ارسال موزیک 🎶", infoCallback: "info_send_music" },
    send_voice: { label: "ارسال ویس 🎙", infoCallback: "info_send_voice" },
    send_file: { label: "ارسال فایل 📂", infoCallback: "info_send_file" },
    send_sticker: { label: "ارسال استیکر 😬", infoCallback: "info_send_sticker" },
};

const permissionsInfo = {
    random_chat: "بقیه بتونن بدون استفاده از لینک به طور تصادفی باهات چت کنن؟",
    found_user_link: "بقیه بتونن لینک چت خصوصیت رو از طریق ربات پیدا کنن؟",
    send_text: "توی چت خصوصی بتونن برات پیام متنی بفرستن؟",
    send_image: "توی چت خصوصی بتونن برات عکس بفرستن؟",
    send_video: "توی چت خصوصی بتونن برات ویدیو بفرستن؟",
    send_circule_video: "توی چت خصوصی بتونن برات ویدیو گرد بفرستن؟",
    send_gif: "توی چت خصوصی بتونن برات گیف بفرستن؟",
    send_music: "توی چت خصوصی بتونن برات موزیک بفرستن؟",
    send_voice: "توی چت خصوصی بتونن برات ویس بفرستن؟",
    send_file: "توی چت خصوصی بتونن برات فایل بفرستن؟",
    send_sticker: "توی چت خصوصی بتونن برات استیکر بفرستن؟"
};


function getToggleButton(permissionKey: PermissionNames, isEnabled: boolean) {
    return {
        text: isEnabled ? "فعال ✅" : "غیر فعال ❌",
        callback_data: `${permissionKey}_${isEnabled ? "on" : "off"}`,
    };
}

export {
    permissionsInfo,
    UserPermissionDescriptions,
    permissionsMapping,
    getToggleButton
};

export type PermissionNames =
    "random_chat"
    | "found_user_link"
    | "send_text"
    | "send_image"
    | "send_video"
    | "send_circule_video"
    | "send_gif"
    | "send_music"
    | "send_voice"
    | "send_file"
    | "send_sticker";

export type UserGender = "male" | "female" | "other";

export default interface Profile {
    gender?: UserGender;
    lastSeen?: number;
    nickname?: string;
    welcome_message?: string;
    permissions?: {
        random_chat?: boolean;
        found_user_link?: boolean;
        send_text?: boolean;
        send_image?: boolean;
        send_video?: boolean;
        send_circule_video?: boolean;
        send_gif?: boolean;
        send_music?: boolean;
        send_voice?: boolean;
        send_file?: boolean;
        send_sticker?: boolean;
    }
};


export interface UserData {
    name?: string;
    username?: string;
    id?: number;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */