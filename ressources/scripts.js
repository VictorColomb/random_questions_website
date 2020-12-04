var my_position = 0;
const all_nb_of_questions = questions_content.length;
var number_of_chapters = chapters.length;
var nb_of_questions = 0;
var real_nb_of_questions = 0;
var real_nb_questions_succeeded = 0;
var buttons_visible = 1;
var keys_active = true;
var selected_chapters = [];
var angle = 0;
var questions = [];

// PARSE QUESTIONS LIST
var all_questions = [];
chapters.forEach((_) => {
  all_questions.push([]);
});
questions_content.forEach((question, question_nb) => {
  all_questions[question[1]].push(question_nb);
});

// FIREWORKS <3
function easteregg1() {
  canvas = document.getElementById("canvasFireworks");
  canvas.style.display = "block";
  var easteregg = document.createElement("script");
  easteregg.src = "ressources\\firework.js";
  easteregg.id = "fireworkscript";
  document.body.appendChild(easteregg);
}

// COOKIE STUFF
function setCookie(name, value) {
  var now = new Date();
  var time = now.getTime();
  var expireTime = time + 31536000000;
  now.setTime(expireTime);
  document.cookie =
    name + "=" + (value || "") + ";expires=" + now.toGMTString() + ";";
}

function getCookieValue(name) {
  var b = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : "";
}

// SELECTED CHAPTERS
function fetch_selected_chapters() {
  var selected_chapters_temp = localStorage.getItem(
    "selected_chapters_mp_" + discipline
  );
  if (selected_chapters_temp == null) {
    chapters.forEach(() => {
      selected_chapters.push(1);
    });
  } else {
    selected_chapters_temp = selected_chapters_temp.split(",");
    selected_chapters_temp.forEach((selected_chapters_temp_i) => {
      selected_chapters.push(parseInt(selected_chapters_temp_i));
    });
  }
}

// PROGRESSION
progression_temp = localStorage.getItem("progression_mp_" + discipline);
if (progression_temp == null) {
  var progression = [];
} else {
  var progression = progression_temp.split(",").map((elt) => {
    return parseInt(elt);
  });
}

//SELECT CHAPTER
function select_all(bol) {
  document.getElementsByName("check_chapters").forEach((checkbox) => {
    checkbox.checked = bol;
  });
}

function show_buttons(ga = true) {
  if (document.getElementById("help_overlay").style.display == "") {
    if (buttons_visible) {
      document.getElementById("button_visibility").innerHTML = "visibility";
      document.getElementById("button_visibility_tip").innerHTML =
        "Afficher les boutons";
      Array.from(document.getElementsByClassName("hidable_buttons")).forEach(
        (button) => {
          button.style.display = "none";
        }
      );
      buttons_visible = 0;
      setCookie("buttons_visible", "1");
      if (ga) {
        gtag("event", "Buttons", { event_label: "Hidden" });
      }
    } else {
      document.getElementById("button_visibility").innerHTML = "visibility_off";
      document.getElementById("button_visibility_tip").innerHTML =
        "Masquer les boutons";
      Array.from(document.getElementsByClassName("hidable_buttons")).forEach(
        (button) => {
          button.style.display = "block";
        }
      );
      buttons_visible = 1;
      setCookie("buttons_visible", "0");
      if (ga) {
        gtag("event", "Buttons", { event_label: "Visible" });
      }
    }
  }
}

function auto_grow(element) {
  element.style.height = "1pt";
  element.style.height = element.scrollHeight + "px";
}

function has_text(element, bol) {
  if (element.value != "" || bol) {
    var val = element.value;
    element.value = "";
    element.value = val;
    element.labels[0].className = "active text";
  } else {
    element.labels[0].className = "text";
  }
}

function updateChapterProgression() {
  succeeded_per_chapter = [];
  chapters.forEach((_) => {
    succeeded_per_chapter.push(0);
  });
  progression.forEach((question_id) => {
    for (
      i = 0;
      i < all_nb_of_questions && question_id != questions_content[i][0];
      i++
    ) {}
    if (!(i == all_nb_of_questions)) {
      succeeded_per_chapter[questions_content[i][1]] += 1;
    }
  });
  for (let i = 0; i < number_of_chapters; i++) {
    nb_qu_succeeded = succeeded_per_chapter[i];
    nb_qu_chap = questions_per_chapter[i];
    document.getElementById("chapter_progress_bar" + i).style.width =
      ((nb_qu_succeeded / nb_qu_chap) * 100).toString() + "%";
    document.getElementById("chapter_progression" + i).innerHTML =
      nb_qu_succeeded + "/" + nb_qu_chap;
  }
}

