export type Lang = "ru" | "uz";

export const translations = {
  ru: {
    // Navbar
    nav: {
      courses: "Курсы",
      about: "О нас",
      whyUs: "Почему мы",
      contacts: "Контакты",
      login: "Войти",
      register: "Записаться",
    },
    // Hero
    hero: {
      badge: "Профессиональное IT-образование",
      title1: "Suffa",
      title2: "IT Academy",
      subtitle:
        "Практические IT-курсы от экспертов-практиков. Получите востребованную профессию с доступом к лабораторному оборудованию и поддержкой 24/7.",
      btnCourses: "Смотреть курсы",
      btnAbout: "О нас",
      statCourses: "Курса",
      statStudents: "Студентов",
      statAccess: "Доступ",
      statPayments: "Способа оплаты",
    },
    // About
    about: {
      badge: "О академии",
      title: "Suffa IT Academy — ваш старт в мире IT",
      p1: "Мы — образовательный центр, основанный с целью дать качественное IT-образование студентам Ферганской области. Наша миссия — сделать профессиональное IT-обучение доступным без поездки в крупные города.",
      p2: "Каждый курс построен по принципу «практика прежде теории»: вы сразу работаете с реальными инструментами, конфигурируете оборудование и решаете задачи, с которыми сталкиваются специалисты на рынке труда.",
      f1Title: "Практические лаборатории",
      f1Desc: "Обучение на реальном оборудовании Cisco, Mikrotik и серверных системах.",
      f2Title: "Эксперты-практики",
      f2Desc: "Преподаватели — действующие специалисты с многолетним опытом в индустрии.",
      f3Title: "Сертификация",
      f3Desc: "Подготовка к международным сертификатам CCNA, CEH, CompTIA и другим.",
      f4Title: "Удобное расположение",
      f4Desc: "Академия находится в Ибрат Янгикургане, Бувайдинский район, Ферганская область.",
    },
    // Courses
    courses: {
      badge: "Программы обучения",
      title: "Наши курсы",
      subtitle:
        "Три направления подготовки — от сетевого инжиниринга до этичного хакинга. Курсы в разработке откроются без переустановки сайта.",
      available: "Доступен",
      comingSoon: "Скоро",
      inDevelopment: "В разработке",
      details: "Подробнее",
      contactUs: "Свяжитесь с нами",
      descriptions: {
        "network-engineer":
          "Полный курс по сетевым технологиям: маршрутизация, коммутация, протоколы TCP/IP, настройка Cisco и Mikrotik. Практические лабораторные работы на реальном оборудовании.",
        "windows-server-2022":
          "Администрирование Windows Server 2022: Active Directory, DNS, DHCP, групповые политики, Hyper-V, PowerShell автоматизация.",
        "ethical-hacker":
          "Этичный хакинг и пентест: разведка, сканирование уязвимостей, эксплойты, Metasploit, Burp Suite, CEH/OSCP методология.",
      },
    },
    // Why us
    whyUs: {
      badge: "Наши преимущества",
      title: "Почему Suffa IT Academy?",
      subtitle: "Мы не просто даём знания — мы готовим специалистов, которых берут на работу.",
      r1Title: "Практические лаборатории",
      r1Desc:
        "Каждое занятие — это реальная работа с оборудованием. Вы настраиваете, ломаете и чините — именно так учатся профи.",
      r2Title: "Эксперты-практики",
      r2Desc:
        "Наши преподаватели работают в отрасли прямо сейчас. Никакой устаревшей теории — только актуальные кейсы.",
      r3Title: "Доступ 24/7",
      r3Desc:
        "Видеоуроки и материалы доступны круглосуточно. Учитесь в своём темпе, повторяйте сложные темы сколько угодно.",
      r4Title: "4 способа оплаты",
      r4Desc:
        "UzumPay, PayMe, Paynet, Click — выбирайте удобный способ. Также принимаем наличные в офисе академии.",
    },
    // Location
    location: {
      badge: "Как нас найти",
      title: "Локация и контакты",
      contactTitle: "Свяжитесь с нами",
      contactDesc:
        "Хотите записаться на курс или узнать цену? Напишите нам в Telegram или позвоните — ответим в течение нескольких минут.",
      phone: "Телефон",
      address: "Адрес",
      addressText: "Ибрат Янгикурган, Бувайдинский район,\nФерганская область, Узбекистан",
    },
    // Footer
    footer: {
      tagline: "Профессиональное IT-образование в сердце Ферганской долины.",
      nav: "Навигация",
      contacts: "Контакты",
      dashboard: "Личный кабинет",
      rights: "© 2025 Suffa IT Academy. Все права защищены.",
    },
    dashboard: {
      myCourses: "Мои курсы",
      profile: "Профиль",
      adminPanel: "Администрирование",
      signOut: "Выйти",
      noCourses: "У вас ещё нет купленных курсов",
      browseCourses: "Смотреть курсы",
    },
    profilePage: {
      title: "Профиль",
      name: "Имя",
      email: "Email",
      phone: "Телефон",
      role: "Роль",
      createdAt: "Аккаунт создан",
      editTitle: "Редактировать профиль",
      avatar: "Фото профиля",
      uploadPhoto: "Загрузить фото",
      save: "Сохранить",
      saving: "Сохранение...",
    },
    adminPage: {
      title: "Панель администратора",
      activeStudents: "Активных учеников",
      coursesSection: "Курсы — статусы",
      addCourse: "Добавить новый курс",
      manualGrant: "Ручная выдача доступа",
      enrollments: "Все записи (последние 50)",
      grantsLog: "Журнал ручных выдач",
      backToDashboard: "Выйти из админки",
      payments: "Платежи",
      courseTitle: "Название",
      courseSlug: "Slug",
      courseDesc: "Описание",
      coursePrice: "Цена (UZS)",
      create: "Создать курс",
      priceLabel: "Цена",
      savePrice: "Сохранить цену",
    },
  },

  uz: {
    // Navbar
    nav: {
      courses: "Kurslar",
      about: "Biz haqimizda",
      whyUs: "Nima uchun biz",
      contacts: "Kontaktlar",
      login: "Kirish",
      register: "Ro'yxatdan o'tish",
    },
    // Hero
    hero: {
      badge: "Professional IT ta'lim",
      title1: "Suffa",
      title2: "IT Academy",
      subtitle:
        "Amaliyotchi ekspertlardan IT kurslari. Laboratoriya uskunalariga kirish va 24/7 qo'llab-quvvatlash bilan iste'molga yuqori kasb oling.",
      btnCourses: "Kurslarni ko'rish",
      btnAbout: "Biz haqimizda",
      statCourses: "Kurs",
      statStudents: "O'quvchi",
      statAccess: "Kirish",
      statPayments: "To'lov usuli",
    },
    // About
    about: {
      badge: "Akademiya haqida",
      title: "Suffa IT Academy — IT dunyosiga birinchi qadamingiz",
      p1: "Biz — Farg'ona viloyati talabalari uchun sifatli IT ta'lim berish maqsadida tashkil etilgan o'quv markazimiz. Bizning vazifamiz — katta shaharlarga bormagan holda professional IT ta'limni hamma uchun ochiq qilish.",
      p2: "Har bir kurs «amaliyot nazariyadan oldin» tamoyili asosida qurilgan: siz darhol haqiqiy vositalar bilan ishlaysiz, uskunalarni sozlaysiz va mehnat bozorida mutaxassislar duch keladigan masalalarni hal qilasiz.",
      f1Title: "Amaliy laboratoriyalar",
      f1Desc: "Cisco, Mikrotik va server tizimlarida haqiqiy uskunalarda o'qitish.",
      f2Title: "Amaliyotchi ekspertlar",
      f2Desc: "O'qituvchilar — sanoatda ko'p yillik tajribaga ega amaldagi mutaxassislar.",
      f3Title: "Sertifikatlash",
      f3Desc: "CCNA, CEH, CompTIA va boshqa xalqaro sertifikatlarga tayyorgarlik.",
      f4Title: "Qulay joylashuv",
      f4Desc: "Akademiya Farg'ona viloyati, Buvayda tumani, Ibrat Yangiqo'rg'onda joylashgan.",
    },
    // Courses
    courses: {
      badge: "O'quv dasturlari",
      title: "Bizning kurslar",
      subtitle:
        "Uch yo'nalish — tarmoq muhandisligidan etik hakerlikkacha. Ishlab chiqilayotgan kurslar saytni qayta o'rnatmasdan ochiladi.",
      available: "Mavjud",
      comingSoon: "Tez orada",
      inDevelopment: "Ishlanmoqda",
      details: "Batafsil",
      contactUs: "Biz bilan bog'laning",
      descriptions: {
        "network-engineer":
          "Tarmoq texnologiyalari bo'yicha to'liq kurs: marshrutlash, kommutatsiya, TCP/IP protokollari, Cisco va Mikrotik sozlash. Haqiqiy uskunalarda amaliy laboratoriya ishlari.",
        "windows-server-2022":
          "Windows Server 2022 administratsiyasi: Active Directory, DNS, DHCP, guruh siyosatlari, Hyper-V, PowerShell avtomatizatsiyasi.",
        "ethical-hacker":
          "Etik hacking va pentest: razvedka, zaifliklarni skanerlash, ekspluatlar, Metasploit, Burp Suite, CEH/OSCP metodologiyasi.",
      },
    },
    // Why us
    whyUs: {
      badge: "Bizning afzalliklarimiz",
      title: "Nima uchun Suffa IT Academy?",
      subtitle:
        "Biz faqat bilim bermaymiz — ish joylarda qabul qilinadigan mutaxassislar tayyorlaymiz.",
      r1Title: "Amaliy laboratoriyalar",
      r1Desc:
        "Har bir mashg'ulot — bu uskunalar bilan haqiqiy ish. Siz sozlaysiz, buzasiz va tuzatasiz — aynan shunday professonallar o'rganadi.",
      r2Title: "Amaliyotchi ekspertlar",
      r2Desc:
        "Bizning o'qituvchilarimiz hozir ham sohada ishlaydi. Eskirgan nazariya yo'q — faqat dolzarb holatlar.",
      r3Title: "24/7 kirish",
      r3Desc:
        "Video darslar va materiallar kunning istalgan vaqtida mavjud. O'z sur'atingizda o'rganing, murakkab mavzularni xohlagancha takrorlang.",
      r4Title: "4 ta to'lov usuli",
      r4Desc:
        "UzumPay, PayMe, Paynet, Click — qulay usulni tanlang. Akademiya ofisida naqd pul ham qabul qilinadi.",
    },
    // Location
    location: {
      badge: "Bizni qanday topish mumkin",
      title: "Joylashuv va kontaktlar",
      contactTitle: "Biz bilan bog'laning",
      contactDesc:
        "Kursga yozilmoqchimisiz yoki narxni bilmoqchimisiz? Telegramga yozing yoki qo'ng'iroq qiling — bir necha daqiqada javob beramiz.",
      phone: "Telefon",
      address: "Manzil",
      addressText: "Ibrat Yangiqo'rg'on, Buvayda tumani,\nFarg'ona viloyati, O'zbekiston",
    },
    // Footer
    footer: {
      tagline: "Farg'ona vodiysining yuragi bo'ylab professional IT ta'lim.",
      nav: "Navigatsiya",
      contacts: "Kontaktlar",
      dashboard: "Shaxsiy kabinet",
      rights: "© 2025 Suffa IT Academy. Barcha huquqlar himoyalangan.",
    },
    dashboard: {
      myCourses: "Mening kurslarim",
      profile: "Profil",
      adminPanel: "Boshqaruv paneli",
      signOut: "Chiqish",
      noCourses: "Sizda hali sotib olingan kurslar yo'q",
      browseCourses: "Kurslarni ko'rish",
    },
    profilePage: {
      title: "Profil",
      name: "Ism",
      email: "Email",
      phone: "Telefon",
      role: "Rol",
      createdAt: "Hisob yaratilgan",
      editTitle: "Profilni tahrirlash",
      avatar: "Profil rasmi",
      uploadPhoto: "Rasm yuklash",
      save: "Saqlash",
      saving: "Saqlanmoqda...",
    },
    adminPage: {
      title: "Administrator paneli",
      activeStudents: "Faol o'quvchilar",
      coursesSection: "Kurslar — holati",
      addCourse: "Yangi kurs qo'shish",
      manualGrant: "Qo'lda kirish berish",
      enrollments: "Barcha yozuvlar (oxirgi 50)",
      grantsLog: "Qo'lda berishlar jurnali",
      backToDashboard: "Admin paneldan chiqish",
      payments: "To'lovlar",
      courseTitle: "Nomi",
      courseSlug: "Slug",
      courseDesc: "Tavsif",
      coursePrice: "Narx (UZS)",
      create: "Kurs yaratish",
      priceLabel: "Narx",
      savePrice: "Narxni saqlash",
    },
  },
} as const;

