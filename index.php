<!DOCTYPE html>

<?php
    if (isset($_GET['m']) && $_GET['m'] == 'physique') {$maths = false; $m_or_p = 'physique';}
    else {$maths = true; $m_or_p = 'maths';}
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
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap">

    <script>
        var m_or_p = <?php if ($maths) {echo '"maths"';} else {echo '"physique"';} ?>;
    </script>

    <!--Script-->
    <script src="scripts.js"></script>
</head>

<body onload='on_load();' onkeydown="keyDown(event.keyCode);">
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
                <span style="font-family: 'Work Sans', sans-serif;">Maths</span>
            </div>
        </a>

        <a class="menu" href="?m=physique">
            <div style="text-align: center;<?php if (!$maths) echo ' color: #f9aa33;' ?>">
                <span class="material-icons">
                    flash_on
                </span>
                <span style="font-family: 'Work Sans', sans-serif;">Physics</span>
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
        <p id="progress_number" style="font-family: 'Work Sans', sans-serif;"></p>
        <div id="empty">
            <div id="progress"></div>
        </div>
    </div>

    <div id="chapters_overlay">
    <div id='scrim'></div>
    <div id='dialog'>
        <div class='header'>
            <span class='title'>Chapitres</span>
            <br>
            <div class='button' onclick='select_all(1);'>Tout sélectionner</div>
            <div class='button' style="margin-right:0;"onclick='select_all(0);'>Tout désélectionner</div>
            <hr>
        </div>
        <div id='chapter_container' class='content'>
        <ul>
        <?php
        $chapters = glob($m_or_p.'/*' , GLOB_ONLYDIR);

        // counts the amount of chapters
        $number_of_chapters = count($chapters);

        // Counts the amount of questions per chapter
        function count_questions($my_chapter){
            return count(glob($my_chapter.'/*'));
        }
        $questions_per_chapters = [];

        // Enumerates over every available chapter
        for ($i=0, $n=count($chapters); $i<$n; $i++){
            $chapter=$chapters[$i];
            $questions_per_chapters[] = count_questions($chapter);
            $chapter_name_temp = explode('/', $chapter);
            $chapter_name=end($chapter_name_temp);
            //The amount of questions in said chapter
            $count = count(glob($chapter.'/*'));

            //adds the html
            echo("<div class='chapter_container'>
                <label for='chap".$i."' style='display: inline-block;'>
                    <div class='switch'>
                        <input type='checkbox' name='check_chapters' id='chap".$i."'>
                        <span class='slider'></span>
                    </div>
                    <p class='chapter' for='chap".$i."'>".$chapter_name."</p>
                </label>
            </div>");
        }
        unset($n);
        unset($i);
        unset($chapter);
        unset($chapter_name);
        unset($chapter_name_temp);
        ?>
        <script>
            var questions_per_chapters = [<?php echo implode(',', $questions_per_chapters) ?>];
            questions_per_chapter = questions_per_chapters.map(x=>parseInt(x));
            var chapters = ["<?php echo implode('","', $chapters) ?>"];
        </script>
        </ul></div>
        <hr>
        <div id='navigation' class='footer'>
            <div class='button' onclick='show_overlay(0);'>Annuler</div>
            <div class='button' style='color:var(--secondary-color)' onclick='confirm_choice();'>Activer</div>
        </div>
    </div>

    </div>

    <input type='checkbox' id='fab_input'>
    <label for='fab_input' onclick='show_menus();'>
        <div id='fab'>
            <span class="material-icons"></span>
        </div>
    </label>
    <div id='fab_menu' class='shrink'>
        <div class='mini_fab' onclick='set_chapter_menu(); show_overlay(1);'>
            <span class="material-icons">
                format_list_bulleted
            </span>
        </div>
        <div class='mini_fab'>
            <span class="material-icons">
                feedback
            </span>
        </div>
        <div class='mini_fab' onclick='reset();'>
            <span class="material-icons">
                refresh
            </span>
        </div>
        <div class='mini_fab' onclick='show_buttons()'>
            <span class="material-icons" id='button_visibility'>
                visibility_off
            </span>
        </div>
        <div class='mini_fab'>
            <span class="material-icons">
                help
            </span>
        </div>
    </div>

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

            <a class="custom_button hidable_buttons" style="position:absolute; left: 5%;" onclick="nextQuestion(-1);">
            <div style="text-align: left;">
                <span class="material-icons">
                    navigate_before
                </span>
                <span style="font-family: 'Work Sans', sans-serif;">Previous</span>
            </div>
            </a>

            <a class="custom_button hidable_buttons" style="right: 5%;" onclick="questionSucceeded();">
            <div style="position:absolute; right: 5%;  color: #f9aa33; text-align: right; font-weight: bold;">
                <span style="font-family: 'Work Sans', sans-serif; text-emphasis: bold;">Next</span>
                <span class="material-icons" style="padding-left: 15px;">
                    navigate_next
                </span>
            </div>
            </a>
        </div>

    </div>
</body>
</html>