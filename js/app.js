// Markdown to PDF - JavaScript

// DOM Elements
const input = document.getElementById('input');
const preview = document.getElementById('preview');
const fontSizeSelect = document.getElementById('fontSize');
const textFontSelect = document.getElementById('textFont');
const downloadPDFBtn = document.getElementById('downloadPDFBtn');
const filenameInput = document.getElementById('filename');
const notification = document.getElementById('notification');
const loader = document.getElementById('loader');
const infoModal = document.getElementById('infoModal');
const showInfoBtn = document.getElementById('showInfoBtn');
const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');
const headingMenu = document.getElementById('headingMenu');
const insertHeadingBtn = document.getElementById('insertHeading');

// Tool buttons
const insertBoldBtn = document.getElementById('insertBold');
const insertItalicBtn = document.getElementById('insertItalic');
const insertListBtn = document.getElementById('insertList');
const insertLinkBtn = document.getElementById('insertLink');
const insertImageBtn = document.getElementById('insertImage');
const insertCodeBtn = document.getElementById('insertCode');
const insertQuoteBtn = document.getElementById('insertQuote');
const insertTableBtn = document.getElementById('insertTable');

// Modal functions
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modals on backdrop click
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal(modal);
        }
    });
});

// Info modal
showInfoBtn.addEventListener('click', () => showModal(infoModal));
closeInfoModalBtn.addEventListener('click', () => hideModal(infoModal));

// Heading dropdown
insertHeadingBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.dropdown').classList.toggle('active');
});

document.addEventListener('click', () => {
    document.querySelector('.dropdown').classList.remove('active');
});

headingMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const level = e.target.dataset.level;
        const hashes = '#'.repeat(level);
        insertTextAtCursor(`${hashes} Заголовок`);
    }
});

// Insert text at cursor
function insertTextAtCursor(text) {
    const startPos = input.selectionStart;
    const endPos = input.selectionEnd;
    
    input.value = input.value.substring(0, startPos) + 
                  text + 
                  input.value.substring(endPos);
    
    input.selectionStart = input.selectionEnd = startPos + text.length;
    input.focus();
    updatePreview();
}

// Tool button handlers
insertBoldBtn.addEventListener('click', () => insertTextAtCursor('****', '**'));
insertItalicBtn.addEventListener('click', () => insertTextAtCursor('__', '_'));
insertListBtn.addEventListener('click', () => insertTextAtCursor('- Элемент списка\n'));
insertLinkBtn.addEventListener('click', () => insertTextAtCursor('[текст](https://example.com)'));
insertImageBtn.addEventListener('click', () => insertTextAtCursor('![описание](https://example.com/image.jpg)'));
insertCodeBtn.addEventListener('click', () => insertTextAtCursor('```\nкод\n```'));
insertQuoteBtn.addEventListener('click', () => insertTextAtCursor('> Цитата\n'));

// Table insertion
insertTableBtn.addEventListener('click', () => {
    const table = `| Заголовок 1 | Заголовок 2 | Заголовок 3 |
|-------------|-------------|-------------|
| Ячейка 1    | Ячейка 2    | Ячейка 3    |
| Ячейка 4    | Ячейка 5    | Ячейка 6    |`;
    insertTextAtCursor(table + '\n');
});

// Custom renderer for marked
const renderer = new marked.Renderer();

