require("dotenv").config();
const { Telegraf, Markup } = require("telegraf");
const { google } = require("googleapis");

const bot = new Telegraf(process.env.BOT_TOKEN);

const SPREADSHEET_ID = "1B3NJ25i9g2TkdHsljF7iQgD2EEHlOH1FxmPlEv_squg";

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

async function saveUserData(user) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Лист1!A:A",
        });

        const rows = response.data.values || [];
        const userIds = rows.flat();

        if (userIds.includes(user.id.toString())) {
            console.log(`Пользователь с ID ${user.id} уже есть в таблице.`);
            return;
        }

        const date = new Date().toISOString();
        const values = [
            [
                user.id,
                user.username || "",
                user.first_name || "",
                user.last_name || "",
                date,
            ],
        ];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Лист1!A:E",
            valueInputOption: "RAW",
            requestBody: { values },
        });

        console.log("Данные пользователя сохранены:", user);
    } catch (error) {
        console.error("Ошибка при записи в Google-таблицу:", error);
    }
}

// === Логика бота ===
bot.start(async (ctx) => {
    const user = ctx.from;

    // Сохраняем данные пользователя
    await saveUserData(user);

    await ctx.reply("Сейчас загрузится, подожди 🤗", { parse_mode: "HTML" });

    // Шаг 1: Отправляем файл про питание
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

    // Шаг 2: Через 5 секунд отправляем текстовое сообщение
    setTimeout(() => {
        ctx.reply(
            "😎 А теперь посмотри, каких результатов можно добиться благодаря тренировкам дома на таком вкусном и разнообразном питании ⤵️",
            { parse_mode: "HTML" },
        );
    }, 5000);

    // Шаг 3: Через 2 секунды отправляем фотографии
    setTimeout(() => {
        ctx.replyWithMediaGroup([
            {
                type: "photo",
                media: { source: "./assets/images/change_1.jpg" },
            },
        ]);
    }, 7000);

    // Шаг 4: Через 5 секунд отправляем текст
    setTimeout(() => {
        ctx.reply(
            "А так стройные девушки избавляются от целлюлита, добиваются рельефа и улучшают осанку 😍⤵️",
            { parse_mode: "HTML" },
        );
    }, 17000);

    // Шаг 5: Через 5 секунд отправляем еще фотографии
    setTimeout(() => {
        ctx.replyWithMediaGroup([
            {
                type: "photo",
                media: { source: "./assets/images/change_2.jpg" },
            },
        ]);
    }, 19000);

    // Шаг 6: Через 5 секунд отправляем текст с кнопкой
    setTimeout(() => {
        ctx.reply(
            "Узнай о моём фитнес-проекте по кнопке ниже! 👇",
            Markup.inlineKeyboard(
                [Markup.button.callback("Узнать подробнее", "FITNESS_PROJECT")],

                { resize_keyboard: true },
            ),
        );
    }, 24000);
});

// Обработка нажатия на кнопку "Узнать"
bot.action("FITNESS_PROJECT", async (ctx) => {
    await ctx.reply(
        "Меню завтраков – это лишь малая часть \nвсей системы питания, которой я обучаю.\n\n💙 5 августа стартует 10-й поток \nфитнес-проекта Naumova Team с \nдомашними тренировками, в котором ты \nсможешь получить:\n\n✅ План питания со вкусными и быстрыми рецептами 🍽️\n\n✅ Продуктовую корзину\n\n✅ Общий чат для поддержки и мотивации ❤️\n\n❗️И ты научишься самостоятельно составлять блюда без подсчета калорий и взвешивания продуктов.",
        { parse_mode: "HTML" },
    );

    // Через 2 секунд отправляем изображение
    setTimeout(() => {
        ctx.replyWithMediaGroup([
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
    }, 3000);

    // Через 5 секунд отправляем текст с кнопками
    setTimeout(() => {
        ctx.reply(
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
    }, 10000);
});

// Обработка нажатия на кнопку "Что еще входит?"
bot.action("MORE_INFO", async (ctx) => {
    await ctx.reply(
        "🌟 Фитнес-проект Naumova Team \nзаменит тебе абонемент в тренажерку и \nпоможет достичь результата.\n\nВсего за 65 BYN ты получишь доступ к \nтренировкам и программе питания.\n\nЧто тебя ждет, помимо разбора питания:\n\n🏋️‍♂️ 9 домашних тренировок по 30 минут \n\nбез дополнительного инвентаря.\nТренироваться можно в любое удобное время.\n\n✅ Во время тренировок я не только \nобъясняю технику, но и поддерживаю \nсвоих атлетов, чтобы все дошли до конца.\n\n👍Цена - 65 BYN\n\n⏰ Длительность проекта: 3 недели.\n⏳ Доступ ко всем материалам: 4 недели.\n\nПосмотри на результаты моих атлетов 😍👇",
        { parse_mode: "HTML" },
    );

    // Через 2 секунды отправляем изображения
    setTimeout(() => {
        ctx.replyWithMediaGroup([
            {
                type: "photo",
                media: { source: "./assets/images/change_3.jpg" },
            },
        ]);
    }, 2000);

    setTimeout(() => {
        ctx.reply("А вот что говорят сами атлеты 😍🤗", { parse_mode: "HTML" });
    }, 4000);

    setTimeout(() => {
        ctx.replyWithMediaGroup([
            {
                type: "photo",
                media: { source: "./assets/images/comment_1.jpg" },
            },
        ]);
    }, 6000);

    // Через 5 секунды отправляем кнопку "Оплатить"
    setTimeout(() => {
        ctx.reply(
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
    }, 11000);
});

bot.action("PAYMENT_INFO", async (ctx) => {
    const adminId = "219164119"; // Ваш Telegram ID (замените на актуальный)
    const user = ctx.from; // Информация о пользователе, вызвавшем действие

    // 1. Отправка уведомления админу
    const adminMessage = `
👤 Пользователь хочет узнать о способах оплаты:
▪️ Имя: ${user.first_name} ${user.last_name || ""}
▪️ Username: @${user.username || "не указан"}
▪️ ID: ${user.id}
    `;
    try {
        await ctx.telegram.sendMessage(adminId, adminMessage.trim());
    } catch (error) {
        console.error("Ошибка при отправке сообщения админу:", error);
    }

    // 2. Ответ пользователю
    await ctx.answerCbQuery(); // Убирает "часики" на кнопке
    await ctx.reply(
        "🌟 В ближайшее время я напишу тебе и расскажу про все варианты оплаты. Спасибо 😇",
        { parse_mode: "HTML" },
    );
});

// Запуск бота
bot.launch();
console.log("Бот запущен! Ожидаем пользователей...");

// Обработка сигналов для завершения
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
