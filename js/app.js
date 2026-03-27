// Markdown to PDF - JavaScript

// DOM Elements
let input, preview, fontSizeSelect, textFontSelect, downloadPDFBtn, filenameInput;
let notification, loader, infoModal, showInfoBtn, closeInfoModalBtn;
let headingMenu, insertHeadingBtn;
let insertBoldBtn, insertItalicBtn, insertListBtn, insertLinkBtn;
let insertImageBtn, insertCodeBtn, insertQuoteBtn, insertTableBtn;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Get all DOM elements
    input = document.getElementById('input');
    preview = document.getElementById('preview');
    fontSizeSelect = document.getElementById('fontSize');
    textFontSelect = document.getElementById('textFont');
    downloadPDFBtn = document.getElementById('downloadPDFBtn');
    filenameInput = document.getElementById('filename');
    notification = document.getElementById('notification');
    loader = document.getElementById('loader');
    infoModal = document.getElementById('infoModal');
    showInfoBtn = document.getElementById('showInfoBtn');
    closeInfoModalBtn = document.getElementById('closeInfoModalBtn');
    headingMenu = document.getElementById('headingMenu');
    insertHeadingBtn = document.getElementById('insertHeading');
    
    // Tool buttons
    insertBoldBtn = document.getElementById('insertBold');
    insertItalicBtn = document.getElementById('insertItalic');
    insertListBtn = document.getElementById('insertList');
    insertLinkBtn = document.getElementById('insertLink');
    insertImageBtn = document.getElementById('insertImage');
    insertCodeBtn = document.getElementById('insertCode');
    insertQuoteBtn = document.getElementById('insertQuote');
    insertTableBtn = document.getElementById('insertTable');
    
    // Initialize the app
    initApp();
});

// Insert text at cursor helper
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

// Initialize the application
function initApp() {
    // Modal functions
    function showModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function hideModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Make hideModal global for onclick handlers
    window.hideModal = hideModal;
    
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
        const dropdown = document.querySelector('.dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    });
    
    headingMenu.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const level = e.target.dataset.level;
            const hashes = '#'.repeat(parseInt(level));
            insertTextAtCursor(hashes + ' Заголовок');
        }
    });
    
    // Tool button handlers
    insertBoldBtn.addEventListener('click', () => insertTextAtCursor('****'));
    insertItalicBtn.addEventListener('click', () => insertTextAtCursor('__'));
    insertListBtn.addEventListener('click', () => insertTextAtCursor('- Элемент списка\n'));
    insertLinkBtn.addEventListener('click', () => insertTextAtCursor('[текст](https://example.com)'));
    insertImageBtn.addEventListener('click', () => insertTextAtCursor('![описание](https://example.com/image.jpg)'));
    insertCodeBtn.addEventListener('click', () => insertTextAtCursor('```\nкод\n```'));
    insertQuoteBtn.addEventListener('click', () => insertTextAtCursor('> Цитата\n'));
    
    // Table insertion
    insertTableBtn.addEventListener('click', () => {
        const table = '| Заголовок 1 | Заголовок 2 | Заголовок 3 |\n|-------------|-------------|-------------|\n| Ячейка 1    | Ячейка 2    | Ячейка 3    |\n| Ячейка 4    | Ячейка 5    | Ячейка 6    |';
        insertTextAtCursor(table + '\n');
    });
    
    // Update preview function
    function updatePreview() {
        const text = input.value;
        const html = marked.parse(text);
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
            
            const html = marked.parse(input.value);
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
    
    // Notification function
    function showNotification(message, type) {
        const messageEl = document.getElementById('notificationMessage');
        if (messageEl) {
            messageEl.textContent = message;
        }
        notification.className = 'notification ' + (type || 'success');
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Set initial content
    input.value = '# Добро пожаловать в Markdown to PDF\n\nЭтот инструмент позволяет легко конвертировать текст в формате **Markdown** в красивый PDF документ.\n\n## Что такое Markdown?\n\nMarkdown — это облегченный язык разметки, который используется во многих популярных сервисах:\n\n- Искусственный интеллект (ChatGPT, Claude и другие)\n- Discord\n- Telegram\n- GitHub\n- Reddit\n\n## Примеры форматирования\n\n### Жирный и курсив\n\nТекст может быть **жирным**, *курсивом* или ***жирным курсивом***.\n\n### Списки\n\n#### Маркированный список\n- Первый элемент\n- Второй элемент\n- Третий элемент\n\n#### Нумерованный список\n1. Первый шаг\n2. Второй шаг\n3. Третий шаг\n\n### Код\n\nВстроенный код: `const x = 10;`\n\nБлок кода:\n```javascript\nfunction greet(name) {\n    return `Привет, ${name}!`;\n}\n\nconsole.log(greet(\'Мир\'));\n```\n\n### Цитата\n\n> Это пример цитаты. Вы можете использовать этот формат для выделения важных мыслей или цитирования других источников.\n\n### Таблица\n\n| Функция | Описание | Пример |\n|---------|----------|--------|\n| **bold** | Делает текст жирным | **текст** |\n| *italic* | Делает текст курсивом | *текст* |\n| `code` | Встроенный код | `код` |\n\n---\n\nНачните редактировать этот текст слева, чтобы увидеть изменения в реальном времени!';
    
    // Initial preview update
    updatePreview();
}