renderer.code = function(code, language) {
    const validLang = language && hljs.getLanguage(language);
    const highlighted = validLang 
        ? hljs.highlight(language, code).value 
        : code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<pre><code class="hljs ${language || ''}">${highlighted}</code></pre>`;
};

// Update preview
function updatePreview() {
    const text = input.value;
    const html = marked.parse(text, { renderer });
    preview.innerHTML = DOMPurify.sanitize(html);
    
    // Apply font settings
    preview.style.fontSize = fontSizeSelect.value + 'px';
    preview.style.fontFamily = textFontSelect.value;
    
    // Style images
    preview.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
}

// Font size change
fontSizeSelect.addEventListener('change', updatePreview);
textFontSelect.addEventListener('change', updatePreview);

// Input event
input.addEventListener('input', updatePreview);

// Download PDF
downloadPDFBtn.addEventListener('click', async () => {
    const filename = filenameInput.value.trim() || 'document';
    
    // Show loader
    loader.classList.add('active');
    
    try {
        const element = document.createElement('div');
        element.style.width = '595pt';
        element.style.padding = '40pt';
        element.style.fontFamily = textFontSelect.value;
        element.style.fontSize = fontSizeSelect.value + 'px';
        element.style.color = '#333';
        element.style.background = '#fff';
        
        const html = marked.parse(input.value, { renderer });
        element.innerHTML = DOMPurify.sanitize(html);
        
        // Style for PDF
        element.querySelectorAll('h1, h2, h3').forEach(el => {
            el.style.marginTop = '1em';
            el.style.marginBottom = '0.5em';
            el.style.fontWeight = '600';
        });
        
        element.querySelectorAll('p').forEach(el => {
            el.style.marginBottom = '1em';
        });
        
        element.querySelectorAll('ul, ol').forEach(el => {
            el.style.marginBottom = '1em';
            el.style.paddingLeft = '2em';
        });
        
        element.querySelectorAll('blockquote').forEach(el => {
            el.style.borderLeft = '3px solid #1a73e8';
            el.style.paddingLeft = '16px';
            el.style.margin = '16px 0';
            el.style.color = '#5f6368';
            el.style.background = '#f8f9fa';
            el.style.padding = '8px 16px';
        });
        
        element.querySelectorAll('table').forEach(el => {
            el.style.width = '100%';
            el.style.borderCollapse = 'collapse';
            el.style.margin = '16px 0';
        });
        
        element.querySelectorAll('th, td').forEach(el => {
            el.style.border = '1px solid #dadce0';
            el.style.padding = '8px 16px';
            el.style.textAlign = 'left';
        });
        
        element.querySelectorAll('th').forEach(el => {
            el.style.background = '#f8f9fa';
            el.style.fontWeight = '600';
        });
        
        element.querySelectorAll('pre').forEach(el => {
            el.style.background = '#f1f3f4';
            el.style.padding = '16px';
            el.style.borderRadius = '8px';
            el.style.overflowX = 'auto';
            el.style.margin = '16px 0';
        });
        
        element.querySelectorAll('code').forEach(el => {
            el.style.fontFamily = 'JetBrains Mono, monospace';
        });
        
        const opt = {
            margin: 0,
            filename: filename + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
        
        showNotification('PDF успешно создан!', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showNotification('Ошибка при создании PDF', 'error');
    } finally {
        loader.classList.remove('active');
    }
});

// Notification
function showNotification(message, type = 'success') {
    const messageEl = document.getElementById('notificationMessage');
    messageEl.textContent = message;
    notification.className = 'notification ' + type;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize with sample content
input.value = `# Добро пожаловать в Markdown to PDF

Этот инструмент позволяет легко конвертировать текст в формате **Markdown** в красивый PDF документ.

## Что такое Markdown?

Markdown — это облегченный язык разметки, который используется во многих популярных сервисах:

- Искусственный интеллект (ChatGPT, Claude и другие)
- Discord
- Telegram
- GitHub
- Reddit

## Примеры форматирования

### Жирный и курсив
Текст может быть **жирным**, *курсивом* или ***жирным курсивом***.

### Списки

#### Маркированный список
- Первый элемент
- Второй элемент
- Третий элемент

#### Нумерованный список
1. Первый шаг
2. Второй шаг
3. Третий шаг

### Код

Встроенный код: \`const x = 10;\`

Блок кода:
\`\`\`javascript
function greet(name) {
    return \`Привет, \${name}!\`;
}

console.log(greet('Мир'));
\`\`\`

### Цитата

> Это пример цитаты. Вы можете использовать этот формат для выделения важных мыслей или цитирования других источников.

### Таблица

| Функция | Описание | Пример |
|---------|----------|--------|
| **bold** | Делает текст жирным | **текст** |
| *italic* | Делает текст курсивом | *текст* |
| \`code\` | Встроенный код | \`код\` |

---

Начните редактировать этот текст слева, чтобы увидеть изменения в реальном времени!
`;

// Initial preview update
updatePreview();