function show_overlay(name, bol, key = false) {
  if (document.getElementById("help_overlay").style.display == "") {
    if (bol == 1) {
      if (name == "suggestion") {
        document.getElementById("name").focus();
        document.getElementById("comment").value = "";
      }
      if (name == "chapters") {
        updateChapterProgression();
      }
      document.getElementById(name + "_overlay").style.visibility = "visible";
      document.getElementById("fab").style.opacity = 0;
      document.getElementById("fab_menu").style.opacity = 0;
      document.getElementById(name + "_dialog").style.transform =
        "translateX(0em)";

      if (key) {
        ga_action = "key";
      } else {
        ga_action = "click";
      }
      gtag("event", name, { event_category: "Menus", event_label: ga_action });
    } else {
      if (name != "correction") {
        document.getElementById(name + "_dialog").style.transform =
          "translateX(30em)";
      } else {
        document.getElementById(name + "_dialog").style.transform =
          "translateY(100%)";
        document.getElementById("correction_frame").src = "";
      }
      document.getElementById("fab").style.opacity = 1;
      document.getElementById("fab_menu").style.opacity = 1;
      document.getElementById(name + "_overlay").style.visibility = "hidden";
      if (name != "correction") {
        show_menus();
        document.getElementById("fab_input").checked = false;
      }
    }
  }
}

function send_comment() {
  qid = questions_content[questions[my_position][1]][0];
  timestamp = Date.now();
  name_input = document.getElementById("name").value;
  email = document.getElementById("mail").value;
  comment = document.getElementById("comment").value;

  var xmlhttprequest = new XMLHttpRequest();
  xmlhttprequest.open("POST", "submitsuggestion.php", true);
  var params = "qid=" + qid + "&timestamp=" + timestamp + "&name=" + name_input + "&comment=" + comment + "&email=" + email;
  xmlhttprequest.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  xmlhttprequest.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
      alert("Commentaire envoyé !");
    }
  }
  xmlhttprequest.send(params);

  show_overlay("suggestion", 0);
}

function show_menus() {
  if (document.getElementById("fab_input").checked) {
    document.getElementById("fab_menu").className = "shrink";

    if (document.getElementById("help_overlay").style.display == "block") {
      // trigger help overlay off
      document.getElementById("help_overlay").style.display = "";
      Array.from(document.getElementsByClassName("help")).forEach((element) => {
        element.style.display = "";
      });
      Array.from(document.getElementsByClassName("hidden_af")).forEach(
        (element) => {
          element.classList.remove("hidden_af");
        }
      );
    }
  } else {
    document.getElementById("fab_menu").className = "expand";
    gtag("event", "Opened menu", { event_category: "Menus" });
  }
}

function confirm_choice() {
  // get selected chapters
  var selected_chapters_temp = [];
  for (i = 0; i < number_of_chapters; i++) {
    if (document.getElementById("chap" + i).checked) {
      selected_chapters_temp.push(1);
    } else {
      selected_chapters_temp.push(0);
    }
  }

  if (selected_chapters_temp.includes(1)) {
    // if at least one chapter has been selected
    // save selected chapters to local storage
    localStorage.setItem(
      "selected_chapters_mp_" + discipline,
      selected_chapters_temp.toString()
    );

    gtag("event", "Selected chapters", { event_category: "Progression" });

    // reload everything
    selected_chapters = selected_chapters_temp;
    show_overlay("chapters", 0);
    document.getElementById("fab_menu").className = "shrink";
    init();
  } else {
    // if no chapters were selected, alert user and do nothing else
    alert("Veuillez sélectionner au moins un chapitre.");
  }
}

// UTILITIES
function set_chapter_menu() {
  selected_chapters.forEach((selected_chapter, i) => {
    document.getElementById("chap" + i).checked = selected_chapter;
  });
}

function get_questions() {
  questions = [];
  questions_content.forEach((question, question_nb) => {
    if (selected_chapters[question[1]]) {
      real_nb_of_questions += 1;
      if (!progression.includes(question[0])) {
        questions.push([question[1], question_nb]);
      } else {
        real_nb_questions_succeeded += 1;
      }
    }
  });
  nb_of_questions = questions.length;
}

