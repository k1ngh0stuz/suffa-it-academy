-- ============================================================
-- Seed: Courses (matches landing page spec)
-- ============================================================
insert into courses (id, slug, title, description, status, price_tiyin, sort_order)
values
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'network-engineer',
    'Network Engineer',
    'Полный курс по сетевым технологиям: маршрутизация, коммутация, протоколы TCP/IP, настройка Cisco и Mikrotik. Практические лабораторные работы на реальном оборудовании.',
    'available',
    null,   -- "Свяжитесь с нами" — price null = contact us
    1
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'windows-server-2022',
    'Windows Server 2022',
    'Администрирование Windows Server 2022: Active Directory, DNS, DHCP, групповые политики, Hyper-V, PowerShell автоматизация.',
    'coming_soon',
    null,
    2
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'ethical-hacker',
    'Ethical Hacker',
    'Этичный хакинг и пентест: разведка, сканирование уязвимостей, эксплойты, Metasploit, Burp Suite, CEH/OSCP методология.',
    'coming_soon',
    null,
    3
  );
