<!DOCTYPE html>

<?php
    if (isset($_GET['m']) && $_GET['m'] == 'physique') {$discipline = 'physique';}
    elseif (isset($_GET['m']) && $_GET['m'] == 'SI') {$discipline = 'SI';}
    else {$discipline = 'maths';}


    $chapters_file_handle = fopen('data/chapters.csv', 'r');
    $chapters = [];
    $nb_chapters = 0;
    while (($data = fgetcsv($chapters_file_handle, 0, "\t")) !== false) {
        if ($data[1] == $discipline) {
            array_push($chapters, $data[2]);
            $nb_chapters += 1;
        }
    }
    fclose($chapters_file_handle);

    $questions_file_handle = fopen('data/questions.csv', 'r');
    $questions = [];
    $available_corrections = [];
    $questions_per_chapter = array_fill(0, $nb_chapters, 0);
    while (($data = fgetcsv($questions_file_handle, 0, "\t")) !== false) {
        if ($data[1] == $discipline) {
            $questions_per_chapter[$data[2]] += 1;
            if ($data[4]) {
                array_push($available_corrections, $data[0]);
            }

            $qu = str_replace('\\', '\\\\', $data[3]);
            array_push($questions, $data[0] . ',' . $data[2] . ',"' . $qu . '"');
        }
    }
    fclose($questions_file_handle);
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


    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-164106797-1"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag("js", new Date());
    gtag("config", "UA-164106797-1");
    </script>


    <link rel="stylesheet" href="/ressources/styles.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans&display=swap">


    <script>
        const discipline = <?php echo '"'.$discipline.'"' ?>;
        const questions_per_chapter = [<?php echo implode(',', $questions_per_chapter) ?>];
        // questions_per_chapter = questions_per_chapter.map(x=>parseInt(x));
        const chapters = ["<?php echo implode('","', $chapters) ?>"];
        const questions_content = [[<?php echo implode('],[', $questions) ?>]];
        const available_corrections = [<?php echo implode(',', $available_corrections) ?>];
    </script>
    <script src="/ressources/scripts.js"></script>
    <script src="/ressources/mathjaxloader.js"></script>
</head>