// SWIPES
function swipes() {
  function unify(e) {
    return e.changedTouches ? e.changedTouches[0] : e;
  }
  let x0 = null;
  let y0 = null;
  function lock(e) {
    e.stopPropagation();
    x0 = unify(e).clientX;
    y0 = unify(e).clientY;
  }
  function move(e) {
    e.stopPropagation();
    if (x0 || x0 === 0) {
      var dx = unify(e).clientX - x0;
      var dy = unify(e).clientY - y0;
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        if (Math.abs(dx) > Math.abs(dy)) {
          if (Math.sign(-dx) > 0) {
            questionSucceeded((key = "swipe"));
          } else if (Math.sign(-dx) < 0) {
            nextQuestion(-1, false, "swipe");
          }
        } else {
          if (Math.sign(-dy) > 0) {
            questionFailed((key = "swipe"));
          }
        }
      }
    }
    x0 = null;
    y0 = null;
  }

  let m = document.getElementById("main");
  m.addEventListener("mousedown", lock, { passive: true });
  m.addEventListener("touchstart", lock, { passive: true });

  m.addEventListener("mouseup", move, { passive: true });
  m.addEventListener("touchend", move, { passive: true });
}

// RESET
function reset() {
  if (document.getElementById("help_overlay").style.display == "") {
    if (
      confirm(
        "Attention ! Vous êtes sur le point de réinitialiser la progression des chapitres sélectionnés. Voulez vous poursuivre ?"
      )
    ) {
      progression.forEach((id, nb) => {
        for (
          i = 0;
          i < all_nb_of_questions && id != all_questions[i][0];
          i++
        ) {}
        if (
          !i == all_nb_of_questions &&
          selected_chapters.includes(all_questions[i][1])
        ) {
          progression.splice(nb, 1);
        }
      });
      push_progression();
      document.getElementById("fab_menu").className = "shrink";

      gtag("event", "Progression reset", { event_category: "Progression" });

      init();
    }
  }
}

// CORRECTIONS
function displayCorrectionButton(q, which) {
  if (available_corrections.includes(q)) {
    document.getElementById("correction" + which).classList.add("exists");
  } else {
    document.getElementById("correction" + which).classList.remove("exists");
  }
}
function displayCorrectionTooltip(q) {
  if (available_corrections.includes(q)) {
    document.getElementById("correction_tooltip").innerHTML = "Correction";
  } else {
    document.getElementById("correction_tooltip").innerHTML =
      "Proposer une correction";
  }
}

function view_correction(allow_open = 1) {
  var qid = questions_content[questions[my_position][1]][0];
  if (available_corrections.includes(qid) && allow_open) {
    var iframe = document.getElementById("correction_frame");
    iframe.src = "";
    iframe.src = "corrections/" + qid + ".pdf#toolbar=0&view=FitH";
    show_overlay("correction", 1);
    gtag("event", "Opened correction", { event_category: "Corrections" });
  } else {
    window.open("correction/?q=" + qid, "_blank");
    gtag("event", "Opened correction form", { event_category: "Corrections" });
  }
}

// INIT
function modpos(n) {
  return (n + nb_of_questions) % nb_of_questions;
}

function on_load() {
  has_text(document.getElementById("name"), 0);
  has_text(document.getElementById("mail"), 0);
  document.getElementById("comment").value = "";

  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 13 && event.target.nodeName === "INPUT") {
      var form = event.target.form;
      var index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  });

  // button visibility cookies stuff
  buttons_visible = getCookieValue("buttons_visible");
  if (buttons_visible == "") {
    buttons_visible = 0;
  } else {
    buttons_visible = parseInt(buttons_visible);
  }
  show_buttons((ga = false));

  fetch_selected_chapters();
  swipes();
  init();
  showHelp_onload();

  gtag("event", "timing_complete", {
    name: "Done loading",
    value: Math.round(performance.now()),
    event_category: "Loading",
  });
}

function init() {
  my_position = 0;
  real_nb_questions_succeeded = 0;
  real_nb_of_questions = 0;
  keys_active = true;

  // Finds the amount of chapters
  number_of_chapters = questions_per_chapter.length;

  document.getElementById("fab_input").checked = false;

  // Selects the chapters
  if (selected_chapters.length <= 0) {
    selected_chapters = new Array(number_of_chapters).fill(true);
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

    for (i = 0; i < 8; i++) {
      var chap = questions[modpos(i - 2)][0];
      var q = questions[modpos(i - 2)][1];
      which = (i - 2 + 8) % 8;
      document.getElementById("question_" + which).innerHTML =
        questions_content[q][2];
      document.getElementById("question_chap_" + which).innerHTML =
        chapters[chap];
      displayCorrectionButton(questions_content[q][0], which);
    }

    nextQuestion(0);
  } else {
    // if there are no questions
    nothing_remains();
  }

  // deletes fireworks
  if (document.getElementById("fireworkscript") != null) {
    document.getElementById("fireworkscript").remove();
  }
  document.getElementById("canvasFireworks").style.display = "none";
}

