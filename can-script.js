// Créer une variable dans laquelle sera stockée la base de données
var products;

// récupération de la base de donnée et si la récupération est réussie alors
//lancer la fonction d'initialisation, autrement avertir de l'erreur
fetch('products.json').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      products = json;
      initialize();
    });
  } else {
    console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
  }
});

// prépare les variables importante et lance la première fonction une fois finie
function initialize() {
  // Récupère tous les éléments à manipuler
  var category = document.querySelector('#category');
  var searchTerm = document.querySelector('#searchTerm');
  var searchBtn = document.querySelector('button');
  var main = document.querySelector('main');

  // Garde en mémoire la dernière saisie de catégorie
  var lastCategory = category.value;
  // Aucune recherche n'a été tapée
  var lastSearch = '';

  // Déclaration de la liste intermédiaire et de la liste finale
  // qui seront utilisée lors de l'affichage
  var categoryGroup;
  var finalGroup;

  // D'abord, on affiche l'intégralité des produits par défaut
  finalGroup = products;
  updateDisplay();

  // On les remets à 0 pour plus tard
  categoryGroup = [];
  finalGroup = [];

  // Lorsque le bouton recherche est cliqué, lancer le tri de catégorie
  searchBtn.onclick = selectCategory;

  function selectCategory(e) {
    // Empeche la validation du formulaire
    e.preventDefault();

    // Remets les arrays à vide
    categoryGroup = [];
    finalGroup = [];

    // Si la saisie est inchangée, ne rien changer et sortir de la fonction
    if (category.value === lastCategory && searchTerm.value.trim() === lastSearch) {
      return;
    } else {
      // Mets à jour selon la nouvelle recherche
      lastCategory = category.value;
      lastSearch = searchTerm.value.trim();
      // Si aucune catégorie particulière n'est choisie, on inclut tous les produits dans la liste
      // avant de passer au tri produit
      if (category.value === 'All') {
        categoryGroup = products;
        selectProducts();
        // Si une catégorie précise est choisie, il faut filtrer les produits par catégorie.
      } else {
        // La base de données est en minuscule, mais les catégories ont une majuscule,
        // on les passe donc en minuscule pour la recherche
        var lowerCaseType = category.value.toLowerCase();
        for (var i = 0; i < products.length; i++) {
          // Si le produit fait partie de la catégorie choisie, ajout au groupe final
          if (products[i].type === lowerCaseType) {
            categoryGroup.push(products[i]);
          }
        }

        // Une fois ce tri par catégorie fait, tri des produits sur la base de l'input utilisateur
        selectProducts();
      }
    }
  }

  // Précise d'avantage la recherche en triant les produits qui correspondent à l'input
  function selectProducts() {
    // On affiche seulement le resultat du premier tri si rien n'est tapé
    if (searchTerm.value.trim() === '') {
      finalGroup = categoryGroup;
      updateDisplay();
    } else {
      // On passe la saisie en minuscule pour éviter la casse
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      // Tri des produits restants dans la liste, ajout de ceux qui correspondent à la recherche à la liste finale
      for (var i = 0; i < categoryGroup.length; i++) {
        if (categoryGroup[i].name.indexOf(lowerCaseSearchTerm) !== -1) {
          finalGroup.push(categoryGroup[i]);
        }
      }

      // Une fois que c'est fait, on mets à jour l'affichage
      updateDisplay();
    }

  }

  // Mets à jour l'affichage
  function updateDisplay() {
    // Vide le contenu précédent du main
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // Si la liste est vide, afficher qu'il n'y a rien à afficher 
    if (finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'Aucun résultat !';
      main.appendChild(para);
      // On fait rechercher chaque terme de la liste dans la fonction fetch
    } else {
      for (var i = 0; i < finalGroup.length; i++) {
        showProduct(finalGroup[i]);
      }
    }
  }

  // // Va chercher les images associées aux produits
  // function fetchBlob(product) {
  //   // contruit le chemin vers l'image du produit
  //   var url = 'images/' + product.image;
  //   // 
  //   fetch(url).then(function (response) {
  //     if (response.ok) {
  //       response.blob().then(function (blob) {
  //         // Convert the blob to an object URL — this is basically an temporary internal URL
  //         // that points to an object stored inside the browser
  //         var objectURL = URL.createObjectURL(blob);
  //         showProduct(objectURL, product);
  //       });
  //     } else {
  //       console.log('Network request for "' + product.name + '" image failed with response ' + response.status + ': ' + response.statusText);
  //     }
  //   });
  // }

  // Affiche les produits dans le main
  function showProduct(product) {
    // Créer la fondation html pour l'affichage des images
    var section = document.createElement('section');
    var heading = document.createElement('h2');
    var para = document.createElement('p');
    var image = document.createElement('img');

    // Assigne à la section la classe correspondant au type de produit
    section.setAttribute('class', product.type);

    // Donne le nom correspondant au produit mis à la majuscule
    heading.textContent = product.name.replace(product.name.charAt(0), product.name.charAt(0).toUpperCase());

    // Affiche le prix dans le <p>
    para.textContent = '$' + product.price.toFixed(2);

    // Raccorde l'image au produit
    image.src = "images/"+product.name+".jpg";
    image.alt = product.name;

    // Ajoute tous ces éléments à la page
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(para);
    section.appendChild(image);
  }
}
