// Beautiful Script
var my_position = getCookieValue(m_or_p + '_position');
var seed = getCookieValue(m_or_p + '_seed');
var questions = [];
var flips = 1;
var sensitivity = 1;
var selected_chapters = [];
var number_of_chapters = 0;
var number_of_questions = 0;

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
}


//Utilities
function random(seed) {
    var x = Math.sin(seed++ * 10000);
    return x - Math.floor(x);
}

function count_questions(){
    var s = 0;
    for(i=0, n= questions_per_chapters.length; i< n; i++){
        if (selected_chapters[i]){
            s += questions_per_chapters[i];
        }
    }
    number_of_questions = s;
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
    function lock(e) { e.stopPropagation(); console.log("Touched started"); x0 = unify(e).clientX};
    function move(e) {
        e.stopPropagation();
        console.log("Touched ended");
        if(x0 || x0 === 0){
            let dx = unify(e).clientX - x0, s = Math.sign(dx);
            if(Math.abs(dx) > 10){
                nextQuestionPressed(-s);
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



// Cookies
if (getCookieValue('maths_nb_questions') != nb_of_questions) {
    var fuck = ' -- de nouvelles questions ont été ajoutées, la progression a été réinitialisée';
    console.log("Number of questions changed, resetting progression.");
    my_position = '';
    setCookie('maths_nb_questions', nb_of_questions.toString());
}
else {
    var fuck = '';
}

function reset(){
    if(confirm('Warning you are about to reset all of your progress. Are you sure that you want to proceed ?')){
        seed='';
        my_position='';
        init();
    }
}

function modpos(n){return (n + nb_of_questions) % (nb_of_questions)}


function init(){
    var checkbox = document.getElementById('fab_input');
    checkbox.checked = false;

    //window.localStorage.setItem('test', 'Test');
    //var temp = [];
    //for(var i=0; i<10000; i++){
    //    temp.push(i)
    //}
    //window.localStorage.setItem('arr', temp);
        // Cookie if question number changed
        if (getCookieValue(m_or_p + '_nb_questions') != nb_of_questions) {
            my_position = '';
            setCookie(m_or_p + '_nb_questions', nb_of_questions.toString());
            document.getElementById("reset_message").style.visibility = 'visible';
        }


    // Initializes seed if it doesn't exist yet
    //if (seed == '') {
    //    seed = Math.floor(Math.random() * 10**16);
    //    setCookie(m_or_p + '_seed', seed.toString());
    //}
    //else seed = parseInt(seed);
    //console.log('Seed: ' + seed)

    // Initializes an array [1, 2, ..., nb_of_questions]
    //for (var i = 0; i < nb_of_questions; i++) {
    //    questions.push(i);
    //}
    /*
    Shuffles the elements in the array using Fisher-Yates Algorithm
    for(let i = nb_of_questions - 2; i > 0; i--){
        const j = Math.floor(random(seed) * i);
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
    }*/

    // Finds the amount of chapters
    number_of_chapters = questions_per_chapters.length;

    // Selects the chapters
    if (selected_chapters.length <= 0){
        selected_chapters = (new Array(number_of_chapters)).fill(true);
    }
    set_chapter_menu();

    // Finds the amount of questions
    count_questions();
    get_questions();

    // debug
    console.log("Found " + number_of_chapters.toString() + " chapters");
    console.log("Found " + number_of_questions.toString() + " questions");

    for(i=0; i<8; i++){
        var chap = questions[modpos(i - 2)][0];
        var q = questions[modpos(i - 2)][1];
        document.getElementById('question_' + ((i-2+8)%8)).src = chapters[chap] + '/' + q.toString() + '.png';
    }
    //if (my_position == '') {
    my_position = 0;
    nextQuestion(0);
    //}
    //else {
    //    console.log("Retrieved position from cookies : " + my_position);
    //    my_position = parseInt(my_position);
    //    nextQuestion(0);
    //}
    swipes();
}
function nextQuestionPressed(direction) {
    document.getElementById('reset_message').style.visibility = 'hidden';
    nextQuestion(direction);
}


function nextQuestion(direction) {
    my_position = modpos(my_position + direction)
    console.log('I am at ' + my_position)
    setCookie(m_or_p + '_position', my_position.toString())
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


// COOKIE STUFF !!!

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

// suggestion overlay
function suggestionOverlay() {
    if (document.getElementById('suggestion_overlay').style.visibility == 'hidden') {
        document.getElementById('suggestion_overlay').style.visibility = 'visible'
    }
    else {
        document.getElementById('suggestion_overlay').style.visibility = 'hidden'
    }
}
