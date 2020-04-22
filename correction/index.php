<!DOCTYPE html>

<?php
    // Check if discipline, chapter and question get vars exist
    if (!( isset($_GET['m']) && isset($_GET['c']) && isset($_GET['q']) )) {
        http_response_code(400);
        exit('<h2>400 - Mauvaise requête</h2><p>Argument(s) GET manquant(s)</p>');
    }

    // Fetch chapter & question
    $m_or_p = $_GET['m'];
    $chapter = glob('../'.$m_or_p.'/*', GLOB_ONLYDIR)[$_GET['c']];
    $question = $_GET['q'];
    $question_src = $chapter.'/'.$question.'.png';

    // Chapter name for display
    $chapter_name_temp = explode('/', $chapter);
    $chapter_name_temp_temp = end($chapter_name_temp);
    $chapter_name = substr($chapter_name_temp_temp, 2);
    unset($chapter_name_temp); unset($chapter_name_temp_temp);

    $tex_file_path = $chapter.'/'.$question.'.bad.tex';
    if (!file_exists($tex_file_path)) {
        http_response_code(400);
        exit('<h2>400- Mauvaise requête</h2><p>La question n\'existe pas ou est déjà corrigée.</p>');
    }
    $tex_file_contents = file($tex_file_path);
    // Code before
    $tex_file_contents_before = array_slice($tex_file_contents, 0, 26);
    $codeBefore = implode('<br>', $tex_file_contents_before);
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

    <script src="codemirror.js"></script>
    <link rel="stylesheet" href="codemirror.css">
    <script src="stex.js"></script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap">

    <link rel="stylesheet" href="/ressources/styles.css">
    <link rel="stylesheet" href="styles.css">
    <script src="scripts.js"></script>
</head>

<body onload="onLoad();">
    <div id="main">
        <h2>Proposer une correction de <?php echo $m_or_p ?></h2>
        <h3><?php echo $chapter_name?></h3>
        <h4>Question <?php echo ($_GET['q'] + 1)?></h4>
        <img id='correction_image' src="<?php echo $question_src ?>" alt="Question image">
        <div class="code non_interactive">
            <input type="checkbox" id="spoiler1" onchange="openedSpoiler(this);"/>
            <label for="spoiler1"><span>Afficher le début du code</span></label>
            <div id="code_before" class="spoiler">
                <p>
                    <?php echo $codeBefore ?>
                </p>
            </div>
        </div>

        <div id="code_div" class="code">
            <form action="submit.php" method='post'>
                <textarea name="code" id="code"></textarea>
                <input type="hidden" name="m" value="<?php echo $_GET['m'] ?>">
                <input type="hidden" name="c" value="<?php echo $_GET['c'] ?>">
                <input type="hidden" name="q" value="<?php echo $_GET['q'] ?>">
                <div id="submit_button_div">
                    <div class="input-field">
                        <input type="text" id="name" name="name" class="text" onfocus="has_text(this, 1);" onblur="has_text(this, 0)" length="32" maxlength="32">
                        <label for="name" class="text">Nom</label>
                    </div>
                    <input id="submit" type="submit" value="Envoyer">
                </div>
            </form>
        </div>
    </div>

    <div id="side_panel">
        <h3>Instructions</h3>
        <hr>
        <p>
            Les corrections sont compilées en LaTeX au format PDF. Il nous est donc bénéfique que les corrections soient écrites directement en LaTeX. Malgré cela, vous êtes libres de les écrire de toute autre façon, pourvu que ce soit lisible, afin que nous puissions le transcrire en LaTeX.<br>
            Pour les intéréssés, vous avez accès, dans le spoiler, au code LaTeX qui précédera et suivera votre code, notamment les packages qui sont inclus.<br>
            Nous encadrons les résultats en rouge. Vous pouvez faire cela avec la fonction <span style="font-family: monospace;">\fcolorbox{red}{white}{...}</span><br><br>
            Votre nom peut être inclus dans la correction, si vous le souhaitez.<br>
            Il suffit de remplir la case correspondante.<br><br>
            Nous nous réservons bien entendu le droit d'éliminer tout envoi non sérieux, que ce soit dans le nom ou dans la correction elle-même.
        </p>
    </div>
</body>

</html>