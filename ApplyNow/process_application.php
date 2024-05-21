<?php
require_once __DIR__ . '/../vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

require_once 'db_connection.php';

// Retrieve form data
$position = $_POST['position'];
$firstName = $_POST['firstName'];
$middleName = $_POST['middleName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$streetAddress = $_POST['streetAddress'];
$addressLine2 = $_POST['addressLine2'];
$city = $_POST['city'];
$state = $_POST['state'];
$zip = $_POST['zip'];
$country = $_POST['country'];
$ssn = $_POST['ssn'];
$homePhone = $_POST['homePhone'];
$mobilePhone = $_POST['mobilePhone'];
$workPhone = $_POST['workPhone'];
$citizenship = $_POST['citizenship'];
$employmentType = isset($_POST['employmentType']) ? implode(', ', $_POST['employmentType']) : '';
$availableHours = $_POST['availableHours'];
$workDays = isset($_POST['workDays']) ? implode(', ', $_POST['workDays']) : '';
$shifts = isset($_POST['shifts']) ? implode(', ', $_POST['shifts']) : '';
$drugTest = $_POST['drugTest'];
$felony = $_POST['felony'];
$felonyDescription = $_POST['felonyDescription'];

// Encrypt sensitive information (SSN)
$encryptedSSN = openssl_encrypt($ssn, 'AES-256-CBC', $_ENV['ENCRYPTION_KEY'], 0, $_ENV['ENCRYPTION_IV']);

// Prepare the SQL statement
$stmt = $pdo->prepare("INSERT INTO applications (position, first_name, middle_name, last_name, email, street_address, address_line2, city, state, zip, country, encrypted_ssn, home_phone, mobile_phone, work_phone, citizenship, employment_type, available_hours, work_days, shifts, drug_test, felony, felony_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->execute([$position, $firstName, $middleName, $lastName, $email, $streetAddress, $addressLine2, $city, $state, $zip, $country, $encryptedSSN, $homePhone, $mobilePhone, $workPhone, $citizenship, $employmentType, $availableHours, $workDays, $shifts, $drugTest, $felony, $felonyDescription]);

// Send email to the boss with unencrypted information
$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host = $_ENV['SMTP_HOST'];
    $mail->SMTPAuth = true;
    $mail->Username = $_ENV['SMTP_USERNAME'];
    $mail->Password = $_ENV['SMTP_PASSWORD'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port = 465;
    $mail->SMTPOptions = array(
        'ssl' => array(
            'verify_peer' => false,
            'verify_peer_name' => false,
            'allow_self_signed' => true
        )
    );

    // Recipients
    $mail->setFrom($_ENV['EMAIL_FROM'], 'Application Form');
    $mail->addAddress($_ENV['EMAIL_TO'], 'Boss');

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Job Application';
    $mail->Body = "
        <p><strong>Position Applied For:</strong> $position</p>
        <p><strong>Name:</strong> $firstName $middleName $lastName</p>
        <p><strong>Email:</strong> $email</p>
        <p><strong>Address:</strong> $streetAddress, $addressLine2, $city, $state, $zip, $country</p>
        <p><strong>Social Security Number:</strong> $ssn</p>
        <p><strong>Phone:</strong> Home: $homePhone, Mobile: $mobilePhone, Work: $workPhone</p>
        <p><strong>Citizenship:</strong> $citizenship</p>
        <p><strong>Employment Type:</strong> $employmentType</p>
        <p><strong>Available Hours:</strong> $availableHours</p>
        <p><strong>Work Days:</strong> $workDays</p>
        <p><strong>Preferred Shifts:</strong> $shifts</p>
        <p><strong>Drug Test/Physical Exam:</strong> $drugTest</p>
        <p><strong>Felony Conviction:</strong> $felony</p>
        <p><strong>Felony Description:</strong> $felonyDescription</p>
    ";

    $mail->send();
    echo 'Application submitted successfully!';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}
?>