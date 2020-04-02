// Beautiful Script
var my_position = getCookieValue(m_or_p + '_position');
var delta_position = 0;
var seed = getCookieValue(m_or_p + '_seed');
var questions = [];
var sensitivity = 1;

// Random generator
function mulberry32(a) {
    return function () {
        var t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Swipes
function swipes(){
    function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };
    let x0 = null;
    function lock(e) { e.stopPropagation(); x0 = unify(e).clientX};
    function move(e) {
        e.stopPropagation();
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


function reset(){
    if(confirm('Attention ! Vous êtes sur le point de réinitialiser toute votre progression. Êtes vous sûr de vouloir poursuivre ?')){
        seed='';
        my_position='';
        init();
    }
}

function modpos(n){return (n + nb_of_questions) % (nb_of_questions)}


function init(){
        // Cookie if question number changed
    if (getCookieValue(m_or_p + '_nb_questions') != '' && getCookieValue(m_or_p + '_nb_questions') != nb_of_questions) {
            my_position = '';
            setCookie(m_or_p + '_nb_questions', nb_of_questions.toString());
            document.getElementById("reset_message").style.visibility = 'visible';
    }
    else if(getCookieValue(m_or_p + '_nb_questions') == '') {
        setCookie(m_or_p + '_nb_questions', nb_of_questions.toString());
    }

    // Initializes seed if it doesn't exist yet
    if (seed == '') {
        seed = Math.floor(Math.random() * 10**16);
        setCookie(m_or_p + '_seed', seed.toString());
    }
    else seed = parseInt(seed);

    // Initializes an array [1, 2, ..., nb_of_questions]
    for (var i = 0; i < nb_of_questions; i++) {
        questions.push(i);
    }

    //Shuffles the elements in the array using Fisher-Yates Algorithm
    random = mulberry32(seed);
    for(let i = nb_of_questions - 2; i > 0; i--){
        const j = Math.floor(random() * i);
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
    }

    if (my_position == '') {
        my_position = 0;
    }
    else {
        my_position = parseInt(my_position);
    }

    for(i=0; i<8; i++){
        document.getElementById('question_' + ((i-2+8)%8)).src = m_or_p + '/' + questions[modpos(my_position + i - 2)].toString() + '.png';
    }
    nextQuestion(0);
    swipes();
}
function nextQuestionPressed(direction) {
    document.getElementById('reset_message').style.visibility = 'hidden';
    nextQuestion(direction);
}


function nextQuestion(direction) {
    my_position = modpos(my_position + direction);
    delta_position += direction;
    setCookie(m_or_p + '_position', my_position.toString())
    document.getElementById('progress_number').innerHTML = (my_position + 1).toString() + '/' + (nb_of_questions).toString() + ' questions';
    document.getElementById('progress').style.width = ((my_position + 1) / (nb_of_questions) * 100).toString() + '%' ;

    // adds the next question on the back side
    if (direction > 0){
        document.getElementById('question_' + ((modpos(delta_position) + 5) % 8).toString()).src = m_or_p + '/' + questions[modpos(my_position + 5)].toString() + '.png';
    } else {
        document.getElementById('question_' + ((modpos(delta_position) + 8 - 2) % 8).toString()).src = m_or_p + '/' + questions[modpos(my_position - 2)].toString() + '.png';
    }
    document.getElementById('carousel').style.transform = 'translateZ(-150em) rotateY(' + (45 * delta_position).toString() + 'deg)';

    document.getElementById('question_nb').value = questions[my_position].toString();
}


function keyDown(e) {
    // 40:down 38:up 39:right 37:left 32:space 13:enter
    if (document.getElementById('suggestion_overlay').style.visibility == 'hidden') {
        if (e == 13 || e == 39 || e == 40 || e == 32) {
            nextQuestionPressed(1);
        }
        else if (e == 37 || e == 38) {
            nextQuestionPressed(-1);
        }
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
