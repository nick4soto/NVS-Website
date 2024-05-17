document.addEventListener('DOMContentLoaded', function() {
    const formSteps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress');
    let currentStep = 0;

    const updateProgress = () => {
        const percentage = ((currentStep + 1) / formSteps.length) * 100;
        progressBar.style.width = `${percentage}%`;
    };

    const showStep = () => {
        formSteps.forEach((step, index) => {
            step.style.display = index === currentStep ? 'block' : 'none';
        });
        updateProgress();
    };

    document.querySelectorAll('.next-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep < formSteps.length - 1) {
                currentStep++;
                showStep();
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep();
            }
        });
    });

    const submitForm = () => {
        alert('Form submitted!');
        // Add your submission logic here
    };

    showStep(); // Initialize the first step
});

// Function to update progress bar and percentage
function updateProgressBar(currentStep, totalSteps) {
    const progressBar = document.querySelector('.progress');
    const progressPercentage = document.querySelector('.progress-percentage');
    const percentage = (currentStep / totalSteps) * 100;

    progressBar.style.width = `${percentage}%`;
    progressPercentage.textContent = `${percentage.toFixed(0)}%`;
}

// Event listeners for navigation buttons
document.addEventListener('DOMContentLoaded', () => {
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const totalSteps = document.querySelectorAll('.form-step').length;
    let currentStep = 1; // Starting step

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep < totalSteps) {
                currentStep++;
                showStep(currentStep - 1, currentStep);
                updateProgressBar(currentStep, totalSteps);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 1) {
                currentStep--;
                showStep(currentStep + 1, currentStep);
                updateProgressBar(currentStep, totalSteps);
            }
        });
    });

    // Initialize progress bar
    updateProgressBar(currentStep, totalSteps);
});

// Function to switch visible form step
function showStep(previousStepIndex, currentStepIndex) {
    const steps = document.querySelectorAll('.form-step');
    steps[previousStepIndex - 1].classList.remove('active');
    steps[currentStepIndex - 1].classList.add('active');
}

function submitForm() {
    // Placeholder for form submission logic
    alert('Form submitted!');
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.addButton').forEach(button => {
        button.addEventListener('click', function() {
            const container = document.getElementById(this.getAttribute('data-target'));
            const newInputGroup = createInputGroup(container);

            // Append the new input group to the container
            container.appendChild(newInputGroup);
            updateRemoveButtons(container);
        });
    });

    function createInputGroup(container) {
        const div = document.createElement('div');
        div.className = 'input-group';

        if (container.id === 'namesContainer') {
            const innerDiv = document.createElement('div');
            innerDiv.className = 'input-row';
            ['firstName', 'middleName', 'lastName'].forEach(name => {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = `${name}[]`;
                input.placeholder = name.charAt(0).toUpperCase() + name.slice(1);
                innerDiv.appendChild(input);
            });
            div.appendChild(innerDiv);
        } else if (container.id === 'employmentHistoryContainer') {
            const fields = [
                { name: 'companyName[]', placeholder: 'Company Name' },
                { name: 'companyAddress[]', placeholder: 'Address' },
                { name: 'companyPhone[]', placeholder: 'Phone' },
                { name: 'dateStarted[]', placeholder: 'Date Started', type: 'date' },
                { name: 'startingWage[]', placeholder: 'Starting Wage' },
                { name: 'dateEnded[]', placeholder: 'Date Ended', type: 'date' },
                { name: 'endingWage[]', placeholder: 'Ending Wage' },
                { name: 'supervisorName[]', placeholder: 'Supervisor Name' },
                { name: 'contactEmployer[]', placeholder: 'May we contact this employer?', type: 'select', options: ['Yes', 'No'] },
                { name: 'responsibilities[]', placeholder: 'Responsibilities', type: 'textarea' },
                { name: 'reasonForLeaving[]', placeholder: 'Reason for Leaving', type: 'textarea' }
            ];
            addFields(div, fields);
        } else if (container.id === 'referenceContainer') {
            const fields = [
                { name: 'refName[]', placeholder: 'Name' },
                { name: 'refPhone[]', placeholder: 'Phone' },
                { name: 'refAddress[]', placeholder: 'Address' },
                { name: 'refYearsKnown[]', placeholder: 'Years Known' },
                { name: 'refPosition[]', placeholder: 'Position' }
            ];
            addFields(div, fields);
        } else if (container.id === 'residentialAddressContainer') {
            const fields = [
                { name: 'address[]', placeholder: 'Address' },
                { name: 'fromTo[]', placeholder: 'From/To' }
            ];
            addFields(div, fields);
        }

        return div;
    }

    function addFields(div, fields) {
        fields.forEach(field => {
            const label = document.createElement('label');
            label.textContent = field.placeholder + ': ';
            if (field.type === 'select') {
                const select = document.createElement('select');
                select.name = field.name;
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.toLowerCase();
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                });
                label.appendChild(select);
            } else if (field.type === 'textarea') {
                const textarea = document.createElement('textarea');
                textarea.name = field.name;
                textarea.placeholder = field.placeholder;
                label.appendChild(textarea);
            } else {
                const input = document.createElement('input');
                input.type = field.type || 'text';
                input.name = field.name;
                input.placeholder = field.placeholder;
                label.appendChild(input);
            }
            div.appendChild(label);
        });
    }

    function updateRemoveButtons(container) {
        const inputGroups = container.querySelectorAll('.input-group');
        inputGroups.forEach((group, index) => {
            let removeBtn = group.querySelector('.removeButton');
            if (removeBtn) removeBtn.remove();

            if (index > -1) {
                removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.textContent = 'Remove';
                removeBtn.className = 'removeButton';
                removeBtn.onclick = () => {
                    group.remove();
                    updateRemoveButtons(container);
                };
                group.appendChild(removeBtn);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
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
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);

    const clearButton = document.getElementById('clearSignature');
    clearButton.addEventListener('click', () => ctx.clearRect(0, 0, canvas.width, canvas.height));

    // Set up the canvas drawing styles
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';
});

