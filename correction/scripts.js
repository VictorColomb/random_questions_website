// NAME TEXT INPUT
function has_text(element, bol) {
    if (element.value != '' || bol) {
        var val = element.value; element.value = ''; element.value = val;
        element.labels[0].className = 'active text';
    } else {
        element.labels[0].className = 'text';
    }
}


// ON LOAD
function onLoad() {
    // Interactive codemirror instance
    var code_textarea = CodeMirror.fromTextArea(document.getElementById('code'), {
        mode: 'stex',
        lineNumbers: true
    });

    has_text(document.getElementById('name'), 0);
}


// GA
function openedSpoiler(obj) {
    if (this.checked) {
        gtag('event', 'Opened spoiler', {'event_category':'Corrections'});
    }
}
