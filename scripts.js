var my_position = 0;
var questions = [];
var flips = 1;
var sensitivity = 1;
var number_of_chapters = 0;
var nb_of_questions = 0;
var buttons_visible = 1;

// selected chapters
selected_chapters_temp = localStorage.getItem('selected_chapters_'+m_or_p);
if (selected_chapters_temp == null) {
    var selected_chapters = [];
}
else {
    selected_chapters_temp = selected_chapters_temp.split(',');
    var selected_chapters = [];
    selected_chapters_temp.forEach(selected_chapters_temp_i => {
        selected_chapters.push(parseInt(selected_chapters_temp_i));
    })
}
delete selected_chapters_temp;

// progression
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

function show_buttons(){
    if(buttons_visible){
        document.getElementById('button_visibility').innerHTML = 'visibility_off';
        Array.from(document.getElementsByClassName('hidable_buttons')).forEach(button =>{
            button.style.display = 'none';});
        buttons_visible = 0;
    } else{
        document.getElementById('button_visibility').innerHTML = 'visibility';
        Array.from(document.getElementsByClassName('hidable_buttons')).forEach(button =>{
            button.style.display = 'block';});
        buttons_visible = 1;
    }
}

function auto_grow(element){
    element.style.height = "1pt";
    element.style.height = (element.scrollHeight) + "px";
    // Overflow ?
}
function has_text(element, bol){
    if(element.value != '' || bol){
        element.labels[0].className='active text';
    } else {
        element.labels[0].className='text';
    }
}

function show_overlay(name ,bol){
    if(bol == 1){
        if(name=='suggestion'){
            document.getElementById('question_nb').value = questions[my_position];
            var now = new Date;
            var utc_timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(),
                now.getUTCHours(), now.getUTCMinutes());
            document.getElementById('date').value = utc_timestamp.toString();
        }
        // chapters selection overlay
        document.getElementById(name + '_overlay').style.visibility = 'visible';
        document.getElementById('fab').style.opacity = 0;
        document.getElementById('fab_menu').style.opacity = 0;
        document.getElementById(name + '_dialog').style.transform = 'translateX(0em)';
    }
    else {
        // close all overlays
        document.getElementById(name + '_dialog').style.transform = 'translateX(30em)';
        document.getElementById('fab').style.opacity = 1;
        document.getElementById('fab_menu').style.opacity = 1;
        document.getElementById(name + '_overlay').style.visibility = 'hidden';
        show_menus();
        document.getElementById('fab_input').checked = false;
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
    questions = [];
    get_chapter_menu();
    show_overlay('chapters', 0);
    init();

    // save selected chapters to local storage
    selected_chapters_temp = [];
    selected_chapters.forEach(selected_chapter => {
        if (selected_chapter) {
            selected_chapters_temp.push(1);
        }
        else {
            selected_chapters_temp.push(0);
        }
    })
    localStorage.setItem('selected_chapters_'+m_or_p, selected_chapters_temp.toString());
    delete selected_chapters_temp;
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
                if (!progression[i].includes(j)) {
                    // if question not in progression
                    questions.push([i, j])
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
    function lock(e) { console.log('touch started');e.stopPropagation(); x0 = unify(e).clientX};
    function move(e) {
        e.stopPropagation();
        if(x0 || x0 === 0){
            var dx = unify(e).clientX - x0;
            if(Math.abs(dx) > 10){
                nextQuestion(Math.sign(-dx));
                console.log(Math.sign(-dx));
                console.log('touch ended');
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
    if(confirm('Warning you are about to reset all of your progress. Are you sure that you want to proceed ?')){
        init();
    }
}


// INIT
function modpos(n){return (n + nb_of_questions) % (nb_of_questions)}

function on_load(){
    has_text(document.getElementById('name'), 0);
    has_text(document.getElementById('mail'), 0);
    has_text(document.getElementById('comment'), 0);
    document.addEventListener('keydown', function (event) {
        if (event.keyCode === 13 && event.target.nodeName === 'INPUT') {
          var form = event.target.form;
          var index = Array.prototype.indexOf.call(form, event.target);
          form.elements[index + 1].focus();
          event.preventDefault();
        }
    });
    swipes();
    init();
}

function init(){
    // init progression if empty
    if (progression.length < number_of_chapters) {
        for (var i = 0; i < number_of_chapters; i++) {
            progression.push([]);
        }
    }

    document.getElementById('fab_input').checked = false;

    // Finds the amount of chapters
    number_of_chapters = questions_per_chapters.length;

    // Selects the chapters
    if (selected_chapters.length <= 0){
        selected_chapters = (new Array(number_of_chapters)).fill(true);
    }
    set_chapter_menu();

    // Finds the amount of questions
    get_questions();

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
        document.getElementById('question_' + ((i-2+8)%8)).src = chapters[chap] + '/' + q.toString() + '.png';
    }

    nextQuestion(0);
}


// NEXT QUESTION
function nextQuestion(direction) {
    my_position = modpos(my_position + direction)
    document.getElementById('progress_number').innerHTML = (my_position + 1).toString() + '/' + (nb_of_questions).toString() + ' questions';
    document.getElementById('progress').style.width = ((my_position + 1) / (nb_of_questions) * 100).toString() + '%' ;

    // adds the next question on the back side
    if (direction > 0){
        var chap = questions[modpos(my_position + 5)][0];
        var q = questions[modpos(my_position + 5)][1];
        document.getElementById('question_' + ((my_position + 5) % 8).toString()).src = chapters[chap] + '/' + q.toString() + '.png';
    } else {
        var chap = questions[modpos(my_position - 2)][0];
        var q = questions[modpos(my_position - 2)][1];
        document.getElementById('question_' + ((my_position + 8 - 2) % 8).toString()).src = chapters[chap] + '/' + q.toString() + '.png';
    }
    document.getElementById('carousel').style.transform = 'translateZ(-150em) rotateY(' + (45 * my_position).toString() + 'deg)';
}

function questionSucceeded() {
    var question = questions[my_position]; // [0] = chapter ; [1] = question

    // add question[1] to the question[0] th element of progression
    var progression_chapter = progression[question[0]];
    progression_chapter.push(question[1]);
    // remove question[0] th element of the progression list and replace with progression_chapter
    progression.splice(question[0],1,progression_chapter);

    // push progression to localstorage
    var progression_temp = [];
    for (var i=0; i<number_of_chapters; i++) {
        progression_temp.push(progression[i].toString())
    }
    localStorage.setItem('progression_'+m_or_p, progression_temp.join(';'));

    // next question
    nextQuestion(1);
}


// KEYS
function keyDown(e) {
    console.log(e);
    if (e == 13 || e == 39  || e == 40 || e == 13) {
        // down, right, enter, space
        nextQuestion(1);
    }
    else if (e == 37 || e == 38) {
        // up, left
        nextQuestion(-1);
    }
    else if (e == 27) {
        // echap
        chapters_overlay = document.getElementById('chapters_overlay').style.visibility != 'hidden';
        if (chapters_overlay) {
            // if an overlay is visible, close it
            show_overlay('chapters', 0);
        }
        else {
            checkbox = document.getElementById('fab_input');
            if (checkbox.checked) {
                checkbox.checked = false;
                document.getElementById('fab_menu').className = 'shrink';
            }
        }
    }
}