export type Translations = {
  nav: {
    courses: string;
    about: string;
    whyUs: string;
    contacts: string;
    login: string;
    register: string;
  };
  hero: {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    btnCourses: string;
    btnAbout: string;
    statCourses: string;
    statStudents: string;
    statAccess: string;
    statPayments: string;
  };
  about: {
    badge: string;
    title: string;
    p1: string;
    p2: string;
    f1Title: string;
    f1Desc: string;
    f2Title: string;
    f2Desc: string;
    f3Title: string;
    f3Desc: string;
    f4Title: string;
    f4Desc: string;
  };
  courses: {
    badge: string;
    title: string;
    subtitle: string;
    available: string;
    comingSoon: string;
    inDevelopment: string;
    details: string;
    contactUs: string;
    descriptions: Record<string, string>;
  };
  whyUs: {
    badge: string;
    title: string;
    subtitle: string;
    r1Title: string;
    r1Desc: string;
    r2Title: string;
    r2Desc: string;
    r3Title: string;
    r3Desc: string;
    r4Title: string;
    r4Desc: string;
  };
  location: {
    badge: string;
    title: string;
    contactTitle: string;
    contactDesc: string;
    phone: string;
    address: string;
    addressText: string;
  };
  footer: { tagline: string; nav: string; contacts: string; dashboard: string; rights: string };
  dashboard: {
    myCourses: string;
    profile: string;
    adminPanel: string;
    signOut: string;
    noCourses: string;
    browseCourses: string;
  };
  profilePage: {
    title: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    createdAt: string;
    editTitle: string;
    avatar: string;
    uploadPhoto: string;
    save: string;
    saving: string;
  };
  adminPage: {
    title: string;
    activeStudents: string;
    coursesSection: string;
    addCourse: string;
    manualGrant: string;
    enrollments: string;
    grantsLog: string;
    backToDashboard: string;
    payments: string;
    courseTitle: string;
    courseSlug: string;
    courseDesc: string;
    coursePrice: string;
    create: string;
    priceLabel: string;
    savePrice: string;
  };
};
