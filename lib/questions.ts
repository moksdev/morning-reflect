export const questions = [
  "Qu'est-ce qui te rend vraiment vivant·e?",
  "Si tu n'avais pas peur, que ferais-tu aujourd'hui?",
  "Quelle vérité évites-tu d'affronter depuis trop longtemps?",
  "De quoi as-tu le plus besoin en ce moment — et pourquoi ne te l'accordes-tu pas?",
  "Qu'est-ce que tu regretterais de ne pas avoir fait si tu regardes ta vie dans 10 ans?",
  "À qui dois-tu des excuses? Et pourquoi hésites-tu encore?",
  "Qu'est-ce que tu portes pour les autres qui n'est pas le tien à porter?",
  "Quel serait ton conseil à toi-même il y a cinq ans?",
  "Qu'est-ce qui te manque que tu n'oses pas nommer?",
  "Comment serais-tu différent·e si personne ne te regardait?",
  "Quelle habitude te coûte plus qu'elle ne t'apporte?",
  "Qu'est-ce que tu appelles 'trop tard' alors que ce ne l'est peut-être pas?",
  "Quelle partie de toi ignores-tu depuis longtemps?",
  "Si tu devais choisir une seule valeur pour guider ta journée, laquelle serait-ce?",
  "Qu'est-ce que la solitude te révèle sur toi-même?",
  "Qu'est-ce que tu cherches dans les autres que tu pourrais te donner à toi-même?",
  "Quelle est la dernière fois où tu as été pleinement présent·e?",
  "De quoi as-tu besoin de lâcher prise?",
  "Qu'est-ce que tu appelles 'bonheur'?",
  "Quelle question refuses-tu de te poser?",
  "Si ta vie était un message, que dirait-il?",
  "Qu'est-ce qui mérite vraiment ton attention aujourd'hui?",
  "Comment traiterais-tu un ami qui vit ce que tu vis en ce moment?",
  "Qu'est-ce qui t'émerveille encore?",
  "Quelle frontière dois-tu poser et n'as pas encore posée?",
  "Qu'est-ce que tu ferais si le succès était garanti?",
  "Qu'est-ce qui définit qui tu es, en dehors de ce que tu fais?",
  "Qu'est-ce que tu as appris sur toi cette semaine?",
  "Qu'est-ce que tu n'arrives pas à pardonner?",
  "Si tu n'avais qu'une seule journée devant toi, comment la vivrais-tu?",
  "Quel silence en toi attend d'être entendu?",
  "Qu'est-ce que tu appelles 'réussite'?",
  "Quand t'es-tu senti·e le plus libre?",
  "Qu'est-ce qui t'ancre quand tout vacille?",
  "Quel mensonge te répètes-tu pour te protéger?",
  "À quoi ressemblerait ta journée idéale — et pourquoi ne la crées-tu pas?",
  "Qu'est-ce que tu gardes secret et qui mériterait d'être dit?",
];

export function getDailyQuestion(): string {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return questions[dayOfYear % questions.length];
}

export function getQuestionIndex(): number {
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dayOfYear % questions.length;
}
