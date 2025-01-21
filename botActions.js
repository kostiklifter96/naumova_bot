const { Markup } = require("telegraf");
const { delay } = require("./googleSheetsFunc");

function setupBotActions(bot) {
    bot.action("FITNESS_PROJECT", async (ctx) => {
        await ctx.reply(
            `Мой фитнес-проект - это не марафон, это полноценное обучение питанию,выполнение тренировок и изменение образа жизни.

10 февраля стартует 16-й поток фитнес-проекта Naumova Team в котором ты сможешь получить:

✅ 3 варианта питания на выбор:
- по меню-конструктору с рассчитанным кБЖУ (60 рецептов)
- по методу тарелки без подсчета калорий
- меню на 21 день с рассчитанным КБЖУ

✅ Продуктовую корзину на каждую неделю
            
✅ 9 тренировок на все тело по 30 мин, которые можно выполнять в любое время

✅ Общий чат с Кариной`,
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
            "Поспеши, старт потока 10 февраля!\nЦена - 79 BYN 👇",
            Markup.inlineKeyboard(
                [
                    [
                        Markup.button.url(
                            "ХОЧУ УЧАСТВОВАТЬ 🔥",
                            "https://naumova-team.by/?utm_source=telegram&utm_medium=chat_bot&utm_campaign=sryv_knopka_1",
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
            `🌟 Зачем ждать ? Время меняться уже настало! 

🔥В фитнес-проекте Naumova Team ты получишь не только доступ к тренировкам и программе питания.

Но и:

✔️ видеоматериал "Как рассчитывать свое кБЖУ и пользоваться приложением для подсчета калорий";
✔️ видеоматериал "Как похудеть без подсчета калорий";
✔️ видеоматериал "Как не срываться по вечерам и отсрочить чувство голода";
✔️ видеоматериал "Как различать эмоциональный голод от физического";
✔️ видеоматериал "КАК ПОХУДЕТЬ И СОХРАНИТЬ РЕЗУЛЬТАТ НАВСЕГДА";

✔️ чек-лист "Продукты-находки" (это продукты с выгодным кБЖУ, на которых легко худеть);
✔️ праздничные низкокалорийные рецепты;

✔️ розыгрыш фитнес-бокса.

✅ А еще тренироваться можно в любое удобное время (тренировки в записи)

✅ Во время тренировок я не только объясняю технику, но и поддерживаю своих атлетов, чтобы все дошли до конца.

👍Цена - 79 BYN

⏰ Длительность проекта: 3 недели.
⏳ Доступ ко всем материалам: 4 недели.

Посмотри на результаты моих атлетов😍👇
И знай: у тебя тоже всё получится!`,
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
            "Посвяти 2025 год своему здоровью и красивой фигуре! Старт уже 10 февраля!",
            Markup.inlineKeyboard(
                [
                    [
                        Markup.button.url(
                            "ХОЧУ УЧАСТВОВАТЬ 🔥",
                            "https://naumova-team.by/?utm_source=telegram&utm_medium=chat_bot&utm_campaign=sryv_knopka_2",
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
        await ctx.answerCbQuery();
        await ctx.reply("Введи, пожалуйста, свой инстаграм для связи:");

        bot.on("text", async (ctx) => {
            const nickname = ctx.message.text;
            const adminId = process.env.ADMIN_ID;
            const user = ctx.from;
            const adminMessage = `
    👤 Пользователь хочет узнать о способах оплаты:
    ▪️ Имя: ${user.first_name} ${user.last_name || ""}
    ▪️ UsernameTelegram: @${user.username || "не указан"}
    ▪️ InstagramUser: https://www.instagram.com/${
        nickname.toLowerCase() || "не указан"
    }
    ▪️ ID: ${user.id}`;

            try {
                await ctx.telegram.sendMessage(adminId, adminMessage.trim());
            } catch (error) {
                console.error("Ошибка при отправке сообщения админу:", error);
            }

            await ctx.reply(
                "🌟 В ближайшее время я напишу тебе и расскажу про все варианты оплаты. Спасибо 😇",
                { parse_mode: "HTML" },
            );
        });
    });
}

module.exports = { setupBotActions };
