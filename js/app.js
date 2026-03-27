// Initialize particles.js
particlesJS("particles-js", {
    "particles": {
        "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
        "color": { "value": "#3b82f6" },
        "shape": { 
            "type": "circle", 
            "stroke": { "width": 0, "color": "#000000" },
            "polygon": { "nb_sides": 5 }
        },
        "opacity": { "value": 0.5, "random": false },
        "size": { "value": 3, "random": true },
        "line_linked": { 
            "enable": true, 
            "distance": 100, 
            "color": "#3b82f6", 
            "opacity": 0.4, 
            "width": 1 
        },
        "move": { 
            "enable": true, 
            "speed": 1.5, 
            "direction": "none", 
            "random": true, 
            "straight": false, 
            "out_mode": "out", 
            "bounce": false
        }
    },
    "interactivity": { 
        "detect_on": "canvas", 
        "events": { 
            "onhover": { "enable": true, "mode": "grab" }, 
            "onclick": { "enable": true, "mode": "push" } 
        }, 
        "modes": {
            "grab": { "distance": 100, "line_linked": { "opacity": 0.8 } },
            "push": { "particles_nb": 4 }
        } 
    },
    "retina_detect": true
});

// DOM elements
const input = document.getElementById('input');
const preview = document.getElementById('preview');
const fontSelect = document.getElementById('fontSize');
const downloadPDFBtn = document.getElementById('downloadPDFBtn');
const showPdfPreviewBtn = document.getElementById('showPdfPreviewBtn');
const filenameInput = document.getElementById('filename');
const notification = document.getElementById('notification');
const pdfLoader = document.querySelector('.pdf-loader');
const themeSwitcher = document.getElementById('themeSwitcher');
const themeIcon = document.getElementById('themeIcon');
const authorSignature = document.querySelector('.author-signature');
const infoModal = document.getElementById('infoModal');
const showInfoBtn = document.getElementById('showInfoBtn');
const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');
const textFontSelect = document.getElementById('textFont');
const codeFontSelect = document.getElementById('codeFont');
const thanksBtn = document.getElementById('thanksBtn');
const thanksModal = document.getElementById('thanksModal');
const closeThanksModalBtn = document.getElementById('closeThanksModalBtn');
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
const insertPageBreakBtn = document.getElementById('insertPageBreak');
const insertTableBtn = document.getElementById('insertTable');
const insertAlignBtn = document.getElementById('insertAlign');
const insertCustomFontBtn = document.getElementById('insertCustomFont');

// Modals
const tableModal = document.getElementById('tableModal');
const closeTableModalBtn = document.getElementById('closeTableModalBtn');
const alignModal = document.getElementById('alignModal');
const closeAlignModalBtn = document.getElementById('closeAlignModalBtn');
const fontModal = document.getElementById('fontModal');
const closeFontModalBtn = document.getElementById('closeFontModalBtn');
const pdfPreviewModal = document.getElementById('pdfPreviewModal');
const closePdfPreviewModalBtn = document.getElementById('closePdfPreviewModalBtn');
const confirmCloseModal = document.getElementById('confirmCloseModal');
const cancelCloseBtn = document.getElementById('cancelCloseBtn');
const confirmCloseBtn = document.getElementById('confirmCloseBtn');

// Table editor
const tableGrid = document.getElementById('tableGrid');
let tableData = [
    ['', '', ''],
    ['', '', '']
];

// Stats
let downloadCount = parseInt(localStorage.getItem('downloadCount') || '0');
let totalChars = parseInt(localStorage.getItem('totalChars') || '0');
document.getElementById('statDownloads').textContent = downloadCount;
document.getElementById('statChars').textContent = totalChars;

// Initialize Viz.js
const viz = new Viz();

// Theme management
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
        themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        themeIcon.style.color = '#ffd700';
    } else {
        themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
        themeIcon.style.color = '#ffffff';
    }
}
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        setTheme('light');
    } else {
        setTheme('dark');
    }
}

// Initialize theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Modal functions
let currentModal = null;
function showModal(modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    currentModal = modal;
}
function hideModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModal = null;
}

