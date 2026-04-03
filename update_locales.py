import json
import os

base_path = "c:\\Users\\User\\Desktop\\zero-projects\\src\\locales"
locales = {
    "en.json": {
        "tasks": {"createSuccess": "Successfully created task"},
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
}

for file_name, updates in locales.items():
    file_path = os.path.join(base_path, file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    for section, keys in updates.items():
        if section not in data:
            data[section] = {}
        for k, v in keys.items():
            if isinstance(v, dict):
                if k not in data[section]:
                    data[section][k] = {}
                for nk, nv in v.items():
                    data[section][k][nk] = nv
            else:
                data[section][k] = v

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
