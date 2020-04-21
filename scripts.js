var my_position = 0;
var questions = [];
var flips = 1;
var sensitivity = 1;
var number_of_chapters = 0;
var nb_of_questions = 0;
var real_nb_of_questions = 0;
var real_nb_questions_succeeded = 0;
var buttons_visible = 1;
var keys_active = true;
var selected_chapters = [];
var angle = 0;


// COOKIE STUFF

//sets a cookie value given a cookie name
function setCookie(name, value) {
    var now = new Date();
    var time = now.getTime();
    var expireTime = time + 31536000000;
    now.setTime(expireTime);
    document.cookie = name + "=" + (value || "") + ';expires=' + now.toGMTString() + ';';
}

//gets a cookie value given a cookie name
function getCookieValue(name) {
    var b = document.cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
    return b ? b.pop() : '';
}


// SELECTED CHAPTERS
function fetch_selected_chapters() {
    var selected_chapters_temp = localStorage.getItem('selected_chapters_'+m_or_p);
    if (selected_chapters_temp == null) {
        chapters.forEach(() => {
            selected_chapters.push(1);
        })
    }
    else {
        selected_chapters_temp = selected_chapters_temp.split(',');
        selected_chapters_temp.forEach(selected_chapters_temp_i => {
            selected_chapters.push(parseInt(selected_chapters_temp_i));
        })
    }
}

// PROGRESSION
progression_temp = localStorage.getItem('progression_'+m_or_p);
if (progression_temp == null) {
    var progression = [];
}
else {
    progression_temp = progression_temp.split(';');
    var progression = [];
    progression_temp.forEach(progression_temp_i => {
        if (progression_temp_i == "") {
            // no progression in chapter
            progression.push([]);
        }
        else {
            progression_questions = progression_temp_i.split(',');
            progression_chapter_questions = []
            progression_questions.forEach(progression_question => {
                progression_chapter_questions.push(parseInt(progression_question));
            })
            progression.push(progression_chapter_questions);
            delete progression_chapter_questions;
            delete progression_questions;
        }
    })
}
delete progression_temp;


//SELECT CHAPTER
function select_all(bol){
    document.getElementsByName('check_chapters').forEach(checkbox => {
        checkbox.checked = bol;
    })
}

function show_buttons() {
    if (document.getElementById('help_overlay').style.display == "") {
        if(buttons_visible){
            document.getElementById('button_visibility').innerHTML = 'visibility';
            document.getElementById('button_visibility_tip').innerHTML='Afficher les boutons';
            Array.from(document.getElementsByClassName('hidable_buttons')).forEach(button =>{
                button.style.display = 'none';});
            buttons_visible = 0;
            setCookie('buttons_visible', '1');
        }
        else{
            document.getElementById('button_visibility').innerHTML = 'visibility_off';
            document.getElementById('button_visibility_tip').innerHTML='Masquer les boutons';
            Array.from(document.getElementsByClassName('hidable_buttons')).forEach(button =>{
                button.style.display = 'block';});
            buttons_visible = 1;
            setCookie('buttons_visible', '0');
        }
    }
}

function auto_grow(element){
    element.style.height = "1pt";
    element.style.height = (element.scrollHeight) + "px";
    // Overflow ?
}
function has_text(element, bol){
    if(element.value != '' || bol){
        var val = element.value; element.value=''; element.value= val;
        element.labels[0].className='active text';
    } else {
        element.labels[0].className='text';
    }
}

function updateChapterProgression() {
    for (let i = 0; i < number_of_chapters; i++) {
        nb_qu_succeeded = progression[i].length
        nb_qu_chap = questions_per_chapters[i];
        document.getElementById('chapter_progress_bar' + i).style.width = ((nb_qu_succeeded / nb_qu_chap) * 100).toString() + "%";
        document.getElementById('chapter_progression' + i).innerHTML = nb_qu_succeeded + '/' + nb_qu_chap;
    }
}

function view_correction(){
    var chap = questions[my_position][0];
    var q = questions[my_position][1];
    if(corrections[chap].includes(q)){
        var iframe = document.getElementById('correction_frame');
        iframe.src= chapters[chap] + '/' + q.toString() + '.pdf#toolbar=0&view=FitH';
        show_overlay('correction', 1);
    }
}

