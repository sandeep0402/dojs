$(document).ready(function () {
    let jsonData = {};

    // Paste from clipboard
    $('#paste-btn').click(async function () {
        try {
            const text = await navigator.clipboard.readText();
            $('#json-input').val(text);
            parseAndRender();
        } catch (err) {
            alert('Failed to read clipboard: ' + err);
        }
    });

    // Clear everything
    $('#clear-btn').click(() => {
        $('#json-input').val('');
        $('#json-tree').empty();
        $('#sibling-table').empty();
    });

    // Format JSON
    $('#format-btn').click(() => {
        try {
            const json = JSON.parse($('#json-input').val());
            $('#json-input').val(JSON.stringify(json, null, 4));
            parseAndRender();
        } catch (e) {
            alert('Invalid JSON!');
        }
    });

    // Minify JSON
    $('#minify-btn').click(() => {
        try {
            const json = JSON.parse($('#json-input').val());
            $('#json-input').val(JSON.stringify(json));
            parseAndRender();
        } catch (e) {
            alert('Invalid JSON!');
        }
    });

    // Render JSON tree when textarea changes
    $('#json-input').on('input', parseAndRender);

    function parseAndRender() {
        $('#json-tree').empty();
        $('#sibling-table').empty();
        try {
            const inputVal = $('#json-input').val();
            jsonData = JSON.parse(inputVal);
            $('#json-tree').append(renderTree(jsonData));
        } catch (e) {
            // Silent fail if input is empty or invalid
        }
    }

    // Render tree logic with +/- indicators
    function renderTree(data, level = 0) {
        const ul = $('<ul></ul>').addClass('json-tree');
    
        if (Array.isArray(data)) {
            data.forEach((item, index) => {
                const li = $('<li></li>');
                const keySpan = $('<span class="json-key"></span>').text(`[${index}]`);
    
                if (typeof item === 'object' && item !== null) {
                    keySpan.addClass('json-collapsible'); // Array collapsible node
                    li.append(keySpan);
                    li.append(renderTree(item, level + 1));
                    if (level >= 1) {
                        li.find('ul').hide();
                    }
                } else {
                    li.append(keySpan).append(`<span class="json-value text-muted">: ${item}</span>`);
                }
                ul.append(li);
            });
        } else if (typeof data === 'object' && data !== null) {
            Object.entries(data).forEach(([key, value]) => {
                const li = $('<li></li>');
                const keySpan = $('<span class="json-key"></span>').text(key);
    
                if (typeof value === 'object' && value !== null) {
                    keySpan.addClass('json-collapsible'); // Object collapsible node
                    li.append(keySpan);
                    li.append(renderTree(value, level + 1));
                    if (level >= 1) {
                        li.find('ul').hide();
                    }
                } else {
                    li.append(keySpan).append(`<span class="json-value text-muted">: ${value}</span>`);
                }
                ul.append(li);
            });
        } else {
            const li = $('<li></li>').append(`<span class="json-value text-muted">${data}</span>`);
            ul.append(li);
        }
    
        return ul;
    }    
    
    // Toggle tree + update sibling table
    $(document).on('click', '.json-collapsible', function (e) {
        e.stopPropagation();
        const $this = $(this);
        $this.toggleClass('active');
        $this.siblings('ul').slideToggle();

        const siblings = $this.closest('ul').children('li');
        const siblingData = [];
        siblings.each(function () {
            const key = $(this).children('.json-key').first().text();
            const value = $(this).children('.json-value').first().text().trim();
            siblingData.push({ name: key, value: value || '[Object]' });
        });
        updateSiblingTable(siblingData);
    });

    function updateSiblingTable(data) {
        if (!data.length) {
            $('#sibling-table').html('<p class="text-muted">No siblings to display.</p>');
            return;
        }

        let table = `<table class="table table-bordered table-sm">
                        <thead><tr><th>Name</th><th>Value</th></tr></thead>
                        <tbody>`;
        data.forEach(row => {
            table += `<tr><td>${row.name}</td><td>${row.value}</td></tr>`;
        });
        table += `</tbody></table>`;

        $('#sibling-table').html(table);
    }
});
