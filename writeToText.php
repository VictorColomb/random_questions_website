<?php
if (trim($_POST['name']) == "" || trim($_POST['suggestion_text']) == "") {
    header("Location: " . $_POST['back'] . "?incorrect=1");
    exit();
}


if (!is_dir('suggestions')) {
    mkdir('suggestions');
}
if (file_exists("suggestions/" . $_POST['maths_or_physics'] . ".txt")) {
    $fp = fopen('suggestions/' . $_POST['maths_or_physics'] . '.txt', 'a');
}
else {
    $fp = fopen('suggestions/' . $_POST['maths_or_physics'] . '.txt', 'x');
}
if ($_POST['suggestion_or_comment'] == "suggestion"){
    fwrite($fp, "Suggestion (" . $_POST['name'] . ") : " . $_POST['suggestion_text'] . "\n");
}
elseif ($_POST['suggestion_or_comment'] == "comment") {
    fwrite($fp, "Question " . $_POST["question_nb"] . " (" . $_POST['name'] . ") : " . $_POST['suggestion_text'] . "\n");
}
fclose($fp);


// Redirecting back to 
if (isset($_POST['back'])) {
    header("Location: " . $_POST['back']);
}
?>