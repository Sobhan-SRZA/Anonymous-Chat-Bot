# Anonymous Chat Bot 🤖

This project is a Telegram bot that enables users to chat anonymously. It features a referral system where each user can generate a unique referral link (without revealing their Telegram ID), profile creation (e.g., setting gender), and random anonymous chat options with filtering.

> **Note:** The bot supports various message types (text, stickers, photos, files, voice messages, videos, etc.) by copying messages so that the sender’s identity remains hidden.

---

## Features ✨

- **Anonymous Chat:** Chat with random users without revealing your personal details.
- **Referral System:** Generate a unique referral code and share your referral link without exposing your Telegram user ID.
- **Profile Management:** Set up your profile (e.g., gender) for filtered random chats.
- **Multi-type Messaging:** All message types (text, photo, sticker, video, etc.) are forwarded/copyed anonymously.
- **Database Integration:** Uses [quick.db](https://www.npmjs.com/package/quick.db) with JsonDriver for storing non-sensitive data like profiles and referral codes.

---

## Prerequisites ⚙️

- **Node.js** (v14 or higher recommended)
- **Telegram Bot Token:** Create a bot via [BotFather](https://core.telegram.org/bots#6-botfather) and obtain your bot token.

---

## Setup Instructions 🚀

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/anonymous-chat-bot.git
cd anonymous-chat-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure the `.env` File

Create a `.env` file in the root directory. **Make sure to provide values for at least `token` and `database_type`.**  
Below is an example configuration:

```ini
# Bot token (required)
token="YOUR_TELEGRAM_BOT_TOKEN"

# Database type (required): options are "mysql" | "sql" | "mongodb" | "json"
database_type="json"

# (Optional) If using MongoDB:
database_mongoURL="your-mongo-url"

# (Optional) If using MySQL:
database_msql_host="your-mysql-host"
database_msql_user="your-mysql-user"
database_msql_password="your-mysql-password"
database_msql_database="your-mysql-database"

# Support server invite link (optional)
support_url="https://discord.gg/yourInvite"

# Source owners (optional, comma-separated list of owner IDs)
owners='["123456789", "987654321"]'

# Anti crash controller (optional)
anti_crash="true"

# Send console errors to Discord (optional)
logger="true"
```

### 4. Running the Bot

You can run the bot in development mode using `ts-node`:

```bash
npm start
```

Or compile the TypeScript code to JavaScript and run it:

```bash
npm run build
node dist/index.js
```

---

## Available Commands 📜

| Command             | Description                                                                                                                                        | Emoji |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ----- |
| `/start`            | Starts the bot. Without parameters, it shows usage instructions. With a referral parameter (`ref-<referralCode>`), it connects you with a partner. | 🚀     |
| `/setprofile`       | Opens an inline menu to let you set your profile (e.g., choose your gender).                                                                       | 👤     |
| `/myprofile`        | Displays your profile and your unique referral link (e.g., `https://t.me/<botUsername>?start=ref-<referralCode>`).                                 | 📄     |
| `/activateReferral` | Puts you in a waiting state to accept incoming connections via your referral link.                                                                 | 🔗     |
| `/anon`             | Joins the general queue for a random anonymous chat (without any profile filtering).                                                               | 💬     |
| `/random`           | Joins the queue for a random chat filtered by profile (e.g., gender). Optionally, you can pass a parameter (e.g., `/random male`).                 | 🎲     |
| `/stop`             | Stops the current chat session and removes you from any waiting queues.                                                                            | ✋     |

---

## Packages & Versions 📦

| Package    | Version | Description                                                            | Emoji |
| ---------- | ------- | ---------------------------------------------------------------------- | ----- |
| telegraf   | ^4.12.2 | Telegram bot framework for interacting with the Telegram Bot API.      | 🤖     |
| dotenv     | ^16.0.3 | Loads environment variables from a `.env` file.                        | 🌱     |
| quick.db   | ^9.1.2  | A simple SQLite-based database using JsonDriver for storing bot data.  | 🗄️     |
| typescript | ^4.8.4  | Superset of JavaScript for static type checking (dev dependency).      | 💻     |
| ts-node    | ^10.9.1 | Runs TypeScript files directly without pre-compiling (dev dependency). | ⚡     |

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Final Steps

1. **Ensure your `.env` file is properly configured** with at least the `token` and `database_type` values.
2. **Run `npm install`** to install all dependencies.
3. **Start your bot** using `npm start` (or build and run the compiled JavaScript).

Enjoy using the Anonymous Chat Bot and feel free to extend its functionality as needed!

---

## Contact

 <div align="center">
  <a href="http://sobhan.epizy.com" target="_blank">
   <img align="left" src="https://github.com/user-attachments/assets/69b35053-17b1-48c6-a35b-4d3881a4dd2c" width=50%>
  </a>
  <a href="https://t.me/d_opa_mine" target="_blank">
   <img alt="Telegram"
    src="https://img.shields.io/static/v1?message=Telegram&logo=telegram&label=&color=229ED9&logoColor=white&labelColor=&style=flat"
    height="30" />
  </a>
  <a href="https://www.instagram.com/mr.sinre?igsh=cWk1aHdhaGRnOGg%3D&utm_source=qr" target="_blank">
   <img alt="Instagram"
    src="https://img.shields.io/static/v1?message=Instagram&logo=instagram&label=&color=C13584&logoColor=white&labelColor=&style=flat"
    height="30" />
  </a>
  <a href="https://www.twitch.tv/sobhan_srza" target="_blank">
   <img alt="Twitch"
    src="https://img.shields.io/static/v1?message=Twitch&logo=twitch&label=&color=6441A4&logoColor=white&labelColor=&style=flat"
    height="30" />
  </a>
  <a href="https://www.youtube.com/@mr_sinre?app=desktop&sub_confirmation=1" target="_blank">
   <img alt="YouTube"
    src="https://img.shields.io/static/v1?message=YouTube&logo=youtube&label=&color=FF0000&logoColor=white&labelColor=&style=flat"
    height="30" />
  </a>
  <a href="https://github.com/Sobhan-SRZA" target="_blank">
   <img alt="Github"
    src="https://img.shields.io/static/v1?message=Github&logo=github&label=&color=000000&logoColor=white&labelColor=&style=flat"
    height="30" />
  </a>
  </p>
  <p align="left">
   <a href="https://discord.gg/xh2S2h67UW" target="_blank">
    <img src="https://discord.com/api/guilds/1054814674979409940/widget.png?style=banner2" alt="pc-development.png">
   </a>
  </p>
  <p align="right">
   <a href="https://discord.gg/54zDNTAymF" target="_blank">
    <img src="https://discord.com/api/guilds/1181764925874507836/widget.png?style=banner2" alt="pc-club.png">
   </a>
  </p>
  <div align="center">
   <a href="https://discord.com/users/865630940361785345" target="_blank">
    <img alt="My Discord Account" src="https://discord.c99.nl/widget/theme-1/865630940361785345.png" />
   </a>
  </div>
 </div>