<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

function capitalize($value) {
    return is_string($value) ? ucfirst($value) : $value;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = $_POST;
    $fields = [
        'Position Applied For' => $data['position'] ?? '',
        'First Name' => $data['firstName'] ?? '',
        'Middle Name' => $data['middleName'] ?? '',
        'Last Name' => $data['lastName'] ?? '',
        'Email' => $data['email'] ?? '',
        'Street Address' => $data['streetAddress'] ?? '',
        'Address Line 2' => $data['addressLine2'] ?? '',
        'City' => $data['city'] ?? '',
        'State' => $data['state'] ?? '',
        'ZIP' => $data['zip'] ?? '',
        'Country' => $data['country'] ?? '',
        'SSN' => $data['ssn'] ?? '',
        'Home Phone' => $data['homePhone'] ?? '',
        'Mobile Phone' => $data['mobilePhone'] ?? '',
        'Work Phone' => $data['workPhone'] ?? '',
        'Citizenship' => capitalize($data['citizenship'] ?? ''),
        'Employment Level' => isset($data['employmentType']) ? implode(', ', array_map('ucfirst', (array)$data['employmentType'])) : '',
        'Available Hours' => $data['availableHours'] ?? '',
        'Work Days' => isset($data['workDays']) ? implode(', ', array_map('ucfirst', (array)$data['workDays'])) : '',
        'Preferred Shifts' => isset($data['shifts']) ? implode(', ', array_map('ucfirst', (array)$data['shifts'])) : '',
        'Drug Test' => capitalize($data['drugTest'] ?? ''),
        'Felony' => capitalize($data['felony'] ?? ''),
        'Felony Description' => $data['felonyDescription'] ?? '',
        'Source' => $data['source'] ?? '',
        'Applied Before' => capitalize($data['appliedBefore'] ?? ''),
        'Applied When' => $data['appliedWhen'] ?? '',
        'Employed Before' => capitalize($data['employedBefore'] ?? ''),
        'Employed When' => $data['employedWhen'] ?? '',
        'Currently Employed' => capitalize($data['currentlyEmployed'] ?? ''),
        'Contact Employer' => capitalize($data['contactEmployer'] ?? ''),
        'Continue Employment' => capitalize($data['continueEmployment'] ?? ''),
        'Willing to Travel' => capitalize($data['willingToTravel'] ?? ''),
        'Travel Percent' => $data['travelPercent'] ?? '',
        'Start Date' => $data['startDate'] ?? '',
        'Desired Salary' => $data['desiredSalary'] ?? '',
        'Skills' => $data['skills'] ?? '',
        'High School Years' => $data['highSchoolYears'] ?? '',
        'High School Major' => $data['highSchoolMajor'] ?? '',
        'High School Degree' => $data['highSchoolDegree'] ?? '',
        'College Years' => $data['collegeYears'] ?? '',
        'College Major' => $data['collegeMajor'] ?? '',
        'College Degree' => $data['collegeDegree'] ?? '',
        'Additional College Years' => $data['additionalCollegeYears'] ?? '',
        'Additional College Major' => $data['additionalCollegeMajor'] ?? '',
        'Additional College Degree' => $data['additionalCollegeDegree'] ?? '',
        'Post-College Years' => $data['postCollegeYears'] ?? '',
        'Post-College Major' => $data['postCollegeMajor'] ?? '',
        'Post-College Degree' => $data['postCollegeDegree'] ?? '',
        'Other Training Years' => $data['otherTrainingYears'] ?? '',
        'Other Training Major' => $data['otherTrainingMajor'] ?? '',
        'Other Training Degree' => $data['otherTrainingDegree'] ?? '',
        'Additional Skills' => $data['additionalSkills'] ?? '',
        'Scholastic Honors' => $data['scholasticHonors'] ?? '',
        'Continue Studies' => capitalize($data['continueStudies'] ?? ''),
        'Emergency First Name' => $data['emergencyFirstName'] ?? '',
        'Emergency Last Name' => $data['emergencyLastName'] ?? '',
        'Emergency Phone' => $data['emergencyPhone'] ?? '',
        'Emergency Address' => $data['emergencyAddress'] ?? '',
        'Full Name' => $data['fullName'] ?? '',
        'Maiden Name or Aliases' => isset($data['aliases']) ? implode(', ', (array)$data['aliases']) : '',
        'Date of Birth' => $data['dob'] ?? '',
        'Driver\'s License State' => $data['licenseState'] ?? '',
        'Driver\'s License Number' => $data['licenseNumber'] ?? '',
        'Contact Phone' => $data['contactPhone'] ?? '',
        'Consent Agreement' => isset($data['consent']) ? 'Agreed' : 'Not Agreed',
        'Notice And Acknowledgment' => isset($data['acknowledge']) ? 'Agreed' : 'Not Agreed',
        'MN OK Report Copy' => isset($data['reportCopyMNOK']) ? 'Requested' : 'Not Requested',
        'NY Report Copy' => isset($data['reportCopyNY']) ? 'Requested' : 'Not Requested',
        'CA Report Copy' => isset($data['reportCopyCA']) ? 'Requested' : 'Not Requested'
    ];

    // Handle dynamic fields
    if (isset($data['companyName'])) {
        $employmentHistory = "";
        foreach ($data['companyName'] as $index => $companyName) {
            $employmentHistory .= "<h3>Employment History " . ($index + 1) . "</h3>";
            $employmentHistory .= "<p><strong>Company Name:</strong> " . $companyName . "</p>";
            $employmentHistory .= "<p><strong>Address:</strong> " . ($data['companyAddress'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Phone:</strong> " . ($data['companyPhone'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Date Started:</strong> " . ($data['dateStarted'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Starting Wage:</strong> " . ($data['startingWage'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Date Ended:</strong> " . ($data['dateEnded'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Ending Wage:</strong> " . ($data['endingWage'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Name of Supervisor:</strong> " . ($data['supervisorName'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>May we contact this employer?</strong> " . capitalize($data['contactEmployer'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Responsibilities:</strong> " . ($data['responsibilities'][$index] ?? '') . "</p>";
            $employmentHistory .= "<p><strong>Reason for Leaving:</strong> " . ($data['reasonForLeaving'][$index] ?? '') . "</p>";
        }
        $fields['Employment History'] = $employmentHistory;
    }

    if (isset($data['refName'])) {
        $professionalReferences = "";
        foreach ($data['refName'] as $index => $refName) {
            $professionalReferences .= "<h3>Professional Reference " . ($index + 1) . "</h3>";
            $professionalReferences .= "<p><strong>Name:</strong> " . $refName . "</p>";
            $professionalReferences .= "<p><strong>Phone:</strong> " . ($data['refPhone'][$index] ?? '') . "</p>";
            $professionalReferences .= "<p><strong>Address:</strong> " . ($data['refAddress'][$index] ?? '') . "</p>";
            $professionalReferences .= "<p><strong>Years Known:</strong> " . ($data['refYearsKnown'][$index] ?? '') . "</p>";
            $professionalReferences .= "<p><strong>Position:</strong> " . ($data['refPosition'][$index] ?? '') . "</p>";
        }
        $fields['Professional References'] = $professionalReferences;
    }

    if (isset($data['address'])) {
        $residentialAddresses = "";
        foreach ($data['address'] as $index => $address) {
            $residentialAddresses .= "<h3>Residential Address " . ($index + 1) . "</h3>";
            $residentialAddresses .= "<p><strong>Address:</strong> " . $address . "</p>";
            $residentialAddresses .= "<p><strong>From:</strong> " . ($data['addressFrom'][$index] ?? '') . "</p>";
            $residentialAddresses .= "<p><strong>To:</strong> " . ($data['addressTo'][$index] ?? '') . "</p>";
        }
        $fields['Residential Addresses'] = $residentialAddresses;
    }

    // Handle the signature data
    if (isset($_POST['signature'])) {
        $signatureDataURL = $_POST['signature'];
        $signatureData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $signatureDataURL));
        $signatureFilePath = 'signatures/' . uniqid() . '.png';
        file_put_contents($signatureFilePath, $signatureData);
        $fields['Signature'] = "<img src=\"cid:signature\" alt=\"Signature\" style=\"max-width: 200px; background-color: white;\" />";
    }

    $message = "<html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f9f9f9;
                margin: 0;
                padding: 20px;
            }
            h2 {
                color: #3e2a75;
                font-size: 24px;
                margin-bottom: 20px;
            }
            h3 {
                color: #3e2a75;
                font-size: 18px;
                margin-top: 30px;
                margin-bottom: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
            }
            th, td {
                padding: 10px;
                border: 1px solid #ccc;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            p {
                margin: 5px 0;
            }
            strong {
                font-weight: bold;
            }
            .section {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <h2>Job Application Details</h2>";

    $message .= "<div class=\"section\"><h3>Personal Information</h3><table>";
    foreach ($fields as $key => $value) {
        if (!is_array($value) && !in_array($key, ['Employment History', 'Professional References', 'Residential Addresses', 'Signature'])) {
            $message .= "<tr><th>$key</th><td>$value</td></tr>";
        }
    }
    $message .= "</table></div>";

    if (isset($fields['Employment History'])) {
        $message .= "<div class=\"section\"><h3>Employment History</h3>" . $fields['Employment History'] . "</div>";
    }

    if (isset($fields['Professional References'])) {
        $message .= "<div class=\"section\"><h3>Professional References</h3>" . $fields['Professional References'] . "</div>";
    }

    if (isset($fields['Residential Addresses'])) {
        $message .= "<div class=\"section\"><h3>Residential Addresses</h3>" . $fields['Residential Addresses'] . "</div>";
    }

    if (isset($fields['Signature'])) {
        $message .= "<div class=\"section\"><h3>Signature</h3>" . $fields['Signature'] . "</div>";
    }

    $message .= "</body>
    </html>";

    $logFile = 'C:/xampp/htdocs/NVS-Website/ApplyNow/application_log.txt';  // Specify the path and filename of your log file

    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->SMTPDebug = 2;  // Enable verbose debug output
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'oddphyscomiko@gmail.com';   // Your Gmail address
        $mail->Password = 'ugpr vbhi snyw zwrs';       // Your Gmail app password
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        //Recipients
        $firstName = $data['firstName'] ?? '';
        $lastName = $data['lastName'] ?? '';
        $mail->setFrom('oddphyscomiko@gmail.com', 'NVS Corporate Services');  // Set the "From" address to your Gmail address
        $mail->addAddress('mad3566@outlook.com');       // Recipient email address

        //Content
        $mail->isHTML(true);
        $mail->Subject = 'Job Application from ' . $firstName . ' ' . $lastName;
        $mail->Body    = $message;

        // Attach signature image
        if (isset($signatureFilePath)) {
            $mail->addEmbeddedImage($signatureFilePath, 'signature');
        }

        // Capture the debug output
        ob_start();
        $mail->send();
        $debugOutput = ob_get_clean();

        // Log the debug output
        file_put_contents($logFile, $debugOutput, FILE_APPEND);

        echo 'Application sent successfully!';
    } catch (Exception $e) {
        echo "There was a problem sending your application. Mailer Error: {$mail->ErrorInfo}";

        // Log the error message
        $errorMessage = "Mailer Error: {$mail->ErrorInfo}\n";
        file_put_contents($logFile, $errorMessage, FILE_APPEND);
    }
} else {
    echo "Invalid request.";
}
?>
