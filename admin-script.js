class PackManager {
  constructor() {
      this.data = {
          packs: {}
      };
      this.availableLanguages = ["fr", "nl", "en"];
      this.currentLanguage = "fr";  // Langue active
      this.timeUnits = {
          fr: { minutes: "minutes", hours: "heures" },
          nl: { minutes: "minuten", hours: "uren" },
          en: { minutes: "minutes", hours: "hours" }
      };
      this.elements = {};
      this.init();
  }
  init() {
      this.cacheDomElements();
      this.attachEventListeners();
      this.initializeData();
      this.initializeInterface();
  }
  cacheDomElements() {
    this.elements = {
        fileInput: document.getElementById("fileInput"),
        packSelect: document.getElementById("packSelect"),
        gameSelect: document.getElementById("gameSelect"),
        optionSelect: document.getElementById("optionSelect"),
        ageSelect: document.getElementById("ageSelect"),
        priceContainer: document.getElementById("priceContainer"),
        linkInputContainer: document.getElementById("linkInputContainer"),
        previewCard: document.getElementById("previewCard"),
        previewTitle: document.getElementById("previewTitle"),
        previewPrice: document.getElementById("previewPrice"),
        previewTime: document.getElementById("previewTime"),
        previewWarningMessage: document.getElementById("previewWarningMessage"),
        saveDataButton: document.getElementById("saveDataButton"),
        updateDataButton: document.getElementById("updateDataButton"),
        resetButton: document.getElementById("resetButton"),
        packExistantSelect: document.getElementById("packExistantSelect"),
        jeuExistantSelect: document.getElementById("jeuExistantSelect"),
        nouveauJeuInput: document.getElementById("nouveauJeuInput"),
        nouvelleOptionInput: document.getElementById("nouvelleOptionInput"),
        creerNouveauPackButton: document.getElementById("creerNouveauPackButton"),
        ajouterJeuOptionButton: document.getElementById("ajouterJeuOptionButton"),
        newLanguageCode: document.getElementById("newLanguageCode"),
        addLanguageButton: document.getElementById("addLanguageButton"),
        renamePackButton: document.getElementById("renamePackButton"),
        deletePackButton: document.getElementById("deletePackButton"),
        renameGameButton: document.getElementById("renameGameButton"),
        deleteGameButton: document.getElementById("deleteGameButton"),
        renameOptionButton: document.getElementById("renameOptionButton"),
        deleteOptionButton: document.getElementById("deleteOptionButton"),
        renamePackNamesButton: document.getElementById("renamePackNamesButton"),
        updateLinkButton: document.getElementById("updateLinkButton"),
        languageTabs: document.querySelectorAll(".language-tab"),
        languageContents: document.querySelectorAll(".language-content"),
        timeOnSiteValue: document.getElementById("timeOnSiteValue"),
        previewInclus: document.getElementById("previewInclus"),
        previewOptions: document.getElementById("previewOptions"),
    };
    // Ajouter les boutons de suppression pour chaque langue
    this.availableLanguages.forEach(lang => {
        this.elements[`deleteWarningButton_${lang}`] = document.getElementById(`deleteWarningButton_${lang}`);
        this.elements[`warningTextInput_${lang}`] = document.getElementById(`warningTextInput_${lang}`);
    });
    // Vérification des éléments
    Object.keys(this.elements).forEach(key => {
        if (!this.elements[key]) {
            console.warn(`L'élément ${key} est introuvable dans le DOM`);
        }
    });
    // Capturer les champs de nom de pack pour chaque langue
    this.availableLanguages.forEach(lang => {
      this.elements[`packName_${lang}`] = document.getElementById(`packName_${lang}`);
      if (!this.elements[`packName_${lang}`]) {
          console.warn(`L'élément packName_${lang} est introuvable dans le DOM`);
      }
  });
      // Capturer les champs de la liste des inclusions pour chaque langue
      this.availableLanguages.forEach(lang => {
        this.elements[`inclusList_${lang}`] = document.getElementById(`inclusList_${lang}`);
        if (!this.elements[`inclusList_${lang}`]) {
            console.warn(`L'élément inclusList_${lang} est introuvable dans le DOM`);
        }
    });
    this.availableLanguages.forEach(lang => {
      this.elements[`inclusList_${lang}`] = document.getElementById(`inclusList_${lang}`);
      this.elements[`newInclusInput_${lang}`] = document.getElementById(`newInclusInput_${lang}`);
      this.elements[`addInclusButton_${lang}`] = document.getElementById(`addInclusButton_${lang}`);
      this.elements[`optionsList_${lang}`] = document.getElementById(`optionsList_${lang}`);
      this.elements[`newOptionInput_${lang}`] = document.getElementById(`newOptionInput_${lang}`);
      this.elements[`addOptionButton_${lang}`] = document.getElementById(`addOptionButton_${lang}`);

      // Vérification si les éléments sont introuvables
      Object.keys(this.elements).forEach(key => {
          if (!this.elements[key]) {
              console.warn(`L'élément ${key} est introuvable dans le DOM`);
          }
      });
  });
}
  attachEventListeners() {
    // Attacher les événements pour le chargement de fichier
    if (this.elements.fileInput) {
        this.elements.fileInput.addEventListener("change", e => this.loadFile(e));
    }
    // Attacher les événements pour la sélection de pack
    if (this.elements.packSelect) {
        this.elements.packSelect.addEventListener("change", () => {
            this.handlePackSelectionChange();
            this.updatePreviewCard();
        });
    }
    // Attacher les événements pour la sélection de jeu
    if (this.elements.gameSelect) {
        this.elements.gameSelect.addEventListener("change", () => {
            this.handleGameSelectionChange();
            this.updatePreviewCard();
        });
    }
    // Attacher les événements pour la sélection d'option
    if (this.elements.optionSelect) {
        this.elements.optionSelect.addEventListener("change", () => {
            this.handleOptionSelectionChange();
            this.updatePreviewCard();
        });
    }
    // Attacher les événements pour la sélection de tranche d'âge
    if (this.elements.ageSelect) {
        this.elements.ageSelect.addEventListener("change", () => {
            this.updatePriceInput();
            this.updateLinkInput();
            this.updatePreviewCard();
        });
    }
    // Attacher les événements pour renommer les packs
    if (this.elements.renamePackNamesButton) {
        this.elements.renamePackNamesButton.addEventListener("click", () => this.savePackNames());
    }
    // Ajouter les écouteurs pour supprimer les messages d'avertissement
    this.availableLanguages.forEach(lang => {
      let deleteWarningButton = this.elements[`deleteWarningButton_${lang}`];
      if (deleteWarningButton) {
          deleteWarningButton.addEventListener("click", () => this.deleteWarningMessage(lang));
      }
    });
    // Gestion des onglets de langue
    this.elements.languageTabs.forEach(tab => {
      tab.addEventListener("click", () => {
          let lang = tab.getAttribute("data-lang");
          this.currentLanguage = lang;
          // Afficher le contenu de la langue sélectionnée
          this.elements.languageContents.forEach(content => {
              content.style.display = content.getAttribute("data-lang") === lang ? "block" : "none";
          });
          // Mettre à jour les champs multilingues
          this.updateLanguageFields();
          // Mettre à jour la carte de prévisualisation pour refléter la langue sélectionnée
          this.updatePreviewCard(); // Ajout important pour mettre à jour la carte
      });
  });
    // Attacher les événements pour la saisie du temps sur place unifié
    if (this.elements.timeOnSiteValue) {
        this.elements.timeOnSiteValue.addEventListener("input", () => {
            this.updateTimeOnSite();
            this.updatePreviewCard();
        });
    }
    // Création de nouveau pack
    if (this.elements.creerNouveauPackButton) {
        this.elements.creerNouveauPackButton.addEventListener("click", () => this.creerNouveauPack());
    }
    // Ajout de jeu ou option
    if (this.elements.ajouterJeuOptionButton) {
        this.elements.ajouterJeuOptionButton.addEventListener("click", () => this.ajouterJeuOuOption());
    }
    // Renommer pack
    if (this.elements.renamePackButton) {
        this.elements.renamePackButton.addEventListener("click", () => this.renamePack());
    }
    // Supprimer pack
    if (this.elements.deletePackButton) {
        this.elements.deletePackButton.addEventListener("click", () => this.deletePack());
    }
    // Renommer jeu
    if (this.elements.renameGameButton) {
        this.elements.renameGameButton.addEventListener("click", () => this.renameGame());
    }
    // Supprimer jeu
    if (this.elements.deleteGameButton) {
        this.elements.deleteGameButton.addEventListener("click", () => this.deleteGame());
    }
    // Renommer option
    if (this.elements.renameOptionButton) {
        this.elements.renameOptionButton.addEventListener("click", () => this.renameOption());
    }
    // Supprimer option
    if (this.elements.deleteOptionButton) {
        this.elements.deleteOptionButton.addEventListener("click", () => this.deleteOption());
    }
    // Sauvegarder les données
    if (this.elements.saveDataButton) {
        this.elements.saveDataButton.addEventListener("click", () => this.saveChanges());
    }
    // Mettre à jour les données
    if (this.elements.updateDataButton) {
        this.elements.updateDataButton.addEventListener("click", () => this.updateData());
    }
    // Mettre à jour les liens de réservation
    if (this.elements.updateLinkButton) {
        this.elements.updateLinkButton.addEventListener("click", () => this.updateReservationLink());
    }
    // Réinitialiser l'interface
    if (this.elements.resetButton) {
        this.elements.resetButton.addEventListener("click", () => this.resetInterface());
    }
    this.availableLanguages.forEach(lang => {
      let addInclusBtn = this.elements[`addInclusButton_${lang}`];
      let addOptionBtn = this.elements[`addOptionButton_${lang}`];

      if (addInclusBtn) {
          addInclusBtn.addEventListener("click", () => this.addInclus(lang));
      }
      if (addOptionBtn) {
          addOptionBtn.addEventListener("click", () => this.addOption(lang));
      }
  });
}
updateTimeOnSite() {
  let packId = this.elements.packSelect.value;
  let gameId = this.elements.gameSelect.value;
  let optionId = this.elements.optionSelect.value;
  let timeValue = this.elements.timeOnSiteValue.value.trim();

  if (packId && gameId && optionId && timeValue) {
      let option = this.data.packs[packId].games[gameId].options[optionId];
      option.timeOnSite = Number(timeValue);  // Stocke le temps unifié en minutes
      this.updatePreviewCard();  // Met à jour la carte d'aperçu
  }
}
collectFormData(){
  let packId = this.elements.packSelect.value;
  if(packId){
      let pack = this.data.packs[packId];
      this.availableLanguages.forEach(lang => {
          // Collecter et sauvegarder le nom du pack
          let packName = this.elements[`packName_${lang}`].value.trim();
          if(packName) pack.names[lang] = packName;

          // Collecter et sauvegarder le message d'avertissement, même s'il est vide
          let warning = this.elements[`warningTextInput_${lang}`].value.trim();
          pack.warningMessages[lang] = warning || "";  // Enregistrer une chaîne vide si le champ est vide
      });

      let gameId = this.elements.gameSelect.value;
      let optionId = this.elements.optionSelect.value;
      if(gameId && optionId){
          let option = this.data.packs[packId].games[gameId].options[optionId];
          this.availableLanguages.forEach(lang => {
              // Collecter et sauvegarder le temps sur place
              let time = this.elements[`timeOnSite_${lang}`].value.trim();
              if(time){
                  option.timeOnSite = option.timeOnSite || {};
                  option.timeOnSite[lang] = time;
              }

              // Gestion des prix
              let priceInputs = this.elements.priceContainer.querySelectorAll('input[type="number"]');
              priceInputs.forEach(input => {
                  let age = input.placeholder.replace("Prix pour ", "");
                  option.prices = option.prices || {};
                  option.prices[age] = Number(input.value);
              });
          });
      }
  }
}
  initializeData(){
      if(!this.data.reservationLinks){
          this.data.reservationLinks = {};
      }
      this.availableLanguages.forEach(lang => {
          if(!this.data.reservationLinks[lang]){
              this.data.reservationLinks[lang] = {};
          }
      });
  }
  async loadFile(event){
      let file = event.target.files[0];
      if(!file){
          console.error("Aucun fichier sélectionné");
          return;
      }
      try{
          let content = await file.text();
          let match = content.match(/const\s+constants\s*=\s*({[\s\S]*?});/);
          if(match){
              let dataString = match[1];
              let dataFunc = new Function('"use strict"; return (' + dataString + ");");
              this.data = dataFunc();
              console.log("Données extraites :", this.data);
              this.initializeInterface();
          } else {
              console.error("Format de fichier invalide");
              alert("Erreur lors du chargement du fichier. Veuillez vérifier le format et la console pour plus de détails.");
          }
      } catch(error){
          console.error("Erreur lors du chargement du fichier :", error);
          alert("Erreur lors du chargement du fichier. Veuillez vérifier le format et la console pour plus de détails.");
      }
  }
  initializeInterface(){
      if(!this.data || !this.data.packs){
          this.data = {
              packs: {},
              reservationLinks: {}
          };
      }
      this.updatePackSelector();
      this.updateGameSelector();
      this.updateOptionSelector();
      this.updateAgeSelector();
      this.updatePriceInput();
      this.updateLinkInput();
      this.updatePreviewCard();
      this.updateLanguageFields();
  }
  updatePackSelector(){
      let packSelect = this.elements.packSelect;
      packSelect.innerHTML = '<option value="">Sélectionnez un pack</option>';
      Object.keys(this.data.packs).forEach(packId => {
          let pack = this.data.packs[packId];
          let option = document.createElement("option");
          option.value = packId;
          option.textContent = pack.names[this.currentLanguage] || pack.names.fr;
          packSelect.appendChild(option);
      });
  }
  updateGameSelector(){
      let packId = this.elements.packSelect.value;
      let gameSelect = this.elements.gameSelect;
      let jeuExistantSelect = this.elements.jeuExistantSelect;
      gameSelect.innerHTML = '<option value="">Sélectionnez un jeu</option>';
      jeuExistantSelect.innerHTML = '<option value="">Jeu existant</option>';
      if(packId && this.data.packs[packId]){
          Object.keys(this.data.packs[packId].games).forEach(gameId => {
              let game = this.data.packs[packId].games[gameId];
              let option = document.createElement("option");
              option.value = gameId;
              option.textContent = game.names[this.currentLanguage] || game.names.fr;
              gameSelect.appendChild(option);

              let clone = option.cloneNode(true);
              jeuExistantSelect.appendChild(clone);
          });
      }
  }
  updateOptionSelector(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      let optionSelect = this.elements.optionSelect;
      optionSelect.innerHTML = '<option value="">Sélectionnez une option</option>';
      if(packId && gameId && this.data.packs[packId].games[gameId]){
          Object.keys(this.data.packs[packId].games[gameId].options).forEach(optionId => {
              let optionData = this.data.packs[packId].games[gameId].options[optionId];
              let option = document.createElement("option");
              option.value = optionId;
              option.textContent = optionData.names[this.currentLanguage] || optionData.names.fr;
              optionSelect.appendChild(option);
          });
      }
  }
  updateAgeSelector(){
      let packId = this.elements.packSelect.value;
      let ageSelect = this.elements.ageSelect;
      ageSelect.innerHTML = '<option value="">Sélectionnez une tranche d\'âge</option>';
      if(packId && this.data.packs[packId]){
          let ages = this.data.packs[packId].ages;
          ages.forEach(age => {
              let option = document.createElement("option");
              option.value = age;
              option.textContent = age;
              ageSelect.appendChild(option);
          });
      }
  }
  updatePriceInput(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      let optionId = this.elements.optionSelect.value;
      let age = this.elements.ageSelect.value;
      let priceContainer = this.elements.priceContainer;
      priceContainer.innerHTML = "";
      if(packId && gameId && optionId){
          let optionData = this.data.packs[packId].games[gameId].options[optionId];
          if(this.data.packs[packId].ages){
              this.data.packs[packId].ages.forEach(ageGroup => {
                  let input = document.createElement("input");
                  input.type = "number";
                  input.placeholder = `Prix pour ${ageGroup}`;
                  input.value = optionData.prices && optionData.prices[ageGroup] || "";
                  input.addEventListener("change", () => {
                      this.savePriceForAgeGroup(ageGroup, input.value);
                  });
                  priceContainer.appendChild(input);
              });
          }
      }
  }
  savePriceForAgeGroup(age, value){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      let optionId = this.elements.optionSelect.value;
      if(packId && gameId && optionId){
          let optionData = this.data.packs[packId].games[gameId].options[optionId];
          optionData.prices = optionData.prices || {};
          optionData.prices[age] = Number(value);
          this.updatePreviewCard();
      }
  }
  updateLinkInput(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      let optionId = this.elements.optionSelect.value;
      let age = this.elements.ageSelect.value;
      let linkContainer = this.elements.linkInputContainer;
      linkContainer.innerHTML = "";
      if(packId && gameId && optionId && age){
          this.availableLanguages.forEach(lang => {
              let key = `${packId}_${gameId}_${optionId}_${age}`;
              let link = this.data.reservationLinks[lang] && this.data.reservationLinks[lang][key] || "";
              let label = document.createElement("label");
              label.textContent = `Lien (${lang.toUpperCase()}):`;
              let input = document.createElement("input");
              input.type = "text";
              input.id = `linkInput_${lang}`;
              input.value = link;
              input.placeholder = `Lien de réservation pour ${lang.toUpperCase()}`;
              linkContainer.appendChild(label);
              linkContainer.appendChild(input);
          });
      }
  }
  updatePreviewCard() {
    let packId = this.elements.packSelect.value;
    let gameId = this.elements.gameSelect.value;
    let optionId = this.elements.optionSelect.value;
    let ageId = this.elements.ageSelect.value;

    if (packId && gameId && optionId) {
        let pack = this.data.packs[packId];
        let game = pack.games[gameId];
        let option = game.options[optionId];

        // Utiliser la langue actuellement sélectionnée pour les noms
        let currentLang = this.currentLanguage;

        // Mettre à jour le titre avec la langue sélectionnée
        this.elements.previewTitle.textContent = `${pack.names[currentLang]} - ${game.names[currentLang]} - ${option.names[currentLang]}`;

        // Mettre à jour le prix
        let price = option.prices[ageId] || "Prix non défini";
        this.elements.previewPrice.textContent = `${price} €`;

        // Mettre à jour le temps sur place avec conversion heures/minutes
        let timeOnSite = option.timeOnSite || pack.timeOnSite || 0;
        let formattedTime = this.formatTime(timeOnSite);
        this.elements.previewTime.textContent = `⏱️ Temps sur place : ${formattedTime}`;

        // Mettre à jour les inclusions
        let inclusList = this.elements.previewInclus;
        inclusList.innerHTML = "";  // Vider la liste d'inclusions
        if (pack.inclusions && pack.inclusions[currentLang]) {
            pack.inclusions[currentLang].forEach(inclus => {
                let listItem = document.createElement("li");
                listItem.textContent = `✅ ${inclus}`;
                inclusList.appendChild(listItem);
            });
        }

        // Mettre à jour les options supplémentaires
        let optionsList = this.elements.previewOptions;
        optionsList.innerHTML = "";  // Vider la liste d'options
        if (pack.additionalOptions && pack.additionalOptions[currentLang]) {
            pack.additionalOptions[currentLang].forEach(option => {
                let listItem = document.createElement("li");
                listItem.textContent = `• ${option}`;
                optionsList.appendChild(listItem);
            });
        }

        // Mettre à jour le message d'avertissement
        let warningMessage = pack.warningMessages[currentLang] || "";
        this.elements.previewWarningMessage.textContent = warningMessage;
        this.elements.previewWarningMessage.style.display = warningMessage ? "block" : "none";

        // Afficher la carte de prévisualisation
        this.elements.previewCard.style.display = "block";
    } else {
        // Masquer la prévisualisation si aucune option n'est sélectionnée
        this.elements.previewCard.style.display = "none";
    }
}
  formatTime(minutes) {
    if (minutes >= 60) {
        let hours = Math.floor(minutes / 60);
        let remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes > 0 ? remainingMinutes + 'min' : ''}`;
    } else {
        return `${minutes} min`;
    }
  }
updateLanguageFields() {
  let packId = this.elements.packSelect.value;
  let lang = this.currentLanguage;

  if (packId) {
      let pack = this.data.packs[packId];

      // Met à jour le nom du pack pour la langue courante
      this.elements[`packName_${lang}`].value = pack.names[lang] || "";

      // Met à jour le message d'avertissement pour la langue courante
      this.elements[`warningTextInput_${lang}`].value = pack.warningMessages[lang] || "";

      // Mise à jour des inclusions pour la langue courante
      this.updateInclusOptionsList(lang);
  }
}
deleteWarningMessage(lang) {
  let packId = this.elements.packSelect.value;
  if (packId) {
      // Supprimer le message d'avertissement dans la structure de données
      this.data.packs[packId].warningMessages[lang] = "";
      // Vider le champ de texte dans l'interface utilisateur
      this.elements[`warningTextInput_${lang}`].value = "";
      // Mettre à jour la carte de prévisualisation
      this.updatePreviewCard();
  }
}
updateInclusOptionsList() {
  let packId = this.elements.packSelect.value;
  if (packId) {
      this.availableLanguages.forEach(lang => {
          let inclusList = this.elements[`inclusList_${lang}`];
          let optionsList = this.elements[`optionsList_${lang}`];

          // Mettre à jour la liste des inclusions
          inclusList.innerHTML = "";
          let inclusions = this.data.packs[packId].inclusions[lang] || [];
          inclusions.forEach((inclus, index) => {
              let li = document.createElement("li");
              li.textContent = inclus;
              let deleteBtn = document.createElement("button");
              deleteBtn.textContent = "Supprimer";
              deleteBtn.addEventListener("click", () => this.removeInclus(lang, index));
              li.appendChild(deleteBtn);
              inclusList.appendChild(li);
          });

          // Mettre à jour la liste des options
          optionsList.innerHTML = "";
          let options = this.data.packs[packId].additionalOptions[lang] || [];
          options.forEach((option, index) => {
              let li = document.createElement("li");
              li.textContent = option;
              let deleteBtn = document.createElement("button");
              deleteBtn.textContent = "Supprimer";
              deleteBtn.addEventListener("click", () => this.removeOption(lang, index));
              li.appendChild(deleteBtn);
              optionsList.appendChild(li);
          });
      });
  }
}
addInclus(lang) {
  let packId = this.elements.packSelect.value;
  if (packId) {
      let newInclus = this.elements[`newInclusInput_${lang}`].value.trim();
      if (newInclus) {
          this.data.packs[packId].inclusions[lang] = this.data.packs[packId].inclusions[lang] || [];
          this.data.packs[packId].inclusions[lang].push(newInclus);
          this.updateInclusOptionsList();  // Actualiser l'affichage des inclusions
          this.elements[`newInclusInput_${lang}`].value = "";  // Vider le champ de texte après ajout
      }
  }
}
  removeInclus(lang, index){
      let packId = this.elements.packSelect.value;
      if(packId){
          let pack = this.data.packs[packId];
          if(pack.inclusions && pack.inclusions[lang]){
              pack.inclusions[lang].splice(index, 1);
              this.updateInclusOptionsList();
              this.updatePreviewCard();
          }
      }
  }
  addOption(lang) {
    let packId = this.elements.packSelect.value;
    if (packId) {
        let newOption = this.elements[`newOptionInput_${lang}`].value.trim();
        if (newOption) {
            this.data.packs[packId].additionalOptions[lang] = this.data.packs[packId].additionalOptions[lang] || [];
            this.data.packs[packId].additionalOptions[lang].push(newOption);
            this.updateInclusOptionsList();  // Actualiser l'affichage des options
            this.elements[`newOptionInput_${lang}`].value = "";  // Vider le champ de texte après ajout
        }
    }
}
  removeOption(lang, index){
      let packId = this.elements.packSelect.value;
      if(packId){
          let pack = this.data.packs[packId];
          if(pack.additionalOptions && pack.additionalOptions[lang]){
              pack.additionalOptions[lang].splice(index, 1);
              this.updateInclusOptionsList();
              this.updatePreviewCard();
          }
      }
  }
  handlePackSelectionChange(){
      this.updateGameSelector();
      this.updateOptionSelector();
      this.updateAgeSelector();
      this.updatePriceInput();
      this.updateLinkInput();
      this.updatePreviewCard();
      this.updateLanguageFields();
  }
  handleGameSelectionChange(){
      this.updateOptionSelector();
      this.updatePriceInput();
      this.updateLinkInput();
      this.updatePreviewCard();
  }
  handleOptionSelectionChange(){
      this.updatePriceInput();
      this.updateLinkInput();
      this.updatePreviewCard();
  }
  updateReservationLink(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      let optionId = this.elements.optionSelect.value;
      let age = this.elements.ageSelect.value;
      if(!packId || !gameId || !optionId || !age){
          alert("Veuillez remplir tous les champs (pack, jeu, option et tranche d'âge).");
          return;
      }
      this.availableLanguages.forEach(lang => {
          let linkInput = document.getElementById(`linkInput_${lang}`).value;
          if(!linkInput){
              alert(`Le lien pour la langue ${lang} est manquant.`);
              return;
          }
          let key = `${packId}_${gameId}_${optionId}_${age}`;
          this.data.reservationLinks[lang] = this.data.reservationLinks[lang] || {};
          this.data.reservationLinks[lang][key] = linkInput;
      });
      alert("Liens de réservation mis à jour avec succès pour toutes les langues !");
  }
  creerNouveauPack(){
      let newPackNameInput = document.getElementById("nouveauPack");
      let newPackName = newPackNameInput.value.trim();
      if(!newPackName){
          alert("Veuillez entrer un nom pour le nouveau pack.");
          return;
      }
      let newPackId = `pack_${Date.now()}`;
      this.data.packs[newPackId] = {
          names: {},
          ages: [], // Vous devez définir comment sélectionner les tranches d'âge
          games: {},
          inclusions: {},
          additionalOptions: {},
          warningMessages: {}
      };
      this.availableLanguages.forEach(lang => {
          this.data.packs[newPackId].names[lang] = newPackName;
      });
      this.initializeInterface();
      this.elements.packSelect.value = newPackId;
      this.handlePackSelectionChange();
  }
  ajouterJeuOuOption(){
      let packId = this.elements.packExistantSelect.value;
      let existingGameId = this.elements.jeuExistantSelect.value;
      let newGameName = this.elements.nouveauJeuInput.value.trim();
      let newOptionName = this.elements.nouvelleOptionInput.value.trim();

      if(!packId || (!existingGameId && !newGameName) || !newOptionName){
          alert("Veuillez remplir tous les champs obligatoires.");
          return;
      }

      let gameId = existingGameId;
      if(!gameId){
          gameId = `game_${Date.now()}`;
          this.data.packs[packId].games[gameId] = {
              names: {},
              options: {}
          };
          this.availableLanguages.forEach(lang => {
              this.data.packs[packId].games[gameId].names[lang] = newGameName;
          });
      }

      let optionId = `option_${Date.now()}`;
      this.data.packs[packId].games[gameId].options[optionId] = {
          names: {},
          prices: {},
          timeOnSite: {}
      };
      this.availableLanguages.forEach(lang => {
          this.data.packs[packId].games[gameId].options[optionId].names[lang] = newOptionName;
      });

      alert("Option ajoutée avec succès.");
      this.initializeInterface();
      this.elements.packSelect.value = packId;
      this.handlePackSelectionChange();
      this.elements.gameSelect.value = gameId;
      this.handleGameSelectionChange();
  }
  addLanguage(){
      let newLangCode = this.elements.newLanguageCode.value.trim();
      if(newLangCode && !this.availableLanguages.includes(newLangCode)){
          this.availableLanguages.push(newLangCode);
          Object.values(this.data.packs).forEach(pack => {
              pack.names[newLangCode] = "";
              pack.inclusions[newLangCode] = [];
              pack.additionalOptions[newLangCode] = [];
              pack.warningMessages[newLangCode] = "";
              Object.values(pack.games).forEach(game => {
                  game.names[newLangCode] = "";
                  Object.values(game.options).forEach(option => {
                      option.names[newLangCode] = "";
                      // timeOnSite initialized as empty object
                      option.timeOnSite[newLangCode] = "";
                  });
              });
          });
          this.addLanguageTab(newLangCode);
          alert(`La langue '${newLangCode}' a été ajoutée avec succès.`);
          this.elements.newLanguageCode.value = "";
      } else {
          alert("Veuillez entrer un code de langue valide qui n'existe pas déjà.");
      }
  }
  addLanguageTab(lang){
      let tabsContainer = document.querySelector(".language-tabs");
      let tabButton = document.createElement("button");
      tabButton.classList.add("language-tab");
      tabButton.setAttribute("data-lang", lang);
      tabButton.textContent = lang.toUpperCase();
      tabsContainer.appendChild(tabButton);

      let langContent = document.createElement("div");
      langContent.classList.add("language-content");
      langContent.setAttribute("data-lang", lang);
      langContent.style.display = "none";
      langContent.innerHTML = `
          <h3>Nom du pack (${lang.toUpperCase()})</h3>
          <input type="text" id="packName_${lang}">
          <h3>Message d'avertissement (${lang.toUpperCase()})</h3>
          <textarea id="warningTextInput_${lang}" placeholder="Entrez un message d'avertissement"></textarea>
          <h3>Temps sur place (${lang.toUpperCase()})</h3>
          <input id="timeOnSite_${lang}" type="text" placeholder="Temps sur place pour l'option">
          <h3>Inclus (${lang.toUpperCase()})</h3>
          <ul id="inclusList_${lang}"></ul>
          <input id="newInclusInput_${lang}" type="text" placeholder="Nouvel élément inclus">
          <button id="addInclusButton_${lang}">Ajouter</button>
          <h3>Options supplémentaires (${lang.toUpperCase()})</h3>
          <ul id="optionsList_${lang}"></ul>
          <input id="newOptionInput_${lang}" type="text" placeholder="Nouvelle option">
          <button id="addOptionButton_${lang}">Ajouter Option</button>
      `;
      document.querySelector(".language-tabs").insertAdjacentElement("afterend", langContent);

      // Stocker les éléments dans this.elements
      this.elements[`packName_${lang}`] = langContent.querySelector(`#packName_${lang}`);
      this.elements[`warningTextInput_${lang}`] = langContent.querySelector(`#warningTextInput_${lang}`);
      this.elements[`newInclusInput_${lang}`] = langContent.querySelector(`#newInclusInput_${lang}`);
      this.elements[`addInclusButton_${lang}`] = langContent.querySelector(`#addInclusButton_${lang}`);
      this.elements[`inclusList_${lang}`] = langContent.querySelector(`#inclusList_${lang}`);
      this.elements[`newOptionInput_${lang}`] = langContent.querySelector(`#newOptionInput_${lang}`);
      this.elements[`addOptionButton_${lang}`] = langContent.querySelector(`#addOptionButton_${lang}`);
      this.elements[`optionsList_${lang}`] = langContent.querySelector(`#optionsList_${lang}`);
      this.elements[`timeOnSite_${lang}`] = langContent.querySelector(`#timeOnSite_${lang}`);

      // Ajouter les écouteurs d'événements
      tabButton.addEventListener("click", () => {
          this.currentLanguage = lang;
          document.querySelectorAll(".language-content").forEach(content => {
              content.style.display = content.getAttribute("data-lang") === lang ? "block" : "none";
          });
          this.updateLanguageFields();
      });

      this.elements[`addInclusButton_${lang}`].addEventListener("click", () => this.addInclus(lang));
      this.elements[`addOptionButton_${lang}`].addEventListener("click", () => this.addOption(lang));
  }
  savePackNames(){
      let packId = this.elements.packSelect.value;
      if(packId){
          let pack = this.data.packs[packId];
          this.availableLanguages.forEach(lang => {
              let packName = this.elements[`packName_${lang}`].value.trim();
              let warning = this.elements[`warningTextInput_${lang}`].value.trim();
              let time = this.elements[`timeOnSite_${lang}`].value.trim();

              if(packName){
                  pack.names[lang] = packName;
              }
              pack.warningMessages[lang] = warning || "";
              // Note: timeOnSite est géré par option, pas par pack
          });
          alert("Les informations du pack ont été mises à jour avec succès.");
          this.updatePackSelector();
          this.updatePreviewCard();
      } else {
          alert("Veuillez sélectionner un pack.");
      }
  }
  renamePack(){
      let packId = this.elements.packSelect.value;
      if(packId){
          let pack = this.data.packs[packId];
          let newName = prompt("Entrez le nouveau nom du pack:", pack.names.fr);
          if(newName !== null){
              this.availableLanguages.forEach(lang => {
                  pack.names[lang] = newName;
              });
              alert("Le pack a été renommé avec succès.");
              this.updatePackSelector();
              this.updatePreviewCard();
          }
      } else {
          alert("Veuillez sélectionner un pack.");
      }
  }
  deletePack(){
      let packId = this.elements.packSelect.value;
      if(packId && confirm("Êtes-vous sûr de vouloir supprimer ce pack ?")){
          delete this.data.packs[packId];
          this.initializeInterface();
      }
  }
  renameGame(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      if(packId && gameId){
          let game = this.data.packs[packId].games[gameId];
          this.availableLanguages.forEach(lang => {
              let newName = prompt(`Nouveau nom pour le jeu (${lang.toUpperCase()}):`, game.names[lang]);
              if(newName !== null){
                  game.names[lang] = newName;
              }
          });
          alert("Le jeu a été renommé avec succès.");
          this.updateGameSelector();
          this.updatePreviewCard();
      } else {
          alert("Veuillez sélectionner un pack et un jeu.");
      }
  }
  deleteGame(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      if(packId && gameId && confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")){
          delete this.data.packs[packId].games[gameId];
          this.initializeInterface();
      }
  }
  renameOption(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      let optionId = this.elements.optionSelect.value;
      if(packId && gameId && optionId){
          let option = this.data.packs[packId].games[gameId].options[optionId];
          this.availableLanguages.forEach(lang => {
              let newName = prompt(`Nouveau nom pour l'option (${lang.toUpperCase()}):`, option.names[lang]);
              if(newName !== null){
                  option.names[lang] = newName;
              }
          });
          alert("L'option a été renommée avec succès.");
          this.updateOptionSelector();
          this.updatePreviewCard();
      } else {
          alert("Veuillez sélectionner un pack, un jeu et une option.");
      }
  }
  deleteOption(){
      let packId = this.elements.packSelect.value;
      let gameId = this.elements.gameSelect.value;
      let optionId = this.elements.optionSelect.value;
      if(packId && gameId && optionId && confirm("Êtes-vous sûr de vouloir supprimer cette option ?")){
          delete this.data.packs[packId].games[gameId].options[optionId];
          this.initializeInterface();
      }
  }
  saveChanges(){
      this.collectFormData();
      let fileContent = `const constants = ${JSON.stringify(this.data, null, 2)};`;
      if("showSaveFilePicker" in window){
          this.saveWithFileSystemAccess(fileContent);
      } else {
          this.downloadFile(fileContent, "constants.js");
      }
  }
  downloadFile(content, filename){
      let blob = new Blob([content], {type: "text/javascript"});
      let url = URL.createObjectURL(blob);
      let a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      alert("Fichier téléchargé avec succès !");
  }
  async saveWithFileSystemAccess(content){
      try{
          let fileHandle = await window.showSaveFilePicker({
              suggestedName: "constants.js",
              types: [{
                  description: "JavaScript File",
                  accept: {"text/javascript": [".js"]}
              }]
          });
          let writable = await fileHandle.createWritable();
          await writable.write(content);
          await writable.close();
          alert("Fichier sauvegardé avec succès !");
      } catch(error){
          console.warn("Impossible d'utiliser l'API File System Access. Utilisation de la méthode de téléchargement classique.", error);
          this.downloadFile(content, "constants.js");
      }
  }
  updateData(){
      // Implémentez ici la logique de mise à jour des données si nécessaire
      // Par exemple, recharger les sélecteurs ou autres éléments UI
      console.log("updateData called");
      this.initializeInterface();
  }
  resetInterface(){
      this.elements.packSelect.value = "";
      this.elements.gameSelect.value = "";
      this.elements.optionSelect.value = "";
      this.elements.ageSelect.value = "";
      this.elements.priceContainer.innerHTML = "";
      this.elements.linkInputContainer.innerHTML = "";
      this.updatePreviewCard();
      this.updateLanguageFields();
  }
}
// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  window.packManager = new PackManager();
});
