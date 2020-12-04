<?php

$comments_file_handler = fopen('data/comments.csv', file_exists('data/comments.csv') ? 'a' : 'x');

fwrite(
    $comments_file_handler,
    $_POST['timestamp'] . "\t" . $_POST['name'] . "\t" . $_POST['email'] . "\t" . str_replace("\n", '\n', str_replace("\t", " ", $_POST['comment'])) . "\t" . $_POST['qid'] . "\t0\n"
);

fclose($comments_file_handler);

?>
