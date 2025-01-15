require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const express = require("express");
const { saveUserData, delay } = require("./googleSheetsFunc");
const { setupBotActions } = require("./botActions");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
    const user = ctx.from;
    await saveUserData(user);
    await ctx.reply("Сейчас загрузится, подожди 🤗", { parse_mode: "HTML" });

    await ctx.replyWithDocument(
        {
            source: "./assets/documents/nutrition.pdf",
            filename: "nutrition.pdf",
        },
        {
            caption: "Вот ваш документ с информацией о питании!",
            parse_mode: "HTML",
        },
    );

    await delay(5000);
    await ctx.reply(
        "😎 А теперь посмотри, каких результатов можно добиться благодаря тренировкам дома на таком вкусном и разнообразном питании ⤵️",
        { parse_mode: "HTML" },
    );

    await delay(2000);
    await ctx.replyWithMediaGroup([
        {
            type: "photo",
            media: { source: "./assets/images/change_1.jpg" },
        },
    ]);

    await delay(5000);
    await ctx.reply(
        "А так стройные девушки избавляются от целлюлита, добиваются рельефа и улучшают осанку 😍⤵️",
        { parse_mode: "HTML" },
    );

    await delay(5000);
    await ctx.replyWithMediaGroup([
        {
            type: "photo",
            media: { source: "./assets/images/change_2.jpg" },
        },
    ]);

    await delay(5000);
    await ctx.reply(
        "Узнай о моём фитнес-проекте по кнопке ниже! 👇",
        Markup.inlineKeyboard(
            [Markup.button.callback("Узнать подробнее", "FITNESS_PROJECT")],
            { resize_keyboard: true },
        ),
    );
});

setupBotActions(bot);

const app = express();
app.use(bot.webhookCallback("/bot"));
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = `${process.env.WEBHOOK_URL}/bot`;
bot.telegram.setWebhook(WEBHOOK_URL);

app.listen(PORT, () => {
    console.log(
        `Сервер запущен на порту ${PORT}, вебхук установлен на ${WEBHOOK_URL}`,
    );
});
