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
            toggleJeuxExistantsHeader: document.getElementById("toggleJeuxExistantsHeader"),
            toggleJeuxExistantsIcon: document.getElementById("toggleJeuxExistantsIcon"),
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
            toggleJeuxExistantsButton: document.getElementById("toggleJeuxExistantsButton"),
            deleteGameButton: document.getElementById("deleteGameButton"),
            renameOptionButton: document.getElementById("renameOptionButton"),
            deleteOptionButton: document.getElementById("deleteOptionButton"),
            updateLinkButton: document.getElementById("updateLinkButton"),
            timeOnSiteValue: document.getElementById("timeOnSiteValue"),
            previewInclus: document.getElementById("previewInclus"),
            previewOptions: document.getElementById("previewOptions"),
            toggleCenterColumnButton : document.getElementById("toggleCenterColumn"),
            languageContentsContainer: document.getElementById("languageContentsContainer"),
            leftColumn: document.querySelector('.left-column'),
            rightColumn: document.querySelector('.right-column'),
            centerColumn: document.getElementById('centerColumn'),
            toggleCenterColumnButton: document.getElementById('toggleCenterColumn'),
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
        if (this.elements.toggleJeuxExistantsButton) {
            this.elements.toggleJeuxExistantsButton.addEventListener('click', () => this.toggleJeuxExistants());
          }
        if (this.elements.toggleJeuxExistantsHeader) {
        this.elements.toggleJeuxExistantsHeader.addEventListener('click', () => this.toggleJeuxExistants());
        }
        if (this.elements.toggleCenterColumnButton) {
            this.elements.toggleCenterColumnButton.addEventListener("click", () => this.toggleCenterColumn());
        }
    }
    toggleCenterColumn() {
        const centerColumn = this.elements.centerColumn;
        const container = document.querySelector('.container');
        
        if (!centerColumn) {
            console.error("Élément centerColumn non trouvé");
            return;
        }
    
        const isHidden = centerColumn.classList.contains('hidden');
    
        if (isHidden) {
            centerColumn.classList.remove('hidden');
            container.classList.add('center-visible');
            centerColumn.style.display = 'block';
            this.elements.toggleCenterColumnButton.textContent = "Masquer le créateur";
        } else {
            centerColumn.classList.add('hidden');
            container.classList.remove('center-visible');
            centerColumn.style.display = 'none';
            this.elements.toggleCenterColumnButton.textContent = "Créateur de formule";
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
        this.updateJeuxExistantsSelect();
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
    toggleJeuxExistants() {
        const container = document.getElementById("jeuxExistantsContainer");
        const icon = this.elements.toggleJeuxExistantsIcon;
        
        if (container.style.display === 'none' || container.style.display === '') {
          container.style.display = 'block';
          icon.textContent = 'expand_less';
        } else {
          container.style.display = 'none';
          icon.textContent = 'expand_more';
        }
    }
    updatePackExistantSelect() {
        let packExistantSelect = this.elements.packExistantSelect;
        if (!packExistantSelect) return;
        packExistantSelect.innerHTML = '<option value="">Sélectionnez un pack</option>';
        Object.keys(this.data.packs).forEach(packId => {
            let pack = this.data.packs[packId];
            let option = document.createElement('option');
            option.value = packId;
            option.textContent = pack.names[this.currentLanguage] || pack.names.fr;
            packExistantSelect.appendChild(option);
        });
    }
    updateJeuExistantSelect() {
        let packId = this.elements.packExistantSelect.value;
        let jeuExistantSelect = this.elements.jeuExistantSelect;
        if (!jeuExistantSelect) return;
        jeuExistantSelect.innerHTML = '<option value="">Sélectionnez un jeu</option>';
        if (packId && this.data.packs[packId]) {
            let games = this.data.packs[packId].games;
            Object.keys(games).forEach(gameId => {
                let game = games[gameId];
                let option = document.createElement('option');
                option.value = gameId;
                option.textContent = game.names[this.currentLanguage] || game.names.fr;
                jeuExistantSelect.appendChild(option);
            });
        }
    }
    updateGameSelector() {
        let packId = this.elements.packSelect.value;
        let gameSelect = this.elements.gameSelect;
        let jeuExistantSelect = this.elements.jeuExistantSelect;
        gameSelect.innerHTML = '<option value="">Sélectionnez un jeu</option>';
        if (jeuExistantSelect) {
          jeuExistantSelect.innerHTML = '<option value="">Sélectionnez un jeu</option>';
        }
        if (packId && this.data.packs[packId]) {
          let games = this.data.packs[packId].games;
          Object.keys(games).forEach(gameId => {
            let game = games[gameId];
            let option = document.createElement('option');
            option.value = gameId;
            option.textContent = game.names[this.currentLanguage] || game.names.fr;
            gameSelect.appendChild(option);
            if (jeuExistantSelect) {
              let existingOption = option.cloneNode(true);
              jeuExistantSelect.appendChild(existingOption);
            }
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
        let packId = this.elements.packSelect.value,
            gameId = this.elements.gameSelect.value,
            optionId = this.elements.optionSelect.value,
            ageGroup = this.elements.ageSelect.value;
    
        if (packId && gameId && optionId) {
            let pack = this.data.packs[packId];
            if (!pack) {
                this.elements.previewCard.style.display = "none";
                return;
            }
    
            let game = pack.games[gameId];
            if (!game) {
                this.elements.previewCard.style.display = "none";
                return;
            }
    
            let option = game.options[optionId];
            if (!option) {
                this.elements.previewCard.style.display = "none";
                return;
            }
    
            let lang = this.currentLanguage;
    
            // Met à jour le titre du aperçu
            this.elements.previewTitle.textContent = `${pack.names[lang] || ""} - ${game.names[lang] || ""} - ${option.names[lang] || ""}`;
    
            // Met à jour le prix
            let price = option.prices && option.prices[ageGroup] ? option.prices[ageGroup] : "Prix non défini";
            this.elements.previewPrice.textContent = `${price} €`;
    
            // Met à jour le temps sur place
            let timeOnSite = option.timeOnSite || pack.timeOnSite || 0;
            let formattedTime = this.formatTime(timeOnSite);
            this.elements.previewTime.textContent = `⏱️ Temps sur place : ${formattedTime}`;
    
            // Met à jour la liste des inclusions
            let inclusList = this.elements.previewInclus;
            inclusList.innerHTML = "";
            if (pack.inclusions && pack.inclusions[lang]) {
                pack.inclusions[lang].forEach(item => {
                    let li = document.createElement("li");
                    li.textContent = `✅ ${item}`;
                    inclusList.appendChild(li);
                });
            }
    
            // Met à jour la liste des options supplémentaires
            let optionsList = this.elements.previewOptions;
            optionsList.innerHTML = "";
            if (pack.additionalOptions && pack.additionalOptions[lang]) {
                pack.additionalOptions[lang].forEach(item => {
                    let li = document.createElement("li");
                    li.textContent = `• ${item}`;
                    optionsList.appendChild(li);
                });
            }
    
            // Met à jour le message d'avertissement
            let warningMessage = pack.warningMessages[lang] || "";
            this.elements.previewWarningMessage.textContent = warningMessage;
            this.elements.previewWarningMessage.style.display = warningMessage ? "block" : "none";
    
            // Affiche la carte d'aperçu
            this.elements.previewCard.style.display = "block";
    
            // Met à jour les tranches d'âge
            if (pack.ages) {
                let agesText = pack.ages.join(", ");
                this.elements.previewAges.textContent = `Tranches d'âge : ${agesText}`;
            }
        } else {
            // Cache la carte d'aperçu si les sélections sont incomplètes
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
        let packId = this.elements.packSelect.value,
            lang = this.currentLanguage;
        if (packId) {
            let pack = this.data.packs[packId];
            if (!pack) {
                return;
            }
            let packNameInput = document.getElementById(`packName_${lang}`),
                warningTextInput = document.getElementById(`warningTextInput_${lang}`);
            if (packNameInput) packNameInput.value = pack.names[lang] || "";
            if (warningTextInput) warningTextInput.value = pack.warningMessages[lang] || "";
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
        let packId = this.elements.packSelect.value;
        if (packId) {
            let inclusList = document.getElementById(`inclusList_${lang}`);
            let optionsList = document.getElementById(`optionsList_${lang}`);
            if (!inclusList || !optionsList) return;
    
            inclusList.innerHTML = '';
            optionsList.innerHTML = '';
    
            // Gérer les inclusions
            if (this.data.packs[packId].inclusions[lang]) {
                this.data.packs[packId].inclusions[lang].forEach((item, index) => {
                    let li = document.createElement('li');
    
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.value = item;
                    input.addEventListener('input', () => {
                        this.data.packs[packId].inclusions[lang][index] = input.value;
                        this.updatePreviewCard();
                    });
    
                    let removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Supprimer';
                    removeBtn.addEventListener('click', () => {
                        this.removeInclus(lang, index);
                    });
    
                    li.appendChild(input);
                    li.appendChild(removeBtn);
                    inclusList.appendChild(li);
                });
            }
    
            // Gérer les options supplémentaires
            if (this.data.packs[packId].additionalOptions[lang]) {
                this.data.packs[packId].additionalOptions[lang].forEach((item, index) => {
                    let li = document.createElement('li');
    
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.value = item;
                    input.addEventListener('input', () => {
                        this.data.packs[packId].additionalOptions[lang][index] = input.value;
                        this.updatePreviewCard();
                    });
    
                    let removeBtn = document.createElement('button');
                    removeBtn.textContent = 'Supprimer';
                    removeBtn.addEventListener('click', () => {
                        this.removeOption(lang, index);
                    });
    
                    li.appendChild(input);
                    li.appendChild(removeBtn);
                    optionsList.appendChild(li);
                });
            }
        }
    }
    addInclus(lang) {
        let packId = this.elements.packSelect.value;
        if (packId) {
            let newInclusInput = document.getElementById(`newInclusInput_${lang}`);
            if (newInclusInput) {
                let newItem = newInclusInput.value.trim();
                if (newItem) {
                    this.data.packs[packId].inclusions[lang] = this.data.packs[packId].inclusions[lang] || [];
                    this.data.packs[packId].inclusions[lang].push(newItem);
                    newInclusInput.value = '';
                    this.updateInclusOptionsList(lang);
                    this.updatePreviewCard();
                }
            }
        }
    }   
    addOption(lang) {
        let packId = this.elements.packSelect.value;
        if (packId) {
            let newOptionInput = document.getElementById(`newOptionInput_${lang}`);
            if (newOptionInput) {
                let newItem = newOptionInput.value.trim();
                if (newItem) {
                    this.data.packs[packId].additionalOptions[lang] = this.data.packs[packId].additionalOptions[lang] || [];
                    this.data.packs[packId].additionalOptions[lang].push(newItem);
                    newOptionInput.value = '';
                    this.updateInclusOptionsList(lang);
                    this.updatePreviewCard();
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
        this.updateInclusOptionsList(this.currentLanguage);
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
    findGameByUniqueId(uniqueGameId) {
        let [packId, gameId] = uniqueGameId.split('_');
        let pack = this.data.packs[packId];
        if (pack && pack.games[gameId]) {
            return {
                packId: packId,
                gameId: gameId,
                game: pack.games[gameId]
            };
        }
        return null;
    }
    findOptionByName(gameName, optionName) {
        for (let pack of Object.values(this.data.packs)) {
            for (let game of Object.values(pack.games)) {
                let currentGameName = game.names[this.currentLanguage] || game.names.fr;
                if (currentGameName === gameName) {
                    for (let option of Object.values(game.options)) {
                        let currentOptionName = option.names[this.currentLanguage] || option.names.fr;
                        if (currentOptionName === optionName) {
                            return option;
                        }
                    }
                }
            }
        }
        return null;
    }
    creerNouveauPack() {
        let nomPack = document.getElementById("nouveauPack").value.trim();
        if (!nomPack) {
            alert("Veuillez entrer un nom pour le nouveau pack.");
            return;
        }
        
        let tranchesAge = Array.from(document.querySelectorAll('#agesCheckboxes input[type="checkbox"]:checked')).map(el => el.value);
        if (tranchesAge.length === 0) {
            alert("Veuillez sélectionner au moins une tranche d'âge.");
            return;
        }
    
        // Identifiant unique pour le nouveau pack
        let packId = `pack_${Date.now()}`;
        this.data.packs[packId] = {
            names: {},
            ages: tranchesAge,
            games: {},
            inclusions: {},
            additionalOptions: {},
            warningMessages: {}
        };
    
        // Initialiser les langues pour le nouveau pack
        this.availableLanguages.forEach(langue => {
            this.data.packs[packId].names[langue] = nomPack;
            this.data.packs[packId].inclusions[langue] = [];
            this.data.packs[packId].additionalOptions[langue] = [];
            this.data.packs[packId].warningMessages[langue] = "";
        });
    
        // Création de jeux et options facultatifs
        let jeuxExistants = Array.from(document.querySelectorAll("#jeuxExistantsContainer .option-checkbox:checked"));
        if (jeuxExistants.length > 0) {
            let jeuxOptions = {};
            
            jeuxExistants.forEach(optionElement => {
                let nomJeu = optionElement.dataset.gameName;
                let nomOption = optionElement.parentElement.textContent.trim();
    
                if (!jeuxOptions[nomJeu]) {
                    jeuxOptions[nomJeu] = [];
                }
                jeuxOptions[nomJeu].push(nomOption);
            });
    
            Object.entries(jeuxOptions).forEach(([nomJeu, options]) => {
                let gameId = `game_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
                this.data.packs[packId].games[gameId] = {
                    names: {},
                    options: {}
                };
    
                this.availableLanguages.forEach(langue => {
                    this.data.packs[packId].games[gameId].names[langue] = nomJeu;
                });
    
                options.forEach(nomOption => {
                    let optionId = `option_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
                    this.data.packs[packId].games[gameId].options[optionId] = {
                        names: {},
                        prices: {},
                        timeOnSite: 0
                    };
    
                    this.availableLanguages.forEach(langue => {
                        this.data.packs[packId].games[gameId].options[optionId].names[langue] = nomOption;
                    });
                });
            });
        }
    
        alert("Le nouveau pack a été créé avec succès.");
        this.initializeInterface();
        this.elements.packSelect.value = packId;
        this.handlePackSelectionChange();
    }    
    updateJeuxExistantsSelect() {
        let container = document.getElementById("jeuxExistantsContainer");
        if (!container) return;
    
        container.innerHTML = "";
    
        let gamesMap = {};
    
        // Parcourir tous les packs
        Object.values(this.data.packs).forEach(pack => {
            // Parcourir tous les jeux du pack
            Object.values(pack.games).forEach(game => {
                let gameName = game.names[this.currentLanguage] || game.names.fr;
    
                // Utiliser le nom du jeu comme clé
                if (!gamesMap[gameName]) {
                    gamesMap[gameName] = {
                        name: gameName,
                        options: {}
                    };
                }
    
                // Fusionner les options du jeu
                Object.entries(game.options).forEach(([optionId, option]) => {
                    let optionName = option.names[this.currentLanguage] || option.names.fr;
    
                    // Créer une clé unique pour l'option basée sur le nom
                    if (!gamesMap[gameName].options[optionName]) {
                        gamesMap[gameName].options[optionName] = {
                            names: option.names,
                            prices: option.prices,
                            timeOnSite: option.timeOnSite
                        };
                    }
                });
            });
        });
    
        // Générer le HTML
        Object.values(gamesMap).forEach(gameData => {
            let gameCategory = document.createElement("div");
            gameCategory.classList.add("game-category");
    
            let gameTitle = document.createElement("h4");
            gameTitle.classList.add("game-category-title");
    
            let gameCheckbox = document.createElement("input");
            gameCheckbox.type = "checkbox";
            gameCheckbox.classList.add("game-checkbox");
    
            let gameLabel = document.createElement("label");
            gameLabel.appendChild(gameCheckbox);
            gameLabel.appendChild(document.createTextNode(` ${gameData.name}`));
    
            gameTitle.appendChild(gameLabel);
            gameCategory.appendChild(gameTitle);
    
            let optionsContainer = document.createElement("div");
            optionsContainer.classList.add("game-options");
    
            Object.keys(gameData.options).forEach(optionName => {
                let optionData = gameData.options[optionName];
    
                let optionLabel = document.createElement("label");
                optionLabel.classList.add("game-option");
    
                let optionCheckbox = document.createElement("input");
                optionCheckbox.type = "checkbox";
                optionCheckbox.classList.add("option-checkbox");
                optionCheckbox.dataset.gameName = gameData.name;
    
                optionLabel.appendChild(optionCheckbox);
                optionLabel.appendChild(document.createTextNode(` ${optionName}`));
    
                optionsContainer.appendChild(optionLabel);
            });
    
            // Gestion de la sélection du jeu entier
            gameCheckbox.addEventListener('change', (event) => {
                const isChecked = event.target.checked;
                const optionCheckboxes = optionsContainer.querySelectorAll('.option-checkbox');
                optionCheckboxes.forEach(optionCheckbox => {
                    optionCheckbox.checked = isChecked;
                });
            });
    
            // Gestion de la sélection des options
            const optionCheckboxes = optionsContainer.querySelectorAll('.option-checkbox');
            optionCheckboxes.forEach(optionCheckbox => {
                optionCheckbox.addEventListener('change', () => {
                    const anyChecked = Array.from(optionCheckboxes).some(checkbox => checkbox.checked);
                    // Mettre à jour l'état de la case du jeu
                    gameCheckbox.checked = anyChecked;
                });
            });
    
            gameCategory.appendChild(optionsContainer);
            container.appendChild(gameCategory);
        });
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
        delete this.data.reservationLinks[langCode];
        this.availableLanguages = this.availableLanguages.filter(lang => lang !== langCode);
        this.generateLanguageContents();
        this.initializeInterface(); // Réinitialiser l'interface
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
    renamePack() {
        let packId = this.elements.packSelect.value;
        if (packId) {
            let pack = this.data.packs[packId];
            if (!pack) {
                alert("Le pack sélectionné n'existe pas.");
                return;
            }
            let newName = prompt("Entrez le nouveau nom du pack:", pack.names.fr);
            if (newName !== null) {
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
    renameGame() {
        let packId = this.elements.packSelect.value,
            gameId = this.elements.gameSelect.value;
        if (packId && gameId) {
            let pack = this.data.packs[packId];
            if (!pack) {
                alert("Le pack sélectionné n'existe pas.");
                return;
            }
            let game = pack.games[gameId];
            if (!game) {
                alert("Le jeu sélectionné n'existe pas.");
                return;
            }
            this.availableLanguages.forEach(lang => {
                let newName = prompt(`Nouveau nom pour le jeu (${lang.toUpperCase()}):`, game.names[lang]);
                if (newName !== null) {
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
    deleteGame() {
        let packId = this.elements.packSelect.value,
            gameId = this.elements.gameSelect.value;
        if (packId && gameId) {
            let pack = this.data.packs[packId];
            if (!pack) {
                alert("Le pack sélectionné n'existe pas.");
                return;
            }
            if (!pack.games[gameId]) {
                alert("Le jeu sélectionné n'existe pas.");
                return;
            }
            if (confirm("Êtes-vous sûr de vouloir supprimer ce jeu ?")) {
                delete pack.games[gameId];
                this.initializeInterface();
            }
        } else {
            alert("Veuillez sélectionner un pack et un jeu.");
        }
    }
    renameOption() {
        let packId = this.elements.packSelect.value,
            gameId = this.elements.gameSelect.value,
            optionId = this.elements.optionSelect.value;
        if (packId && gameId && optionId) {
            let pack = this.data.packs[packId];
            if (!pack) {
                alert("Le pack sélectionné n'existe pas.");
                return;
            }
            let game = pack.games[gameId];
            if (!game) {
                alert("Le jeu sélectionné n'existe pas.");
                return;
            }
            let option = game.options[optionId];
            if (!option) {
                alert("L'option sélectionnée n'existe pas.");
                return;
            }
            this.availableLanguages.forEach(lang => {
                let newName = prompt(`Nouveau nom pour l'option (${lang.toUpperCase()}):`, option.names[lang]);
                if (newName !== null) {
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
    deleteOption() {
        let packId = this.elements.packSelect.value,
            gameId = this.elements.gameSelect.value,
            optionId = this.elements.optionSelect.value;
        if (packId && gameId && optionId) {
            let pack = this.data.packs[packId];
            if (!pack) {
                alert("Le pack sélectionné n'existe pas.");
                return;
            }
            let game = pack.games[gameId];
            if (!game) {
                alert("Le jeu sélectionné n'existe pas.");
                return;
            }
            if (!game.options[optionId]) {
                alert("L'option sélectionnée n'existe pas.");
                return;
            }
            if (confirm("Êtes-vous sûr de vouloir supprimer cette option ?")) {
                delete game.options[optionId];
                this.initializeInterface();
            }
        } else {
            alert("Veuillez sélectionner un pack, un jeu et une option.");
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
            this.downloadFile(fileContent, "data.js");
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
                suggestedName: "data.js",
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
            this.downloadFile(content, "data.js");
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
    document.addEventListener('DOMContentLoaded', () => {
        const centerColumn = document.getElementById('centerColumn');
        const toggleButton = document.getElementById('toggleCenterColumn');
        
        if (centerColumn && toggleButton) {
            centerColumn.style.display = 'none';
            console.log("Initialisation de la colonne centrale");
        }
    });