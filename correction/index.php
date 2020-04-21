<!DOCTYPE html>

<?php
    // Check if discipline, chapter and question get vars exist
    if (!( isset($_GET['m']) && isset($_GET['c']) && isset($_GET['q']) )) {
        http_response_code(400);
        exit('400 - Mauvaise requête');
    }

    // Fetch chapter & question
    $m_or_p = $_GET['m'];
    $chapter = glob('../'.$m_or_p.'/*', GLOB_ONLYDIR)[$_GET['c']];
    $question_src = $chapter.'/'.$_GET['q'].'.png';
?>

<html>

<head>
    <meta charset="utf-8">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <title>Révisions MP - Proposer une correction</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="lib/codemirror.js"></script>
    <link rel="stylesheet" href="lib/codemirror.css">
    <script src="mode/stex/stex.js"></script>

    <link rel="stylesheet" href="/styles.css">
    <script src="scripts.js"></script>
</head>

<body>
    <img class='correction_image' src="<?php echo $question_src ?>" alt="Question image">
</body>

</html>