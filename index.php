<!DOCTYPE html>

<?php
    if (isset($_GET['m']) && $_GET['m'] == 'physique') {$maths = false; $discipline = 'physique';}
    else {$maths = true; $discipline = 'maths';}


    // SQL CONNECT
    $sql = new mysqli(
        'localhost',
        'phpuser',
        'RyIh3IdrKhNdzB4T',
        'random_questions'
    );
    if ($sql->connect_error || !$sql->set_charset('utf8')) {
        header('sqlerror.html', true, 500);
        exit();
    }


    // FETCH CHAPTERS, QUESTIONS AND CORRECTIONS
    // Chapters
    $sql_getchapters_query = 'SELECT chapter FROM chapters_mp WHERE discipline = "' . $discipline . '" ORDER BY id';
    $sql_getchapters_result =  $sql->query($sql_getchapters_query);
    while($chapter = $sql_getchapters_result->fetch_array(MYSQLI_NUM)) {
        $chapters[] = $chapter[0];
    };
    $sql_getchapters_result->free(); unset($sql_getchapters_query); unset($sql_getchapters_result);

    // Number of questions per chapter
    $sql_getnb_query = 'SELECT COUNT(id) FROM (SELECT id,chapter FROM questions_mp WHERE discipline = "' . $discipline . '") as temp GROUP BY chapter ORDER BY chapter';
    $sql_getnb_result =  $sql->query($sql_getnb_query);
    while ($nb_qu = $sql_getnb_result->fetch_array(MYSQLI_NUM)) {
        $questions_per_chapters[] = $nb_qu[0];
    }
    $sql_getnb_result->free(); unset($sql_getnb_query); unset($sql_getnb_result);

    // Questions
    $sql_getquestions_query = 'SELECT id,chapter,question FROM questions_mp WHERE discipline = "' . $discipline . '"';
    $sql_getquestions_result = $sql->query($sql_getquestions_query);
    while ($question = $sql_getquestions_result->fetch_array(MYSQLI_NUM)) {
        $questions[] = $question;
    }
    $sql_getquestions_result->free(); unset($sql_getquestions_query); unset($sql_getquestions_result);
    $questions_print = array_map(function ($elt) {$qu = str_replace('\\','\\\\',$elt[2]); return $elt[0].','.$elt[1].',"'.$qu.'"';}, $questions);

    // Corrections
    $sql_getcorrections_query = 'SELECT question,name,correction FROM corrections_mp WHERE discipline = "' . $discipline . '"';
    $sql_getcorrections_result = $sql->query($sql_getcorrections_query);
    $corrections = [];
    while ($correction = $sql_getcorrections_result->fetch_array(MYSQLI_NUM)) {
        $corrections[] = $correction;
    }
    $sql_getcorrections_result->free(); unset($sql_getcorrections_query); unset($sql_getcorrections_result);
    $corrections_print = array_map(function ($elt) {return $elt[1] . ',' . $elt[2];}, $corrections);
    $available_corrections_print = array_map(function ($elt) {return $elt[0];}, $corrections);
?>


<html lang="fr">

<head>
    <meta charset="utf-8">
    <link rel="apple-touch-icon" sizes="180x180" href="/ressources/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/ressources/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/ressources/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <title>Révisions MP</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Revisions</title>


    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-164106797-1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'UA-164106797-1');
    </script>


    <link rel="stylesheet" href="/ressources/styles.css">
    <link rel="stylesheet" href="/ressources/suggestion_styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap">


    <script>
        var discipline = <?php if ($maths) {echo '"maths"';} else {echo '"physique"';} ?>;

        var questions_per_chapters = [<?php echo implode(',', $questions_per_chapters) ?>];
        questions_per_chapter = questions_per_chapters.map(x=>parseInt(x));
        var chapters = ["<?php echo implode('","', $chapters) ?>"];
        var questions_content = [[ <?php echo implode('],[', $questions_print) ?> ]];
        var corrections = [[ <?php echo implode('],[', $corrections_print) ?> ]];
        var available_corrections = [ <?php echo implode(',', $available_corrections_print) ?> ];
    </script>
    <script src="/ressources/scripts.js"></script>
    <script src="/ressources/mathjaxloader.js"></script>
</head>

