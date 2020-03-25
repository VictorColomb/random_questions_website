<!DOCTYPE html>
<?php
    if (isset($_GET['m']) && $_GET['m'] == 'physique') {$maths = false; $m_or_p = 'physique';}
    else {$maths = true; $m_or_p = 'maths';}

    $files = glob(getcwd() . "/" . $m_or_p . "/*.png");
    if ($files) {
        $nb_questions = count($files);
    }
    else {
        if ($maths) {
            exit("No questions.<br>Maybe we're in maintenance or we just fucked up...<br>Try <a href='?m=physique'>physique</a>.");
        }
        else {
            exit("No questions.<br>Maybe we're in maintenance or we just fucked up...<br>Try <a href='?m=maths'>maths</a>.");
        }
    }
?>


<html lang="en">
<!--MINE-->
<head>
<meta charset="utf-8">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <title>Révisions MP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Title and logo -->
    <title>Revisions</title>

    <!-- External links -->
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined">
    <script>
        var nb_of_questions = <?php echo $nb_questions ?>;
        var m_or_p = <?php if ($maths) {echo '"maths"';} else {echo '"physique"';} ?>;
    </script>

    <!--Script-->
    <script src="scripts.js"></script>
</head>

<body onload='init();' onkeydown="keyDown(event.keyCode);">
    <div id="head">
        <a href="/">
            <div id="head_img">
                <img src="icon.ico">
            </div>
        </a>

        <a class="menu" href="?m=maths">
            <div style="text-align: center;<?php if ($maths) echo ' color: #f9aa33;' ?>">
                <span class="material-icons">
                    functions
                </span>
                <span style="font-family: 'Roboto', sans-serif;">Maths</span>
            </div>
        </a>

        <a class="menu" href="?m=physique">
            <div style="text-align: center;<?php if (!$maths) echo ' color: #f9aa33;' ?>">
                <span class="material-icons">
                    flash_on
                </span>
                <span style="font-family: 'Roboto', sans-serif;">Physique</span>
            </div>
        </a>

        <a class="menu" id="suggestions" onclick="suggestionOverlay();">
            <div style="text-align: center;">
                <span class="material-icons-outlined">
                    feedback
                </span>
                <span style="font-family: 'Roboto', sans-serif;">Suggestion / commentaire</span>
            </div>
        </a>
    </div>

    <div id="suggestion_overlay" style="visibility:hidden;">
        <form action="writeToText.php" method="post">
        <input type="text" name="suggestion_text" id="sugg_input" placeholder="Suggestion / commentaire" onkeyup="enableSubmit();"><br>
        <input type="text" name="name" id="name_input" placeholder="Nom" onkeyup="enableSubmit();"><br>
        <input type="hidden" name="back" value=".">
        <input type="hidden" name="maths_or_physics" value="<?php echo $m_or_p; ?>">
        <input id="question_nb" type="hidden" name="question_nb">
        <input type="radio" name="suggestion_or_comment" id="suggestion_or_comment_comment" value="comment" onclick="enableSubmit();">
        <label for="suggestion_or_comment_comment">Commentaire à  de propos la question courante</label><br>
        <input type="radio" name="suggestion_or_comment" id="suggestion_or_comment_suggestion" value="suggestion" onclick="enableSubmit();">
        <label for="suggestion_or_comment_suggestion">Suggestion de question</label><br>
        <input type="submit" id="submit_button" value="Envoyer" disabled="disabled">
    </form>
    </div>

    <div id="progress_bar">
        <p id="progress_number" style="font-family: 'Roboto', sans-serif;"></p>
        <div id="empty">
            <div id="progress"></div>
        </div>
        <p id="reset_message" style="font-family: 'Roboto', sans-serif;">De nouvelles questions ont été ajoutées, la progression a été réinitialisée.</p>
    </div>

    <a id="reset">
        <div onclick="reset();">
            <p class="material-icons">refresh</p>
            <p style="font-family: 'Roboto', sans-serif;">Réinitialiser la progression</p>
        </div>
    </a>

    <div id="main">

        <div id="question_div">
            <div id='carousel'>
                <div class="carousel_cell"><div class="container"><img id='question_0' width='80%' alt="Question Image"></div></div>
                <div class="carousel_cell"><div class="container"><img id='question_7' width='80%' alt="Question Image"></div></div>
                <div class="carousel_cell"><div class="container"><img id='question_6' width='80%' alt="Question Image"></div></div>
                <div class="carousel_cell"><div class="container"><img id='question_5' width='80%' alt="Question Image"></div></div>
                <div class="carousel_cell"><div class="container"><img id='question_4' width='80%' alt="Question Image"></div></div>
                <div class="carousel_cell"><div class="container"><img id='question_3' width='80%' alt="Question Image"></div></div>
                <div class="carousel_cell"><div class="container"><img id='question_2' width='80%' alt="Question Image"></div></div>
                <div class="carousel_cell"><div class="container"><img id='question_1' width='80%' alt="Question Image"></div></div>
            </div>
        </div>

        <div id="button_div">

            <a class="custom_button" style="position:absolute; left: 5%;" onclick="nextQuestionPressed(-1);">
            <div style="text-align: left;">
                <span class="material-icons">
                    navigate_before
                </span>
                <span style="font-family: 'Roboto', sans-serif;">Précédente</span>
            </div>
            </a>

            <a class="custom_button" style="right: 5%;" onclick="nextQuestionPressed(1);">
            <div style="position:absolute; right: 5%;  color: #f9aa33; text-align: right; font-weight: bold;">
                <span style="font-family: 'Roboto', sans-serif; text-emphasis: bold;">Suivante</span>
                <span class="material-icons" style="padding-left: 15px;">
                    navigate_next
                </span>
            </div>
            </a>
        </div>

    </div>
</body>
</html>