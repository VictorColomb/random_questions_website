<!DOCTYPE html>

<?php
if (!is_dir('suggestions')) {
    mkdir('suggestions');
}
if (file_exists("suggestions/" . $_POST['maths_or_physics'] . ".txt")) {
    $fp = fopen('suggestions/' . $_POST['maths_or_physics'] . '.txt', 'a');
}
else {
    $fp = fopen('suggestions/' . $_POST['maths_or_physics'] . '.txt', 'x');
}
fwrite($fp, "Sent on ".$_POST["date"]."UTC; Question " . $_POST["question_nb"] . " (" . $_POST['name'] .' | '. $_POST['mail'].") : " . $_POST['suggestion_text'] . "\n");
fclose($fp);
?>

<html lang="en">
    <script type='text/javascript'>
        self.close();
    </script>
</html>