const discipline = "physique";
const questions_per_chapter = [39, 28, 59, 16, 54, 50, 21];
const chapters = ["Electrocinétique", "Mécanique", "Electromagnétisme", "Optique", "Thermodynamique", "Chimie", "Mécanique quantique"];
const questions_content = [[549, 0, "Définition convention réceptrice"], [550, 0, "Définition convention génératrice"], [551, 0, "Puissance consommée par un dipôle"], [552, 0, "Graphe $U-I$ d’une résistance"], [553, 0, "Graphe $U-I$ d’une source idéale de tension"], [554, 0, "Graphe $U-I$ d’une source idéale de courant"], [555, 0, "Définition d’une source réelle de courant "], [556, 0, "Définition d’une source réelle de tension"], [557, 0, "Loi des noeuds"], [558, 0, "Diviseur de tension"], [559, 0, "Diviseur de courant"], [560, 0, "Théorème d’équivalence entre une source réelle de courant et une source réelle de tension"], [561, 0, "Théorème de superposition"], [562, 0, "Théorème de Thévenin"], [563, 0, "HP: Théorème de Millman"], [564, 0, "Définition ARQP"], [565, 0, "Définition circuit linéaire"], [566, 0, "Définition de la stabilité, de la stabilité large et de l’instabilité d’un système. Condition sur les pôles de la fonction de transfert"], [567, 0, "Équations réelles $U-I$ d’une résistance, d’une source réelle de courant, d’une source réelle de tension, d’un condensateur, d’une inductance"], [568, 0, "Équations complexes $\\underline{U}-\\underline{I}$ d’une résistance, d’une source réelle de courant, d’une source réelle de tension, d’un condensateur, d’une inductance"], [569, 0, "Définition grandeur efficace"], [570, 0, "Définition puissance complexe électrocinétique, lien avec la puissance moyenne"], [571, 0, "Définition du gain, de l’impédance d’entrée, de l’impédance de sortie d’un quadripôle"], [572, 0, "Étude $\\underline{H}=A$ pour $A>0$"], [573, 0, "Étude de $\\underline{H}=jx$"], [574, 0, "Étude de $\\underline{H}=\\dfrac{1}{jx}$"], [575, 0, "Étude de $\\underline{H}=1+jx$"], [576, 0, "Étude de $\\underline{H}=\\dfrac{1}{1+jx}$"], [577, 0, "Étude d’un passe-bas du deuxième ordre"], [578, 0, "Étude d’un passe-bande"], [579, 0, "Théorème de développement en série de Fourier"], [580, 0, "Transformée de Fourier d’un signal"], [581, 0, "Égalité de Parseval"], [582, 0, "Filtrage d’une série de Fourier"], [583, 0, "Montage dérivateur sur série de Fourier"], [584, 0, "Montage intégrateur sur série de Fourier"], [585, 0, "Montage passe-bande sur série de Fourier"], [586, 0, "Critère de Shannon"], [587, 0, "Graphe $U-I$ d’une source réelle de tension"], [588, 1, "Définition nabla, gradient, divergence, rotationnel, laplacien scalaire, laplacien vectoriel"], [589, 1, "Théorèmes d’Ostrogradski, de Stokes et du gradient"], [590, 1, "Théorèmes du rotationnel et de la divergence"], [591, 1, "Expressions de $\\vec{\\mathrm{grad}}\\,(fg)$, $\\mathrm{div}\\,(f\\vec{u})$, $\\vec{\\mathrm{rot}}\\,(f\\vec{u})$ et de $\\mathrm{div}\\,(\\vec{A} \\wedge \\vec{B})$"], [592, 1, "Gradient en coordonnées cartésiennes, cylindriques et sphériques"], [593, 1, "Hypothèse de la mécanique galiléenne"], [594, 1, "Définition des vecteurs vitesse et accélération dans un repère"], [595, 1, "Formule de dérivation composée, définition du vecteur rotation"], [596, 1, "Trièdre de Frenet"], [597, 1, "Composition des vitesses et des accélérations"], [598, 1, "Définition de la quantité de mouvement et de l’énergie cinétique d’un point matériel dans un repère"], [599, 1, "Lois de Newton (3)"], [600, 1, "Principe fondamental de la dynamique dans un référentiel non galiléen"], [601, 1, "Définition et théorème du moment cinétique"], [602, 1, "Définition puissance et travail d’une force dans un repère"], [603, 1, "Théorème de l’énergie cinétique"], [604, 1, "Définition force conservative"], [605, 1, "Force et énergie potentielle: poids, force gravitationnelle, force électrique, force d’un ressort, force d’entraînement"], [606, 1, "Définition énergie mécanique dans un repère"], [607, 1, "Théorème de l’énergie mécanique"], [608, 1, "Énergie mécanique d’un corps en orbite elliptique dans un champ de force central"], [609, 1, "Définition centre d’inertie d’un système de points matériels"], [610, 1, "Définition moment d’inertie d’un solide"], [611, 1, "Définition quantité de mouvement, moment cinétique et énergie cinétique d’un système de points matériels dans un référentiel"], [612, 1, "Théorèmes du centre d’inertie, du moment cinétique et de l’énergie cinétique"], [613, 1, "Lois de Coulomb pour le contact entre deux solides (2)"], [614, 1, "Bras de levier"], [615, 1, "Théorème du moment d’inertie"], [616, 2, "Formule du champ électrique volumique"], [617, 2, "Formule du potentiel électrique volumique"], [618, 2, "Théorème de Gauss"], [619, 2, "Circulation du champ électrique"], [620, 2, "Loi de Poisson"], [621, 2, "Analogie électrostatique/gravitation"], [622, 2, "Définition du moment dipolaire électrique"], [623, 2, "Potentiel dipolaire asymptotique"], [624, 2, "Force agissant sur un dipôle"], [625, 2, "Énergie potentielle électrostatique"], [626, 2, "Énergie potentielle d’un dipôle dans un champ électrique"], [627, 2, "Densité d’énergie électrostatique"], [628, 2, "Relations de passage du champ électrique"], [629, 2, "Théorème de Coulomb"], [630, 2, "Définition de la densité de courant"], [631, 2, "Définition de l’intensité du courant électrique"], [632, 2, "Conservation de la charge en ARQP"], [633, 2, "Loi d’Ohm locale pour un conducteur"], [634, 2, "Définition de la capacité"], [635, 2, "Travail reçu par un condensateur"], [636, 2, "Énergie stockée dans un condensateur"], [637, 2, "Valeur de $\\mu_0$"], [638, 2, "Théorème d’Ampère"], [639, 2, "Champ sur l’axe d’une spire"], [640, 2, "Définition du moment dipolaire magnétique"], [641, 2, "Composante du champ créé par un moment dipolaire électrique selon $u_r$"], [642, 2, "Composante du champ créé par un moment dipolaire électrique selon $u_\\theta$"], [643, 2, "Force de Lorentz"], [644, 2, "Densité de forces de Laplace"], [645, 2, "Couple exercé sur un dipôle électrique"], [646, 2, "Couple exercé sur un dipôle magnétique"], [647, 2, "Equations de Maxwell avec noms"], [648, 2, "Conservation de la charge (cas général)"], [649, 2, "Densité de puissance électromagnétique"], [650, 2, "Définition du vecteur de Poynting"], [651, 2, "Densité d’énergie électromagnétique"], [652, 2, "Règle de calcul sur les ondes (convention électronicienne): $\\mathrm{div}\\,\\vec f$, $\\vec{\\mathrm{grad}}\\,f$, $\\vec{\\mathrm{rot}}$ $\\vec f$, $\\Delta\\,f$ et $\\vec\\Delta\\,\\vec f$"], [653, 2, "Relation de dispersion dans le vide pour une OPPMH"], [654, 2, "Relation de structure d’une OPPMH électromagnétique dans le vide"], [655, 2, "Définition du vecteur de Poynting complexe"], [656, 2, "Lien Poynting - Poynting complexe"], [657, 2, "Vitesse de phase"], [658, 2, "Vitesse de groupe"], [659, 2, "Relations de Heisenberg"], [660, 2, "Champ magnétique dans une bobine"], [661, 2, "Propagation d’une onde EM dans un conducteur"], [662, 2, "Propagation d’une onde EM dans un plasma non collisionnel"], [663, 2, "Modèle de Drude"], [664, 2, "RMN"], [665, 2, "Effet Hall"], [666, 2, "Flux magnétique auto-induit"], [667, 2, "Énergie stockée dans une bobine"], [668, 2, "Flux magnétique et mutuelle inductance"], [669, 2, "Loi de Faraday"], [670, 2, "Puissance des forces de Laplace en induction"], [671, 2, "Approximations du rayonnement (3)"], [672, 2, "Expression de la capacité d’un condensateur plan en fonction de la surface et de l’épaisseur"], [673, 2, "Relation de dispersion d’un plasma non collisionnel"], [674, 2, "Relation de passage du champ magnétique"], [675, 3, "Définition de la vergence"], [676, 3, "Formules du grandissement pour une lentille (4)"], [677, 3, "Formules de conjugaison de Newton"], [678, 3, "Formules de conjugaison de Descartes"], [679, 3, "Définition du chemin optique"], [680, 3, "Différence de marche et interfrange pour les trous d’Young"], [681, 3, "Différence de marche et interfrange pour les trous d’Young avec lentille de projection"], [682, 3, "Définition de l’ordre d’interférence"], [683, 3, "Critère de brouillage temporel et spatial"], [684, 3, "Définition du contraste "], [685, 3, "Différences entre division du front d’onde et division d’amplitude"], [686, 3, "Différence de marche pour un Michelson monté en lame d’air"], [687, 3, "Différence de marche pour un Michelson monté en coin d’air"], [688, 3, "Condition d’interférences constructives d’un réseau"], [689, 3, "Lien entre le déphasage et la différence de marche "], [690, 3, "Définition pouvoir de résolution"], [691, 4, "Travail des forces de pression"], [692, 4, "Définition système fermé, système isolé"], [693, 4, "Définition état thermodynamique, état thermodynamique d’équilibre, équilibre mécanique stable"], [694, 4, "Définition transformation quasi-statique"], [695, 4, "Définition transformation mécaniquement réversible"], [696, 4, "Définition transformation isochore, monobare, isobare, isotherme"], [697, 4, "Premier principe de la thermodynamique (3 propriétés)"], [698, 4, "Détente de Joule Gay-Lussac"], [699, 4, "Définition enthalpie"], [700, 4, "Définition des capacités calorifiques à volume constant et à pression constante pour un gaz parfait"], [701, 4, "Relation de Mayer"], [702, 4, "Définition indice adiabatique $\\gamma$, expression de $C_v$ et $C_p$ en fonction de $\\gamma$"], [703, 4, "Lien entre $k_B$, $R$ et $\\mathcal{N}_A$"], [704, 4, "Valeur de $\\gamma$ et de $c_{v,n}$ pour un gaz monoatomique, diatomique"], [705, 4, "Valeur de $C_v$ et $C_p$ pour une phase condensée"], [706, 4, "Premier principe industriel"], [707, 4, "Détente de Joule-Thompson"], [708, 4, "Définition processus réversible"], [709, 4, "Second principe de la thermodynamique (3 propriétés)"], [710, 4, "Identités thermodynamiques"], [711, 4, "Valeur de d$S$ pour une transformation quasi-statique mécaniquement réversible"], [712, 4, "Inégalité de Clausius"], [713, 4, "Définition entropie d’échange, de création"], [714, 4, "Lois de Laplace"], [715, 4, "Variation de $S$ pour  une phase condensée"], [716, 4, "Équations sur un cycle  d’une machine thermique ditherme"], [717, 4, "Rendement moteur ditherme, rendement de Carnot"], [718, 4, "Efficacité d’un réfrigérateur et  d’une pompe à chaleur, efficacité de Carnot"], [719, 4, "Impossibilité du moteur monotherme"], [720, 4, "Définition point critique"], [721, 4, "Chaleur latente massique"], [722, 4, "Théorème des moments"], [723, 4, "Lien entre une grandeur et son titre massique"], [724, 4, "Lien entropie - chaleur latente"], [725, 4, "Définition conduction, convection, rayonnement"], [726, 4, "Définition équilibre thermodynamique local"], [727, 4, "Valeur de la densité de flux de convection"], [728, 4, "Loi de Fourier pour la conduction"], [729, 4, "Définition flux de conduction, de convection"], [730, 4, "Equation de la chaleur, démonstration monodimensionnelle"], [731, 4, "Loi de Newton pour  un échange conducto-convectif"], [732, 4, "Analogie électrocinétique/diffusion thermique"], [733, 4, "Expression locale de l’équilibre hydrostatique"], [734, 4, "Expression locale de l’équilibre hydrostatique dans un champ de pesanteur uniforme pour un fluide homogène"], [735, 4, "Poussée d’Archimède"], [736, 4, "Équilibre d’une atmosphère isotherme"], [737, 4, "Hypothèses de la théorie cinétique des gaz (3)"], [738, 4, "Valeur de l’intégrale de Gauss"], [739, 4, "Définition fonction de partition $Z$"], [740, 4, "Moyenne énergétique,  moyenne énergétique quadratique et écart-type énergétique en fonction de $Z$"], [741, 4, "Lien entre écart-type énergétique et $C_v$"], [742, 4, "Théorème d’équirépartition de Boltzmann et condition d’application"], [743, 4, "Valeur de $k_B$"], [744, 4, "$\\emph{HP:}$ Loi de Fick"], [745, 5, "Définition grandeur molaire partielle"], [746, 5, "Théorème d’Euler"], [747, 5, "Définition fraction molaire"], [748, 5, "Loi de Dalton"], [749, 5, "Définition enthalpie libre"], [750, 5, "Définition potentiel chimique"], [751, 5, "Expression de d$G$ en fonction, entres autres, des $\\mu _i$"], [752, 5, "Définition grandeur standard"], [753, 5, "Valeur de $\\mu _i$ en fonction de l’activité"], [754, 5, "Activités d’un gaz parfait, d’un mélange de gaz parfaits, d’un mélange idéal de solide ou de liquide, d’un solide ou d’un liquide pur, d’un solvant, d’un soluté"], [755, 5, "Inéquation sur $\\Delta G$ pour une transformation spontanée d’un corps pur"], [756, 5, "Relation de Clapeyron"], [757, 5, "Définition de l’avancement d’une réaction"], [758, 5, "Définition grandeur de réaction"], [759, 5, "Lien entre $\\Delta _rU$ et $\\Delta _rH$"], [760, 5, "Lien entre $\\Delta _rG$, $\\Delta _rH$ et $\\Delta _rS$"], [761, 5, "Définition grandeur standard de réaction"], [762, 5, "Première loi de Kirschoff"], [763, 5, "Deuxième loi de Kirschoff"], [764, 5, "Relations de Helmholtz"], [765, 5, "Loi de Hess"], [766, 5, "Troisième principe de la thermodynamique"], [767, 5, "Variation d’une grandeur extensive lors d’une réaction"], [768, 5, "Relation entre $\\Delta _rG$ et d$\\xi$ à pression et température fixée"], [769, 5, "Définition constante d’équilibre"], [770, 5, "Définition quotient de réaction"], [771, 5, "Relation entre $\\Delta _rG$, $Q_r$ et $K{\\circ}$"], [772, 5, "Sens d’une réaction en fonction de $Q_r$ et de $K^{\\circ}$"], [773, 5, "Relation de van’t Hoff"], [774, 5, "Définition variance"], [775, 5, "Loi de van’t Hoff"], [776, 5, "Loi de Le Chatelier"], [777, 5, "Formule de Nernst"], [778, 5, "Potentiels standards du calomel saturé et des couples $O_2/H_2O$ et $H^+/H_2$"], [779, 5, "Valeur de $K^\\circ$ en fonction des potentiels standards et du nombre d’électrons échangés"], [780, 5, "Réaction sur une anode/une cathode, orientation canonique du courant et signe sur une anode/une cathode"], [781, 5, "Valeur de $I$ en fonction de $v$ dans une électrode"], [782, 5, "Définition de $j$ et de $v_s$ dans une électrode"], [783, 5, "Principe expérimental du relevé d’une courbe intensité-potentiel"], [784, 5, "Définition surtension cathodique/anodique"], [785, 5, "Possibilités de transfert de matière autour d’une électrode"], [786, 5, "Surtensions anodique et cathodique de l’eau"], [787, 5, "Définition potentiel mixte d’une solution"], [788, 5, "Valeur de $\\Delta _rG$ en fonction de la différence de potentiel à courant nul"], [789, 5, "Condition de fonctionnement d’une électrolyse"], [790, 5, "Définition rendement faradique d’une électrolyse"], [791, 5, "Définition de la corrosion et domaines d’immunité, de corrosion et de passivité"], [792, 5, "Convention pour l’existence de la corrosion humide"], [793, 5, "Valeur de la force électromotrice d’une pile en fonction des potentiels électriques et des surtensions"], [794, 5, "Valeur de $F$"], [795, 6, "Relations d’Einstein pour les photons"], [796, 6, "Énergie d’un photon en fonction de $p$"], [797, 6, "Relations de Louis de Broglie pour les particules"], [798, 6, "Énergie d’une particule libre en fonction de $p$"], [799, 6, "Relation de dispersion de de Broglie"], [800, 6, "Valeur de $h$ et de $\\hbar$"], [801, 6, "Condition de traitement quantique d’une particule"], [802, 6, "Action d’un électron"], [803, 6, "Densité de probabilité de présence"], [804, 6, "Équation de Schrödinger pour une particule dans un champ de force"], [805, 6, "Définition courant de probabilité "], [806, 6, "Équation de conservation du courant de probabilité"], [807, 6, "Équation de dispersion pour un potentiel uniforme"], [808, 6, "Comparaison $\\Delta x \\Delta p_x$ et $\\hbar$"], [809, 6, "Lien entre $\\lambda$, $h$ et $p$ pour une particule"], [810, 6, "Discontinuité de $V$ et continuité de $\\varphi$ et $\\dfrac{\\mathrm{d}\\varphi}{\\mathrm{d}x}$"], [811, 6, "Valeur de $\\vec{j}$ si $E>V$ et si $E<V$, pour une marche de potentiel"], [812, 6, "Coefficients de transmittance et de réflexion"], [813, 6, "Niveaux d’énergie de l’atome d’hydrogène"], [814, 6, "Équation de Schrödinger pour une particule stationnaire dans un champ de force"], [815, 6, "Valeur de $\\psi (\\vec{r},t)$ en fonction de $\\varphi (\\vec{r})$ et de $E_n$ pour une particule stationnaire"]];
const available_corrections = [549, 550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564, 565, 566, 567, 568, 569, 570, 571, 572, 573, 574, 575, 576, 577, 578, 579, 580, 581, 582, 583, 584, 585, 586, 587, 588, 589, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 635, 636, 637, 638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, 650, 651, 652, 653, 654, 655, 656, 657, 658, 659, 660, 661, 662, 663, 664, 665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678, 679, 680, 681, 682, 683, 684, 685, 686, 687, 688, 689, 690, 691, 692, 693, 694, 695, 696, 697, 698, 699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728, 729, 730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 741, 742, 743, 744, 745, 746, 747, 748, 749, 750, 751, 752, 753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 763, 764, 765, 766, 767, 768, 769, 770, 771, 772, 773, 774, 775, 776, 777, 778, 779, 780, 781, 782, 783, 784, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815];