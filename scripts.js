// Beautiful Script
var my_position = 0;
var questions = [];
var flips = 1;
var sensitivity = 1;
var selected_chapters_temp = localStorage.getItem('selected_chapters');
if (selected_chapters_temp == null) {
    var selected_chapters = [];
}
else {
    selected_chapters_temp = selected_chapters_temp.split(',');
    var selected_chapters = [];
    for (var i=0; i<selected_chapters_temp.length; i++) {
        selected_chapters = selected_chapters.concat(parseInt(selected_chapters_temp[i]));
    }
}
var number_of_chapters = 0;
var nb_of_questions = 0;

//SELECT CHAPTER
function select_all(bol){
    checkboxes = document.getElementsByName('check_chapters');
    for(var i=0, n=checkboxes.length; i<n; i++){
        checkboxes[i].checked = bol;
    }
}
function show_overlay(bol){
    overlay = document.getElementById('overlay');
    fab = document.getElementById('fab');
    fab_menu = document.getElementById('fab_menu');
    dialog = document.getElementById('dialog');
    if(bol){
        overlay.style.visibility = 'visible';
        fab.style.opacity = 0;
        fab_menu.style.opacity = 0;
        dialog.style.transform = 'translateX(0em)';
    } else {
        dialog.style.transform = 'translateX(30em)';
        fab.style.opacity = 1;
        fab_menu.style.opacity = 1;
        overlay.style.visibility = 'hidden';
    }
}
function show_menus(){
    checkbox = document.getElementById('fab_input');
    menus = document.getElementById('fab_menu');
    if(checkbox.checked){
        menus.className='shrink';
    } else {
        menus.className='expand';
    }
}
function confirm_choice(){
    questions = [];
    get_chapter_menu();
    show_overlay(0);
    init();

    // save selected chapters to local storage
    var selected_chapters_temp = [];
    for (var i=0; i<selected_chapters.length; i++) {
        if (selected_chapters[i]) {
            selected_chapters_temp = selected_chapters_temp.concat(1);
        }
        else {
            selected_chapters_temp = selected_chapters_temp.concat(0);
        }
    }
    localStorage.setItem('selected_chapters', selected_chapters_temp.toString());
}


//Utilities
function random(seed) {
    var x = Math.sin(seed++ * 10000);
    return x - Math.floor(x);
}

function set_chapter_menu(){
    for(i=0; i<number_of_chapters; i++){
        checkbox = document.getElementById('chap'+i)
        checkbox.checked = selected_chapters[i];
    }
}

function get_chapter_menu(){
    for(i=0; i<number_of_chapters; i++){
        checkbox = document.getElementById('chap'+i)
        selected_chapters[i] = checkbox.checked;
    }
}

function get_questions(){
    for(i=0; i<number_of_chapters;i++){
        if(selected_chapters[i]){
            for(j=0; j< questions_per_chapters[i]; j++){
                questions.push([i, j])
            }
        }
    }
    nb_of_questions = questions.length;
}

// Swipes
function swipes(){
    function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };
    let x0 = null;
    function lock(e) { e.stopPropagation(); x0 = unify(e).clientX};
    function move(e) {
        e.stopPropagation();
        if(x0 || x0 === 0){
            if(Math.abs(dx) > 10){
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


function reset(){
    if(confirm('Warning you are about to reset all of your progress. Are you sure that you want to proceed ?')){
        init();
    }
}

function modpos(n){return (n + nb_of_questions) % (nb_of_questions)}


function init(){
    var checkbox = document.getElementById('fab_input');
    checkbox.checked = false;

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
    swipes();
}


function nextQuestionPressed(direction) {
    nextQuestion(direction);
}


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


function keyDown(e) {
    if (e == 13 || e == 39  || e == 40) {
        nextQuestionPressed(1);
    }
    else if (e == 37 || e == 38) {
        nextQuestionPressed(-1);
    }
    else if (e == 27) {
        document.getElementById('suggestion_overlay').style.visibility = 'hidden';
    }
}

function enableSubmit() {
    var radios = document.getElementsByName('suggestion_or_comment');
    var radioChecked = radios[0].checked || radios[1].checked;
    if (radioChecked && (document.getElementById('name_input').value != '') && (document.getElementById('sugg_input').value != '')) {
        document.getElementById("submit_button").disabled = "";
    }
    else{
        document.getElementById("submit_button").disabled = "disabled";
    }
}


// suggestion overlay
function suggestionOverlay() {
    if (document.getElementById('suggestion_overlay').style.visibility == 'hidden') {
        document.getElementById('suggestion_overlay').style.visibility = 'visible'
    }
    else {
        document.getElementById('suggestion_overlay').style.visibility = 'hidden'
    }
}