function show_overlay(name ,bol){
    if (document.getElementById('help_overlay').style.display == "") {
        if (name == "suggestion" && bol) {
            document.getElementById('comment').value = "";
        }
        if(bol == 1){
            // chapters selection overlay
            document.getElementById(name + '_overlay').style.visibility = 'visible';
            document.getElementById('fab').style.opacity = 0;
            document.getElementById('fab_menu').style.opacity = 0;
            document.getElementById(name + '_dialog').style.transform = 'translateX(0em)';
            if(name=='suggestion'){
                document.getElementById('question_nb').value = questions[my_position];
                var now = new Date;
                var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(),
                    now.getUTCHours(), now.getUTCMinutes());
                document.getElementById('date').value = utc_timestamp.toString();
                document.getElementById('name').focus();
            }
        }
        else {
            // close all overlays
            if(name != 'correction'){
                document.getElementById(name + '_dialog').style.transform = 'translateX(30em)';
            } else{
                document.getElementById(name + '_dialog').style.transform = 'translateY(100%)';
            }
            document.getElementById('fab').style.opacity = 1;
            document.getElementById('fab_menu').style.opacity = 1;
            document.getElementById(name + '_overlay').style.visibility = 'hidden';
            if(name != 'correction'){
                show_menus();
                document.getElementById('fab_input').checked = false;
            }
        }
        if (name == "chapters" && bol) {
            updateChapterProgression();
        }
    }
}

function show_menus(){
    if (document.getElementById('fab_input').checked){
        document.getElementById('fab_menu').className='shrink';

        if (document.getElementById('help_overlay').style.display == "block") {
            // trigger help overlay off
            document.getElementById('help_overlay').style.display = "";
            Array.from(document.getElementsByClassName('help')).forEach(element => {
                element.style.display = "";
            })
            Array.from(document.getElementsByClassName('hidden_af')).forEach(element => {
                element.classList.remove('hidden_af');
            })
        }
    } else {
        document.getElementById('fab_menu').className='expand';
    }
}

function confirm_choice(){
    // get selected chapters
    var selected_chapters_temp = [];
    for (i = 0; i < number_of_chapters; i++) {
        if (document.getElementById('chap' + i).checked) {
            selected_chapters_temp.push(1);
        }
        else {
            selected_chapters_temp.push(0);
        }
    }

    if (selected_chapters_temp.includes(1)) {
        // if at least one chapter has been selected
        // save selected chapters to local storage
        localStorage.setItem('selected_chapters_' + m_or_p, selected_chapters_temp.toString());

        // reload everything
        questions = [];
        get_chapter_menu();
        show_overlay('chapters', 0);
        document.getElementById('fab_menu').className='shrink';
        init();
    }
    else {
        // if no chapters were selected, alert user and do nothing else
        alert("Veuillez sélectionner au moins un chapitre.");
    }
}


// UTILITIES
function random(seed) {
    var x = Math.sin(seed++ * 10000);
    return x - Math.floor(x);
}

function set_chapter_menu(){
    selected_chapters.forEach((selected_chapter, i) => {
        document.getElementById('chap' + i).checked = selected_chapter;
    })
}

function get_chapter_menu(){
    for(i=0; i<number_of_chapters; i++){
        selected_chapters[i] = document.getElementById('chap' + i).checked;
    }
}

function get_questions(){
    selected_chapters.forEach((selected_chapter, i) => {
        if(selected_chapter){
            for(j=0; j< questions_per_chapters[i]; j++){
                real_nb_of_questions += 1;
                if (!progression[i].includes(j)) {
                    // if question not in progression
                    questions.push([i, j])
                }
                else {
                    real_nb_questions_succeeded += 1;
                }
            }
        }
    })
    nb_of_questions = questions.length;
}