function nothing_remains() {
  if (
    confirm(
      "Vous avez déjà réussi toutes les questions des chapitres sélectionnés. Voulez vous réinitialiser la progression de ces chapitres ? Dans la négative, sélectionnez plus de chapitres pour pouvoir continuer."
    )
  ) {
    // remove progression from selected chapters
    progression.forEach((id, nb) => {
      for (i = 0; i < all_nb_of_questions && id != all_questions[i][0]; i++) {}
      if (
        !i == all_nb_of_questions &&
        selected_chapters.includes(all_questions[i][1])
      ) {
        progression.splice(nb, 1);
      }
    });
    push_progression();

    // GA event
    gtag("event", "End - reset", { event_category: "Progression" });

    // Reload after progression reset
    init();
  } else {
    document.getElementById("progress_number").innerHTML =
      real_nb_questions_succeeded.toString() +
      "/" +
      real_nb_of_questions.toString() +
      " questions réussies";
    document.getElementById("progress").style.width = "100%";
    keys_active = false;

    gtag("event", "End - not reset", { event_category: "Progression" });
    easteregg1();
  }
}

// NEXT QUESTION
function nextQuestion(direction, failed = false, ga_bool = false) {
  if (direction < 0 && angle == 0) {
    return;
  }

  document.getElementById("cell_" + ((my_position - 1 + 8) % 8)).className =
    "carousel_cell";

  if (direction < 0 && ga_bool) {
    gtag("event", "Previous", {
      event_category: "Questions",
      event_label: ga_bool,
    });
  }

  if (
    my_position + direction >= nb_of_questions ||
    real_nb_of_questions <= real_nb_questions_succeeded
  ) {
    if (real_nb_of_questions > real_nb_questions_succeeded) {
      real_nb_of_questions = 0;
      real_nb_questions_succeeded = 0;
      get_questions();

      for (let i = nb_of_questions - 2; i > my_position + direction; i--) {
        const j =
          Math.floor(Math.random() * (i - my_position + direction)) +
          my_position +
          direction;
        const temp = questions[i];
        questions[i] = questions[j];
        questions[j] = temp;
      }
      for (i = 1; i < 5; i++) {
        var chap = questions[modpos(my_position + i)][0];
        var q = questions[modpos(my_position + i)][1];
        which = (angle + i) % 8;
        document.getElementById("question_" + which).innerHTML =
          questions_content[q][2];
        document.getElementById("question_chap_" + which).innerHTML =
          chapters[chap];
        displayCorrectionButton(questions_content[q][0], which);
      }
    } else {
      nothing_remains();
      return;
    }
  }

  my_position = modpos(my_position + direction);
  angle += direction;
  document.getElementById("progress_number").innerHTML =
    real_nb_questions_succeeded.toString() +
    "/" +
    real_nb_of_questions.toString() +
    " questions réussies";
  document.getElementById("progress").style.width =
    ((real_nb_questions_succeeded / real_nb_of_questions) * 100).toString() +
    "%";

  if (direction > 0) {
    var chap = questions[modpos(my_position + 5)][0];
    var q = questions[modpos(my_position + 5)][1];
    which = (angle + 5) % 8;
    if (buttons_visible) {
      previous = document.getElementById("previous_button");
      previous.style.opacity = 1;
      previous.children[0].style.cursor = "";
    }
  } else {
    var chap = questions[modpos(my_position - 2)][0];
    var q = questions[modpos(my_position - 2)][1];
    which = (angle + 8 - 2) % 8;
    if (angle == 0) {
      previous = document.getElementById("previous_button");
      previous.style.opacity = 0;
      previous.children[0].style.cursor = "default";
    }
  }
  document.getElementById("question_" + which).innerHTML =
    questions_content[q][2];
  document.getElementById("question_chap_" + which).innerHTML = chapters[chap];
  displayCorrectionButton(questions_content[q][0], which);

  if (failed) {
    document.getElementById("cell_" + ((angle - 1) % 8)).className =
      "failed carousel_cell";
  }

  qid = questions_content[questions[my_position][1]][0];
  if (progression.includes(qid)) {
    document.getElementById("question_succeeded").style.opacity = "";
  } else {
    document.getElementById("question_succeeded").style.opacity = "0";
  }
  displayCorrectionTooltip(qid);

  try {
    MathJax.typeset();
  } catch (_) {
    MathJax.typesetPromise();
  }
  document.getElementById("carousel").style.transform =
    "translateZ(-150em) rotateY(" + (45 * angle).toString() + "deg)";
}

