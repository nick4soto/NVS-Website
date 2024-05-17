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
            const inputs = [
                { name: 'firstName[]', placeholder: 'First' },
                { name: 'middleName[]', placeholder: 'Middle' },
                { name: 'lastName[]', placeholder: 'Last' }
            ];
            const innerDiv = document.createElement('div');
            innerDiv.className = 'input-row';
            inputs.forEach(inputInfo => {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = inputInfo.name;
                input.placeholder = inputInfo.placeholder;
                innerDiv.appendChild(input);
            });
            div.appendChild(innerDiv);
        } else if (container.id === 'residentialAddressContainer') {
            const addressInput = document.createElement('input');
            addressInput.type = 'text';
            addressInput.name = 'address[]';
            addressInput.placeholder = 'Address';
            div.appendChild(addressInput);

            const fromToInput = document.createElement('input');
            fromToInput.type = 'text';
            fromToInput.name = 'fromTo[]';
            fromToInput.placeholder = 'From/To';
            div.appendChild(fromToInput);
        }

        return div;
    }

    function updateRemoveButtons(container) {
        const inputGroups = container.querySelectorAll('.input-group');
        inputGroups.forEach((group, index) => {
            // Remove existing remove button if it exists
            let removeBtn = group.querySelector('.removeButton');
            if (removeBtn) {
                removeBtn.remove();
            }

            // Only add remove button if it's not the first input group
            if (index > -1) {
                removeBtn = document.createElement('button');
                removeBtn.type = 'button';
                removeBtn.textContent = 'Remove';
                removeBtn.className = 'removeButton';
                removeBtn.onclick = () => {
                    group.remove();
                    updateRemoveButtons(container); // Update buttons after removal
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