// LOADER
var polyfill_script = document.createElement('script');
polyfill_script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
document.head.appendChild(polyfill_script);
var mathjax_script = document.createElement('script');
mathjax_script.async = true;
mathjax_script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
document.head.appendChild(mathjax_script);


// OPTIONS
window.MathJax = {
    loader: {
        load: [
            '[tex]/color',
            '[tex]/physics',
            '[tex]/ams'
        ]
    },
    tex: {
        packages: {
            '[+]': [
                'color',
                'physics',
                'ams'
            ]
        },
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)']
        ],
        color: {
            borderWidth: '1px'
        },
        macros: {
            textbf: ['{\\bf #1}', 1],
            emph: ['{\\bf #1}', 1],
            textit: ['{\\it #1}', 1],
            vv: '\\vec'
        }
    }
};