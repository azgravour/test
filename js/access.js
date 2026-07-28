// ============================================================
// MODE VITRINE — Verrou d'accès global à la mini-app.
// Le popup reste affiché pour la démonstration visuelle, mais
// aucune vérification réelle n'a lieu : toute saisie non vide est
// acceptée après un court délai simulé (effet "vérification en
// cours"). Rien n'est envoyé sur le réseau.
// ============================================================

let accessToken = null;

export function hasAppAccess() {
  return !!accessToken;
}

export async function submitGlobalPassword(password) {
  await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 400));
  accessToken = 'vitrine-demo-token';
  return true;
}