<body onload="on_load();" onkeydown="keyDown(event.keyCode);">
    <div id="head">
        <a href="/">
            <div id="head_img"><img src="ressources/icon.ico"></div>
        </a>

        <a class="menu" href="?m=maths">
            <div style="text-align: center;<?php if ($discipline == "maths") {echo " color: #f9aa33;";} ?>">
                <span class="material-icons">
                    functions
                </span>
                <span style="font-family: 'Work Sans', sans-serif;">Maths</span>
            </div>
        </a>

        <a class="menu" href="?m=physique">
            <div style="text-align: center;<?php if ($discipline == "physique") {echo " color: #f9aa33;";} ?>">
                <span class="material-icons">
                    flash_on
                </span>
                <span style="font-family: 'Work Sans', sans-serif;">Physique</span>
            </div>
        </a>

        <a class="menu" href="?m=SI">
            <div style="text-align: center;<?php if ($discipline == "SI") {echo " color: #f9aa33;";} ?>">
                <span class="material-icons">
                    miscellaneous_services
                </span>
                <span style="font-family: 'Work Sans', sans-serif;">SI</span>
            </div>
        </a>

        <a class="menu github" href="https://github.com/prepaStan-revisions/random_questions_website" target="_blank">
            <svg class="github_logo" viewBox="0 0 16 16" version="1.1" aria-hidden="true"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"/></svg>
        </a>
    </div>

    <div id="progress_bar">
        <p id="progress_number"></p>
        <div id="empty">
            <div id="progress"></div>
        </div>
        <p id="question_succeeded" style="opacity: 0;">Question réussie</p>
    </div>


    <div class="overlay" id="suggestion_overlay">
        <div class="scrim" onclick="show_overlay('suggestion',0);"></div>
        <div class="dialog" id="suggestion_dialog">
            <form target="_blank" action="submitsuggestion.php" method="post" onsubmit='gtag("event","Submit",{"event_category":"Suggestions"});show_overlay("suggestion", 0);'>
            <div class="header">
                <span class="title">Suggestions</span>
                <br>
                <p class="text">Commentaire sur la question courante ou autre</p>
                <hr>
            </div>
            <div class="content">
                <div class="input-field">
                    <input type="text" id="name" name="name" class="text" onfocus="has_text(this, 1);" onblur="has_text(this, 0)" maxlength="32"></input>
                    <label for="name" class="text">Nom</label>
                    <p class="word_count text">32 caractères max</p>
                </div>

                <div class="input-field">
                    <input type="text" id="mail"  name='mail' class='text' onfocus="has_text(this, 1);" onblur="has_text(this, 0)" maxlength="32"></input>
                    <label for="mail" class="text">Mail (Optionnel)</label>
                    <p class="word_count text">32 caractères max</p>
                </div>

                <div class="input-field">
                    <textarea id="comment" name="suggestion_text" class='text' oninput="auto_grow(this)" onfocus="has_text(this, 1);" onblur="has_text(this, 0)" maxlength="256"></textarea>
                    <label for="comment" class="text">Commentaire</label>
                    <p class="word_count text">256 caractères max</p>
                </div>
            </div>
            <hr>
            <div id="navigation" class="footer">
                <div class="button" onclick="show_overlay('suggestion', 0);">Annuler</div>
                <div class="button" style="color:var(--secondary-color)" onclick="send_comment();">Envoyer</div>
            </div>
            </form>
        </div>
    </div>

    <div class ="overlay" id="correction_overlay">
        <div class="scrim" onclick='show_overlay("correction",0);'></div>
        <div class="dialog" id="correction_dialog">
        <span class="correction_overlay_buttons material-icons" id="leave_correction" onclick="show_overlay('correction',0);">
            clear
        </span>
        <span class="correction_overlay_buttons material-icons-outlined" id="new_correction" onclick="view_correction(0)">
            emoji_objects
        </span>
        <iframe id="correction_frame" allowtransparency="true" frameborder="0" src="">
        </iframe>
        </div>
    </div>

    <div class ="overlay" id="chapters_overlay">
    <div class="scrim" onclick="show_overlay('chapters',0);"></div>
        <div class="dialog" id="chapters_dialog">
            <div class="header">
                <span class="title">Chapitres</span>
                <br>
                <div class="button" onclick="select_all(1);">Tout sélectionner</div>
                <div class="button" style="margin-right:0;"onclick="select_all(0);">Tout désélectionner</div>
                <hr>
            </div>
            <div id="chapter_container" class="content">
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
            <div id="navigation" class="footer">
                <div class="button" onclick="show_overlay('chapters', 0);">Annuler</div>
                <div class="button" style="color:var(--secondary-color)" onclick="confirm_choice();">Activer</div>
            </div>
        </div>
    </div>

    <input type="checkbox" id="fab_input">
    <label for="fab_input" onclick="show_menus();">
        <div id="fab">
            <span class="material-icons"></span>
        </div>
    </label>
    <div id="fab_menu" class="shrink">
        <div class="mini_fab tooltip" onclick="set_chapter_menu(); show_overlay('chapters', 1);">
            <span class="material-icons">
                format_list_bulleted
            </span>
            <span class="tooltiptext">Choix des chapitres</span>
            <span class="help left">Sélection des chapitres</span>
        </div>
        <div class="mini_fab tooltip" onclick="show_overlay('suggestion', 1);">
            <span class="material-icons">
                feedback
            </span>
            <span class="tooltiptext">Suggestions/commentaires</span>
            <span class="help left">Envoyer un commentaire</span>
        </div>
        <div class="mini_fab tooltip" onclick="reset();">
            <span class="material-icons">
                refresh
            </span>
            <span class="tooltiptext">Réinitialiser la progression</span>
            <span class="help left">Réinitialiser la progression</span>
        </div>
        <div class="mini_fab tooltip" onclick="show_buttons();">
            <span class="material-icons" id="button_visibility">
                visibility_off
            </span>
            <span id="button_visibility_tip" class="tooltiptext">Masquer les boutons</span>
            <span class="help left">Afficher/cacher les boutons</span>
        </div>
        <div class="mini_fab tooltip" onclick="showHelp();">
            <span class="material-icons">
                help
            </span>
            <span class="tooltiptext">Aide</span>
            <span class="help left">Afficher ce message d'aide</span>
        </div>
    </div>

    <div id="main">
        <div class="correction fake tooltip" onclick="view_correction()">
            <a class="material-icons-outlined">emoji_objects</a>
            <span id="correction_tooltip" class="tooltiptext">Proposer une correction</span>
        </div>

        <div id="question_div">
            <div id="carousel">
                <div class="carousel_cell" id="cell_0"><div class="container"><div class="question"><span id="question_0" class="question"></span></div><p id="question_chap_0"></p><div class="correction"><a class="material-icons-outlined" id="correction0">emoji_objects</a></div></div></div>
                <div class="carousel_cell" id="cell_7"><div class="container"><div class="question"><span id="question_7" class="question"></span></div><p id="question_chap_7"></p><div class="correction"><a class="material-icons-outlined" id="correction7">emoji_objects</a></div></div></div>
                <div class="carousel_cell" id="cell_6"><div class="container"><div class="question"><span id="question_6" class="question"></span></div><p id="question_chap_6"></p><div class="correction"><a class="material-icons-outlined" id="correction6">emoji_objects</a></div></div></div>
                <div class="carousel_cell" id="cell_5"><div class="container"><div class="question"><span id="question_5" class="question"></span></div><p id="question_chap_5"></p><div class="correction"><a class="material-icons-outlined" id="correction5">emoji_objects</a></div></div></div>
                <div class="carousel_cell" id="cell_4"><div class="container"><div class="question"><span id="question_4" class="question"></span></div><p id="question_chap_4"></p><div class="correction"><a class="material-icons-outlined" id="correction4">emoji_objects</a></div></div></div>
                <div class="carousel_cell" id="cell_3"><div class="container"><div class="question"><span id="question_3" class="question"></span></div><p id="question_chap_3"></p><div class="correction"><a class="material-icons-outlined" id="correction3">emoji_objects</a></div></div></div>
                <div class="carousel_cell" id="cell_2"><div class="container"><div class="question"><span id="question_2" class="question"></span></div><p id="question_chap_2"></p><div class="correction"><a class="material-icons-outlined" id="correction2">emoji_objects</a></div></div></div>
                <div class="carousel_cell" id="cell_1"><div class="container"><div class="question"><span id="question_1" class="question"></span></div><p id="question_chap_1"></p><div class="correction"><a class="material-icons-outlined" id="correction1">emoji_objects</a></div></div></div>
            </div>
        </div>
    </div>
    <div id="button_div">
        <a id="previous_button" class="custom_button hidable_buttons" style="position:absolute; left:30px; opacity:0;" onclick="nextQuestion(-1,false,'click');">
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
        <div id="help_overlay_inside">
            <span class="material-icons">navigate_next</span><span class="not-material-icons">Les questions réussies ne reviennent pas.</span><br><br>
            <span class="material-icons">clear</span><span class="not-material-icons">Les questions échouées résparaissent éventuellement.</span><br><br>
            <span class="material-icons">refresh</span><span class="not-material-icons">Réinitialiser la progression retire les questions des chapitres sélectionnés des questions réussies.</span><br><br>
            <span class="material-icons">swap_horiz</span><span class="not-material-icons">Balayez horizontalement pour passer à la question suivante/précédente. Balayez vers le haut pour marquer une question échouée.</span><br><br>
            <span class="material-icons">emoji_objects</span><span class="not-material-icons">Certaines questions viennent avec des corrigés. Appuyez sur C pour ouvrir la correction plus rapidement.</span><br>
            <span class="material-icons-outlined">emoji_objects</span><span class="not-material-icons">Pour celles qui n'en n'ont pas, vous pouvez en proposer une.</span><br><br>
            <span class="material-icons no-tel">keyboard</span><span class="not-material-icons no-tel">Appuyez sur les touches Entrée, Espace ou &rarr; pour passer à la question suivante. Appuyez sur &uarr; pour marquer une question échouée. Appuyez sur &larr; pour revenir à la question précédente.</span><br><br>
            <span class="material-icons">error</span><span class="not-material-icons">Les navigateurs Internet Explorer, Duck Duck Go et Écosia ne sont pas supportés (pour l'instant).</span><br><br>
            <div><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" target="_blank"><img src="https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by-nc-sa.eu.svg" alt="CC BY-NC-DA 4.0" /></a></div><span class="not-material-icons">Les questions et corrections sont soumises à la licence Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</span>
        </div>
    </div>

    <canvas id="canvasFireworks">Canvas is not supported in your browser.</canvas>

</body>
</html>
