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
    if(buttons_visible){
        document.getElementById('button_visibility').innerHTML = 'visibility_off';
        Array.from(document.getElementsByClassName('hidable_buttons')).forEach(button =>{
            button.style.display = 'none';});
        buttons_visible = 0;
        setCookie('buttons_visible', '1');
    }
    else{
        document.getElementById('button_visibility').innerHTML = 'visibility';
        Array.from(document.getElementsByClassName('hidable_buttons')).forEach(button =>{
            button.style.display = 'block';});
        buttons_visible = 1;
        setCookie('buttons_visible', '0');
    }
}

function show_overlay(bol){
    if(bol == 1){
        // chapters selection overlay
        document.getElementById('chapters_overlay').style.visibility = 'visible';
        document.getElementById('fab').style.opacity = 0;
        document.getElementById('fab_menu').style.opacity = 0;
        document.getElementById('dialog').style.transform = 'translateX(0em)';
    }
    else {
        // close all overlays
        document.getElementById('dialog').style.transform = 'translateX(30em)';
        document.getElementById('fab').style.opacity = 1;
        document.getElementById('fab_menu').style.opacity = 1;
        document.getElementById('chapters_overlay').style.visibility = 'hidden';
    }
}

function show_menus(){
    if (document.getElementById('fab_input').checked){
        document.getElementById('fab_menu').className='shrink';
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
        show_overlay(0);
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
    function lock(e) {
        e.stopPropagation();
        x0 = unify(e).clientX;
    }
    function move(e) {
        e.stopPropagation();
        if(x0 || x0 === 0) {
            var dx = unify(e).clientX - x0;
            if(Math.abs(dx) > 10){
                if (Math.sign(-dx) > 0) {
                    questionSucceeded();
                }
                else if(Math.sign(-dx) < 0) {
                    nextQuestion(-1);
                }
            }
        }
        x0=null;
    }

    let m = document.getElementById('main')
    m.addEventListener('mousedown', lock, {passive: true});
    m.addEventListener('touchstart', lock, {passive: true});

    m.addEventListener('mouseup', move, {passive: true});
    m.addEventListener('touchend', move, {passive: true});
}


// RESET
function reset(){
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


// INIT
function modpos(n) {return (n + nb_of_questions) % (nb_of_questions)}

function on_load(){
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
        }

        nextQuestion(0);
    }
    else { // if there are no questions
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
            document.getElementById('progress_number').innerHTML = "Terminé !";
            // disable keys
            keys_active = false;
        }
    }
}


// NEXT QUESTION
function nextQuestion(direction) {
    // if going over the number of questions
    if (my_position + direction >= nb_of_questions) {
        questions = [];
        init();
    }
    else {
        my_position = modpos(my_position + direction)
        document.getElementById('progress_number').innerHTML = (real_nb_questions_succeeded + 1).toString() + '/' + (real_nb_of_questions).toString() + ' questions';
        document.getElementById('progress').style.width = ((real_nb_questions_succeeded + 1) / (real_nb_of_questions) * 100).toString() + '%' ;

        // adds the next question on the back side
        if (direction > 0){
            var chap = questions[modpos(my_position + 5)][0];
            var q = questions[modpos(my_position + 5)][1];
            which = (my_position + 5) % 8;
            document.getElementById('question_' + which).src = chapters[chap] + '/' + q.toString() + '.png';
            document.getElementById('question_chap_' + which).innerHTML = chapters_names[chap];
        } else {
            var chap = questions[modpos(my_position - 2)][0];
            var q = questions[modpos(my_position - 2)][1];
            which = (my_position + 8 - 2) % 8;
            document.getElementById('question_' + which).src = chapters[chap] + '/' + q.toString() + '.png';
            document.getElementById('question_chap_' + which).innerHTML = chapters_names[chap];
        }
        document.getElementById('carousel').style.transform = 'translateZ(-150em) rotateY(' + (45 * my_position).toString() + 'deg)';
    }
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

    nextQuestion(1);
}


// KEYS
function keyDown(e) {
    chapters_overlay = document.getElementById('chapters_overlay').style.visibility;
    chapters_overlay_visibility = chapters_overlay == "hidden" || chapters_overlay == "";
    if (chapters_overlay_visibility && keys_active) {
        if (e == 13 || e == 39  || e == 40 || e == 32) {
            // down, right, enter, space
            questionSucceeded();
        }
        else if (e == 37 || e == 38) {
            // up, left
            nextQuestion(-1);
        }
    }
    if (e == 27) {
        // echap
        if (!chapters_overlay_visibility) {
            // if an overlay is visible, close it
            show_overlay(0);
        }
        else {
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