// SWIPES
function swipes(){
    function unify(e) { return e.changedTouches ? e.changedTouches[0] : e};
    let x0 = null;
    let y0=null
    function lock(e) {
        e.stopPropagation();
        x0 = unify(e).clientX;
        y0 = unify(e).clientY;
    }
    function move(e) {
        e.stopPropagation();
        if(x0 || x0 === 0) {
            var dx = unify(e).clientX - x0;
            var dy = unify(e).clientY - y0;
            if(Math.abs(dx) > 10 || Math.abs(dy) >10){
                if(Math.abs(dx) > Math.abs(dy)){
                    if (Math.sign(-dx) > 0) {
                        questionSucceeded();
                    }
                    else if(Math.sign(-dx) < 0) {
                        nextQuestion(-1);
                    }
                } else {
                    if (Math.sign(-dy) > 0) {
                        questionFailed();
                    }
                }
            }
        }
        x0=null;
        y0=null
    }

    let m = document.getElementById('main')
    m.addEventListener('mousedown', lock, {passive: true});
    m.addEventListener('touchstart', lock, {passive: true});

    m.addEventListener('mouseup', move, {passive: true});
    m.addEventListener('touchend', move, {passive: true});
}


// RESET
function reset(){
    if (document.getElementById('help_overlay').style.display == "") {
        if (confirm('Attention ! Vous êtes sur le point de réinitialiser la progression des chapitres sélectionnés . Voulez vous poursuivre ?')) {
            selected_chapters.forEach((if_chapter, chapter_nb) => {
                if (if_chapter) {
                    progression.splice(chapter_nb, 1, []);
                }
            });
            push_progression();
            questions = [];
            document.getElementById('fab_menu').className = 'shrink';
            init();
        }
    }
}


// CORRECTIONS
function displayCorrectionButton(chap, q, which) {
    if (corrections[chap].includes(q)) {
        document.getElementById('correction' + which).classList.add('exists');
        document.getElementById('correction_tooltip' + which).innerHTML = 'Correction';
    }
    else {
        document.getElementById('correction' + which).classList.remove('exists');
        document.getElementById('correction_tooltip' + which).innerHTML = 'Proposer une correction';
    }
}


// INIT
function modpos(n) {return (n + nb_of_questions) % (nb_of_questions)}

function on_load(){
    has_text(document.getElementById('name'), 0);
    has_text(document.getElementById('mail'), 0);
    document.getElementById('comment').value='';

    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && event.target.nodeName === 'INPUT') {
          var form = event.target.form;
          var index = Array.prototype.indexOf.call(form, event.target);
          form.elements[index + 1].focus();
          event.preventDefault();
        }
    });

    // button visibility cookies stuff
    buttons_visible = getCookieValue('buttons_visible');
    if (buttons_visible == '') {
        buttons_visible = 0
    }
    else {
        buttons_visible = parseInt(buttons_visible);
    }
    show_buttons();

    fetch_selected_chapters();
    swipes();
    init();
    showHelp_onload();
}

function init(){
    my_position = 0;
    real_nb_questions_succeeded = 0;
    real_nb_of_questions = 0;
    keys_active = true;

    // Finds the amount of chapters
    number_of_chapters = questions_per_chapters.length;

    // init progression if empty
    if (progression.length < number_of_chapters) {
        for (var i = 0; i < number_of_chapters; i++) {
            progression.push([]);
        }
    }

    document.getElementById('fab_input').checked = false;

    // Selects the chapters
    if (selected_chapters.length <= 0){
        selected_chapters = (new Array(number_of_chapters)).fill(true);
    }
    set_chapter_menu();

    // Finds the amount of questions
    get_questions();

    // if there actually are questions...
    if (real_nb_of_questions > real_nb_questions_succeeded) {
        //Shuffles the elements in the array using Fisher-Yates Algorithm
        for (let i = nb_of_questions - 2; i > 0; i--) {
            const j = Math.floor(Math.random() * i);
            const temp = questions[i];
            questions[i] = questions[j];
            questions[j] = temp;
        }

        for(i=0; i<8; i++){
            var chap = questions[modpos(i - 2)][0];
            var q = questions[modpos(i - 2)][1];
            which = ((i - 2 + 8) % 8);
            document.getElementById('question_' + which).src = chapters[chap] + '/' + q.toString() + '.png';
            document.getElementById('question_chap_' + which).innerHTML = chapters_names[chap];
            displayCorrectionButton(chap, q, which);
        }

        nextQuestion(0);
    }
    else { // if there are no questions
        nothing_remains()
    }
}