function push_progression() {
  localStorage.setItem("progression_mp_" + discipline, progression.join(","));
}

function questionSucceeded(key = false) {
  var qid = questions_content[questions[my_position][1]][0];

  if (!progression.includes(qid)) {
    progression.push(qid);
    real_nb_questions_succeeded += 1;
    push_progression();
  }

  if (!key) {
    key = "click";
  }
  gtag("event", "Succeeded", { event_category: "Questions", event_label: key });

  nextQuestion(1);
}

function questionFailed(key = false) {
  var qid = questions_content[questions[my_position][1]][0];

  pos = progression.lastIndexOf(qid);
  if (pos != -1) {
    progression.splice(pos, 1);
    real_nb_questions_succeeded -= 1;
    push_progression();
  }

  if (!key) {
    key = "click";
  }
  gtag("event", "Failed", { event_category: "Questions", event_label: key });

  nextQuestion(1, true);
}

// KEYS
function keyDown(e) {
  chapters_overlay = document.getElementById("chapters_overlay").style
    .visibility;
  suggestion_overlay = document.getElementById("suggestion_overlay").style
    .visibility;
  correction_overlay = document.getElementById("correction_overlay").style
    .visibility;
  chapters_overlay_visibility =
    chapters_overlay == "hidden" || chapters_overlay == "";
  suggestion_overlay_visibility =
    suggestion_overlay == "hidden" || suggestion_overlay == "";
  correction_overlay_visibility =
    correction_overlay == "hidden" || correction_overlay == "";
  help_overlay_visi =
    document.getElementById("help_overlay").style.display == "";
  if (
    suggestion_overlay_visibility &&
    chapters_overlay_visibility &&
    keys_active &&
    help_overlay_visi &&
    correction_overlay_visibility
  ) {
    if (e == 13 || e == 39 || e == 32) {
      // down, right, enter, space
      questionSucceeded((key = "key"));
    } else if (e == 38) {
      // up
      questionFailed((key = "key"));
    } else if (e == 37) {
      // left
      nextQuestion(-1, false, "key");
    } else if (e == 67) {
      // c
      view_correction();
    }
  } else if (e == 27) {
    // echap
    if (!chapters_overlay_visibility) {
      show_overlay("chapters", 0, (key = true));
    } else if (!suggestion_overlay_visibility) {
      show_overlay("suggestion", 0, (key = true));
    } else if (!correction_overlay_visibility) {
      show_overlay("correction", 0, (key = true));
    } else {
      checkbox = document.getElementById("fab_input");
      if (checkbox.checked) {
        checkbox.checked = false;
        document.getElementById("fab_menu").className = "shrink";
      }

      gtag("event", "Menus closed", {
        event_category: "Menus",
        event_label: "key",
      });
    }
  } else if (e == 67 && !correction_overlay_visibility) {
    show_overlay("correction", 0, (key = true));
  }
}

// HELP OVERLAY
function showHelp(open = 1) {
  help_overlay_visi = document.getElementById("help_overlay").style.display;
  if (help_overlay_visi == "" && open) {
    // if overlay hidden

    gtag("event", "help", { event_category: "Menus", event_label: "click" });

    // open menu
    document.getElementById("fab_menu").className = "expand";

    // trigger overlay
    document.getElementById("help_overlay").style.display = "block";
    Array.from(document.getElementsByClassName("help")).forEach((element) => {
      element.style.display = "block";
    });
    Array.from(document.getElementsByClassName("tooltiptext")).forEach(
      (element) => {
        element.classList.add("hidden_af");
      }
    );
  } else {
    // close menu
    document.getElementById("fab_menu").className = "shrink";
    document.getElementById("fab_input").checked = false;

    // trigger overlay off
    document.getElementById("help_overlay").style.display = "";
    Array.from(document.getElementsByClassName("help")).forEach((element) => {
      element.style.display = "";
    });
    Array.from(document.getElementsByClassName("hidden_af")).forEach(
      (element) => {
        element.classList.remove("hidden_af");
      }
    );
  }
}

function showHelp_onload() {
  help_overlay_cookie = getCookieValue("help");
  if (help_overlay_cookie == "") {
    setCookie("help", "1");
    document.getElementById("fab_input").checked = true;
    showHelp();
  }
}