// Check if modal has unsaved input
function hasUnsavedInput(modal) {
    const inputs = modal.querySelectorAll('input, textarea, select');
    for (let el of inputs) {
        if (el.value.trim() !== '') return true;
    }
    return false;
}

// Close modal with confirmation if needed
function requestCloseModal(modal) {
    if (hasUnsavedInput(modal)) {
        showModal(confirmCloseModal);
        confirmCloseBtn.onclick = () => {
            hideModal(confirmCloseModal);
            hideModal(modal);
        };
        cancelCloseBtn.onclick = () => hideModal(confirmCloseModal);
    } else {
        hideModal(modal);
    }
}

// Close modals on backdrop click
document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal && modal.id !== 'confirmCloseModal') {
            requestCloseModal(modal);
        }
    });
});

// Tool handlers
insertHeadingBtn.addEventListener('click', () => headingMenu.classList.toggle('active'));
document.addEventListener('click', (e) => {
    if (!insertHeadingBtn.contains(e.target) && !headingMenu.contains(e.target)) {
        headingMenu.classList.remove('active');
    }
});

function insertTextAtCursor(text, wrapBefore = '', wrapAfter = '') {
    const textarea = input;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const selectedText = textarea.value.substring(startPos, endPos);
    textarea.value = textarea.value.substring(0, startPos) + 
                    wrapBefore + selectedText + wrapAfter + 
                    textarea.value.substring(endPos);
    if (selectedText) {
        textarea.selectionStart = startPos;
        textarea.selectionEnd = endPos + wrapBefore.length + wrapAfter.length;
    } else {
        textarea.selectionStart = textarea.selectionEnd = startPos + wrapBefore.length;
    }
    textarea.focus();
    updatePreview();
}

insertBoldBtn.addEventListener('click', () => insertTextAtCursor('', '**', '**'));
insertItalicBtn.addEventListener('click', () => insertTextAtCursor('', '_', '_'));
insertListBtn.addEventListener('click', () => insertTextAtCursor('Элемент списка', '- ', ''));
insertLinkBtn.addEventListener('click', () => insertTextAtCursor('текст ссылки', '[', '](https://example.com)'));
insertImageBtn.addEventListener('click', () => insertTextAtCursor('альтернативный текст', '![', '](https://example.com/image.jpg)'));
insertCodeBtn.addEventListener('click', () => insertTextAtCursor('код', '```\n', '\n```'));
insertQuoteBtn.addEventListener('click', () => insertTextAtCursor('цитата', '> ', ''));
insertPageBreakBtn.addEventListener('click', () => {
    insertTextAtCursor('\n<!-- PAGEBREAK -->\n');
    showNotification('Разрыв страницы добавлен', 'info');
});

// Table modal
function renderTableEditor() {
    tableGrid.innerHTML = '';
    tableGrid.style.gridTemplateColumns = `repeat(${tableData[0].length}, 1fr)`;
    tableData.forEach((row, i) => {
        row.forEach((cell, j) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'table-cell';
            input.value = cell;
            input.dataset.row = i;
            input.dataset.col = j;
            input.addEventListener('input', (e) => {
                tableData[i][j] = e.target.value;
            });
            tableGrid.appendChild(input);
        });
    });
}

insertTableBtn.addEventListener('click', () => {
    tableData = [
        ['', '', ''],
        ['', '', '']
    ];
    renderTableEditor();
    showModal(tableModal);
});

closeTableModalBtn.addEventListener('click', () => requestCloseModal(tableModal));

document.getElementById('addRowBtn').addEventListener('click', () => {
    const newRow = Array(tableData[0].length).fill('');
    tableData.push(newRow);
    renderTableEditor();
});

document.getElementById('addColBtn').addEventListener('click', () => {
    tableData.forEach(row => row.push(''));
    renderTableEditor();
});

document.getElementById('removeRowBtn').addEventListener('click', () => {
    if (tableData.length > 1) {
        tableData.pop();
        renderTableEditor();
    }
});

