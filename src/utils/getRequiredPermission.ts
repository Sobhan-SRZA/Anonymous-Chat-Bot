import { PermissionNames } from "../types/UserProfile";

export default function getRequiredPermission(message: any): PermissionNames | null {
  if (message.video_note)
    return "send_circule_video";

  else if (message.photo)
    return "send_image";

  else if (message.video)
    return "send_video";

  else if (message.animation)
    return "send_gif";

  else if (message.voice)
    return "send_voice";

  else if (message.audio)
    return "send_music";

  else if (message.document)
    return "send_file";

  else if (message.sticker)
    return "send_sticker";

  else if (message.text)
    return "send_text";

  return null;
}
/**
 * @copyright
 * Code by Sobhan-SRZA (mr.sinre) | https://github.com/Sobhan-SRZA
 * Developed for Persian Caesar | https://github.com/Persian-Caesar | https://dsc.gg/persian-caesar
 *
 * If you encounter any issues or need assistance with this code,
 * please make sure to credit "Persian Caesar" in your documentation or communications.
 */