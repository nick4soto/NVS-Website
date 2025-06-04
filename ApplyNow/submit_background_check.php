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
        'Full Name' => $data['full-name'] ?? '',
        'SSN' => $data['ssn'] ?? '',
        'Date of Birth' => $data['dob'] ?? '',
        'Driver’s License State' => $data['dl-state'] ?? '',
        'Driver’s License Number' => $data['dl-number'] ?? '',
        'Phone Number' => $data['phone'] ?? '',
        'Residential Address' => $data['address'] ?? '',
        'Date Range at Address' => $data['date-range'] ?? ''
    ];

    if (isset($data['signature'])) {
        $signatureDataURL = $data['signature'];
        $signatureData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $signatureDataURL));
        $signatureFilePath = __DIR__ . '/signatures/' . uniqid() . '.png';
        file_put_contents($signatureFilePath, $signatureData);
        $fields['Signature'] = "<img src=\"cid:signature\" style=\"max-width:200px;\" />";
    }

    $message = "<html><body><h2>Background Check Authorization</h2><table border='1' cellpadding='10'>";
    foreach ($fields as $key => $value) {
        if ($key !== 'Signature') {
            $message .= "<tr><th>$key</th><td>$value</td></tr>";
        }
    }
    $message .= "</table>";
    if (isset($fields['Signature'])) {
        $message .= "<h3>Signature</h3>" . $fields['Signature'];
    }
    $message .= "</body></html>";

    $logFile = __DIR__ . '/application_log.txt';

    $mail = new PHPMailer(true);
    try {
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'nvscsiapply@gmail.com';
        $mail->Password = 'mffg fhgq jcvz gapu';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $mail->setFrom('nvscsiapply@gmail.com', 'NVS Background Check');
        $mail->addAddress('hr@nvscsi.com');
        $mail->isHTML(true);
        $mail->Subject = 'Background Check Form Submitted';
        $mail->Body = $message;

        if (isset($signatureFilePath)) {
            $mail->addEmbeddedImage($signatureFilePath, 'signature');
        }

        ob_start();
        $mail->send();
        $debug = ob_get_clean();

        file_put_contents($logFile, $debug, FILE_APPEND);
        echo 'Background check submitted successfully.';
    } catch (Exception $e) {
        echo "Mailer Error: {$mail->ErrorInfo}";
        file_put_contents($logFile, "Mailer Error: {$mail->ErrorInfo}\n", FILE_APPEND);
    }
} else {
    echo "Invalid request.";
}
?>