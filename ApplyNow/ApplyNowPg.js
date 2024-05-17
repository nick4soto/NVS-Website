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

document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('.addButton').forEach(button => {
        button.addEventListener('click', function() {
            const container = document.getElementById(this.getAttribute('data-target'));
            const newInputGroup = container.querySelector('.input-group').cloneNode(true);
            newInputGroup.querySelector('.input-row') ? newInputGroup.querySelector('.input-row').innerHTML = '' : null;
            
            // Reset input fields in cloned group
            Array.from(newInputGroup.querySelectorAll('input')).forEach(input => {
                input.value = '';
            });

            if (container.id === 'namesContainer') {
                const inputs = [
                    { name: 'firstName[]', placeholder: 'First' },
                    { name: 'middleName[]', placeholder: 'Middle' },
                    { name: 'lastName[]', placeholder: 'Last' }
                ];
                
                inputs.forEach(inputInfo => {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.name = inputInfo.name;
                    input.placeholder = inputInfo.placeholder;
                    newInputGroup.querySelector('.input-row').appendChild(input);
                });
            } else if (container.id === 'residentialAddressContainer') {
                newInputGroup.innerHTML = '';
                
                const addressInput = document.createElement('input');
                addressInput.type = 'text';
                addressInput.name = 'address[]';
                addressInput.placeholder = 'Address';
                newInputGroup.appendChild(addressInput);
                
                const fromToInput = document.createElement('input');
                fromToInput.type = 'text';
                fromToInput.name = 'fromTo[]';
                fromToInput.placeholder = 'From/To';
                newInputGroup.appendChild(fromToInput);
            }

            newInputGroup.innerHTML += '<button type="button" class="removeButton">Remove</button>';
            container.appendChild(newInputGroup);
        });
    });

    // Event delegation for remove button
    const formContainer = document.querySelector('.application-form');
    formContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('removeButton')) {
            e.target.closest('.input-group').remove();
        }
    });
});