function nothing_remains(){
    if (confirm("Vous avez déjà réussi toutes les questions des chapitres sélectionnés. Voulez vous réinitialiser la progression de ces chapitres ? Dans la négative, sélectionnez plus de chapitres pour pouvoir continuer.")) {
        // remove progression from selected chapters
        selected_chapters.forEach((if_chapter,chapter_nb) => {
            if (if_chapter) {
                progression.splice(chapter_nb,1,[]);
            }
        });
        push_progression();
        // reload after progression reset
        init();
    }
    else {
        // Just display some crap...
        document.getElementById('progress_number').innerHTML = (real_nb_questions_succeeded).toString() + '/' + (real_nb_of_questions).toString() + ' questions réussies';
        document.getElementById('progress').style.width = "100%";
        // disable keys
        keys_active = false;
    }
}


// NEXT QUESTION
function nextQuestion(direction, failed=false) {
    // remove failed attribute from previous cell
    document.getElementById('cell_' + ((my_position - 1 + 8)% 8)).className='carousel_cell';

    // if going over the number of questions
    if (my_position + direction >= nb_of_questions || real_nb_of_questions <= real_nb_questions_succeeded) {
        if (real_nb_of_questions > real_nb_questions_succeeded) {

            real_nb_of_questions = 0;
            real_nb_questions_succeeded = 0;
            get_questions();
            //Shuffles the elements in the array using Fisher-Yates Algorithm
            for (let i = nb_of_questions - 2; i > my_position + direction; i--) {
                const j = Math.floor(Math.random() * (i - my_position + direction)) + my_position + direction;
                const temp = questions[i];
                questions[i] = questions[j];
                questions[j] = temp;
            }
            for(i=1; i<5; i++){
                var chap = questions[modpos(my_position + i)][0];
                var q = questions[modpos(my_position + i)][1];
                which = (angle + i) % 8;
                document.getElementById('question_' + which).src = chapters[chap] + '/' + q.toString() + '.png';
                document.getElementById('question_chap_' + which).innerHTML = chapters_names[chap];
                displayCorrectionButton(chap, q, which);
            }
        }
        else { // if there are no questions
            nothing_remains();
            return;
        }
    }
    //else {
        my_position = modpos(my_position + direction)
        angle += direction;
        document.getElementById('progress_number').innerHTML = (real_nb_questions_succeeded).toString() + '/' + (real_nb_of_questions).toString() + ' questions réussies';
        document.getElementById('progress').style.width = (real_nb_questions_succeeded / (real_nb_of_questions) * 100).toString() + '%' ;

        // adds the next question on the back side
        if (direction > 0){
            var chap = questions[modpos(my_position + 5)][0];
            var q = questions[modpos(my_position + 5)][1];
            which = (angle + 5) % 8;
        } else {
            var chap = questions[modpos(my_position - 2)][0];
            var q = questions[modpos(my_position - 2)][1];
            which = (angle + 8 - 2) % 8;
        }
        document.getElementById('question_' + which).src = chapters[chap] + '/' + q.toString() + '.png';
        document.getElementById('question_chap_' + which).innerHTML = chapters_names[chap];
        displayCorrectionButton(chap, q, which);

        if(failed){
            document.getElementById('cell_' + ((angle - 1) % 8)).className='failed carousel_cell';
        }
        // rotate caroussel and display succeeded marker
        question = questions[my_position]
        if (progression[question[0]].includes(question[1])) {
            document.getElementById('question_succeeded').style.opacity = "";
        }
        else {
            document.getElementById('question_succeeded').style.opacity = "0";
        }
        document.getElementById('carousel').style.transform = 'translateZ(-150em) rotateY(' + (45 * angle).toString() + 'deg)';
    //}
}

function push_progression() {
    var progression_temp = [];
    for (var i = 0; i < number_of_chapters; i++) {
        progression_temp.push(progression[i].toString())
    }
    localStorage.setItem('progression_' + m_or_p, progression_temp.join(';'));
}

