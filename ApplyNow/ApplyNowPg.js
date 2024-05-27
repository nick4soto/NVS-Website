document.addEventListener('DOMContentLoaded', function () {
    const formSteps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress');
    let currentStep = 0;

    const updateProgress = () => {
        const percentage = (currentStep / (formSteps.length - 1)) * 80; // Maximum of 80%
        progressBar.style.width = `${percentage}%`;
        document.querySelector('.progress-percentage').textContent = `${Math.round(percentage)}%`;
    };

    const showStep = () => {
        formSteps.forEach((step, index) => {
            step.style.display = index === currentStep ? 'block' : 'none';
        });
        updateProgress();
    };

    const validateStep = (stepIndex) => {
        let isValid = true;

        // Step 1: Personal Information
        if (stepIndex === 0) {
            const requiredFieldsStep1 = [
                'position', 'firstName', 'lastName', 'email', 
                'citizenship', 'availableHours', 'drugTest', 
                'felony'
            ];

            requiredFieldsStep1.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    isValid = false;
                }
            });

            // Check radio buttons for citizenship
            const citizenshipChecked = document.querySelector('input[name="citizenship"]:checked');
            if (!citizenshipChecked) {
                isValid = false;
            }

            // Check checkboxes for workDays and shifts
            const workDaysChecked = document.querySelectorAll('input[name="workDays"]:checked').length > 0;
            const shiftsChecked = document.querySelectorAll('input[name="shifts"]:checked').length > 0;
            if (!workDaysChecked || !shiftsChecked) {
                isValid = false;
            }

            // Check radio buttons for drugTest
            const drugTestChecked = document.querySelector('input[name="drugTest"]:checked');
            if (!drugTestChecked) {
                isValid = false;
            }

            // Check radio buttons for felony
            const felonyChecked = document.querySelector('input[name="felony"]:checked');
            if (!felonyChecked) {
                isValid = false;
            }
        }

        // Step 2: Employment Details
        if (stepIndex === 1) {
            const requiredFieldsStep2 = [
                'appliedBefore', 'employedBefore', 'currentlyEmployed',
                'contactEmployer', 'continueEmployment', 'willingToTravel', 
                'travelPercent', 'startDate', 'desiredSalary', 'skills'
            ];

            requiredFieldsStep2.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    isValid = false;
                }
            });

            // Check radio buttons for appliedBefore, employedBefore, currentlyEmployed, contactEmployer, continueEmployment, willingToTravel
            const radioFieldsStep2 = [
                'appliedBefore', 'employedBefore', 'currentlyEmployed',
                'contactEmployer', 'continueEmployment', 'willingToTravel'
            ];

            radioFieldsStep2.forEach(name => {
                const radioChecked = document.querySelector(`input[name="${name}"]:checked`);
                if (!radioChecked) {
                    isValid = false;
                }
            });
        }

        // Step 3: Education Details
        if (stepIndex === 2) {
            const requiredFieldsStep3 = [
                'additionalSkills', 'scholasticHonors', 'continueStudies'
            ];

            requiredFieldsStep3.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    isValid = false;
                }
            });

            // Check radio buttons for continueStudies
            const continueStudiesChecked = document.querySelector('input[name="continueStudies"]:checked');
            if (!continueStudiesChecked) {
                isValid = false;
            }
        }

        // Step 4: Employment History & References
        if (stepIndex === 3) {
            const requiredFieldsStep4 = [
                'emergencyFirstName', 'emergencyLastName', 'emergencyPhone', 
                'emergencyAddress', 'consent'
            ];

            requiredFieldsStep4.forEach(fieldId => {
                const field = document.getElementById(fieldId);
                if (field && !field.value.trim()) {
                    isValid = false;
                }
            });

            // Check the consent checkbox
            const consentChecked = document.getElementById('consent').checked;
            if (!consentChecked) {
                isValid = false;
            }
        }

        return isValid;
    };

    const validateFinalStep = () => {
        const signature = document.getElementById('signatureCanvas');
        const isEmptySignature = signature.toDataURL() === signature.getContext('2d').getImageData(0, 0, signature.width, signature.height).data.toString();

        const requiredCheckboxes = ['consent', 'acknowledge'];
        const areCheckboxesChecked = requiredCheckboxes.every(id => document.getElementById(id).checked);

        return !isEmptySignature && areCheckboxesChecked;
    };

    const showError = (stepIndex) => {
        const errorMessage = formSteps[stepIndex].querySelector('.error-message');
        errorMessage.textContent = 'Please fill in all required fields.';
        errorMessage.style.display = 'block';
    };
    
    const hideError = (stepIndex) => {
        const errorMessage = formSteps[stepIndex].querySelector('.error-message');
        errorMessage.style.display = 'none';
    };

    document.querySelectorAll('.next-btn').forEach((button, index) => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                hideError(currentStep);
                if (currentStep < formSteps.length - 1) {
                    currentStep++;
                    showStep();
                }
            } else {
                showError(currentStep);
            }
        });
    });

    document.querySelectorAll('.prev-btn').forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                hideError(currentStep);
                currentStep--;
                showStep();
            }
        });
    });

    showStep(); // Initialize the first step

    // Add event listener for form submission
    document.getElementById('multiStepForm').addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting

        if (validateStep(currentStep) && validateFinalStep()) {
            const formData = new FormData(this);

            const signature = document.getElementById('signatureCanvas');
            const signatureData = signature.toDataURL();
            formData.append('signature', signatureData);

            fetch('submit_application.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())
                .then(result => {
                    console.log('Server response:', result);
                    window.location.href = 'submission_success.html';
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while submitting the application.');
                });
        } else {
            showError(currentStep);
        }
    });

    document.querySelectorAll('.addButton').forEach(button => {
        button.addEventListener('click', function () {
            const container = document.getElementById(this.getAttribute('data-target'));
            const newInputGroup = createInputGroup(container);
            container.appendChild(newInputGroup);
        });
    });

    const fieldLabels = {
        'companyName[]': 'Company Name',
        'companyAddress[]': 'Address',
        'companyPhone[]': 'Phone',
        'dateStarted[]': 'Date Started',
        'startingWage[]': 'Starting Wage',
        'dateEnded[]': 'Date Ended',
        'endingWage[]': 'Ending Wage',
        'supervisorName[]': 'Name of Supervisor',
        'contactEmployer[]': 'May we contact this employer?',
        'responsibilities[]': 'Responsibilities',
        'reasonForLeaving[]': 'Reason for Leaving',
        'refName[]': 'Name',
        'refPhone[]': 'Phone',
        'refAddress[]': 'Address',
        'refYearsKnown[]': 'Years Known',
        'refPosition[]': 'Position',
        'address[]': 'Address',
        'addressFrom[]': 'From',
        'addressTo[]': 'To'
    };

    function createInputGroup(container) {
        const div = document.createElement('div');
        div.className = 'field-container';

        if (container.id === 'namesContainer') {
            const innerDiv = document.createElement('div');
            innerDiv.className = 'input-row';
            ['firstName', 'middleName', 'lastName'].forEach(name => {
                const input = document.createElement('input');
                input.type = 'text';
                input.name = `${name}[]`;
                innerDiv.appendChild(input);
            });
            div.appendChild(innerDiv);
        } else if (container.id === 'employmentHistoryContainer') {
            const fieldset = document.createElement('fieldset');
            const fields = [
                { name: 'companyName[]' },
                { name: 'companyAddress[]' },
                { name: 'companyPhone[]' },
                { name: 'dateStarted[]', type: 'text' },
                { name: 'startingWage[]' },
                { name: 'dateEnded[]', type: 'text' },
                { name: 'endingWage[]' },
                { name: 'supervisorName[]' },
                { name: 'contactEmployer[]', type: 'select', options: ['Yes', 'No'] },
                { name: 'responsibilities[]', type: 'textarea' },
                { name: 'reasonForLeaving[]', type: 'textarea' }
            ];
            addFields(fieldset, fields);
            div.appendChild(fieldset);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'removeButton';
            removeBtn.onclick = () => div.remove();
            div.appendChild(removeBtn);
        } else if (container.id === 'referenceContainer') {
            const fieldset = document.createElement('fieldset');
            const fields = [
                { name: 'refName[]' },
                { name: 'refPhone[]' },
                { name: 'refAddress[]' },
                { name: 'refYearsKnown[]' },
                { name: 'refPosition[]' }
            ];
            addFields(fieldset, fields);
            div.appendChild(fieldset);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'removeButton';
            removeBtn.onclick = () => div.remove();
            div.appendChild(removeBtn);
        } else if (container.id === 'residentialAddressContainer') {
            const fields = [
                { name: 'address[]' },
                { name: 'addressFrom[]', type: 'text' },
                { name: 'addressTo[]', type: 'text' }
            ];
            addFields(div, fields);

            const removeBtn = document.createElement('button');
            removeBtn.type = 'button';
            removeBtn.textContent = 'Remove';
            removeBtn.className = 'removeButton';
            removeBtn.onclick = () => div.remove();
            div.appendChild(removeBtn);
        }

        return div;
    }

    function addFields(parent, fields) {
        fields.forEach(field => {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            const label = document.createElement('label');
            label.textContent = fieldLabels[field.name] + ':';
            formGroup.appendChild(label);

            if (field.type === 'select') {
                const select = document.createElement('select');
                select.name = field.name;
                select.className = 'form-control';
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
                textarea.className = 'form-control';
                formGroup.appendChild(textarea);
            } else {
                const input = document.createElement('input');
                input.type = field.type || 'text';
                input.name = field.name;
                input.className = 'form-control';
                formGroup.appendChild(input);
            }

            parent.appendChild(formGroup);
        });
    }

    const canvas = document.getElementById('signatureCanvas');
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

    document.getElementById('clearSignature').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
});