document.getElementById('removeColBtn').addEventListener('click', () => {
    if (tableData[0].length > 1) {
        tableData.forEach(row => row.pop());
        renderTableEditor();
    }
});

document.getElementById('insertTableConfirm').addEventListener('click', () => {
    let md = '';
    md += '| ' + tableData[0].map(c => c || ' ').join(' | ') + ' |\n';
    md += '| ' + tableData[0].map(() => '---').join(' | ') + ' |\n';
    for (let i = 1; i < tableData.length; i++) {
        md += '| ' + tableData[i].map(c => c || ' ').join(' | ') + ' |\n';
    }
    insertTextAtCursor(md);
    hideModal(tableModal);
});

// Align modal
insertAlignBtn.addEventListener('click', () => {
    document.getElementById('alignText').value = '';
    showModal(alignModal);
});
closeAlignModalBtn.addEventListener('click', () => requestCloseModal(alignModal));
document.getElementById('insertAlignConfirm').addEventListener('click', () => {
    const text = document.getElementById('alignText').value.trim();
    const mode = document.getElementById('alignMode').value;
    if (!text) return;
    let md = '';
    if (mode === 'center') {
        md = `<center>${text}</center>`;
    } else if (mode === 'left') {
        md = `:::left\n${text}\n:::`;
    } else if (mode === 'right') {
        md = `:::right\n${text}\n:::`;
    } else if (mode === 'justify') {
        md = `:::justify\n${text}\n:::`;
    }
    insertTextAtCursor(md);
    hideModal(alignModal);
});

// Font modal
insertCustomFontBtn.addEventListener('click', () => {
    document.getElementById('fontText').value = '';
    showModal(fontModal);
});
closeFontModalBtn.addEventListener('click', () => requestCloseModal(fontModal));
document.getElementById('insertFontConfirm').addEventListener('click', () => {
    const text = document.getElementById('fontText').value.trim();
    const font = document.getElementById('customFont').value;
    if (!text) return;
    const md = `<span style="font-family:${font}">${text}</span>`;
    insertTextAtCursor(md);
    hideModal(fontModal);
});

// Custom renderer
const renderer = new marked.Renderer();
renderer.code = function(code, language) {
    const validLang = !!(language && hljs.getLanguage(language));
    const highlighted = validLang ? hljs.highlight(language, code).value : hljs.highlightAuto(code).value;
    return `<pre data-lang="${language || ''}"><code class="hljs ${language}">${highlighted}</code></pre>`;
};

// Update preview
function updatePreview() {
    let text = input.value;
    totalChars = text.length;
    localStorage.setItem('totalChars', totalChars.toString());
    document.getElementById('statChars').textContent = totalChars;

    // Process DOT
    text = text.replace(/```dot([\s\S]*?)```/g, (_, dot) => {
        return `<div class="dot-container" data-dot="${encodeURIComponent(dot)}"></div>`;
    });

    // Process page breaks — hidden in preview
    text = text.replace(/<!--\s*PAGEBREAK\s*-->/g, '<div class="page-break"></div>');

    // Sanitize and parse
    const dirty = marked.parse(text, { renderer });
    preview.innerHTML = DOMPurify.sanitize(dirty);

    // Apply styles
    preview.style.fontSize = `${fontSelect.value}px`;

    // Style
    preview.querySelectorAll('pre code').forEach(el => {
        el.style.fontFamily = codeFontSelect.value;
    });
    preview.querySelectorAll('*:not(pre):not(code)').forEach(el => {
        if (!el.closest('.dot-container')) {
            el.style.fontFamily = textFontSelect.value;
        }
    });
    preview.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });

    // Render DOT
    document.querySelectorAll('.dot-container').forEach(container => {
        const dotCode = decodeURIComponent(container.dataset.dot);
        viz.renderSVGElement(dotCode)
            .then(svg => {
                container.innerHTML = '';
                svg.style.maxWidth = '100%';
                svg.style.height = 'auto';
                svg.style.display = 'block';
                svg.style.margin = '0 auto';
                container.appendChild(svg);
            })
            .catch(err => {
                container.innerHTML = `<div class="dot-error">Ошибка в DOT: ${err.message || err}</div>`;
            });
    });
}

