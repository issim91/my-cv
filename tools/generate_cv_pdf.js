const PDFDocument = require('/tmp/cvgen/node_modules/pdfkit');
const fs = require('fs');

const out = 'files/ilya-simonov-cv-ru-1page.pdf';
const doc = new PDFDocument({ size: 'A4', margin: 0 });
doc.pipe(fs.createWriteStream(out));

const W = 595.28, H = 841.89, sidebarW = 190;
const cDark = '#111827', cText = '#0f172a', cMuted = '#475569', cLight = '#e2e8f0', cWhite = '#ffffff';
const font = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
const fontBold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';

if (fs.existsSync(font) && fs.existsSync(fontBold)) {
  doc.registerFont('regular', font);
  doc.registerFont('bold', fontBold);
} else {
  doc.registerFont('regular', 'Helvetica');
  doc.registerFont('bold', 'Helvetica-Bold');
}

doc.rect(0,0,sidebarW,H).fill(cDark);
doc.rect(sidebarW,0,W-sidebarW,H).fill(cWhite);

doc.fillColor(cWhite).font('bold').fontSize(22).text('СИМОНОВ',20,28);
doc.font('bold').fontSize(22).text('ИЛЬЯ',20,56);
doc.fillColor('#93c5fd').font('regular').fontSize(10).text('Senior Backend Developer',20,92);
doc.fillColor('#93c5fd').font('regular').fontSize(10).text('Python • AI Integrations',20,108);

let y=150;
function sTitle(t){doc.fillColor('#cbd5e1').font('bold').fontSize(11).text(t,20,y);y+=20}
function sItem(t){doc.fillColor(cWhite).font('regular').fontSize(9.2).text('• '+t,22,y,{width:sidebarW-34});y+=15}

sTitle('КОНТАКТЫ');
sItem('Telegram: @isimv');
sItem('Сайт: my-cv-nine-green.vercel.app');
sItem('GitHub: github.com/issim91/my-cv');
y+=8;
sTitle('КЛЮЧЕВЫЕ НАВЫКИ');
['Python (Django, DRF, Flask)','PostgreSQL, Redis, Celery','REST API, JWT/OAuth2, OpenAPI','Микросервисная архитектура','CI/CD, Docker, Linux, Nginx','AWS: EC2, RDS, S3, CloudWatch','OpenAI, Gemini, Whisper'].forEach(sItem);
y+=8; sTitle('ЯЗЫКИ'); sItem('Русский — родной'); sItem('English — working proficiency');

let mx=sidebarW+24,my=36,mw=W-sidebarW-40;
function mTitle(t){doc.fillColor(cText).font('bold').fontSize(12.5).text(t,mx,my);my+=16;doc.strokeColor(cLight).lineWidth(1).moveTo(mx,my).lineTo(mx+mw,my).stroke();my+=10}
function mP(t,size=10){doc.fillColor(cMuted).font('regular').fontSize(size).text(t,mx,my,{width:mw,lineGap:2});my=doc.y+8}
function mRole(role,dates,bullets){doc.fillColor(cText).font('bold').fontSize(11).text(role,mx,my,{width:mw-100});doc.fillColor('#334155').font('regular').fontSize(9.5).text(dates,mx+mw-105,my+1,{width:105,align:'right'});my=doc.y+4;bullets.forEach(b=>{doc.fillColor(cMuted).font('regular').fontSize(9.6).text('• '+b,mx,my,{width:mw,lineGap:1.5});my=doc.y+2});my+=4}

mTitle('ПРОФИЛЬ');
mP('Backend-разработчик с 7+ годами опыта. Проектирую и развиваю высоконагруженные системы: архитектура, REST API, базы данных, очереди, CI/CD и интеграции с AI-сервисами. Фокус: надёжность, производительность и предсказуемый delivery.');
mTitle('ОПЫТ');
mRole('Lead / Senior Backend Developer','2021 — н.в.',['Проектирование и развитие распределённых backend-сервисов под высокую нагрузку.','Интеграция AI-пайплайнов (OpenAI, Gemini) в продуктовые процессы.','Оптимизация асинхронной обработки (Celery/Redis), снижение задержек и ошибок.','Ведение code review и менторство Junior/Middle разработчиков.']);
mRole('Middle Backend Developer','2019 — 2021',['Разработка серверной логики для продуктовых модулей и интеграций.','Оптимизация SQL-запросов и схем данных в PostgreSQL.','Участие в декомпозиции легаси-компонентов и стабилизации продакшена.']);
mTitle('ПРОЕКТЫ И РЕЗУЛЬТАТЫ');
mP('• Миграция backend на микросервисный подход с сохранением стабильности продакшена.\n• AI-пайплайн классификации/суммаризации контента (OpenAI/Gemini) с заметной оптимизацией затрат.\n• Улучшение процессов качества (тесты, ревью, наблюдаемость), снижение числа критичных инцидентов.',9.7);
mTitle('СТЕК');
mP('Python, Django, DRF, Flask, PostgreSQL, Redis, Celery, Docker, Linux, Nginx, AWS (EC2/RDS/S3/CloudWatch), Sentry, New Relic, OpenSearch, Pytest.');
mTitle('ФОРМАТ РАБОТЫ');
mP('Удалённо • Full-time / Part-time • Открыт к предложениям по backend- и AI-интеграционным задачам.',9.7);

doc.fillColor('#94a3b8').font('regular').fontSize(8.5).text('One-page CV • Обновлено автоматически из содержимого сайта-резюме', mx, H-24);
doc.end();
