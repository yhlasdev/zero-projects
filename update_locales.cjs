const fs = require('fs');
const path = require('path');

const basePath = "c:\\Users\\User\\Desktop\\zero-projects\\src\\locales";
const locales = {
    "en.json": {
        "tasks": {"createSuccess": "Successfuly created task"},
        "settings": {
            "contact": {"loadFail": "Failed to load contact information. Please refresh the page."},
            "overview": {"loadFail": "Failed to load company overview."}
        },
        "login": {"loginSuccess": "Logged in successfully!"},
        "employees": {
            "scheduleDeleted": "Schedule deleted successfully",
            "scheduleDeleteFail": "Failed to delete schedule"
        }
    },
    "ru.json": {
        "tasks": {"createSuccess": "Задача успешно создана"},
        "settings": {
            "contact": {"loadFail": "Не удалось загрузить контактную информацию. Пожалуйста, обновите страницу."},
            "overview": {"loadFail": "Не удалось загрузить обзор компании."}
        },
        "login": {"loginSuccess": "Успешный вход в систему!"},
        "employees": {
            "scheduleDeleted": "Расписание успешно удалено",
            "scheduleDeleteFail": "Не удалось удалить расписание"
        }
    },
    "tk.json": {
        "tasks": {"createSuccess": "Wezipe üstünlikli döredildi"},
        "settings": {
            "contact": {"loadFail": "Habarlaşmak üçin maglumatlary ýükläp bolmady. Sahypany täzelemegiňizi haýyş edýäris."},
            "overview": {"loadFail": "Kompaniýa barada syny ýükläp bolmady."}
        },
        "login": {"loginSuccess": "Üstünlikli girdiňiz!"},
        "employees": {
            "scheduleDeleted": "Iş tertibi üstünlikli pozuldy",
            "scheduleDeleteFail": "Iş tertibini pozmak başartmady"
        }
    }
};

for (const [fileName, updates] of Object.entries(locales)) {
    const filePath = path.join(basePath, fileName);
    let data;
    try {
        data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        data = {};
    }
    
    for (const [section, keys] of Object.entries(updates)) {
        if (!data[section]) data[section] = {};
        for (const [k, v] of Object.entries(keys)) {
            if (typeof v === 'object') {
                if (!data[section][k]) data[section][k] = {};
                for (const [nk, nv] of Object.entries(v)) {
                    data[section][k][nk] = nv;
                }
            } else {
                data[section][k] = v;
            }
        }
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}
