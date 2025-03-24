$(document).ready(function () {
    let jsonData = {};

    // Action buttons (paste, format, clear, etc.) — placeholders for now
    $('#paste-btn').click(() => $('#json-tree').text(prompt('Paste JSON:')));
    $('#clear-btn').click(() => {
        $('#json-tree').empty();
        $('#sibling-table').empty();
    });

    // Render JSON tree
    function renderTree(data, parent, level = 0) {
        const ul = $('<ul></ul>');
        Object.entries(data).forEach(([key, value]) => {
            const li = $('<li></li>');
            const keySpan = $('<span class="json-key"></span>').text(key);

            if (typeof value === 'object' && value !== null) {
                keySpan.addClass('json-collapsible');
                li.append(keySpan);
                li.append(renderTree(value, li, level + 1));
                if (level >= 1) {
                    li.find('ul').hide(); // Collapse deeper levels
                }
            } else {
                li.append(keySpan).append(`<span class="json-value text-muted">: ${value}</span>`);
            }
            ul.append(li);
        });
        return ul;
    }

    // Example JSON (for testing)
    const sampleJson = {
        user: {
            id: 1,
            name: "John",
            details: {
                email: "john@example.com",
                active: true
            }
        },
        settings: {
            theme: "dark",
            notifications: true
        }
    };

    // Render sample data on page load
    jsonData = sampleJson;
    $('#json-tree').append(renderTree(sampleJson));

    // Toggle expand/collapse on click
    $(document).on('click', '.json-key', function (e) {
        e.stopPropagation();
        const $this = $(this);
        $this.toggleClass('active');
        $this.siblings('ul').slideToggle();

        // Show siblings in right table
        const siblings = $this.closest('ul').children('li');
        const siblingData = [];
        siblings.each(function () {
            const key = $(this).children('.json-key').first().text();
            const value = $(this).children('.json-value').first().text().trim();
            siblingData.push({ name: key, value: value || '[Object]' });
        });
        updateSiblingTable(siblingData);
    });

    // Update sibling table
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