// PDF Preview
async function showPdfPreview() {
    const tempDiv = document.createElement('div');
    tempDiv.style.width = '595pt';
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = textFontSelect.value;
    tempDiv.style.fontSize = `${fontSelect.value}px`;
    tempDiv.style.color = '#333';
    tempDiv.style.background = '#fff';
    tempDiv.style.boxSizing = 'border-box';

    let text = input.value;
    text = text.replace(/```dot([\s\S]*?)```/g, (_, dot) => {
        return `<div class="dot-container" data-dot="${encodeURIComponent(dot)}"></div>`;
    });
    const dirty = marked.parse(text, { renderer });
    tempDiv.innerHTML = DOMPurify.sanitize(dirty);

    const dotContainers = tempDiv.querySelectorAll('.dot-container');
    for (const container of dotContainers) {
        const dotCode = decodeURIComponent(container.dataset.dot);
        try {
            const svg = await viz.renderSVGElement(dotCode);
            container.innerHTML = '';
            const maxWidth = 515;
            const svgWidth = svg.width.baseVal.value;
            const svgHeight = svg.height.baseVal.value;
            if (svgWidth > maxWidth) {
                const scale = maxWidth / svgWidth;
                svg.setAttribute('width', maxWidth);
                svg.setAttribute('height', svgHeight * scale);
            }
            svg.style.maxWidth = '100%';
            svg.style.height = 'auto';
            svg.style.display = 'block';
            svg.style.margin = '0 auto';
            container.appendChild(svg);
        } catch (err) {
            container.innerHTML = `<div>Ошибка в DOT: ${err.message || err}</div>`;
        }
    }

    const pdfPreviewContent = document.getElementById('pdfPreviewContent');
    pdfPreviewContent.innerHTML = '';
    const content = tempDiv.innerHTML;
    const lines = content.split(/(<\/?[^>]+>)/).filter(Boolean);
    let currentPage = document.createElement('div');
    currentPage.className = 'pdf-page';
    pdfPreviewContent.appendChild(currentPage);
    let currentHeight = 0;
    const maxHeight = 800;

    lines.forEach(part => {
        if (part.trim() === '') {
            currentPage.innerHTML += part;
            return;
        }
        if (part.startsWith('<') && part.endsWith('>')) {
            currentPage.innerHTML += part;
            return;
        }
        const words = part.split(' ');
        let line = '';
        words.forEach(word => {
            const testLine = line + (line ? ' ' : '') + word;
            currentHeight += 20;
            if (currentHeight > maxHeight) {
                currentPage = document.createElement('div');
                currentPage.className = 'pdf-page';
                pdfPreviewContent.appendChild(currentPage);
                currentHeight = 20;
            }
            line = testLine;
        });
        if (line) {
            currentPage.innerHTML += line + ' ';
        }
    });

    showModal(pdfPreviewModal);
}

