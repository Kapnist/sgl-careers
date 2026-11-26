# Rapport de projet — Refonte de l'offre SGL « Web Developer – IT Assistant »

*État au 26 novembre 2026, dernier commit poussé : `79d3ff5`.*

## Objectif

Refonte responsive, optimisée et bilingue (EN/FR) de la page d'offre d'emploi
<https://www.sgl.com/careers-Web%20Developer%20-%20IT%20Assistant.html>, à partir du texte
et des images de la page d'origine. Le site est présenté comme un **concept non affilié à SGL**.

Dépôt (privé) : <https://github.com/Kapnist/sgl-careers>

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Page anglaise (contenu d'origine), données JobPosting |
| `fr.html` | Page française (traduction non officielle, fr-CA), données JobPosting traduites |
| `css/styles.css` | Styles partagés par les deux pages |
| `js/main.js` | Menu mobile et mémorisation de la langue choisie |
| `images/` | Images reprises du site d'origine (bannières, fond, icône PDF, favicon) |
| `apercu-mobile.png` | Aperçu 2x en cadres de téléphone, affiché dans le README |

## Ce qui a été fait

1. **Refonte** : HTML sémantique, mise en page en cartes, colonne « Apply » fixe sur desktop,
   compétences en trois cartes avec étiquettes, impression propre.
2. **Responsive** : typographie et espacements fluides (`clamp()`), testé de 320 à 1920 px sans
   débordement horizontal. Menu hamburger sous 1080 px, bouton « Apply » fixé en bas sur mobile,
   cibles tactiles ≥ 44 px, encoche iPhone et mode paysage gérés. Bannières toujours affichées en
   entier, limitées à 1280 px avec un fond flouté au-delà.
3. **Accessibilité** :
   - lien d'évitement, focus visible, textes alternatifs, Échap pour fermer le menu ;
   - vert principal foncé de #6C9536 (3,51:1) à **#4A731D (5,58:1)** pour respecter WCAG AA ;
   - les ancres (`#apply`, `#main`) s'arrêtent sous l'en-tête fixe.
4. **Bilingue** :
   - sélecteur EN | FR dans l'en-tête ;
   - un navigateur en français est redirigé vers `fr.html` lors de la première visite ;
   - le choix explicite du visiteur est mémorisé et prime sur la redirection.
5. **SEO** : meta descriptions, JobPosting sur les deux pages, `hreflang` et `canonical` en
   adresses complètes (`https://kapnist.github.io/sgl-careers/…`).
6. **Mentions** : « Concept redesign — not affiliated with SGL » dans le pied de page, et
   « Traduction française non officielle » sur la page française.

## Points ouverts

- [ ] **Ligne « © Sander Geophysics Ltd. » du pied de page** : elle contredit la mention de
      non-affiliation. À reformuler (par ex. « Job posting content © Sander Geophysics Ltd. »)
      ou à supprimer. Décision en attente.
- [ ] **GitHub Pages** : pas encore activé, donc les adresses `kapnist.github.io` répondent 404.
      L'activation demande un dépôt public sur un compte gratuit
      (Settings → Pages → branche `main`).
- [ ] **JobPosting** : il manque `datePosted` (exigé par Google Jobs) et `validThrough`
      (recommandé). Ces dates ne figurent pas dans l'offre d'origine, il faut les fournir.
- [ ] **`employmentType: FULL_TIME`** : c'est une supposition, l'offre d'origine ne le précise
      pas. À confirmer ou retirer.
- [ ] **Navigation** : les liens du menu mènent encore à l'ancien site sgl.com, qui n'est pas
      responsive. Piste : refaire la liste des offres (`careers.html`), puis les autres pages.
- [ ] **Limites connues** :
      - textes « CAREERS » et « mapping your potential » intégrés aux images, donc en anglais ;
      - PDF de l'offre disponible en anglais seulement ;
      - images sources de 800 px, à remplacer par de plus grandes pour des bannières nettes sur
        grand écran.

## Reprendre le travail

```bash
cd C:\Users\kapni\sgl-careers
git pull
```

Pour tester sur mobile : ouvrir `index.html` dans Edge ou Chrome, puis F12 et Ctrl+Shift+M.
Le navigateur étant en français, la page anglaise redirige vers `fr.html` : cliquer sur **EN**
pour revenir à l'anglais (le choix est mémorisé).
