<?php
    if ( !isset($_POST['m']) || !isset($_POST['q']) || !isset($_POST['c']) || !isset($_POST['code']) ) {
        http_response_code(400);
        exit('<h3>400 - Mauvaise requête</h3>');
    }
    $empty_code = true;
    $tex_code = $_POST['code'];
    $l = strlen($tex_code);
    for ($i=0; $i<$l && $empty_code; $i++) {
        $temp = substr($tex_code, $i, 1);
        $empty_code = $temp == ' ' || $temp == '\n';
    }
    if ($empty_code) {
        http_response_code(400);
        exit('<h3>400 - Mauvaise requête</h3><p>La correction proposée est vide.</p>');
    }

    // Fetch chapter and question
    $m_or_p = $_POST['m'];
    $chapter = glob('../'.$m_or_p.'/*', GLOB_ONLYDIR)[$_POST['c']];
    $question = $_POST['q'];

    // Fetch tex code
    $tex_file_path = $chapter.'/'.$question.'.bad.tex';
    if (!file_exists($tex_file_path)) {
        http_response_code(400);
        exit('<h2>400- Mauvaise requête</h2><p>La question n\'existe pas ou est déjà corrigée.</p>');
    }
    $tex_contents = file($tex_file_path);
    array_splice($tex_contents, 27, 0, $tex_code.PHP_EOL);

    // Add credit if name set
    if ( isset($_POST['name']) ) {
        $name = $_POST['name'];
        $l = strlen($name);
        $empty_name = true;
        for ($i=0; $empty_name && $i < $l; $i++) {
            $empty_name = substr($name, $i, 1) == ' ';
        }
        if (!$empty_name) {
            $name_line_temp = $tex_contents[17];
            $name_line = $name_line_temp . '\\fancyfoot[R]{\\small{Correction proposée par '.$name.'}}';
            array_splice($tex_contents, 17, 1, $name_line);

            $name_or_not = 'Name';
        }
        else{
            $name_or_not = 'No name';
        }
    }

    // Fetch output tex filename
    $i = 0;
    while (file_exists($chapter.'/'.$question.'.bad'.$i.'.tex')) {$i += 1;}
    $output_filename = $chapter.'/'.$question.'.bad'.$i.'.tex';

    // Write tex file
    file_put_contents($output_filename, $tex_contents);

    // Write txt file
    $text_output = fopen('../'.$m_or_p.'/corrections.txt', 'a');
    fwrite($text_output, 'Chapter '.$_POST['c'].' - Question '.$question.'. Submitted on '.date('Y/m/d-g:i a'));
    if (!$empty_name) {
        fwrite($text_output, ' by '.$name);
    }
    fwrite($text_output, '. File name : '.$question.'.bad'.$i.'.tex'.PHP_EOL);
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
            gtag('event', 'Submitted correction', {'event_category':'Corrections', 'event_label':'<?php echo $name_or_not ?>'} );
        }
    </script>

    <style>
        body{
            background-color: #232F34;
        }
        h2,p{
            color: white;
            font-family: 'Work Sans', sans-serif;
            margin-left: 1rem;
        }
        h2{
            margin-top: 1rem;
        }

        #button div{
            width: fit-content;
            border-radius: 5px;
            margin-left: 1rem;

            color: white;
            text-align: center;

            background-color: #344954;

            box-shadow: 1.5px 1.5px 2.5px 3px var(--shadow-color);

            cursor: pointer;
            transition: all .2s ease-in-out;
        }
        #button span{
            padding: 5px 10px;
            display: inline-block;
            margin: auto 0;
        }
        #button div:hover{
            background-color: #293942;
            transform: scale(1.1)
        }
    </style>
</head>

<body onload="onSubmit();">
    <h2>Votre correction a bien été enregistrée.</h2>
    <p>Merci de votre contribution !<br>Nous allons relire votre correction puis l'ajouter.</p><br>
</body>

</html>