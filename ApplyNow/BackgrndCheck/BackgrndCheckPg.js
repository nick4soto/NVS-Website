document.addEventListener('DOMContentLoaded', function () {});
    const canvas = document.getElementById('signature-pad');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    document.querySelector('.signature button').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });


    document.querySelector('.submit-button').addEventListener('click', function (event) {
        event.preventDefault();

        const form = document.querySelector('form');
        const formData = new FormData(form);

        const signatureData = canvas.toDataURL();
        formData.append('signature', signatureData);

        fetch('submit_background_check.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            console.log('Server response:', result);
            window.location.href = 'submission.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the background check authorization.');
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.addButton').forEach(button => {
            button.addEventListener('click', function () {
                const container = document.getElementById(this.getAttribute('data-target'));
                const newInputGroup = createInputGroup(container);
                container.appendChild(newInputGroup);
            });
        });
    
        function createInputGroup(container) {
            const div = document.createElement('div');
            div.className = 'input-group';
    
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = container.querySelector('input').placeholder;
            div.appendChild(input);
    
            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'removeButton';
            removeBtn.addEventListener('click', () => div.remove());
            div.appendChild(removeBtn);
    
            return div;
        }
    });
    
        function addFields(parent, fields) {
            fields.forEach(field => {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
    
                const label = document.createElement('label');
                label.textContent = field.name + ':';
                formGroup.appendChild(label);
    
                if (field.type === 'select') {
                    const select = document.createElement('select');
                    select.name = field.name;
                    field.options.forEach(option => {
                        const optionElement = document.createElement('option');
                        optionElement.value = option.toLowerCase();
                        optionElement.textContent = option;
                        select.appendChild(optionElement);
                    });
                    formGroup.appendChild(select);
                } else if (field.type === 'textarea') {
                    const textarea = document.createElement('textarea');
                    textarea.name = field.name;
                    formGroup.appendChild(textarea);
                } else {
                    const input = document.createElement('input');
                    input.type = field.type || 'text';
                    input.name = field.name;
                    formGroup.appendChild(input);
                }
    
                parent.appendChild(formGroup);
            });
        };