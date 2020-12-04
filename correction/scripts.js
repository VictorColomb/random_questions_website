function onLoad() {
  // Interactive codemirror instance
  CodeMirror.fromTextArea((textarea = document.getElementById("code")), {
    mode: "stex",
    lineNumbers: true,
  });
}

function updatelabel() {
  var label = document.getElementsByTagName("LABEL")[0];

  var input = document.getElementById("file");
  var filename = input.value.split(/(\\|\/)/g).pop();
  var ext = filename.split(".").pop();

  if ((ext == "pdf" || ext == "tex")) {
    label.innerHTML = filename;
  } else {
    alert("Le fichier doit être un fichier .tex ou .pdf !");
    input.value = null;
    label.innerHTML = "Choisir un fichier";
    return;
  }
  if (input.files[0].size > 5242880) {
    // if filesize > 5MB
    alert("Le fichier ne doit pas faire plus de 5MB !");
    input.value = null;
    label.innerHTML = "Choisir un fichier";
  }
}
