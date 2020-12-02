<?php
if (file_exists('comments.csv')) {
    $comments_file_handler = fopen('comments.csv', 'a');
} else {
    $comments_file_handler = fopen('comments.csv', 'x');
}

fwrite(
    $comments_file_handler,
    $_POST['timestamp'] . "\t" . $_POST['name'] . "\t" . $_POST['email'] . "\t" . str_replace("\n", '\n', str_replace("\t", " ", $_POST['comment'])) . "\t" . $_POST['qid'] . "\n"
);

?>
