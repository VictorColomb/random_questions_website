<!DOCTYPE html>

<?php
    const LATEX_1 = "\\documentclass[a4paper]{article}\n\\usepackage[T1]{fontenc}\n\\usepackage[utf8]{inputenc}\n\\usepackage{lmodern}\n\\usepackage{amsmath,amssymb}\n\\usepackage[top=3cm,bottom=2cm,left=2cm,right=2cm]{geometry}\n\\usepackage{fancyhdr}\n\\usepackage{esvect}\n\\usepackage{xcolor}\n\\usepackage{tikz}\\usetikzlibrary{calc}\n\n\\parskip1em\\parindent0pt\n\n\\begin{document}\n\n\\pagestyle{fancy}\n\\fancyhf{}\n\\setlength{\\headheight}{15pt}\n\\fancyhead[L]{";
    // Chapter name
    const LATEX_2 = "}\\fancyhead[R]{Question ";
    // Question id
    const LATEX_3 = "}\n% \\fancyfoot[L]{Correction proposée par !== Votre nom ici ==!}\n\n% Énoncé\n\\begin{center}\n\t\\large{\\boldmath{\\textbf{";
    // Question
    const LATEX_4 = "}}\n\\end{center}\n\n% Correction (!=== type below ===!)\n\n\n\n\\end{document}\n";

    // Check question get variable
    if (!isset($_GET['q'])) {
        http_response_code(400);
        exit('<h2>400 - Mauvaise requête</h2><p>Argument(s) GET manquant(s)</p>');
    }

    $qid = $_GET['q'];

    // Fetch question data
    $questions_file_handle = fopen('../data/questions.csv', 'r');
    while (($data = fgetcsv($questions_file_handle, 0, "\t")) !== false) {
        if ($data[0] == $qid) {
            $discipline = $data[1];
            $chapterid = $data[2];
            $question_content = $data[3];
            $correction_available = $data[4];
            break;
        }
    }
    fclose($questions_file_handle);

    // Fetch chapter name
    $chapters_file_handle = fopen('../data/chapters.csv', 'r');
    $chapters = [];
    $nb_chapters = 0;
    while (($data = fgetcsv($chapters_file_handle, 0, "\t")) !== false) {
        if ($data[1] == $discipline && $data[0] == $chapterid) {
            $chapter = $data[2];
            break;
        }
    }
    fclose($chapters_file_handle);

    // Establish textarea prefill
    $tex_path = '../corrections/' . $qid . '.tex';
    if (!($correction_available && file_exists($tex_path) && ($textarea_prefill = file_get_contents($tex_path)))) {
        $textarea_prefill = LATEX_1 . $chapter . LATEX_2 . $qid . LATEX_3 . $question_content . LATEX_4;
    }
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
    <script src="/ressources/mathjaxloader.js"></script>
</head>

<body onload="onLoad();">
    <div id="main">
        <h2>Proposer une correction de <?php echo $discipline ?></h2>
        <h3><?php echo $chapter?></h3>
        <h4>Question <?php echo $qid; ?></h4>
        <p id="question"><?php echo $question_content; ?></p>

        <div id="code_div" class="code">
            <form enctype="multipart/form-data" action="submit.php" method='post'>
                <textarea name="code" id="code"><?php echo $textarea_prefill; ?></textarea>
                <input type="hidden" name="q" value="<?php echo $qid; ?>">
                <div id="submit_button_div">
                    <div class="input-field">
                        <input id="file" name="file" type="file" onchange="updatelabel();" />
                        <label for="file">Choisir un fichier</label>
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
            Les corrections sont compilées en LaTeX au format PDF. Vous disposez ci-contre d'un template que vous pouvez remplir, après <span>% Correction</span>. Cela permet d'avoir un style uniforme sur toutes les corrections.<br><br>
            Vous pouvez faire apparaître votre nom dans votre correction en enlevant le commentaire <span>%</span> en ligne 20 et remplaçant <span>!== Votre nom ici ==!</span> par votre nom.<br><br>
            Nous vous proposons également de nous fournir directement un ficher LaTeX ou un fichier PDF (5MB max). Le code LaTeX ci-contre ne sera alors pas pris en compte.<br><br>
            Nous relirons votre correction avant de la proposer à tout le monde. Nous nous réservons le droit de retirer toute correction non sérieuse, incomplète ou erronée.
        </p>
    </div>
</body>

</html>
