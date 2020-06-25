from glob import glob
from io import BytesIO
from os import chdir, mkdir, remove
from os.path import exists
from shutil import get_terminal_size, move
from subprocess import DEVNULL, STDOUT, Popen
from sys import argv

import sympy as sp


# Fetch questions (discard empty lines and comments)
def init_question_list(filename):
    temp_questions = []
    global questions, nb_questions
    try:
        with open(filename, 'r', encoding='utf-8-sig') as inp:
            for line in inp:
                temp_questions.append(line)
    except FileNotFoundError:
        print('No such file. Exiting...')
        input('Press ENTER to continue...')
        exit(1)
    line_idx = 0
    chapter_questions = ['Questions']
    while line_idx < len(temp_questions) - 1 and temp_questions[line_idx][:2] != '##' :
        line = temp_questions[line_idx]
        if line[0] != '#':
            for char in line[:-1]:
                if char != ' ':
                    chapter_questions.append(line[:-1])
                    nb_questions += 1
                    break
        line_idx += 1
    while line_idx < len(temp_questions) - 1:
        questions.append(chapter_questions)
        chapter_questions = [temp_questions[line_idx][3:].strip()]
        line_idx += 1
        while line_idx < len(temp_questions) - 1 and temp_questions[line_idx][:2] != '##':
            line = temp_questions[line_idx]
            if line[0] != '#':
                for char in line[:-1]:
                    if char != ' ':
                        chapter_questions.append(line[:-1])
                        nb_questions += 1
                        break
            line_idx += 1
    if temp_questions[-1][0] != '#' and temp_questions[-1] != '':
        for char in temp_questions[-1]:
            if char != ' ':
                chapter_questions.append(temp_questions[-1])
                nb_questions += 1
                break
    questions.append(chapter_questions)

    if questions[0] == ['Questions']:
        del(questions[0])


# Fetch input file and output folder from arguments or prompts
questions, nb_questions = [], 0

if len(argv) == 3:
    output_folder = argv[2]
    input_filename = argv[1]
    init_question_list(input_filename)
elif len(argv) < 1:
    print('Not enough arguments')
    print(f'Usage : {argv[0]} filename output_directory')
    exit(1)
else:
    print('Too many arguments')
    print(f'Usage : {argv[0]} filename output_directory')
    exit(1)



# Create output and temp folders
try:
    mkdir(output_folder)
except FileExistsError:
    pass
chdir(output_folder)


# Compile single question into ps byte streams
def on_latex(idx, exprr):
    global no_latex_errors
    # Assumes we are in the temp directory...

    exprrr = exprr.split(r'\\')

    ps_no = 0

    for expr in exprrr:
        f = BytesIO()
        try:
            sp.preview(expr, euler=True, preamble=r"\documentclass[border=2pt]{standalone}"
                       r"\usepackage[T1]{fontenc}"
                       r"\usepackage[utf8]{inputenc}"
                       r"\usepackage{amssymb}"
                       r"\usepackage{amsmath}"
                       r"\usepackage{lmodern}"
                       r"\usepackage{xcolor}"
                       r"\begin{document}"
                       r"\color{white}",
                       viewer="BytesIO", output="ps", outputbuffer=f)
        except RuntimeError:
            no_latex_errors += 1
            with open('errors.txt','a') as latex_error_output:
                print(f'# Question {idx}', exprr, sep='\n', file=latex_error_output)
            for file in glob('*.ps'):
                remove(file)
            return False
        f.seek(0)
        with open(f'{ps_no}.ps', 'wb') as ps_output:
            ps_output.write(f.read())
        f.close()
        ps_no += 1
    return True


# Convert ps files into single jpg
def ps_to_jpg(idx):
    # Assumes we are in the temp folder...

    # Concatenate all ps files into one jpg
    process = Popen(
        ['convert','-colorspace rgb','-background','none','-density','600','-append','*.ps',f'{idx}.png'],
        stdout = DEVNULL,
        stderr = STDOUT
    )
    process.wait()

    if process != 0:
        raise Exception('Fuck, convert ps to jpg did not work...\nDo you have ImageMagick installed ?')


    # Clear temp directory from ps files
    for file in glob('*.ps'):
        try:
            remove(file)
        except NotImplementedError:
            pass

columns = get_terminal_size(fallback=(40,24))[0]
no_latex_errors = 0
nb_processed = 0


