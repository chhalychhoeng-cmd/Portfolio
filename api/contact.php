<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function reply(int $status, string $message): never
{
    http_response_code($status);
    echo json_encode(['ok' => $status < 400, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    reply(405, 'Method not allowed.');
}

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    reply(500, 'Database configuration is not set up yet.');
}

$config = require $configFile;
$name = trim((string) ($_POST['name'] ?? ''));
$email = trim((string) ($_POST['email'] ?? ''));
$subject = trim((string) ($_POST['subject'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

if ($name === '' || $subject === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    reply(422, 'Please complete every field with a valid email address.');
}

if (mb_strlen($name) > 100 || mb_strlen($email) > 190 || mb_strlen($subject) > 200 || mb_strlen($message) > 5000) {
    reply(422, 'One or more fields are too long.');
}

try {
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
        $config['host'],
        $config['port'],
        $config['database']
    );
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $statement = $pdo->prepare(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (:name, :email, :subject, :message)'
    );
    $statement->execute(compact('name', 'email', 'subject', 'message'));
} catch (PDOException $exception) {
    error_log('Portfolio contact database error: ' . $exception->getMessage());
    reply(500, 'Unable to save your message right now. Please try again later.');
}

reply(201, 'Thanks — your message has been sent successfully.');
