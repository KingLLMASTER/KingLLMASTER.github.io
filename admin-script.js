    class PackManager {
    constructor() {
        this.data = {
            packs: {}
        };
        this.availableLanguages = [];
        this.currentLanguage = "fr";
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
        this.initializeData();
        this.generateLanguageContents();
        this.attachEventListeners();
        this.initializeInterface();
    }
    cacheDomElements() {
        this.elements = {
            // Éléments généraux
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
            previewAges: document.getElementById("previewAges"),
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
            updateLinkButton: document.getElementById("updateLinkButton"),
            timeOnSiteValue: document.getElementById("timeOnSiteValue"),
            previewInclus: document.getElementById("previewInclus"),
            previewOptions: document.getElementById("previewOptions"),
            languageContentsContainer: document.getElementById("languageContentsContainer")
        };
    
        // Vérification des éléments
        Object.keys(this.elements).forEach(key => {
            if (!this.elements[key]) {
                console.warn(`L'élément ${key} est introuvable dans le DOM`);
            }
        });
    }
    attachEventListeners() {
        // Écouteur pour ajouter une nouvelle langue
        if (this.elements.addLanguageButton) {
          this.elements.addLanguageButton.addEventListener("click", () => this.addLanguage());
        }   
        // Écouteur pour le chargement de fichier
        if (this.elements.fileInput) {
          this.elements.fileInput.addEventListener("change", e => this.loadFile(e));
        }  
        // Écouteur pour la sélection de pack
        if (this.elements.packSelect) {
          this.elements.packSelect.addEventListener("change", () => {
            this.handlePackSelectionChange();
            this.updatePreviewCard();
          });
        } 
        // Écouteur pour la sélection de jeu
        if (this.elements.gameSelect) {
          this.elements.gameSelect.addEventListener("change", () => {
            this.handleGameSelectionChange();
            this.updatePreviewCard();
          });
        } 
        // Écouteur pour la sélection d'option
        if (this.elements.optionSelect) {
          this.elements.optionSelect.addEventListener("change", () => {
            this.handleOptionSelectionChange();
            this.updatePreviewCard();
          });
        }     
        // Écouteur pour la sélection de tranche d'âge
        if (this.elements.ageSelect) {
          this.elements.ageSelect.addEventListener("change", () => {
            this.updatePriceInput();
            this.updateLinkInput();
            this.updatePreviewCard();
          });
        }   
        // Écouteur pour la saisie du temps sur place unifié
        if (this.elements.timeOnSiteValue) {
          this.elements.timeOnSiteValue.addEventListener("input", () => {
            this.updateTimeOnSite();
            this.updatePreviewCard();
          });
        }
        // Écouteur pour la création de nouveau pack
        if (this.elements.creerNouveauPackButton) {
          this.elements.creerNouveauPackButton.addEventListener("click", () => this.creerNouveauPack());
        }
        // Écouteur pour l'ajout de jeu ou option
        if (this.elements.ajouterJeuOptionButton) {
          this.elements.ajouterJeuOptionButton.addEventListener("click", () => this.ajouterJeuOuOption());
        }   
        // Écouteurs pour renommer et supprimer packs, jeux, options
        if (this.elements.renamePackButton) {
          this.elements.renamePackButton.addEventListener("click", () => this.renamePack());
        }
        if (this.elements.deletePackButton) {
          this.elements.deletePackButton.addEventListener("click", () => this.deletePack());
        }
        if (this.elements.renameGameButton) {
          this.elements.renameGameButton.addEventListener("click", () => this.renameGame());
        }
        if (this.elements.deleteGameButton) {
          this.elements.deleteGameButton.addEventListener("click", () => this.deleteGame());
        }
        if (this.elements.renameOptionButton) {
          this.elements.renameOptionButton.addEventListener("click", () => this.renameOption());
        }
        if (this.elements.deleteOptionButton) {
        this.elements.deleteOptionButton.addEventListener("click", () => this.deleteOption());
        }  
        // Écouteur pour sauvegarder les données
        if (this.elements.saveDataButton) {
          this.elements.saveDataButton.addEventListener("click", () => this.saveChanges());
        }  
        // Écouteur pour mettre à jour les données
        if (this.elements.updateDataButton) {
          this.elements.updateDataButton.addEventListener("click", () => this.updateData());
        }  
        // Écouteur pour mettre à jour les liens de réservation
        if (this.elements.updateLinkButton) {
          this.elements.updateLinkButton.addEventListener("click", () => this.updateReservationLink());
        }  
        // Écouteur pour réinitialiser l'interface
        if (this.elements.resetButton) {
          this.elements.resetButton.addEventListener("click", () => this.resetInterface());
        }
        // Écouteur pour ajouter une inclusion
        if (this.elements.addInclusButton) {
          this.elements.addInclusButton.addEventListener("click", () => this.addInclus());
        } 
        // Écouteur pour ajouter une option
        if (this.elements.addOptionButton) {
          this.elements.addOptionButton.addEventListener("click", () => this.addOption());
        }  
        // Écouteur pour le champ de message d'avertissement
        if (this.elements.warningTextInput) {
          this.elements.warningTextInput.addEventListener('input', () => {
            this.updateWarningMessage();
            this.updatePreviewCard();
        });
        }
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
    collectFormData() {
        let packId = this.elements.packSelect.value;
        let lang = this.currentLanguage;
      
        if (packId) {
          let pack = this.data.packs[packId];
      
          // Collecter et sauvegarder le nom du pack
          let packName = this.elements.packName.value.trim();
          pack.names[lang] = packName;
      
          // Collecter et sauvegarder le message d'avertissement
          let warning = this.elements.warningTextInput.value.trim();
          pack.warningMessages[lang] = warning || "";
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
    async loadFile(event) {
        let file = event.target.files[0];
        if(!file) {
            console.error("Aucun fichier sélectionné");
            return;
        }
        try {
            let content = await file.text();
            let match = content.match(/const\s+constants\s*=\s*({[\s\S]*?});/);
            if(match) {
                let dataString = match[1];
                let dataFunc = new Function('"use strict"; return (' + dataString + ");");
                this.data = dataFunc();
                console.log("Données extraites :", this.data);
    
                this.updateAvailableLanguages();
                this.initializeInterface();
            } else {
                console.error("Format de fichier invalide");
                alert("Erreur lors du chargement du fichier. Veuillez vérifier le format et la console pour plus de détails.");
            }
        } catch(error) {
            console.error("Erreur lors du chargement du fichier :", error);
            alert("Erreur lors du chargement du fichier. Veuillez vérifier le format et la console pour plus de détails.");
        }
    }
    initializeInterface() {
        if(!this.data || !this.data.packs) {
            this.data = {
                packs: {},
                reservationLinks: {}
            };
        }
        this.generateLanguageContents();
        this.updatePackSelector();
        this.updateGameSelector();
        this.updateOptionSelector();
        this.updateAgeSelector();
        this.updatePriceInput();
        this.updateLinkInput();
        this.updatePreviewCard();
        this.updateLanguageFields();
        this.updatePackExistantSelect();
        this.updateJeuExistantSelect();
        if (this.availableLanguages.length > 0) {
            this.currentLanguage = this.availableLanguages[0];
            document.querySelectorAll(".language-content").forEach(content => {
                content.style.display = content.getAttribute("data-lang") === this.currentLanguage ? "block" : "none";
            });
        }
    }
    generateLanguageContents() {
        const container = document.getElementById("languageContentsContainer");
        const tabsContainer = document.querySelector('.language-tabs');
        
        if (!container || !tabsContainer) {
            console.error("Conteneurs de langue non trouvés");
            return;
        }
    
        container.innerHTML = ""; // Vide le conteneur de contenu
        tabsContainer.innerHTML = ""; // Vide le conteneur d'onglets
    
        this.availableLanguages.forEach(lang => {
            // Création de l'onglet
            let tabButton = document.createElement("button");
            tabButton.classList.add("language-tab");
            tabButton.setAttribute("data-lang", lang);
            tabButton.textContent = lang.toUpperCase();
            tabsContainer.appendChild(tabButton);
    
            // Ajout du bouton de suppression
            let removeButton = document.createElement('button');
            removeButton.className = 'remove-language-button';
            removeButton.textContent = 'Supprimer';
            removeButton.addEventListener('click', () => this.removeLanguage(lang));
            tabButton.appendChild(removeButton);
    
            // Création du contenu
            let langContent = document.createElement("div");
            langContent.classList.add("language-content");
            langContent.setAttribute("data-lang", lang);
            langContent.style.display = lang === this.currentLanguage ? "block" : "none";
            langContent.innerHTML = `
                <h3>Nom du pack (${lang.toUpperCase()})</h3>
                <input type="text" id="packName_${lang}" placeholder="Nom du pack">
                <h3>Message d'avertissement (${lang.toUpperCase()})</h3>
                <textarea id="warningTextInput_${lang}" placeholder="Entrez un message d'avertissement"></textarea>
                <div class="inclus-options-container">
                    <div class="inclus-column">
                        <h3>Inclus (${lang.toUpperCase()})</h3>
                        <ul id="inclusList_${lang}"></ul>
                        <input type="text" id="newInclusInput_${lang}" placeholder="Nouvel élément inclus">
                        <button id="addInclusButton_${lang}">Ajouter Inclus</button>
                    </div>
                    <div class="options-column">
                        <h3>Options supplémentaires (${lang.toUpperCase()})</h3>
                        <ul id="optionsList_${lang}"></ul>
                        <input type="text" id="newOptionInput_${lang}" placeholder="Nouvelle option">
                        <button id="addOptionButton_${lang}">Ajouter Option</button>
                    </div>
                </div>
                <button id="renamePackNamesButton_${lang}">Sauvegarder les noms du pack</button>
            `;
            container.appendChild(langContent);
    
            // Ajout des écouteurs d'événements
            document.getElementById(`addInclusButton_${lang}`).addEventListener("click", () => this.addInclus(lang));
            document.getElementById(`addOptionButton_${lang}`).addEventListener("click", () => this.addOption(lang));
            document.getElementById(`renamePackNamesButton_${lang}`).addEventListener("click", () => this.savePackNames(lang));
    
            // Ajout de l'écouteur pour le nom du pack
            document.getElementById(`packName_${lang}`).addEventListener('input', () => {
                this.updatePackName(lang);
                this.updatePreviewCard();
            });
    
            // Ajout de l'écouteur pour le message d'avertissement
            document.getElementById(`warningTextInput_${lang}`).addEventListener('input', () => {
                this.updateWarningMessage(lang);
                this.updatePreviewCard();
            });
    
            // Ajout de l'écouteur pour l'onglet de langue
            tabButton.addEventListener("click", () => this.switchLanguage(lang));
        });
    
        // Sélectionner le premier onglet par défaut
        if (this.availableLanguages.length > 0) {
            this.switchLanguage(this.availableLanguages[0]);
        }
    }
    updateAvailableLanguages() {
        let languages = new Set(["fr", "nl", "en"]);
        Object.values(this.data.packs).forEach(pack => {
            Object.keys(pack.names).forEach(lang => languages.add(lang));
            Object.keys(pack.warningMessages).forEach(lang => languages.add(lang));
            Object.keys(pack.inclusions).forEach(lang => languages.add(lang));
            Object.keys(pack.additionalOptions).forEach(lang => languages.add(lang));
            Object.values(pack.games).forEach(game => {
                Object.keys(game.names).forEach(lang => languages.add(lang));
                Object.values(game.options).forEach(option => {
                    Object.keys(option.names).forEach(lang => languages.add(lang));
                });
            });
        });
        this.availableLanguages = Array.from(languages);
    }
    updatePackName(lang) {
        let packId = this.elements.packSelect.value;
        if (packId) {
            let pack = this.data.packs[packId];
            let packName = document.getElementById(`packName_${lang}`).value.trim();
            pack.names[lang] = packName;
        }
    }
    updateLanguageTabs() {
        const tabsContainer = document.querySelector(".language-tabs");
        tabsContainer.innerHTML = ""; // Vide le conteneur des onglets
    
        this.availableLanguages.forEach(lang => {
            let tabButton = document.createElement("button");
            tabButton.classList.add("language-tab");
            tabButton.setAttribute("data-lang", lang);
            tabButton.textContent = lang.toUpperCase();
            tabButton.addEventListener("click", () => this.switchLanguage(lang));
            tabsContainer.appendChild(tabButton);
        });
    }
    switchLanguage(lang) {
        this.currentLanguage = lang;
        document.querySelectorAll('.language-content').forEach(content => {
            content.style.display = content.getAttribute('data-lang') === lang ? 'block' : 'none';
        });
        this.updateLanguageFields();
        this.updatePreviewCard();
    }
    promptForNewLanguageNames(newLang) {
        Object.entries(this.data.packs).forEach(([packId, pack]) => {
            pack.names[newLang] = prompt(`Nom du pack "${pack.names.fr}" en ${newLang.toUpperCase()} :`, pack.names.fr);
            
            Object.entries(pack.games).forEach(([gameId, game]) => {
                game.names[newLang] = prompt(`Nom du jeu "${game.names.fr}" en ${newLang.toUpperCase()} :`, game.names.fr);
                
                Object.entries(game.options).forEach(([optionId, option]) => {
                    option.names[newLang] = prompt(`Nom de l'option "${option.names.fr}" en ${newLang.toUpperCase()} :`, option.names.fr);
                });
            });
        });
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
    updateAgeSelector() {
        let packId = this.elements.packSelect.value;
        let ageSelect = this.elements.ageSelect;
        ageSelect.innerHTML = '<option value="">Sélectionnez une tranche d\'âge</option>';
        if (packId && this.data.packs[packId]) {
        this.data.packs[packId].ages.forEach(age => {
            let option = document.createElement("option");
            option.value = age;
            option.textContent = age;
            ageSelect.appendChild(option);
        });
        }
    }
    updatePriceInput() {
        let packId = this.elements.packSelect.value;
        let gameId = this.elements.gameSelect.value;
        let optionId = this.elements.optionSelect.value;
        let priceContainer = this.elements.priceContainer;
        priceContainer.innerHTML = '';
      
        if (packId && gameId && optionId) {
          let option = this.data.packs[packId].games[gameId].options[optionId];
          this.data.packs[packId].ages.forEach(age => {
            let input = document.createElement('input');
            input.type = 'number';
            input.placeholder = `Prix pour ${age}`;
            input.value = option.prices && option.prices[age] || '';
            input.addEventListener('change', () => {
              this.savePriceForAgeGroup(age, input.value);
            });
            priceContainer.appendChild(input);
          });
        }
    }
    showTranslationInterface(newLang) {
        // Créer un conteneur modal pour l'interface de traduction
        const modal = document.createElement('div');
        modal.className = 'translation-modal';
        modal.innerHTML = `
            <div class="translation-content">
                <h2>Traduire en ${newLang.toUpperCase()}</h2>
                <div id="translationContainer"></div>
                <button id="saveTranslations">Sauvegarder les traductions</button>
            </div>
        `;
        document.body.appendChild(modal);
    
        const translationContainer = modal.querySelector('#translationContainer');
        const saveButton = modal.querySelector('#saveTranslations');
    
        // Générer les champs de traduction
        Object.entries(this.data.packs).forEach(([packId, pack]) => {
            translationContainer.innerHTML += `
                <h3>Pack: ${pack.names.fr}</h3>
                <input type="text" id="pack_${packId}" placeholder="Traduction du pack" value="${pack.names[newLang] || ''}">
            `;
    
            Object.entries(pack.games).forEach(([gameId, game]) => {
                translationContainer.innerHTML += `
                    <h4>Jeu: ${game.names.fr}</h4>
                    <input type="text" id="game_${packId}_${gameId}" placeholder="Traduction du jeu" value="${game.names[newLang] || ''}">
                `;
    
                Object.entries(game.options).forEach(([optionId, option]) => {
                    translationContainer.innerHTML += `
                        <p>Option: ${option.names.fr}</p>
                        <input type="text" id="option_${packId}_${gameId}_${optionId}" placeholder="Traduction de l'option" value="${option.names[newLang] || ''}">
                    `;
                });
            });
        });
    
        // Gérer la sauvegarde des traductions
        saveButton.addEventListener('click', () => {
            this.saveTranslations(newLang);
            document.body.removeChild(modal);
        });
    }
    saveTranslations(newLang) {
        Object.entries(this.data.packs).forEach(([packId, pack]) => {
            pack.names[newLang] = document.getElementById(`pack_${packId}`).value;
    
            Object.entries(pack.games).forEach(([gameId, game]) => {
                game.names[newLang] = document.getElementById(`game_${packId}_${gameId}`).value;
    
                Object.entries(game.options).forEach(([optionId, option]) => {
                    option.names[newLang] = document.getElementById(`option_${packId}_${gameId}_${optionId}`).value;
                });
            });
        });
    
        this.updateInterface();
        alert('Traductions sauvegardées avec succès !');
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
    updateWarningMessage(lang) {
        let packId = this.elements.packSelect.value;
        if (packId) {
            let pack = this.data.packs[packId];
            let warningMessage = document.getElementById(`warningTextInput_${lang}`).value.trim();
            pack.warningMessages[lang] = warningMessage;
        }
    }
    updateLinkInput() {
        let packId = this.elements.packSelect.value;
        let gameId = this.elements.gameSelect.value;
        let optionId = this.elements.optionSelect.value;
        let age = this.elements.ageSelect.value;
        let linkContainer = this.elements.linkInputContainer;
        linkContainer.innerHTML = "";
        if (packId && gameId && optionId && age) {
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
            this.elements.previewTitle.textContent = `${pack.names[currentLang] || ''} - ${game.names[currentLang] || ''} - ${option.names[currentLang] || ''}`;
    
            // Mettre à jour le prix
            let price = option.prices && option.prices[ageId] ? option.prices[ageId] : "Prix non défini";
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
    
            // Afficher les tranches d'âge
            if (pack.ages) {
                let agesText = pack.ages.join(', ');
                this.elements.previewAges.textContent = `Tranches d'âge : ${agesText}`;
            }
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
    updateLabelsPlaceholders() {
        let lang = this.currentLanguage;
      
        // Mettre à jour les labels
        this.elements.packNameLabel.textContent = `Nom du Pack (${lang.toUpperCase()})`;
        this.elements.warningMessageLabel.textContent = `Message d'avertissement (${lang.toUpperCase()})`;
        this.elements.inclusLabel.textContent = `Inclus (${lang.toUpperCase()})`;
        this.elements.optionsLabel.textContent = `Options supplémentaires (${lang.toUpperCase()})`;
      
        // Mettre à jour les placeholders
        this.elements.packName.placeholder = `Nom du pack en ${lang.toUpperCase()}`;
        this.elements.warningTextInput.placeholder = `Entrez un message d'avertissement en ${lang.toUpperCase()}`;
        this.elements.newInclusInput.placeholder = `Nouvel élément inclus (${lang.toUpperCase()})`;
        this.elements.newOptionInput.placeholder = `Nouvelle option (${lang.toUpperCase()})`;
    }
    updateLanguageFields() {
        let packId = this.elements.packSelect.value;
        let lang = this.currentLanguage;
    
        if (packId) {
            let pack = this.data.packs[packId];
            let packNameElement = document.getElementById(`packName_${lang}`);
            let warningTextElement = document.getElementById(`warningTextInput_${lang}`);
            
            if (packNameElement) packNameElement.value = pack.names[lang] || "";
            if (warningTextElement) warningTextElement.value = pack.warningMessages[lang] || "";
            
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
    updateInclusOptionsList(lang) {
        let selectedPack = this.elements.packSelect.value;
        if (selectedPack) {
            let inclusList = document.getElementById(`inclusList_${lang}`);
            let optionsList = document.getElementById(`optionsList_${lang}`);
            if (inclusList && optionsList) {
                inclusList.innerHTML = "";
                optionsList.innerHTML = "";
    
                (this.data.packs[selectedPack].inclusions[lang] || []).forEach((item, index) => {
                    let li = document.createElement("li");
                    li.textContent = `✅ ${item}`;
                    let btn = document.createElement("button");
                    btn.textContent = "Supprimer";
                    btn.addEventListener("click", () => this.removeInclus(lang, index));
                    li.appendChild(btn);
                    inclusList.appendChild(li);
                });
    
                (this.data.packs[selectedPack].additionalOptions[lang] || []).forEach((item, index) => {
                    let li = document.createElement("li");
                    li.textContent = `• ${item}`;
                    let btn = document.createElement("button");
                    btn.textContent = "Supprimer";
                    btn.addEventListener("click", () => this.removeOption(lang, index));
                    li.appendChild(btn);
                    optionsList.appendChild(li);
                });
            }
        }
    }
    addInclus(lang) {
        let selectedPack = this.elements.packSelect.value;
        if (selectedPack) {
            let inclusInput = document.getElementById(`newInclusInput_${lang}`);
            if (inclusInput) {
                let inclus = inclusInput.value.trim();
                if (inclus) {
                    this.data.packs[selectedPack].inclusions[lang] = this.data.packs[selectedPack].inclusions[lang] || [];
                    this.data.packs[selectedPack].inclusions[lang].push(inclus);
                    this.updateInclusOptionsList(lang);
                    inclusInput.value = "";
                }
            }
        }
    }
    addOption(lang) {
        let selectedPack = this.elements.packSelect.value;
        if (selectedPack) {
            let optionInput = document.getElementById(`newOptionInput_${lang}`);
            if (optionInput) {
                let option = optionInput.value.trim();
                if (option) {
                    this.data.packs[selectedPack].additionalOptions[lang] = this.data.packs[selectedPack].additionalOptions[lang] || [];
                    this.data.packs[selectedPack].additionalOptions[lang].push(option);
                    this.updateInclusOptionsList(lang);
                    optionInput.value = "";
                }
            }
        }
    }
    removeInclus(lang, index) {
        let selectedPack = this.elements.packSelect.value;
        if (selectedPack) {
            this.data.packs[selectedPack].inclusions[lang].splice(index, 1);
            this.updateInclusOptionsList(lang);
            this.updatePreviewCard();
        }
    }
    removeOption(lang, index) {
        let selectedPack = this.elements.packSelect.value;
        if (selectedPack) {
            this.data.packs[selectedPack].additionalOptions[lang].splice(index, 1);
            this.updateInclusOptionsList(lang);
            this.updatePreviewCard();
        }
    }
    handlePackSelectionChange() {
        this.updateGameSelector();
        this.updateOptionSelector();
        this.updateAgeSelector();
        this.updatePriceInput();
        this.updateLinkInput();
        this.updatePreviewCard();
        if (document.getElementById(`packName_${this.currentLanguage}`)) {
            this.updateLanguageFields();
        }
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
    creerNouveauPack() {
        let packName = document.getElementById("nouveauPack").value.trim();
        if (!packName) {
          alert("Veuillez entrer un nom pour le nouveau pack.");
          return;
        }
      
        // Collecte des tranches d'âge sélectionnées
        let agesCheckboxes = document.querySelectorAll('#agesCheckboxes input[type="checkbox"]:checked');
        let selectedAges = Array.from(agesCheckboxes).map(checkbox => checkbox.value);
        if (selectedAges.length === 0) {
          alert("Veuillez sélectionner au moins une tranche d'âge.");
          return;
        }
      
        let packId = `pack_${Date.now()}`;
        this.data.packs[packId] = {
          names: {},
          ages: selectedAges,
          games: {},
          inclusions: {},
          additionalOptions: {},
          warningMessages: {}
        };
        this.availableLanguages.forEach(lang => {
          this.data.packs[packId].names[lang] = packName;
        });
      
        this.initializeInterface();
        this.elements.packSelect.value = packId;
        this.handlePackSelectionChange();
    }
    updatePackExistantSelect() {
        let select = this.elements.packExistantSelect;
        select.innerHTML = '<option value="">Sélectionnez un pack</option>';
        Object.keys(this.data.packs).forEach(packId => {
        let pack = this.data.packs[packId];
        let option = document.createElement("option");
        option.value = packId;
        option.textContent = pack.names[this.currentLanguage] || pack.names.fr;
        select.appendChild(option);
        });
    }
    updateJeuExistantSelect() {
        let packId = this.elements.packExistantSelect.value;
        let select = this.elements.jeuExistantSelect;
        select.innerHTML = '<option value="">Jeu existant</option>';
        if (packId && this.data.packs[packId]) {
        Object.keys(this.data.packs[packId].games).forEach(gameId => {
            let game = this.data.packs[packId].games[gameId];
            let option = document.createElement("option");
            option.value = gameId;
            option.textContent = game.names[this.currentLanguage] || game.names.fr;
            select.appendChild(option);
        });
        }
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
    addLanguage() {
        let langCode = this.elements.newLanguageCode.value.trim().toLowerCase();
        if (langCode && !this.availableLanguages.includes(langCode)) {
            this.availableLanguages.push(langCode);
    
            // Initialiser les données pour la nouvelle langue
            Object.values(this.data.packs).forEach(pack => {
                pack.names[langCode] = pack.names.fr || "";
                pack.warningMessages[langCode] = "";
                pack.inclusions[langCode] = [];
                pack.additionalOptions[langCode] = [];
                Object.values(pack.games).forEach(game => {
                    game.names[langCode] = game.names.fr || "";
                    Object.values(game.options).forEach(option => {
                        option.names[langCode] = option.names.fr || "";
                    });
                });
            });
    
            // Générer le nouvel onglet et la section de contenu
            this.generateLanguageContents();
            alert(`La langue '${langCode}' a été ajoutée avec succès.`);
            this.elements.newLanguageCode.value = "";
        } else {
            alert("Veuillez entrer un code de langue valide qui n'existe pas déjà.");
        }
    }
    addLanguageTab(lang) {
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
            <input type="text" id="packName_${lang}" placeholder="Nom du pack">
            <h3>Message d'avertissement (${lang.toUpperCase()})</h3>
            <textarea id="warningTextInput_${lang}" placeholder="Entrez un message d'avertissement"></textarea>
            <h3>Temps sur place (${lang.toUpperCase()})</h3>
            <input id="timeOnSite_${lang}" type="number" placeholder="Temps en minutes">
            <div class="inclus-options-container">
                <div class="inclus-column">
                    <h3 id="inclusLabel_${lang}">Inclus (${lang.toUpperCase()})</h3>
                    <ul id="inclusList_${lang}"></ul>
                    <input id="newInclusInput_${lang}" type="text" placeholder="Nouvel élément inclus (${lang.toUpperCase()})">
                    <button id="addInclusButton_${lang}">Ajouter Inclus</button>
                </div>
                <div class="options-column">
                    <h3 id="optionsLabel_${lang}">Options supplémentaires (${lang.toUpperCase()})</h3>
                    <ul id="optionsList_${lang}"></ul>
                    <input id="newOptionInput_${lang}" type="text" placeholder="Nouvelle option (${lang.toUpperCase()})">
                    <button id="addOptionButton_${lang}">Ajouter Option</button>
                </div>
            </div>
        `;

        document.getElementById("languageContentsContainer").appendChild(langContent);

        // Cache les nouveaux éléments
        this.elements[`packName_${lang}`] = langContent.querySelector(`#packName_${lang}`);
        this.elements[`warningTextInput_${lang}`] = langContent.querySelector(`#warningTextInput_${lang}`);
        this.elements[`timeOnSite_${lang}`] = langContent.querySelector(`#timeOnSite_${lang}`);
        this.elements[`inclusList_${lang}`] = langContent.querySelector(`#inclusList_${lang}`);
        this.elements[`optionsList_${lang}`] = langContent.querySelector(`#optionsList_${lang}`);
        this.elements[`newInclusInput_${lang}`] = langContent.querySelector(`#newInclusInput_${lang}`);
        this.elements[`addInclusButton_${lang}`] = langContent.querySelector(`#addInclusButton_${lang}`);
        this.elements[`newOptionInput_${lang}`] = langContent.querySelector(`#newOptionInput_${lang}`);
        this.elements[`addOptionButton_${lang}`] = langContent.querySelector(`#addOptionButton_${lang}`);

        // Attache les écouteurs d'événements pour les nouveaux boutons
        this.elements[`addInclusButton_${lang}`].addEventListener("click", () => this.addInclus(lang));
        this.elements[`addOptionButton_${lang}`].addEventListener("click", () => this.addOption(lang));

        // Attache l'écouteur pour le bouton "Sauvegarder les noms du pack" si nécessaire
        // Si vous avez un bouton par langue, ajoutez-le ici
        if (!this.elements[`renamePackNamesButton_${lang}`]) {
            let renameButton = document.createElement("button");
            renameButton.id = `renamePackNamesButton_${lang}`;
            renameButton.textContent = "Sauvegarder les noms du pack";
            renameButton.addEventListener("click", () => this.savePackNames(lang));
            langContent.appendChild(renameButton);
            this.elements[`renamePackNamesButton_${lang}`] = renameButton;
        }

        // Ajoute l'onglet de langue aux écouteurs
        tabButton.addEventListener("click", () => {
            this.currentLanguage = lang;
            document.querySelectorAll(".language-content").forEach(content => {
                content.style.display = content.getAttribute("data-lang") === lang ? "block" : "none";
            });
            this.updateLanguageFields();
            this.updatePreviewCard();
        });
    }
    removeLanguage(langCode) {
        // Vérifier si la langue existe
        if (!this.availableLanguages.includes(langCode)) {
            alert(`La langue '${langCode}' n'existe pas.`);
            return;
        }
    
        // Afficher une fenêtre de confirmation avec un timer de 3 secondes
        const confirmationModal = document.createElement('div');
        confirmationModal.classList.add('confirmation-modal');
        confirmationModal.innerHTML = `
            <div class="confirmation-content">
                <h2>Supprimer la langue '${langCode.toUpperCase()}'</h2>
                <p>Êtes-vous sûr de vouloir supprimer cette langue et toutes les données associées ?</p>
                <div class="timer">Annulation dans 3 secondes...</div>
                <div class="buttons">
                    <button class="confirm-button" disabled>Oui, supprimer</button>
                    <button class="cancel-button">Annuler</button>
                </div>
            </div>
        `;
        document.body.appendChild(confirmationModal);
    
        let timer = 3;
        const timerElement = confirmationModal.querySelector('.timer');
        const confirmButton = confirmationModal.querySelector('.confirm-button');
        const cancelButton = confirmationModal.querySelector('.cancel-button');
    
        // Compte à rebours de 3 secondes
        const timerInterval = setInterval(() => {
            timer--;
            timerElement.textContent = `Annulation dans ${timer} secondes...`;
            if (timer === 0) {
                clearInterval(timerInterval);
                confirmButton.disabled = false;
                confirmButton.style.backgroundColor = '#dc3545';
                confirmButton.style.cursor = 'pointer';
            }
        }, 1000);
    
        // Gestion des boutons de confirmation
        confirmButton.addEventListener('click', () => {
            clearInterval(timerInterval);
            this.confirmRemoveLanguage(langCode);
            document.body.removeChild(confirmationModal);
        });
    
        cancelButton.addEventListener('click', () => {
            clearInterval(timerInterval);
            document.body.removeChild(confirmationModal);
        });
    }
    confirmRemoveLanguage(langCode) {
        // Supprimer la langue des packs
        Object.values(this.data.packs).forEach(pack => {
            delete pack.names[langCode];
            delete pack.warningMessages[langCode];
            delete pack.inclusions[langCode];
            delete pack.additionalOptions[langCode];
            Object.values(pack.games).forEach(game => {
                delete game.names[langCode];
                Object.values(game.options).forEach(option => {
                    delete option.names[langCode];
                });
            });
        });
    
        // Supprimer la langue des liens de réservation
        delete this.data.reservationLinks[langCode];
    
        // Supprimer la langue de la liste des langues disponibles
        this.availableLanguages = this.availableLanguages.filter(lang => lang !== langCode);
    
        // Mettre à jour l'interface
        this.generateLanguageContents();
        this.updatePreviewCard();
        this.updateLinkInput();
    
        alert(`La langue '${langCode}' a été supprimée avec succès.`);
    }
    savePackNames(lang = null) {
        let selectedPack = this.elements.packSelect.value;
        if (selectedPack) {
            let packData = this.data.packs[selectedPack];
            let languagesToSave = lang ? [lang] : this.availableLanguages;
    
            languagesToSave.forEach(currentLang => {
                let packNameElement = document.getElementById(`packName_${currentLang}`);
                let warningTextElement = document.getElementById(`warningTextInput_${currentLang}`);
                
                if (packNameElement) {
                    packData.names[currentLang] = packNameElement.value.trim();
                }
                if (warningTextElement) {
                    packData.warningMessages[currentLang] = warningTextElement.value.trim();
                }
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
    saveChanges() {
        this.collectFormData();
    
        // Nettoyer les données des langues supprimées
        Object.keys(this.data.packs).forEach(packId => {
            Object.keys(this.data.packs[packId].names).forEach(lang => {
                if (!this.availableLanguages.includes(lang)) {
                    delete this.data.packs[packId].names[lang];
                    delete this.data.packs[packId].warningMessages[lang];
                    delete this.data.packs[packId].inclusions[lang];
                    delete this.data.packs[packId].additionalOptions[lang];
                    Object.values(this.data.packs[packId].games).forEach(game => {
                        delete game.names[lang];
                        Object.values(game.options).forEach(option => {
                            delete option.names[lang];
                        });
                    });
                }
            });
        });
    
        // Nettoyer les liens de réservation pour les langues supprimées
        Object.keys(this.data.reservationLinks).forEach(lang => {
            if (!this.availableLanguages.includes(lang)) {
                delete this.data.reservationLinks[lang];
            }
        });
    
        // Sauvegarder la liste des langues disponibles
        this.data.availableLanguages = this.availableLanguages;
    
        let fileContent = `const constants = ${JSON.stringify(this.data, null, 2)};`;
        if ("showSaveFilePicker" in window) {
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