<body onload='on_load();' onkeydown="keyDown(event.keyCode);">
    <div id="head">
        <a href="/">
            <div id="head_img"><img src="ressources/icon.ico"></div>
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
                <span style="font-family: 'Work Sans', sans-serif;">Physique</span>
            </div>
        </a>
    </div>

    <div id="progress_bar">
        <p id="progress_number"></p>
        <div id="empty">
            <div id="progress"></div>
        </div>
        <p id="question_succeeded" style="opacity: 0;">Question réussie</p>
    </div>


    <div class='overlay' id='suggestion_overlay'>
        <div class='scrim' onclick='show_overlay("suggestion",0);'></div>
        <div class='dialog' id='suggestion_dialog'>
            <form target="_blank" action="submitsuggestion.php" method="post" onsubmit='gtag("event","Submit",{"event_category":"Suggestions"});show_overlay("suggestion", 0);'>
            <div class='header'>
                <span class='title'>Suggestions</span>
                <br>
                <p class='text'>Commentaire sur la question courante ou autre</p>
                <hr>
            </div>
            <div class='content'>
                <input type="hidden" name="back" value=".">
                <input type="hidden" name="maths_or_physics" value="<?php echo $discipline; ?>">
                <input id="question_nb" type="hidden" name="question_nb">
                <input id='date' type="hidden" name="date">

                <div class="input-field">
                    <input type="text" id="name" name='name' class='text' onfocus="has_text(this, 1);" onblur="has_text(this, 0)" maxlength="32"></input>
                    <label for="name" class="text">Nom</label>
                    <p class='word_count text'>32 caractères max</p>
                </div>

                <div class="input-field">
                    <input type="text" id="mail"  name='mail' class='text' onfocus="has_text(this, 1);" onblur="has_text(this, 0)" maxlength="32"></input>
                    <label for="mail" class="text">Mail (Optionnel)</label>
                    <p class='word_count text'>32 caractères max</p>
                </div>

                <div class="input-field">
                    <textarea id="comment" name="suggestion_text" class='text' oninput="auto_grow(this)" onfocus="has_text(this, 1);" onblur="has_text(this, 0)" maxlength="256"></textarea>
                    <label for="comment" class="text">Commentaire</label>
                    <p class='word_count text'>256 caractères max</p>
                </div>
            </div>
            <hr>
            <div id='navigation' class='footer'>
                <div class='button' onclick='show_overlay("suggestion", 0);'>Annuler</div>
                <input class='button' style='color:var(--secondary-color)' type="submit" id="submit_button" value='Envoyer'></input>
            </div>
            </form>
        </div>
    </div>

    <div class ='overlay' id="correction_overlay">
        <div class='scrim' onclick='show_overlay("correction",0);'></div>
        <div class='dialog' id='correction_dialog'>
        <span class="material-icons" id='leave_correction' onclick='show_overlay("correction",0);'>
            clear
        </span>
        <iframe id='correction_frame' allowtransparency="true" frameborder="0" src="">
        </iframe>
        </div>
    </div>

    <div class ='overlay' id="chapters_overlay">
    <div class='scrim' onclick='show_overlay("chapters",0);'></div>
        <div class='dialog' id='chapters_dialog'>
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
                    for ($i=0, $n=count($chapters); $i<$n; $i++){
                        echo("<div class='chapter_container'>
                            <label for='chap".$i."'>
                                <div class='switch'>
                                    <input type='checkbox' name='check_chapters' id='chap".$i."'>
                                    <span class='slider'></span>
                                </div>
                                <p class='chapter'>".$chapters[$i]."</p>
                            </label>
                            <div class='chapter_progression'>
                                <div class='empty'>
                                    <div class='progress' id='chapter_progress_bar".$i."'></div>
                                </div>
                                <p id='chapter_progression".$i."'></p>
                            </div>
                        </div>
                        <hr>");
                    }
                ?>
                </ul>
            </div>
            <hr>
            <div id='navigation' class='footer'>
                <div class='button' onclick='show_overlay("chapters", 0);'>Annuler</div>
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
        <div class='mini_fab tooltip' onclick='set_chapter_menu(); show_overlay("chapters", 1);'>
            <span class="material-icons">
                format_list_bulleted
            </span>
            <span class="tooltiptext">Choix des chapitres</span>
            <span class="help left">Sélection des chapitres</span>
        </div>
        <div class='mini_fab tooltip' onclick='show_overlay("suggestion", 1);'>
            <span class="material-icons">
                feedback
            </span>
            <span class="tooltiptext">Suggestions/commentaires</span>
            <span class="help left">Envoyer un commentaire</span>
        </div>
        <div class='mini_fab tooltip' onclick='reset();'>
            <span class="material-icons">
                refresh
            </span>
            <span class="tooltiptext">Réinitialiser la progression</span>
            <span class="help left">Réinitialiser la progression</span>
        </div>
        <div class='mini_fab tooltip' onclick="show_buttons();">
            <span class="material-icons" id='button_visibility'>
                visibility_off
            </span>
            <span id='button_visibility_tip' class="tooltiptext">Masquer les boutons</span>
            <span class="help left">Afficher/cacher les boutons</span>
        </div>
        <div class='mini_fab tooltip' onclick="showHelp();">
            <span class="material-icons">
                help
            </span>
            <span class="tooltiptext">Aide</span>
            <span class="help left">Afficher ce message d'aide</span>
        </div>
    </div>

    <div id="main">
        <div class='correction fake tooltip' onclick='view_correction()'>
            <a class='material-icons-outlined'>emoji_objects</a>
            <span id='correction_tooltip' class='tooltiptext'>Proposer une correction</span>
        </div>

        <div id="question_div">
            <div id='carousel'>
                <div class="carousel_cell" id='cell_0'><div class="container"><div class='question'><span id='question_0' class='question'></span></div><p id='question_chap_0'></p><div class='correction'><a class='material-icons-outlined' id='correction0'>emoji_objects</a></div></div></div>
                <div class="carousel_cell" id='cell_7'><div class="container"><div class='question'><span id='question_7' class='question'></span></div><p id='question_chap_7'></p><div class='correction'><a class='material-icons-outlined' id='correction7'>emoji_objects</a></div></div></div>
                <div class="carousel_cell" id='cell_6'><div class="container"><div class='question'><span id='question_6' class='question'></span></div><p id='question_chap_6'></p><div class='correction'><a class='material-icons-outlined' id='correction6'>emoji_objects</a></div></div></div>
                <div class="carousel_cell" id='cell_5'><div class="container"><div class='question'><span id='question_5' class='question'></span></div><p id='question_chap_5'></p><div class='correction'><a class='material-icons-outlined' id='correction5'>emoji_objects</a></div></div></div>
                <div class="carousel_cell" id='cell_4'><div class="container"><div class='question'><span id='question_4' class='question'></span></div><p id='question_chap_4'></p><div class='correction'><a class='material-icons-outlined' id='correction4'>emoji_objects</a></div></div></div>
                <div class="carousel_cell" id='cell_3'><div class="container"><div class='question'><span id='question_3' class='question'></span></div><p id='question_chap_3'></p><div class='correction'><a class='material-icons-outlined' id='correction3'>emoji_objects</a></div></div></div>
                <div class="carousel_cell" id='cell_2'><div class="container"><div class='question'><span id='question_2' class='question'></span></div><p id='question_chap_2'></p><div class='correction'><a class='material-icons-outlined' id='correction2'>emoji_objects</a></div></div></div>
                <div class="carousel_cell" id='cell_1'><div class="container"><div class='question'><span id='question_1' class='question'></span></div><p id='question_chap_1'></p><div class='correction'><a class='material-icons-outlined' id='correction1'>emoji_objects</a></div></div></div>
            </div>
        </div>
    </div>
    <div id="button_div">
        <a id='previous_button' class="custom_button hidable_buttons" style="position:absolute; left:30px; opacity:0;" onclick="nextQuestion(-1,false,'click');">
        <div style="text-align: left;">
            <span class="material-icons">
                navigate_before
            </span>
            <span class="custom_button_text" style="font-size: .95em; font-family: 'Work Sans', sans-serif;">Précédente</span>
        </div>
        </a>

        <a class="custom_button custom_button_right hidable_buttons" style="right: 30px;" onclick="questionSucceeded();">
        <div style="right: 30px;  color: #f9aa33; text-align: right; font-weight: bold;">
            <span class="custom_button_text" style="font-family: 'Work Sans', sans-serif; text-emphasis: bold;">Suivante</span>
            <span class="material-icons" id="custom_button_next">
                navigate_next
            </span>
        </div>
        <a class="custom_button custom_button_right hidable_buttons" onclick="questionFailed();">
        <div>
            <span class="material-icons">
                clear
            </span>
            <span class="custom_button_text" style="font-family: 'Work Sans', sans-serif; text-emphasis: bold;">Échouée</span>
        </div>
        </a>
    </div>

    <div id="help_overlay" onclick="showHelp();">
        <div>
            <span class="material-icons">navigate_next</span><span class="not-material-icons">Les questions réussies ne reviennent pas.</span><br><br>
            <span class="material-icons">clear</span><span class="not-material-icons">Les questions échouées résparaissent éventuellement.</span><br><br>
            <span class="material-icons">refresh</span><span class="not-material-icons">Réinitialiser la progression retire les questions des chapitres sélectionnés des questions réussies.</span><br><br>
            <span class="material-icons">swap_horiz</span><span class="not-material-icons">Balayez horizontalement pour passer à la question suivante/précédente. Balayez vers le haut pour marquer une question échouée.</span><br><br>
            <span class="material-icons">emoji_objects</span><span class="not-material-icons">Certaines questions viennent avec des corrigés.</span><br>
            <span class="material-icons-outlined">emoji_objects</span><span class="not-material-icons">Pour celles qui n'en n'ont pas, vous pouvez en proposer une.</span><br><br>
            <span class="material-icons no-tel">keyboard</span><span class="not-material-icons no-tel">Appuyez sur les touches Entrée, Espace ou &rarr; pour passer à la question suivante. Appuyez sur &uarr; pour marquer une question échouée. Appuyez sur &larr; pour revenir à la question précédente.</span><br><br>
            <span class="material-icons">error</span><span class="not-material-icons">Les navigateurs Edge, Internet Explorer, Duck Duck Go et Écosia ne sont pas supportés (pour l'instant).</span>
        </div>
    </div>

</body>
</html>