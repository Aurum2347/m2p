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
    
    // Check if all elements exist
    if (!input || !preview) {
        console.error('Required elements not found');
        return;
    }
    
    // Initialize the app
    initApp();
});

// Insert text at cursor helper
function insertTextAtCursor(text) {
    if (!input) return;
    
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
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    function hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
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
    if (showInfoBtn && infoModal) {
        showInfoBtn.addEventListener('click', () => showModal(infoModal));
    }
    if (closeInfoModalBtn && infoModal) {
        closeInfoModalBtn.addEventListener('click', () => hideModal(infoModal));
    }
    
    // Heading dropdown
    if (insertHeadingBtn) {
        insertHeadingBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = document.querySelector('.dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
        });
    }
    
    document.addEventListener('click', () => {
        const dropdown = document.querySelector('.dropdown');
        if (dropdown) {
            dropdown.classList.remove('active');
        }
    });
    
    // Heading menu
    if (headingMenu) {
        headingMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const level = e.target.dataset.level;
                if (level) {
                    const hashes = '#'.repeat(parseInt(level));
                    insertTextAtCursor(hashes + ' Заголовок');
                }
            }
        });
    }
    
    // Tool button handlers
    if (insertBoldBtn) insertBoldBtn.addEventListener('click', () => insertTextAtCursor('****'));
    if (insertItalicBtn) insertItalicBtn.addEventListener('click', () => insertTextAtCursor('__'));
    if (insertListBtn) insertListBtn.addEventListener('click', () => insertTextAtCursor('- Элемент списка\n'));
    if (insertLinkBtn) insertLinkBtn.addEventListener('click', () => insertTextAtCursor('[текст](https://example.com)'));
    if (insertImageBtn) insertImageBtn.addEventListener('click', () => insertTextAtCursor('![описание](https://example.com/image.jpg)'));
    if (insertCodeBtn) insertCodeBtn.addEventListener('click', () => insertTextAtCursor('```\nкод\n```'));
    if (insertQuoteBtn) insertQuoteBtn.addEventListener('click', () => insertTextAtCursor('> Цитата\n'));
    
    // Table insertion
    if (insertTableBtn) {
        insertTableBtn.addEventListener('click', () => {
            const table = '| Заголовок 1 | Заголовок 2 | Заголовок 3 |\n|-------------|-------------|-------------|\n| Ячейка 1    | Ячейка 2    | Ячейка 3    |\n| Ячейка 4    | Ячейка 5    | Ячейка 6    |';
            insertTextAtCursor(table + '\n');
        });
    }
    
    // Update preview function
    function updatePreview() {
        if (!input || !preview) return;
        
        const text = input.value;
        if (typeof marked !== 'undefined') {
            const html = marked.parse(text);
            if (typeof DOMPurify !== 'undefined') {
                preview.innerHTML = DOMPurify.sanitize(html);
            } else {
                preview.innerHTML = html;
            }
            
            // Apply font settings
            if (fontSizeSelect) {
                preview.style.fontSize = fontSizeSelect.value + 'px';
            }
            if (textFontSelect) {
                preview.style.fontFamily = textFontSelect.value;
            }
            
            // Style images
            preview.querySelectorAll('img').forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            });
        }
    }
    
    // Font size change
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', updatePreview);
    }
    if (textFontSelect) {
        textFontSelect.addEventListener('change', updatePreview);
    }
    
    // Input event
    if (input) {
        input.addEventListener('input', updatePreview);
    }
    
    // Download PDF
    if (downloadPDFBtn) {
        downloadPDFBtn.addEventListener('click', async () => {
            if (!filenameInput) return;
            
            const filename = filenameInput.value.trim() || 'document';
            
            // Show loader
            if (loader) loader.classList.add('active');
            
            try {
                const element = document.createElement('div');
                element.style.width = '595pt';
                element.style.padding = '40pt';
                element.style.fontFamily = textFontSelect ? textFontSelect.value : 'Arial';
                element.style.fontSize = (fontSizeSelect ? fontSizeSelect.value : '14') + 'px';
                element.style.color = '#333';
                element.style.background = '#fff';
                
                if (typeof marked !== 'undefined') {
                    const html = marked.parse(input.value);
                    if (typeof DOMPurify !== 'undefined') {
                        element.innerHTML = DOMPurify.sanitize(html);
                    } else {
                        element.innerHTML = html;
                    }
                }
                
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
                
                if (typeof html2pdf !== 'undefined') {
                    const opt = {
                        margin: 0,
                        filename: filename + '.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
                    };
                    
                    await html2pdf().set(opt).from(element).save();
                    showNotification('PDF успешно создан!', 'success');
                } else {
                    showNotification('Библиотека html2pdf не загружена', 'error');
                }
            } catch (error) {
                console.error('Error generating PDF:', error);
                showNotification('Ошибка при создании PDF', 'error');
            } finally {
                if (loader) loader.classList.remove('active');
            }
        });
    }
    
    // Notification function
    function showNotification(message, type) {
        const messageEl = document.getElementById('notificationMessage');
        if (messageEl) {
            messageEl.textContent = message;
        }
        if (notification) {
            notification.className = 'notification ' + (type || 'success');
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }
    }
    
    // Set initial content
    input.value = '# Добро пожаловать в Markdown to PDF\n\nЭтот инструмент позволяет легко конвертировать текст в формате **Markdown** в красивый PDF документ.\n\n## Что такое Markdown?\n\nMarkdown — это облегченный язык разметки, который используется во многих популярных сервисах:\n\n- Искусственный интеллект (ChatGPT, Claude и другие)\n- Discord\n- Telegram\n- GitHub\n- Reddit\n\n## Примеры форматирования\n\n### Жирный и курсив\n\nТекст может быть **жирным**, *курсивом* или ***жирным курсивом***.\n\n### Списки\n\n#### Маркированный список\n- Первый элемент\n- Второй элемент\n- Третий элемент\n\n#### Нумерованный список\n1. Первый шаг\n2. Второй шаг\n3. Третий шаг\n\n### Код\n\nВстроенный код: `const x = 10;`\n\nБлок кода:\n```javascript\nfunction greet(name) {\n    return `Привет, ${name}!`;\n}\n\nconsole.log(greet(\'Мир\'));\n```\n\n### Цитата\n\n> Это пример цитаты. Вы можете использовать этот формат для выделения важных мыслей или цитирования других источников.\n\n### Таблица\n\n| Функция | Описание | Пример |\n|---------|----------|--------|\n| **bold** | Делает текст жирным | **текст** |\n| *italic* | Делает текст курсивом | *текст* |\n| `code` | Встроенный код | `код` |\n\n---\n\nНачните редактировать этот текст слева, чтобы увидеть изменения в реальном времени!';
    
    // Initial preview update
    updatePreview();
}