function questionSucceeded() {
    var question = questions[my_position]; // [0] = chapter ; [1] = question

    // add question[1] to the question[0] th element of progression
    var progression_chapter = progression[question[0]];
    if (!progression_chapter.includes(question[1])) {
        progression_chapter.push(question[1]);
        // remove question[0] th element of the progression list and replace with progression_chapter
        progression.splice(question[0],1,progression_chapter);

        real_nb_questions_succeeded += 1;

        // push progression to localstorage
        push_progression();
    }

    nextQuestion(1);
}

function questionFailed() {
    var question = questions[my_position];

    var progression_chapter = progression[question[0]];
    if (progression_chapter.includes(question[1])) {
        // delete question[1] from progression_chapter
        progression_chapter.splice(progression_chapter.indexOf(question[1]),1);
        // replace in progression
        progression.splice(question[0], 1, progression_chapter);

        real_nb_questions_succeeded -= 1;
    }

    // push progression to local storage
    push_progression();

    nextQuestion(1, true);
}


// KEYS
function keyDown(e) {
    chapters_overlay = document.getElementById('chapters_overlay').style.visibility;
    suggestion_overlay = document.getElementById('suggestion_overlay').style.visibility;
    chapters_overlay_visibility = (chapters_overlay == "hidden" || chapters_overlay == "");
    suggestion_overlay_visibility = (suggestion_overlay == "hidden" || suggestion_overlay == "");
    help_overlay_visi = document.getElementById('help_overlay').style.display == "";
    if (suggestion_overlay_visibility && chapters_overlay_visibility && keys_active && help_overlay_visi) {
        if (e == 13 || e == 39 || e == 32) {
            // down, right, enter, space
            questionSucceeded();
        } else if (e==38){
            // up
            questionFailed();
        }
        else if (e == 37) {
            // left
            nextQuestion(-1);
        }
    }
    if (e == 27) {
        // echap
        if (!chapters_overlay_visibility) {
            // if an overlay is visible, close it
            show_overlay('chapters', 0);
        }
        else if(!suggestion_overlay_visibility){
            show_overlay('suggestion', 0);
        } else {
            checkbox = document.getElementById('fab_input');
            if (checkbox.checked) {
                checkbox.checked = false;
                document.getElementById('fab_menu').className = 'shrink';
            }
            delete checkbox;
        }
    }
}


// suggestion overlay
function enableSubmit() {
    radios = document.getElementsByName('suggestion_or_comment');
    radioChecked = radios[0].checked || radios[1].checked;
    if (radioChecked && (document.getElementById('name_input').value != '') && (document.getElementById('sugg_input').value != '')) {
        document.getElementById("submit_button").disabled = "";
    }
    else {
        document.getElementById("submit_button").disabled = "disabled";
    }
    delete radios;
    delete radioChecked;
}


// HELP OVERLAY
function showHelp(open=1) {
    help_overlay_visi = document.getElementById('help_overlay').style.display;
    if (help_overlay_visi == "" && open) {
        // if overlay hidden

        // open menu
        document.getElementById('fab_menu').className = "expand";

        // trigger overlay
        document.getElementById('help_overlay').style.display = "block";
        Array.from(document.getElementsByClassName('help')).forEach(element => {
            element.style.display = "block";
        })
        Array.from(document.getElementsByClassName('tooltiptext')).forEach(element => {
            element.classList.add("hidden_af");
        })
    }
    else{
        // close menu
        document.getElementById('fab_menu').className = "shrink";
        document.getElementById('fab_input').checked = false;

        // trigger overlay off
        document.getElementById('help_overlay').style.display = "";
        Array.from(document.getElementsByClassName('help')).forEach(element => {
            element.style.display = "";
        })
        Array.from(document.getElementsByClassName('hidden_af')).forEach(element => {
            element.classList.remove('hidden_af');
        })
    }
}

function showHelp_onload() {
    help_overlay_cookie = getCookieValue('help');
    if (help_overlay_cookie == '') {
        setCookie('help', '1');
        document.getElementById('fab_input').checked = true;
        showHelp();
    }
}
