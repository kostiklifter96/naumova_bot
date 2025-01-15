const { Markup } = require("telegraf");
const { delay } = require("./googleSheetsFunc");

function setupBotActions(bot) {
    bot.action("FITNESS_PROJECT", async (ctx) => {
        await ctx.reply(
            "Меню завтраков – это лишь малая часть всей системы питания, которой я обучаю.\n\n💙 5 августа стартует 10-й поток фитнес-проекта Naumova Team с домашними тренировками, в котором ты сможешь получить:\n\n✅ План питания со вкусными и быстрыми рецептами 🍽️\n\n✅ Продуктовую корзину\n\n✅ Общий чат для поддержки и мотивации ❤️\n\n❗️И ты научишься самостоятельно составлять блюда без подсчета калорий и взвешивания продуктов.",
            { parse_mode: "HTML" },
        );

        await delay(3000);
        await ctx.replyWithMediaGroup([
            {
                type: "photo",
                media: { source: "./assets/images/eat_1.jpg" },
            },
            {
                type: "photo",
                media: { source: "./assets/images/eat_2.jpg" },
            },
            {
                type: "photo",
                media: { source: "./assets/images/eat_3.jpg" },
            },
        ]);

        await delay(5000);
        await ctx.reply(
            "Поспеши, старт потока 5 августа!\nЦена - 65 BYN 👇",
            Markup.inlineKeyboard(
                [
                    [
                        Markup.button.url(
                            "ХОЧУ УЧАСТВОВАТЬ 🔥",
                            "https://naumova-team.by/?utm_source=telegram&utm_medium=chat_bot&utm_campaign=zavtrak_knopka_1",
                        ),
                    ],
                    [Markup.button.callback("ЧТО ЕЩЕ ВХОДИТ?", "MORE_INFO")],
                ],
                { resize_keyboard: true },
            ),
        );
    });

    bot.action("MORE_INFO", async (ctx) => {
        await ctx.reply(
            "🌟 Фитнес-проект Naumova Team заменит тебе абонемент в тренажерку и поможет достичь результата.\n\nВсего за 65 BYN ты получишь доступ к тренировкам и программе питания.\n\nЧто тебя ждет, помимо разбора питания:\n\n🏋️‍♂️ 9 домашних тренировок по 30 минут \n\nбез дополнительного инвентаря. Тренироваться можно в любое удобное время.\n\n✅ Во время тренировок я не только объясняю технику, но и поддерживаю своих атлетов, чтобы все дошли до конца.\n\n👍Цена - 65 BYN\n\n⏰ Длительность проекта: 3 недели.\n⏳ Доступ ко всем материалам: 4 недели.\n\nПосмотри на результаты моих атлетов 😍👇",
            { parse_mode: "HTML" },
        );

        await delay(2000);
        await ctx.replyWithMediaGroup([
            {
                type: "photo",
                media: { source: "./assets/images/change_3.jpg" },
            },
        ]);

        await delay(4000);
        await ctx.reply("А вот что говорят сами атлеты 😍🤗", {
            parse_mode: "HTML",
        });

        await delay(2000);
        await ctx.replyWithMediaGroup([
            {
                type: "photo",
                media: { source: "./assets/images/comment_1.jpg" },
            },
        ]);

        await delay(6000);
        await ctx.reply(
            "Поспеши, старт потока 5 августа!",
            Markup.inlineKeyboard(
                [
                    [
                        Markup.button.url(
                            "ХОЧУ УЧАСТВОВАТЬ 🔥",
                            "https://naumova-team.by/?utm_source=telegram&utm_medium=chat_bot&utm_campaign=zavtrak_knopka_2",
                        ),
                    ],
                    [
                        Markup.button.callback(
                            "КАК МОЖНО ОПЛАТИТЬ?",
                            "PAYMENT_INFO",
                        ),
                    ],
                ],
                { resize_keyboard: true },
            ),
        );
    });

    bot.action("PAYMENT_INFO", async (ctx) => {
        const adminId = process.env.ADMIN_ID;
        const user = ctx.from;
        const adminMessage = `
👤 Пользователь хочет узнать о способах оплаты:
▪️ Имя: ${user.first_name} ${user.last_name || ""}
▪️ Username: @${user.username || "не указан"}
▪️ ID: ${user.id}`;

        try {
            await ctx.telegram.sendMessage(adminId, adminMessage.trim());
        } catch (error) {
            console.error("Ошибка при отправке сообщения админу:", error);
        }

        await ctx.answerCbQuery();
        await ctx.reply(
            "🌟 В ближайшее время я напишу тебе и расскажу про все варианты оплаты. Спасибо 😇",
            { parse_mode: "HTML" },
        );
    });
}

module.exports = { setupBotActions };
