# TODO - Changement couleurs site (blanc + bleu)

- [ ] Analyser où les couleurs “primary/accent” et gradients sont utilisés (tailwind classes)
- [x] Mettre à jour `frontend/tailwind.config.js` : redéfinir la palette `primary` en bleu + ajuster `accent` (optionnel)

- [x] Mettre à jour les couleurs CSS personnalisées dans `frontend/src/index.css` (scrollbar, selection, etc.) si elles dépendent de `primary`

- [x] Remplacer les occurrences de couleurs statiques (ex: `from-purple-...`, `via-purple-...`, `to-purple-...`, `bg-blue-...`) si nécessaires pour harmoniser “blanc + bleu”

- [x] Lancer le build/dev pour vérifier absence d’erreurs Tailwind

---

# TODO - Correction enregistrement produit

- [ ] Modifier backend DTO (CreateProductDto / UpdateProductDto) pour convertir price/stock depuis JSON (class-transformer) et éviter NaN.
- [ ] Sécuriser frontend AdminProducts.jsx : empêcher l’envoi de NaN pour price/stock avant appel API.
- [ ] Tester : création produit + modification produit + vérifier que la liste se recharge et que le bloc error ne s’affiche plus.



