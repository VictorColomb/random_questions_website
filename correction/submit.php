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
    $discipline = $_POST['m'];
    $chapter = glob('../'.$discipline.'/*', GLOB_ONLYDIR)[$_POST['c']];
    $question = $_POST['q'];

    // Fetch tex code
    $bad_tex_file_path = $chapter.'/'.$question.'.bad.tex';
    $tex_file_path = $chapter.'/'.$question.'.tex';
    if (!file_exists($bad_tex_file_path)) {
        if (!file_exists($tex_file_path)) {
            http_response_code(400);
            exit('<h2>400- Mauvaise requête</h2><p>La question n\'existe pas ou alors on a merdé....</p>');
        }
        else{
            $tex_contents = file($tex_file_path);
            array_splice($tex_contents, 27);
            array_push($tex_contents, $tex_code.PHP_EOL, PHP_EOL, "\\end{document}".PHP_EOL);
        }
    }
    else{
        $tex_contents = file($bad_tex_file_path);
        array_splice($tex_contents, 27, 0, $tex_code.PHP_EOL);
    }

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
    $output_filename = $chapter.'/'.$question.'.tex';
    $bad_filename = $chapter.'/'.$question.'.bad.tex';
    if (file_exists($output_filename)) {unlink($output_filename);}
    if (file_exists($bad_filename)) {unlink($bad_filename);}

    // Write tex file
    file_put_contents($output_filename, $tex_contents);

    // Compile latex
    exec('pdflatex -interaction=nonstopmode -output-directory="'.$chapter.'" "'.$output_filename.'"', $compil_output, $compil_returncode);
    if ($compil_returncode == 0){
        exec('pdflatex -interaction=nonstopmode -output-directory="'.$chapter.'" "'.$output_filename.'"');
        $compil_success = true;
        $pdf_filename = $chapter.'/'.$question.'.pdf';
        $user_output = '<iframe id="iframe" src="'.$pdf_filename.'?'.filemtime($pdf_filename).'" frameborder="0">';
    }
    else{
        $compil_success = false;
        $user_output = '<p>La compilation a échoué... T\'es un peu nul mais c\'est pas grave.</p><br><div class="button" onclick="location.href=\'.?m='.$_POST['m'].'&c='.$_POST['c'].'&q='.$_POST['q'].'\'"><span>Réessayer</span></div><div class="button" onclick="window.open(\''.$chapter.'/'.$question.'.log\',\'_blank\')"><span>Ouvrir  le log</span></div>';
    }

    // Delete auxiliary files
    $latex_jobname = substr($output_filename, 0, -4);
    if (file_exists($latex_jobname.'.aux')) {
        unlink($latex_jobname.'.aux');
    }
    if ($compil_success && file_exists($latex_jobname.'.log')) {
        unlink($latex_jobname.'.log');
    }

    // Write log file
    $text_output = fopen('../'.$discipline.'/corrections.txt', 'a');
    fwrite($text_output, 'Chapter '.$_POST['c'].' - Question '.$question.'. Submitted on '.date('Y/m/d-g:i a'));
    if (!$empty_name) {
        fwrite($text_output, ' by '.$name);
    }
    if ($compil_success) { fwrite($text_output, ". Compilation succeeded :)".PHP_EOL); }
    else { fwrite($text_output, ". Compilation failed !!!".PHP_EOL); }
    fclose($text_output);
?>

<html>

<head>
    <meta charset="utf-8">
    <link rel="apple-touch-icon" sizes="180x180" href="/ressources/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/ressources/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/ressources/favicon-16x16.png">
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

        console.log('Tried to compile <?php echo $output_filename; ?>, return code <?php echo $compil_returncode; ?>')
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
    <h2>Votre correction a bien été enregistrée.</h2>
    <p>Merci de votre contribution !</p>
    <?php echo $user_output; ?>
</body>

</html>