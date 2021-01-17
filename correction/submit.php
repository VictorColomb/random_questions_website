<?php
    const FILE_UPLOAD_SUCCESSFUL = '<h2>Votre correction a bien été enregistrée.</h2><p>Merci de votre contribution !</p>';
    const FILE_UPLOAD_UNSUCCESSFUL = '<h2>Le téléversement de votre correction n\'a pas fonctionné</h2><p>Veuillez réessayer ou nous contacter si l\'erreur se produit répétitivement.';

    const BAD_REQUEST = '<h2>400 - Mauvaise requête</h2>';
    const NO_QUESTION = '<h2>400- Mauvaise requête</h2><p>La question n\'existe pas.</p>';
    const WRONG_EXTENSION = '<h2>Wrong file extension</h2><p>Only .tex and .pdf extensions are allowed !</p>';
    const FILE_TOO_LARGE = '<h2>Uploaded file size is too big</h2><p>The maximum file size allowed is 5MB !</p>';
    const EMPTY_CORRECTION = '<h2>400 - Mauvaise requête</h2><p>La correction proposée est vide.</p>';


    // Check post variables
    if (!isset($_POST['q']) || !isset($_POST['code']) ) {
        http_response_code(400);
        exit(BAD_REQUEST);
    }

    $qid = $_POST['q'];


    // Check if the question exists
    $questions_file_handle = fopen('../data/questions.csv', 'r');
    $found_question = false;
    while (($data = fgetcsv($questions_file_handle, 0, "\t")) !== false) {
        if ($data[0] == $qid) {
            $found_question = true;
            break;
        }
    }
    fclose($questions_file_handle);
    if (!$found_question) {
        http_response_code(400);
        exit(NO_QUESTION);
    }


    // Find correction suggestion index
    $corrections_file_handler = fopen('../data/corrections.csv', 'r');
    $existing_corrections = [];
    while (($data = fgetcsv($corrections_file_handler, 0, "\t")) !== false) {
        if ($data[1] == $qid) {
            array_push($existing_corrections, $data[2]);
        }
    }
    $cid = $existing_corrections == [] ? 1 : max($existing_corrections) + 1;


    // Figure out output filename (incl extension)
    $input_file = $_FILES['file'];
    if ($file_uploaded = ($input_file != null && $input_file['size'] != 0)) {
        $ext = pathinfo($input_file['name'], PATHINFO_EXTENSION);
        if (!($ext == 'pdf' || $ext == 'tex')) {
            http_response_code(403);
            exit(WRONG_EXTENSION);
        }

        $file_upload_successful = move_uploaded_file(
            $input_file['tmp_name'],
            "../corrections/${qid}_$cid.$ext"
        );
    } else if ($input_file['error'] == 1) {
        http_response_code(400);
        exit(FILE_TOO_LARGE);
    } else if ($input_file['error'] != 1) {
        $file_uploaded = true;
        $file_upload_successful = false;
    } else {
        $tex_code = $_POST['code'];
        $l = strlen($tex_code);
        $empty_code = true;
        for ($i=0; $i<$l && $empty_code; $i++) {
            $temp = substr($tex_code, $i, 1);
            $empty_code = $temp == ' ' || $temp == "\n";
        }
        if ($empty_code) {
            http_response_code(400);
            exit(EMPTY_CORRECTION);
        }

        $ext = 'tex';
        file_put_contents(
            "../corrections/${qid}_$cid.tex",
            $_POST['code']
        );
    }


    // Register correction suggestion (if successful)
    if (!$file_uploaded || $file_upload_successful) {
        $date = new DateTime();
        $corrections_file_handler = fopen('../data/corrections.csv', file_exists('../data/corrections.csv') ? 'a' : 'x');
        fwrite(
            $corrections_file_handler,
            $date->getTimestamp() . "\t$qid\t$cid\t$ext\n"
        );
        fclose($corrections_file_handler);
    }


?>

<html>

<head>
    <meta charset="utf-8">
    <link rel="apple-touch-icon" sizes="180x180" href="../ressources/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="../ressources/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="../ressources/favicon-16x16.png">
    <link rel="manifest" href="../site.webmanifest">
    <title>Révisions MP - Proposer une correction - Question <?php echo $qid; ?></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-164106797-1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-164106797-1');
    </script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap">

    <script>
        function onSubmit() {
            gtag('event', 'Submitted correction', {'event_category':'Corrections'} );
        }
    </script>

    <style>
        body{
            background-color: #232F34;
        }
        h2,p{
            color: white;
            font-family: 'Work Sans', sans-serif;
            margin-left: 1em;
        }
        h2{
            margin-top: 1em;
        }

        .button{
            width: fit-content;
            border-radius: 5px;
            margin: 0 0 5pt 1em;

            color: white;
            text-align: center;

            background-color: #344954;

            box-shadow: 1.5px 1.5px 2.5px 3px var(--shadow-color);

            cursor: pointer;
            transition: all .2s ease-in-out;
        }
        .button span{
            padding: 5px 10px;
            display: inline-block;
            margin: auto 0;
            font-family: 'Work Sans', sans-serif;
        }
        .button:hover{
            background-color: #293942;
            transform: scale(1.1)
        }

        iframe{
            width: 100%;
            height: calc(100% - 76px - 3em);
        }
    </style>
</head>

<body onload="onSubmit();">
    <?php echo (!$file_uploaded || $file_upload_successful) ? FILE_UPLOAD_SUCCESSFUL : FILE_UPLOAD_UNSUCCESSFUL ?>
</body>

</html>
