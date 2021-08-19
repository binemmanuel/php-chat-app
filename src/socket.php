<?php

use PHPSocketIO\SocketIO;
use Workerman\Worker;

date_default_timezone_set('Africa/Lagos');

require './vendor/autoload.php';

$io = new SocketIO(8080);

$io->on('connection', function ($socket) use ($io) {
    $socket->on('chat-message', function ($message) use ($socket) {
        $socket->broadcast->emit('chat-message', [
            'message' => htmlspecialchars(trim($message)),
            'time' => date('h:ia')
        ]);
    });

    $socket->on('typing', function () use ($socket) {
        $socket->broadcast->emit('typing');
    });
});

Worker::runAll();