corr_out_string = '\\documentclass[a4paper]{{article}}\n\\usepackage[T1]{{fontenc}}\n\\usepackage[utf8]{{inputenc}}\n\\usepackage{{lmodern}}\n\\usepackage{{amsmath,amssymb}}\n\\usepackage[top=3cm,bottom=2cm,left=2cm,right=2cm]{{geometry}}\n\\usepackage{{fancyhdr}}\n\\usepackage{{esvect,esint}}\n\\usepackage{{xcolor}}\n\\usepackage{{tikz}}\\usetikzlibrary{{calc}}\n\n\\parskip1em\\parindent0pt\\let\\ds\\displaystyle\n\n\\begin{{document}}\n\n\\pagestyle{{fancy}}\n\\fancyhf{{}}\n\\setlength{{\\headheight}}{{15pt}}\n\\fancyhead[L]{{{0}}}\\fancyhead[R]{{Question {1}}}\n\n% Énoncé\n\\begin{{center}}\n\t\\large{{\\boldmath{{\\textbf{{{2}}}}}}}\n\\end{{center}}\n\n% Correction\n\n\n\\end{{document}}\n'
corr_out_string_modify = '\t\\large{{\\boldmath{{\\textbf{{{0}}}}}}}\n'

def createCorrLatex(idx, latex_chap, latex_qu):
    with open(f'{idx}.bad.tex', 'w', encoding='utf-8') as output:
        output.write( corr_out_string.format(latex_chap, idx+1, latex_qu))
def modifyLatex(idx, latex_qu, bad=''):
    with open(f'{idx}{bad}.tex', 'r', encoding='utf-8-sig') as inp:
        latex_file = inp.readlines()
    latex_file[22] = corr_out_string_modify.format(latex_qu)
    with open(f'{idx}{bad}.tex', 'w', encoding='utf-8') as output:
        output.writelines(latex_file)
    if bad == '':
        compil_job = Popen(['pdflatex','-interaction=nonstopmode',f'{idx}.tex'], stdout=DEVNULL, stderr=STDOUT)
        compil_job.wait()
        remove(f'{idx}.log')
        remove(f'{idx}.aux')


i = 0
# Convert all questions in numbered jpg files
for ch_nb,chapter_questions in enumerate(questions):
    # get chapter name and questions, move to chapter folder
    chapter = chapter_questions[0]
    chapter_questions = chapter_questions[1:]
    chapter_outname = "%02d" % ch_nb + chapter
    try:
        mkdir(chapter_outname)
    except FileExistsError:
        pass
    chdir(chapter_outname)

    # fetch already existing questions
    try:
        with open('questions.txt', 'r', encoding='utf-8-sig') as already_questions_input:
            already_questions = already_questions_input.readlines()
        for j,al in enumerate(already_questions[:-1]):
            already_questions[j] = al[:-1]
    except FileNotFoundError:
        already_questions = []
    nb_already_questions = len(already_questions)

    for idx, question in enumerate(chapter_questions):
        # Progress bar
        progress_bar = f'Progress : |{"="*(i*30//nb_questions)}{" "*(30-i*30//nb_questions)}| {i*100//nb_questions}% - {i}/{nb_questions}'
        print(progress_bar, ' '*(columns-len(progress_bar)-1), sep='', end='\r')

        # if question has changed
        if idx >= nb_already_questions or already_questions[idx] != question:
            #increment counter
            nb_processed += 1

            if idx < nb_already_questions:
                # change question
                already_questions[idx] = question
                if exists(f'{idx}.tex'):
                    modifyLatex(idx, question)
                elif exists(f'{idx}.bad.tex'):
                    modifyLatex(idx, question, '.bad')
                else:
                    createCorrLatex(idx, chapter, question)
            else:
                # append question
                already_questions.append(question)
                createCorrLatex(idx, chapter, question)

            # remove previous question image
            try:
                remove(f'{idx}.png')
            except FileNotFoundError:
                pass

            # Create ps files from expression
            generate_images = on_latex(idx, question)

            # ps files to a single concatenated jpg file
            if generate_images:
                ps_to_jpg(idx)

        # increment progress counter
        i += 1

    # write questions
    with open('questions.txt', 'w', encoding='utf-8') as output:
        output.writelines('\n'.join(already_questions))

    # Back to output_folder
    chdir('..')



progress_bar = f'Progress : |{"="*30}| 100% - {nb_questions}/{nb_questions}'
print(progress_bar, ' '*(columns-len(progress_bar)-1), sep='')

if no_latex_errors:
    if no_latex_errors > 1:
        latex_str = f'\nThere were {no_latex_errors} latex compilation errors.\nThe corresponding questions have been recorded to errors.txt'
    else:
        latex_str = '\nThere was one latex compilation error.\nThe corresponding question has been recorded to errors.txt'
else:
    latex_str = ''
print(f'Successfully rendered {nb_processed-no_latex_errors} questions.{latex_str}')

if len(argv) == 1:
    input("Press ENTER to continue...")
