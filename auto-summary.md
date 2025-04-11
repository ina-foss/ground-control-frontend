# Résumé automatique

Utilisation du composant Primevue [Carousel](https://Primevue.org/carousel)

## Architecture du json

### Entrée

```json
[
  {
    // Peuvent etre retrouvé avec le topicId 
    tcin : '00.00.15:000',
    tcout: '00.00.20:000',
    data: {
      topicId : 2,
      text: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ']
      algos: [ 'whisper', 'whisper small'] // Optionel ?
    }
  }
]
```

### Sortie

Comme pour la selection de transcriptions, on créé un nouveau object de 0 en accumulant les différents résumés selectionnés par l'user.
Le fichier se suffit a lui-meme donc tcin et tcout compris, voir metadonnées des topics.

```json
[
  {
    tcin : '00.00.15:000',
    tcout: '00.00.20:000',
    data: {
      topicId : 2,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      algos:  'whisper'
    }
  }
]
```

## Refacto du composant [AtomTranscripton](./components/atoms/AtomTrancription.vue)

- Ajouter l'ID du topic en props optionel ou partir du principe que 1er resumé = 1er topic visible -> ajout d'un props `index`
- Si un ID est renseigné ou si on passe l'affichage en mode "Résumé", afficher le titre du topic
- Afficher les transcrptions disponible en colonne plutot qu'en ligne (+ de place)
- Gérer un tableau `algos` vide et afficher "version 1 " à la place
- Traduire tous les textes du composant en francais



## Question 

#### Dans quel ordre est-ce que les résumés doivent-ils être dans le ficher d'input ?
  deja ordonnés dans l'ordre des topics de la transcrption ? 
  trie en frontend au cas ou ?  

#### Comment on gere la continuité entre 2 steps Segmentation -> Résumé Auto

#### Timecode a coté du nom du topic vraiment utile ?

#### Passer au prochain topic automatiquement après avoir validé le précédent ?


# A Faire 

#### Comment j'organise les fonctions normallement gérées pas molecule-transcriptions ?
- Je recopie ? 
- Est ce que je refais un fichier molecule juste pour cette etape ?

#### Créer la nouvelle step dans le back 