// Download PDF
async function downloadPDF() {
    const filename = filenameInput.value.trim() || 'document';
    pdfLoader.classList.add('active');

    const tempContainer = document.createElement('div');
    tempContainer.style.width = '595pt';
    tempContainer.style.padding = '20pt 40pt';
    tempContainer.style.fontFamily = textFontSelect.value;
    tempContainer.style.fontSize = `${fontSelect.value}px`;
    tempContainer.style.color = '#333';
    tempContainer.style.background = '#fff';
    tempContainer.style.boxSizing = 'border-box';

    let text = input.value;
    text = text.replace(/```dot([\s\S]*?)```/g, (_, dot) => {
        return `<div class="dot-container" data-dot="${encodeURIComponent(dot)}"></div>`;
    });
    const dirty = marked.parse(text, { renderer });
    tempContainer.innerHTML = DOMPurify.sanitize(dirty);

    const dotContainers = tempContainer.querySelectorAll('.dot-container');
    for (const container of dotContainers) {
        const dotCode = decodeURIComponent(container.dataset.dot);
        try {
            const svg = await viz.renderSVGElement(dotCode);
            container.innerHTML = '';
            const maxWidth = 515;
            const svgWidth = svg.width.baseVal.value;
            const svgHeight = svg.height.baseVal.value;
            if (svgWidth > maxWidth) {
                const scale = maxWidth / svgWidth;
                svg.setAttribute('width', maxWidth);
                svg.setAttribute('height', svgHeight * scale);
            }
            svg.style.maxWidth = '100%';
            svg.style.height = 'auto';
            svg.style.display = 'block';
            svg.style.margin = '0 auto';
            container.appendChild(svg);
        } catch (err) {
            container.innerHTML = `<div>Ошибка в DOT: ${err.message || err}</div>`;
        }
    }

    tempContainer.querySelectorAll('pre, code').forEach(el => {
        el.style.fontFamily = codeFontSelect.value;
        el.style.backgroundColor = '#f8f9fa';
        el.style.color = '#333';
    });
    tempContainer.querySelectorAll('img').forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });

    // Avoid breaks
    tempContainer.querySelectorAll('p, pre, div, table, ul, ol, blockquote, h1, h2, h3, h4, h5, h6').forEach(el => {
        el.style.breakInside = 'avoid';
        el.style.pageBreakInside = 'avoid';
    });

    document.body.appendChild(tempContainer);

    try {
        const options = {
            margin: [15, 15, 15, 15],
            filename: `${filename}.pdf`,
            html2canvas: { 
                scale: 2,
                scrollY: 0,
                useCORS: true,
                logging: false,
                onclone: (clonedDoc) => {
                    clonedDoc.body.style.backgroundColor = '#fff';
                    clonedDoc.body.style.color = '#333';
                    clonedDoc.querySelectorAll('pre').forEach(pre => {
                        pre.style.backgroundColor = '#f8f9fa';
                        pre.style.border = '1px solid #ddd';
                    });
                }
            },
            jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
            pagebreak: { 
                mode: ['css', 'legacy'],
                before: '.page-break',
                avoid: ['p', 'pre', 'div', 'table', 'ul', 'ol', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']
            }
        };

        await html2pdf().set(options).from(tempContainer).save(`${filename}.pdf`);
        downloadCount++;
        localStorage.setItem('downloadCount', downloadCount.toString());
        document.getElementById('statDownloads').textContent = downloadCount;
        showNotification(`Документ "${filename}.pdf" успешно сохранён`, 'success');
    } catch (error) {
        console.error('PDF error:', error);
        showNotification(`Ошибка PDF: ${error.message}`, 'error');
    } finally {
        document.body.removeChild(tempContainer);
        pdfLoader.classList.remove('active');
    }
}

// Notification
function showNotification(message, type = 'info') {
    const notificationText = document.getElementById('notificationText');
    notificationText.textContent = message;
    notification.className = type === 'error' ? 'error show' : 'show';
    setTimeout(() => notification.classList.remove('show'), 5000);
}
function closeNotification() {
    notification.classList.remove('show');
}

// Event listeners
input.addEventListener('input', updatePreview);
fontSelect.addEventListener('change', updatePreview);
downloadPDFBtn.addEventListener('click', downloadPDF);
showPdfPreviewBtn.addEventListener('click', showPdfPreview);
themeSwitcher.addEventListener('click', toggleTheme);
showInfoBtn.addEventListener('click', () => showModal(infoModal));
closeInfoModalBtn.addEventListener('click', () => hideModal(infoModal));
thanksBtn.addEventListener('click', () => showModal(thanksModal));
closeThanksModalBtn.addEventListener('click', () => hideModal(thanksModal));
textFontSelect.addEventListener('change', updatePreview);
codeFontSelect.addEventListener('change', updatePreview);

// ESC to close modals
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentModal) {
        requestCloseModal(currentModal);
    }
});

// Переключение темы по ПКМ
themeSwitcher.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    toggleTheme();
});

// Initialize
updatePreview();
