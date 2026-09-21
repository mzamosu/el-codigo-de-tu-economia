var myTheme = {
    init: function () {
        // Common functions
        if (this.inIframe()) $('body').addClass('in-iframe');
        if (!$('body').hasClass('exe-web-site')) return;
        // Add menu and search bar togglers
        var togglers =
            '\
            <button type="button" id="siteNavToggler" class="toggler" title="' +
            $exe_i18n.menu +
            '">\
                <span class="sr-av">' +
            $exe_i18n.menu +
            '</span>\
            </button>\
            <button type="button" id="searchBarTogger" class="toggler" title="' +
            $exe_i18n.search +
            '">\
                <span class="sr-av">' +
            $exe_i18n.search +
            '</span>\
            </button>\
        ';
        $('#siteNav').before(togglers);
        // Add dark mode toggle button
        var darkModeButton = '<button type="button" id="darkModeToggle" style="position: fixed; bottom: 10px; right: 40px; width: 30px; height: 30px; background-color: rgba(0,0,0,0.3); border: none; border-radius: 50%; color: white; font-size: 16px; cursor: pointer; opacity: 0.7; z-index: 1000;" title="Modo oscuro">🌙</button>';
        $('body').append(darkModeButton);
        // Check dark mode status from localStorage
        if (localStorage.getItem('darkMode') === 'true') {
            myTheme.applyDarkMode();
        }
        // Dark mode toggle
        $('#darkModeToggle').on('click', function () {
            if ($('body').hasClass('dark-mode-active')) {
                myTheme.removeDarkMode();
            } else {
                myTheme.applyDarkMode();
            }
        });

        // 1. Inyectar estilos específicos para las fuentes
const styleTag = document.createElement('style');
styleTag.innerHTML = `
    /* Cuando la clase NO está activa (Quicksand) */
    .exe-content, body.exe-export, 
    #tinymce.mce-content-body a.glosario span,
    .exe-content :is(.box-content, .udl-content, .eXelearning-content) a.glosario span,
    .exe-content article.box div[mode=export] .idevice_body a.glosario span {
        font-family: 'quicksand', sans-serif;
    }

    /* Cuando la clase SÍ está activa (Atkinson) */
    body.font-hyperlegible .exe-content, 
    body.font-hyperlegible.exe-export,
    body.font-hyperlegible #tinymce.mce-content-body a.glosario span,
    body.font-hyperlegible .exe-content :is(.box-content, .udl-content, .eXelearning-content) a.glosario span,
    body.font-hyperlegible .exe-content article.box div[mode=export] .idevice_body a.glosario span {
        font-family: 'AtkinsonHyperlegible', sans-serif !important;
    }
`;
document.head.appendChild(styleTag);

// 2. Definir el nuevo botón (posicionado a la izquierda del modo oscuro)
var fontToggleButton = '<button type="button" id="fontToggle" style="position: fixed; bottom: 10px; right: 75px; width: 30px; height: 30px; background-color: rgba(0,0,0,0.3); border: none; border-radius: 50%; color: white; font-size: 12px; cursor: pointer; opacity: 0.7; z-index: 1000; font-weight: bold;" title="Cambiar fuente">Aa</button>';

$('body').append(fontToggleButton);

// 3. Comprobar estado guardado
if (localStorage.getItem('fontHyperlegible') === 'true') {
    $('body').addClass('font-hyperlegible');
}

// 4. Evento Click
$('#fontToggle').on('click', function () {
    $('body').toggleClass('font-hyperlegible');
    var isHyperlegible = $('body').hasClass('font-hyperlegible');
    localStorage.setItem('fontHyperlegible', isHyperlegible);
});


        // Check the current NAV status
        var url = window.location.href;
        url = url.split('?');
        if (url.length > 1) {
            if (url[1].indexOf('nav=false') != -1) {
                $('body').addClass('siteNav-off');
                myTheme.params('add');
            }
        }
        // Menu toggler
        $('#siteNavToggler').on('click', function () {
            if (myTheme.isLowRes()) {
                $('#exe-client-search').hide();
                if ($('body').hasClass('siteNav-off')) {
                    $('body').removeClass('siteNav-off');
                } else {
                    if ($('#siteNav').isInViewport()) {
                        $('body').addClass('siteNav-off');
                        myTheme.params('add');
                    }
                }
            } else {
                $('body').toggleClass('siteNav-off');
                myTheme.params(
                    $('body').hasClass('siteNav-off') ? 'add' : 'remove'
                );
            }
        });
        // Search bar toggler
        $('#searchBarTogger').on('click', function () {
            var bar = $('#exe-client-search');
            if (bar.is(':visible')) {
                bar.hide();
            } else {
                if (myTheme.isLowRes()) {
                    $('body').addClass('siteNav-off');
                }
                bar.show();
                $('#exe-client-search-text').focus();
            }
        });
        /*if (!this.inIframe()) {*/
            // Fixed navigation
            $('#siteNav').wrap('<div id="sidebar-nav"></div>');
            myTheme.checkNav();
            $(window).bind('resize', function () {
                myTheme.checkNav();
            });
        /*}*/
        // Search form
        this.searchForm();

        // mover .page-title dentro de .page-content
        this.movePageTitle();
    },
    inIframe: function () {
        try {
            return window.self !== window.top;
        } catch (e) {
            return true;
        }
    },
    searchForm: function () {
        $('#exe-client-search-text').attr('class', 'form-control');
    },
    isLowRes: function () {
        return $('#siteNav').css('float') == 'none';
    },
    checkNav: function () {
        var wrapper = $('#sidebar-nav');
        var navH = $('#siteNav > ul').height(); // Menu height
        navH = navH + 50;
        if (navH < $(window).height()) wrapper.addClass('fixed');
        else wrapper.removeClass('fixed');
    },
    param: function (e, act) {
        if (act == 'add') {
            var ref = e.href;
            var con = '?';
            if (ref.indexOf('.html?') != -1) con = '&';
            var param = 'nav=false';
            if (ref.indexOf(param) == -1) {
                ref += con + param;
                e.href = ref;
            }
        } else {
            // This will remove all params
            var ref = e.href;
            ref = ref.split('?');
            e.href = ref[0];
        }
    },
    params: function (act) {
        $('.nav-buttons a').each(function () {
            myTheme.param(this, act);
        });
    },

    // function that move the h2 outside the header
    movePageTitle: function () {
        const tryMove = () => {
            const $header = $('.main-header .page-header');
            const $title = $header.find('.page-title').first();

            // Search container of content
            let $content = $('.page-content').first();
            if (!$content.length)
                $content = $('.content, main .content').first();
            if (!$content.length) $content = $('#main, #content').first();
            if (!$content.length && $header.length)
                $content = $header.nextAll(':not(header)').first();
            if (!$content.length && $header.length) $content = $header.parent();

            if ($header.length && $title.length && $content.length) {
                $content.prepend($title); // move it to the start
                return true;
            }
            return false;
        };

        if (tryMove()) return;

        const observer = new MutationObserver(() => {
            if (tryMove()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    },
    applyDarkMode: function () {
        $('body').addClass('dark-mode-active');
        $('html').addClass('dark-mode-active');
        localStorage.setItem('darkMode', 'true');
    },
    removeDarkMode: function () {
        $('body').removeClass('dark-mode-active');
        $('html').removeClass('dark-mode-active');
        localStorage.removeItem('darkMode');
    },
    // 🔼
};

$(function () {
    myTheme.init();
    exeNotes.init();
    exeHighlighter.init();
});

$.fn.isInViewport = function () {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
};

var exeNotes = {
    storageKey: null,
    init: function () {
        if (!window.localStorage) return;
        this.storageKey = this.getDocumentStorageKey();
        this.createNotesButton();
        this.createNotesPanel();
        this.loadNotes();
        this.bindEvents();
    },
    getMaterialTitle: function () {
        var title = $.trim($('.package-title').first().text());
        if (!title) {
            title = $.trim($('.package-header .package-title').first().text());
        }
        if (!title) {
            title = document.title || '';
        }
        return title;
    },
    getPageTitle: function () {
        var title = $.trim($('.page-title').first().text());
        return title || 'Página sin título';
    },
    getDocumentStorageKey: function () {
        var packageTitle = this.getMaterialTitle();
        var pageTitle = this.getPageTitle();
        var combinedTitle = packageTitle + ' | ' + pageTitle;
        var normalizedTitle = combinedTitle.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9 _|-]/g, '_');
        return 'exeNotesData|' + normalizedTitle;
    },
    createNotesButton: function () {
        var notesButton = '<button type="button" id="exeNotesToggle" title="Notas" style="position: fixed; bottom: 10px; right: 110px; width: 30px; height: 30px; background-color: rgba(0,0,0,0.3); border: none; border-radius: 50%; color: white; font-size: 18px; cursor: pointer; opacity: 0.7; z-index: 1000; transition: all 0.3s ease;">🗒️</button>';
        $('body').append(notesButton);
    },
    updateNoteButtonStatus: function () {
        var hasNotes = this.notes && this.notes.length > 0;
        var $button = $('#exeNotesToggle');
        
        if (hasNotes) {
            $button.addClass('exe-notes-active').removeClass('exe-notes-inactive');
            $button.attr('title', 'Notas (' + this.notes.length + ')');
        } else {
            $button.addClass('exe-notes-inactive').removeClass('exe-notes-active');
            $button.attr('title', 'Notas (sin contenido en esta página)');
        }
    },
    createNotesPanel: function () {
        var materialTitle = this.escapeHtml(this.getMaterialTitle());
        var pageTitle = this.escapeHtml(this.getPageTitle());
        var panel = `
            <div id="exeNotesPanel" aria-hidden="true">
                <div class="exe-notes-header">
                    <div>
                        <strong>Notas guardadas</strong>
                        <div class="exe-notes-material">${materialTitle}</div>
                        <div class="exe-notes-page" style="font-size: 0.85em; color: #999; margin-top: 4px;">Página: ${pageTitle}</div>
                    </div>
                    <button type="button" id="exeNotesClose" title="Cerrar notas">✕</button>
                </div>
                <div class="exe-notes-body">
                    <div class="exe-notes-form">
                        <input id="exeNotesTitle" type="text" placeholder="Título de la nota">
                        <textarea id="exeNotesText" rows="4" placeholder="Escribe aquí tu nota..."></textarea>
                        <div class="exe-notes-buttons">
                            <button type="button" id="exeNotesSave">Guardar nota</button>
                            <button type="button" id="exeNotesClear">Limpiar</button>
                        </div>
                    </div>
                    <div id="exeNotesList" class="exe-notes-list"></div>
                </div>
            </div>
            <div id="exeNotesBackdrop"></div>
        `;
        $('body').append(panel);
    },
    bindEvents: function () {
        var self = this;
        $(document).on('click', '#exeNotesToggle', function () {
            // Solo permitir abrir el panel si hay notas o si el usuario quiere agregar
            self.togglePanel();
        });
        $(document).on('click', '#exeNotesClose, #exeNotesBackdrop', function () {
            self.hidePanel();
        });
        $(document).on('click', '#exeNotesSave', function () {
            self.addNote();
        });
        $(document).on('click', '#exeNotesClear', function () {
            self.clearForm();
        });
        $(document).on('click', '.exeNotesEdit', function () {
            self.editNote($(this).data('id'));
        });
        $(document).on('click', '.exeNotesDelete', function () {
            self.deleteNote($(this).data('id'));
        });
        $(document).on('click', '.exeNotesUpdate', function () {
            self.saveEditedNote($(this).data('id'));
        });
        $(document).on('click', '.exeNotesCancel', function () {
            self.renderNotes();
        });
    },
    togglePanel: function () {
        if ($('#exeNotesPanel').hasClass('visible')) {
            this.hidePanel();
        } else {
            this.showPanel();
        }
    },
    showPanel: function () {
        $('#exeNotesPanel').addClass('visible').attr('aria-hidden', 'false');
        $('#exeNotesBackdrop').addClass('visible');
        setTimeout(function () {
            $('#exeNotesTitle').focus();
        }, 50);
    },
    hidePanel: function () {
        $('#exeNotesPanel').removeClass('visible').attr('aria-hidden', 'true');
        $('#exeNotesBackdrop').removeClass('visible');
    },
    loadNotes: function () {
        var raw = localStorage.getItem(this.storageKey);
        var data = raw ? JSON.parse(raw) : [];
        var currentMaterial = this.getMaterialTitle();
        var currentPage = this.getPageTitle();
        if (!Array.isArray(data)) {
            this.notes = [];
        } else {
            this.notes = data.filter(function (note) {
                return (!note.materialTitle || note.materialTitle === currentMaterial) &&
                       (!note.pageTitle || note.pageTitle === currentPage);
            });
        }
        this.renderNotes();
        this.updateNoteButtonStatus();
    },
    saveNotes: function () {
        localStorage.setItem(this.storageKey, JSON.stringify(this.notes));
        this.renderNotes();
        this.updateNoteButtonStatus();
    },
    addNote: function () {
        var title = $.trim($('#exeNotesTitle').val());
        var text = $.trim($('#exeNotesText').val());
        if (!title && !text) {
            alert('Introduce un título o un texto para la nota.');
            return;
        }
        this.notes.unshift({
            id: 'note-' + Date.now(),
            title: title || 'Nota sin título',
            text: text,
            materialTitle: this.getMaterialTitle(),
            pageTitle: this.getPageTitle(),
            createdAt: new Date().toISOString(),
        });
        this.saveNotes();
        this.clearForm();
        this.showPanel();
    },
    clearForm: function () {
        $('#exeNotesTitle').val('');
        $('#exeNotesText').val('');
    },
    renderNotes: function () {
        var $list = $('#exeNotesList');
        $list.empty();
        if (!this.notes.length) {
            $list.append('<div class="exe-notes-empty">No hay notas guardadas todavía.</div>');
            return;
        }
        this.notes.forEach(function (note) {
            if (note.editing) {
                $list.append(exeNotes.noteEditingTemplate(note));
            } else {
                $list.append(exeNotes.noteCardTemplate(note));
            }
        });
    },
    noteCardTemplate: function (note) {
        return `
            <article class="exe-note-card" data-id="${note.id}">
                <div class="exe-note-card-header">
                    <strong>${this.escapeHtml(note.title)}</strong>
                    <div>
                        <button type="button" class="exeNotesEdit" data-id="${note.id}">Editar</button>
                        <button type="button" class="exeNotesDelete" data-id="${note.id}">Eliminar</button>
                    </div>
                </div>
                <p class="exe-note-text">${this.escapeHtml(note.text).replace(/\n/g, '<br>')}</p>
            </article>
        `;
    },
    noteEditingTemplate: function (note) {
        return `
            <article class="exe-note-card exe-note-editing" data-id="${note.id}">
                <input type="text" class="exeNoteEditTitle" value="${this.escapeAttribute(note.title)}">
                <textarea class="exeNoteEditText">${this.escapeHtml(note.text)}</textarea>
                <div class="exe-note-card-actions">
                    <button type="button" class="exeNotesUpdate" data-id="${note.id}">Guardar</button>
                    <button type="button" class="exeNotesCancel">Cancelar</button>
                </div>
            </article>
        `;
    },
    editNote: function (id) {
        this.notes = this.notes.map(function (note) {
            note.editing = note.id === id;
            return note;
        });
        this.renderNotes();
    },
    saveEditedNote: function (id) {
        var card = $('.exe-note-card[data-id="' + id + '"]');
        var title = $.trim(card.find('.exeNoteEditTitle').val());
        var text = $.trim(card.find('.exeNoteEditText').val());
        if (!title && !text) {
            alert('La nota no puede estar vacía.');
            return;
        }
        this.notes = this.notes.map(function (note) {
            if (note.id === id) {
                note.title = title || 'Nota sin título';
                note.text = text;
                note.materialTitle = exeNotes.getMaterialTitle();
                note.pageTitle = exeNotes.getPageTitle();
                note.editing = false;
            }
            return note;
        });
        this.saveNotes();
    },
    deleteNote: function (id) {
        if (!confirm('¿Deseas eliminar esta nota?')) return;
        this.notes = this.notes.filter(function (note) {
            return note.id !== id;
        });
        this.saveNotes();
    },
    escapeHtml: function (value) {
        return $('<div/>').text(value).html();
    },
    escapeAttribute: function (value) {
        return $('<div/>').text(value).html().replace(/"/g, '&quot;');
    },
};

var exeHighlighter = {
    storageKey: null,
    active: false,
    init: function () {
        if (!window.localStorage) return;
        this.storageKey = this.getStorageKey();
        this.createHighlighterButton();
        this.bindEvents();
        this.loadHighlights();
    },
    getMaterialTitle: function () {
        var title = $.trim($('.package-title').first().text());
        if (!title) {
            title = $.trim($('.package-header .package-title').first().text());
        }
        if (!title) {
            title = document.title || '';
        }
        return title;
    },
    getPageId: function () {
        var $skip = $('#skipNav');
        if ($skip.length) {
            var href = $skip.attr('href');
            if (href) return href;
            var text = $.trim($skip.text());
            if (text) return text;
        }
        return location.hash || location.pathname || document.title || '';
    },
    getStorageKey: function () {
        var packageTitle = this.getMaterialTitle();
        var normalizedTitle = packageTitle.trim().replace(/\s+/g, ' ').replace(/[^a-zA-Z0-9 _-]/g, '_');
        return 'exeHighlightsData|' + normalizedTitle;
    },
    createHighlighterButton: function () {
        var button = '<button type="button" id="exeHighlightToggle" title="Activar resaltador" style="position: fixed; bottom: 10px; right: 145px; width: 34px; height: 34px; background-color: #b0b7bf; border: none; border-radius: 50%; color: #000; font-size: 18px; cursor: pointer; opacity: 0.95; z-index: 1000;">🖍️</button>';
        $('body').append(button);
    },
    bindEvents: function () {
        var self = this;
        $(document).on('click', '#exeHighlightToggle', function (event) {
            event.stopPropagation();
            self.toggleHighlighter();
        });
        $(document).on('mouseup', function (event) {
            if (!self.active || event.button !== 0) return;
            setTimeout(function () {
                self.handleSelection();
            }, 10);
        });
        $(document).on('contextmenu', '.exe-highlighted', function (event) {
            if (!self.active) return;
            event.preventDefault();
            self.removeHighlight($(this));
        });
    },
    toggleHighlighter: function () {
        this.active = !this.active;
        var $button = $('#exeHighlightToggle');
        $button.toggleClass('active', this.active);
        $button.attr('title', this.active ? 'Resaltador activado' : 'Activar resaltador');
        $button.text(this.active ? '🟡' : '🖍️');
        $('body').toggleClass('highlighter-active', this.active);
    },
    handleSelection: function () {
        var selection = window.getSelection();
        if (!selection || selection.isCollapsed || selection.rangeCount === 0) return;
        var range = selection.getRangeAt(0);
        if (!this.isRangeInsideContent(range)) {
            selection.removeAllRanges();
            return;
        }
        var groups = this.getSelectionGroups(range);
        if (!groups.length) {
            selection.removeAllRanges();
            return;
        }
        var self = this;
        groups.reverse().forEach(function (group) {
            var highlightId = 'highlight-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
            self.wrapRange(group.range, highlightId);
            self.saveHighlight({
                id: highlightId,
                materialTitle: self.getMaterialTitle(),
                pageId: self.getPageId(),
                articleIndex: self.getArticleIndex(group.article),
                start: group.start,
                end: group.end,
                text: self.getTextById(highlightId)
            });
        });
        selection.removeAllRanges();
    },
    getSelectionGroups: function (range) {
        var root = range.commonAncestorContainer;
        if (root && root.nodeType === Node.TEXT_NODE) {
            root = root.parentNode;
        }
        var walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function (node) {
                    return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            },
            false
        );
        var nodes = [];
        var node;
        while ((node = walker.nextNode())) {
            if (!$.trim(node.nodeValue).length) continue;
            var article = $(node).closest('.exe-content article').get(0);
            if (!article) continue;
            var startOffset = (node === range.startContainer) ? range.startOffset : 0;
            var endOffset = (node === range.endContainer) ? range.endOffset : node.nodeValue.length;
            if (node === range.startContainer && node === range.endContainer) {
                startOffset = range.startOffset;
                endOffset = range.endOffset;
            }
            if (startOffset >= endOffset) continue;
            var blockElement = this.getClosestBlockElement(node, article) || article;
            nodes.push({
                article: article,
                blockElement: blockElement,
                node: node,
                startOffset: startOffset,
                endOffset: endOffset
            });
        }
        if (!nodes.length) return [];
        var groups = [];
        var groupMap = {};
        var self = this;
        nodes.forEach(function (item) {
            var groupKey = self.getGroupKey(item.article, item.blockElement);
            if (!groupMap[groupKey]) {
                groupMap[groupKey] = {
                    article: item.article,
                    blockElement: item.blockElement,
                    startNode: item.node,
                    startOffset: item.startOffset,
                    endNode: item.node,
                    endOffset: item.endOffset,
                    start: self.getCharacterOffset(item.node, item.startOffset, item.article),
                    end: self.getCharacterOffset(item.node, item.endOffset, item.article)
                };
            } else {
                var group = groupMap[groupKey];
                var nodePosition = self.compareDocumentPosition(group.endNode, item.node);
                if (nodePosition <= 0) {
                    group.endNode = item.node;
                    group.endOffset = item.endOffset;
                    group.end = self.getCharacterOffset(item.node, item.endOffset, item.article);
                }
                if (self.compareDocumentPosition(item.node, group.startNode) < 0) {
                    group.startNode = item.node;
                    group.startOffset = item.startOffset;
                    group.start = self.getCharacterOffset(item.node, item.startOffset, item.article);
                }
            }
        });
        for (var key in groupMap) {
            if (groupMap.hasOwnProperty(key)) {
                var entry = groupMap[key];
                var groupRange = document.createRange();
                groupRange.setStart(entry.startNode, entry.startOffset);
                groupRange.setEnd(entry.endNode, entry.endOffset);
                groups.push({
                    article: entry.article,
                    blockElement: entry.blockElement,
                    range: groupRange,
                    start: entry.start,
                    end: entry.end
                });
            }
        }
        groups.sort(function (a, b) {
            return a.start - b.start;
        });
        return groups;
    },
    getGroupKey: function (article, blockElement) {
        return this.getArticleIndex(article) + '|' + this.getElementPath(blockElement, article);
    },
    getElementPath: function (element, stop) {
        if (!element) return '';
        var path = [];
        var node = element;
        while (node && node !== stop && node.nodeType === Node.ELEMENT_NODE) {
            var name = node.nodeName.toLowerCase();
            var index = Array.prototype.indexOf.call(node.parentNode ? node.parentNode.children : [], node);
            path.unshift(name + '[' + index + ']');
            node = node.parentNode;
        }
        return path.join('>');
    },
    compareDocumentPosition: function (nodeA, nodeB) {
        if (nodeA === nodeB) return 0;
        var position = nodeA.compareDocumentPosition(nodeB);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1;
        if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1;
        return 0;
    },
    getClosestBlockElement: function (node, article) {
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        if (!node || node === article) return article;
        var block = $(node).closest('li, p, div, section, blockquote, td, th, header, footer, aside, figure, figcaption');
        if (block.length) {
            var $closest = $(block.get(0));
            if ($closest.closest(article).length) return $closest.get(0);
        }
        return article;
    },
    isRangeInsideContent: function (range) {
        return this.nodeIsInExeContent(range.startContainer) && this.nodeIsInExeContent(range.endContainer);
    },
    nodeIsInExeContent: function (node) {
        if (!node) return false;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        return $(node).closest('.exe-content').length > 0;
    },
    getSelectedArticle: function (range) {
        var node = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) node = node.parentNode;
        var $article = $(node).closest('.exe-content article');
        return $article.length ? $article.get(0) : null;
    },
    getArticleIndex: function (article) {
        var $articles = $('.exe-content article');
        return Math.max(0, $articles.index(article));
    },
    getCharacterOffset: function (node, offset, container) {
        if (!node || !container) return null;
        var range = document.createRange();
        try {
            range.setStart(container, 0);
        } catch (e) {
            return null;
        }
        range.setEnd(node, offset);
        return range.toString().length;
    },
    wrapRange: function (range, highlightId) {
        var span = document.createElement('span');
        span.className = 'exe-highlighted';
        span.dataset.highlightId = highlightId;
        var content = range.extractContents();
        span.appendChild(content);
        range.insertNode(span);
    },
    saveHighlight: function (highlight) {
        var highlights = this.loadStorageArray();
        highlights.push(highlight);
        localStorage.setItem(this.storageKey, JSON.stringify(highlights));
    },
    loadStorageArray: function () {
        var raw = localStorage.getItem(this.storageKey);
        if (!raw) return [];
        try {
            var data = JSON.parse(raw);
            return Array.isArray(data) ? data : [];
        } catch (e) {
            return [];
        }
    },
    loadHighlights: function () {
        var highlights = this.loadStorageArray();
        if (!highlights.length) return;
        var currentMaterial = this.getMaterialTitle();
        var currentPage = this.getPageId();
        var self = this;
        highlights.forEach(function (highlight) {
            if (highlight.materialTitle !== currentMaterial || highlight.pageId !== currentPage) return;
            var $article = $('.exe-content article').eq(highlight.articleIndex);
            if (!$article.length) return;
            self.highlightRangeInContainer($article.get(0), highlight.start, highlight.end, highlight.id);
        });
    },
    highlightRangeInContainer: function (container, start, end, highlightId) {
        if (!container || start == null || end == null || end <= start) return;
        var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
        var currentIndex = 0;
        var startNode = null;
        var startOffset = 0;
        var endNode = null;
        var endOffset = 0;
        var node;
        while ((node = walker.nextNode())) {
            var nodeEnd = currentIndex + node.nodeValue.length;
            if (startNode === null && nodeEnd > start) {
                startNode = node;
                startOffset = Math.max(0, start - currentIndex);
            }
            if (startNode !== null && nodeEnd >= end) {
                endNode = node;
                endOffset = Math.max(0, end - currentIndex);
                break;
            }
            currentIndex = nodeEnd;
        }
        if (!startNode || !endNode) return;
        var range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        var span = document.createElement('span');
        span.className = 'exe-highlighted';
        span.dataset.highlightId = highlightId;
        var content = range.extractContents();
        span.appendChild(content);
        range.insertNode(span);
    },
    removeHighlight: function ($element) {
        if (!$element.length) return;
        var highlightId = $element.data('highlightId');
        var dom = $element.get(0);
        while (dom.firstChild) {
            dom.parentNode.insertBefore(dom.firstChild, dom);
        }
        dom.parentNode.removeChild(dom);
        this.removeHighlightById(highlightId);
    },
    removeHighlightById: function (id) {
        if (!id) return;
        var highlights = this.loadStorageArray().filter(function (item) {
            return item.id !== id;
        });
        localStorage.setItem(this.storageKey, JSON.stringify(highlights));
    },
    getTextById: function (id) {
        var $span = $('.exe-highlighted[data-highlight-id="' + id + '"]');
        return $span.length ? $.trim($span.text()) : '';
    }
};

