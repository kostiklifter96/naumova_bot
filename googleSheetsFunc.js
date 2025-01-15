const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});
const sheets = google.sheets({ version: "v4", auth });

async function saveUserData(user) {
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: "Лист1!A:A",
        });
        const rows = response.data.values || [];

        if (rows.flat().includes(user.id.toString())) {
            console.log(`Пользователь с ID ${user.id} уже есть в таблице.`);
            return;
        }

        const values = [
            [
                user.id,
                user.username || "",
                user.first_name || "",
                user.last_name || "",
                new Date().toISOString(),
            ],
        ];
        await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: "Лист1!A:E",
            valueInputOption: "RAW",
            requestBody: { values },
        });
        console.log("Данные пользователя сохранены:", user);
    } catch (error) {
        console.error("Ошибка записи в таблицу:", error);
    }
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { saveUserData, delay };
