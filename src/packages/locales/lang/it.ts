export default {
  nav: {
    wordmark: "Isagog",
    home: "Inizio",
    approach: "Approccio",
    platform: "Piattaforma",
    project: "Progetti",
    blog: "Approfondimenti",
    careers: "Lavora con noi",
    cta: "Valutiamo il vostro caso",
    menu: "Menu di navigazione",
  },
  footer: {
    home: "Inizio",
    approach: "Approccio",
    platform: "La Piattaforma",
    project: "Progetti",
    blog: "Approfondimenti",
    careers: "Lavora con noi",
    contact: "Contatti",
    email: "info@isagog.com",
    privacyPreferences: "Preferenze privacy",
    copyright: "(c) {year} Isagog Srl",
    street: "Via Faà di Bruno 52",
    zip: "00195 Roma (IT)",
  },
  home: {
    hero: {
      imageAlt: "Illustrazione di un albero, Isagog",
      title: "Una IA che sa anche cosa non sa",
      tagline: "E sa dirtelo",
    },
    apertura: {
      eyebrow: "INTELLIGENZA ARTIFICIALE · CONOSCENZA ESPLICITA",
      titleLine1: "Dare forma alla",
      titleEm: "vostra conoscenza.",
      titleLine2: "Poi farla ragionare.",
      sub: "La conoscenza della vostra organizzazione vive in molte forme: in documenti e conversazioni, in tabelle e transazioni, nei dati e nell'esperienza delle persone. Isagog la rende esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale, con una visione, un metodo e una piattaforma.",
      ctaPrimary: "Valutiamo il vostro caso ↗",
      ctaSecondary: "Scoprite come funziona",
    },
    knowledgeDemo: {
      eyebrow: "TRE DOMINI, UNA PIATTAFORMA",
      title: "Dalla somiglianza al ragionamento.",
      intro: "La ricerca testuale, anche per similarità semantica, trova solo passaggi pertinenti. Un [grafo RDF](onto:reasoning) invece collega entità, fatti, fonti e relazioni; l'[ontologia](onto:) esplicita le regole con cui derivare nuove conoscenze.",
      traceLabel: "Esplora le fonti del ragionamento",
      proof: {
        label: "Il ragionamento in evidenza",
        fact: "NEL GRAFO",
        rule: "NELL'ONTOLOGIA",
        conclusion: "PER INFERENZA",
      },
      negative: {
        eyebrow: "CLINICA · CONOSCENZA NEGATIVA",
        title: "«No» è diverso da «non lo so».",
        explanation: "«Non eseguito» è un fatto negato, documentato in una fonte. Se mancasse questa informazione, non sapremmo se il test è stato eseguito: l'assenza di un dato non dimostra il contrario.",
        explore: "Dal fatto negato alla revisione di una diagnosi →",
      },
      tablistLabel: "Scegli un dominio",
      questionPickerLabel: "Scegli una domanda",
      lineLabel: "riga",
      refusalCaption: "Il sistema non generalizza",
      ctaTitle: "Una piattaforma. Tre domini.",
      ctaLink: "Scoprite come funziona →",
      museo: {
        tabLabel: "MUSEO",
        shortDisclosure: "Esempio illustrativo su una ontologia di un museo di arte contemporanea.",
        disclosure:
          "Istanze illustrative su schema reale: la mostra, le opere e le sale sono inventate; le classi e le proprietà attraversate — Exhibition, Painting, Installation, VideoArtwork, Hall, exhibited_in, located_in, adjacent_to — sono quelle dell'ontologia MAXXI (v2.8) e della top ontology Isagog che essa importa.",
        resolutionLabel: "COME È STATA RISOLTA",
        resultsLabel: "RISPOSTA DAL GRAFO",
        axiomsLabel: "SU QUALI ASSIOMI",
        graphStepLabel: "QUERY SUL GRAFO",
        inferenceStepLabel: "INFERENZA",
        nodes: {
          rottaDiTerra: "Rotta di terra (2021)",
          attraverso: "Attraverso (2019)",
          veleDiSale: "Vele di sale (2022)",
          terraFerma: "Terra ferma (2020)",
          senzaTitolo: "Senza titolo (1998)",
          sala3: "Sala 3",
          gallerie: "Gallerie",
        },
        questions: {
          conjunctive: {
            pickerLabel: "Visitatore",
            proof: {
              fact: "«Rotta di terra» è un Painting; «Attraverso» è un VideoArtwork.",
              rule: "Painting → VisualArtwork → MaterialArtwork → Artwork. VideoArtwork → ImmaterialArtwork → Artwork. Ogni passaggio indica una sottoclasse.",
              conclusion: "Entrambe sono quindi Artwork: la domanda sulle «opere» le include per inferenza, insieme ai filtri sulla mostra e sugli autori.",
            },
            question:
              "Quali opere di artisti italiani nati dopo il 1980 posso vedere nella mostra «La luce della migrazione»?",
            steps: {
              findExhibition: "Individua la mostra a partire dal titolo.",
              worksInExhibition: "Raccogli le opere esposte in quella mostra.",
              authors: "Da ogni opera risali al suo autore, quando è un artista.",
              filterAuthors: "Tieni gli autori italiani nati dopo il 1980.",
              subsumption:
                "«Opere» non è stato cercato una classe alla volta: un dipinto e un'opera video rientrano perché le loro classi sono sottoclassi di Artwork.",
              collectiveOut:
                "Il collettivo non ha un tipo Artist dichiarato o derivabile, quindi non soddisfa la condizione positiva della query. Questo non prova una negazione.",
            },
            details: {
              rottaDiTerra: "Nadia Ferri — italiana, 1988",
              attraverso: "Marco Sabbatini — italiano, 1985",
              veleDiSale: "Collettivo Mareo — il tipo Artist non è dichiarato né derivabile dai dati disponibili",
              terraFerma: "Giulio Neri — italiano, 1979: fuori per data di nascita",
              senzaTitolo: "Hélène Roux — francese, 1962: fuori per nazionalità e data di nascita",
            },
            axioms: {
              artworkUnion:
                "Painting e VideoArtwork sono sottoclassi di Artwork: la domanda dice «opere», e il sistema le raccoglie per sussunzione, senza che nessuno abbia elencato le classi da cercare.",
              artistIsPerson:
                "Artist è sottoclasse di Person. Il tipo Collective, da solo, non permette di derivare Artist. La query non include quel risultato, ma l'assenza del tipo non equivale a una negazione: servirebbe un assioma ulteriore.",
            },
            answer:
              "Due opere sulle cinque in mostra: «Rotta di terra» (2021) di Nadia Ferri e «Attraverso» (2019) di Marco Sabbatini.",
            note: "La domanda combina relazioni e filtri sul grafo con la sussunzione delle classi. Il collettivo non soddisfa la condizione positiva Artist; non viene derivato che sia una non-Person.",
          },
          allestimento: {
            pickerLabel: "Allestimento",
            proof: {
              fact: "«Attraverso» è un VideoArtwork; «Vele di sale» è un'Installation.",
              rule: "VideoArtwork è sottoclasse di ImmaterialArtwork. Le descrizioni dell'ontologia definiscono un'opera senza forma fisica e un'installazione che occupa uno spazio specifico.",
              conclusion: "Il tipo immateriale è inferito. Le esigenze di proiezione e spazio sono un'interpretazione di quelle definizioni, da verificare in allestimento: non un vincolo formalizzato in OWL.",
            },
            question:
              "Quali opere di questa mostra hanno bisogno di uno spazio dedicato o di attrezzatura?",
            steps: {
              worksInExhibition: "Raccogli le cinque opere esposte nella mostra.",
              classes: "Leggi la classe di ciascuna opera.",
              noSuchProperty:
                "Nessuna proprietà dello schema dice «richiede attrezzatura»: non c'è un campo da leggere.",
              fromClassDefinitions:
                "L'ontologia permette di inferire il tipo ImmaterialArtwork. Le indicazioni su spazio e attrezzatura interpretano le descrizioni delle classi, non un assioma OWL sui requisiti.",
            },
            details: {
              veleDiSale: "Spazio dedicato da valutare in base alla descrizione di Installation",
              attraverso: "Attrezzatura video da verificare in allestimento",
              rottaDiTerra: "Opera materiale; requisiti di allestimento non specificati",
            },
            axioms: {
              installationOccupiesSpace:
                "La descrizione di Installation suggerisce di valutare uno spazio dedicato. La frase è un'annotazione dell'ontologia, non un assioma che impone una sala.",
              immaterialHasNoForm:
                "VideoArtwork è sottoclasse di ImmaterialArtwork: questo tipo è derivabile. Il tipo di attrezzatura necessario richiede invece una verifica specifica.",
            },
            answer:
              "Due opere da esaminare per spazio o attrezzatura: l'installazione «Vele di sale» e il video «Attraverso».",
            note: "L'esempio distingue la sussunzione formale delle classi dall'interpretazione delle loro descrizioni. Lo schema non formalizza requisiti di attrezzatura; la proposta va verificata sul caso concreto.",
          },
          orientamento: {
            pickerLabel: "Orientamento",
            proof: {
              fact: "L'opera è esposta nella mostra, allestita nella Sala 3. Il grafo registra Sala 2 adjacent_to Sala 3.",
              rule: "adjacent_to è dichiarata owl:SymmetricProperty nella top ontology Isagog.",
              conclusion: "Vale anche Sala 3 adjacent_to Sala 2, senza memorizzare il collegamento inverso. La sala dell'opera si trova seguendo le relazioni con la mostra.",
            },
            question: "In quale sala trovo «Rotta di terra»?",
            steps: {
              noLocationOnArtwork: "Cerca un luogo sull'opera: dall'opera non parte alcun arco di ubicazione.",
              toExhibition: "Risali alla mostra che la espone.",
              toHall: "Dalla mostra, all'ambiente in cui è allestita.",
              hallInBuilding: "Dalla sala, allo spazio espositivo e all'edificio di cui è parte.",
              symmetry:
                "Il grafo registra una sola volta «Sala 2 adiacente alla Sala 3»: adjacent_to è simmetrica, quindi vale anche nell'altro verso.",
            },
            details: {
              sala3: "Secondo piano, subito dopo la Sala 2",
              gallerie: "Lo spazio espositivo di cui la sala fa parte",
            },
            axioms: {
              hallIsAPlace:
                "Una sala è parte di un edificio, e quindi un Luogo: soddisfa il range di located_in senza che l'ontologia del museo debba ridichiararlo.",
              adjacencyIsSymmetric:
                "Nella top ontology adjacent_to è dichiarata owl:SymmetricProperty: un'adiacenza registrata una volta sola risponde nei due versi.",
            },
            answer: "Nella Sala 3, al secondo piano: dalla Sala 2 si prosegue nella sala successiva.",
            note: "Il grafo non registra un luogo direttamente sull'opera. La risposta risale alla mostra e alla sala; la simmetria di adjacent_to permette inoltre di derivare l'adiacenza inversa.",
          },
        },
      },
      giornale: {
        tabLabel: "GIORNALE",
        shortDisclosure: "Esempio illustrativo sullo schema di un archivio storico giornalistico.",
        traceLabel: "Esplora le fonti del ragionamento",
        disclosure:
          "Istanza illustrativa su schema reale: il caso è inventato; le classi dei descrittori — HumanDescriptor, AIDescriptor, DBPediaDescriptor, WikipediaDescriptor, ContextualDescriptor — sono quelle della ontologia di un archivio giornalistico.",
        entity: "Progetto Parco Nord",
        questions: {
          archive: {
            question: "Cosa sappiamo del progetto Parco Nord?",
            answer:
              "Recuperiamo cinque fatti con provenienza esplicita: un redattore, un modello di IA, DBpedia, Wikipedia e una descrizione legata al momento dell'articolo.",
            facts: {
              human: "Coordinato dall'assessorato al Verde pubblico",
              ai: "Avviato nel 2019",
              dbpedia: "Situato nel quartiere Nord",
              wikipedia: "Descritto nella voce Wikipedia del quartiere",
              contextual: "In fase di realizzazione (al momento di questo articolo)",
            },
          },
          refusal: {
            question: "Qual è il budget del progetto?",
            answer:
              "Non confermato: l'unico dato disponibile viene da un descrittore IA, senza riscontro umano o esterno.",
            facts: {
              aiOnly: "Budget stimato: 2 milioni di euro",
            },
          },
        },
      },
      clinica: {
        tabLabel: "CLINICA",
        shortDisclosure: "Caso sintetico e pseudonimizzato; affermazioni e fonti dal grafo clinico.",
        traceLabel: "Esplora le fonti del ragionamento",
        revision: "L'affermazione di settembre supera esplicitamente quelle precedenti tramite la relazione supersedes: non basta scegliere il testo più simile o più recente.",
        knowledgeBoundary: "Negated registra un fatto esplicitamente negato; RuledOut una valutazione esclusa. Un fatto mancante resta ignoto e un sospetto resta aperto: non diventano falsi per assenza di conferma.",
        disclosure:
          "Dati reali (sintetici, pseudonimizzati): il caso clinico è sintetico per costruzione, ma le affermazioni, le citazioni e i riferimenti a documento e riga provengono dal grafo di conoscenza.",
        notes: {
          reportedPediatric: "Riferita dal paziente; l'episodio non è documentato.",
          neverTested: "Nessun test allergologico è mai stato eseguito.",
          steeringTreatment: "L'etichetta non verificata comincia a orientare le scelte terapeutiche.",
          deLabelled: "La valutazione specialistica supera le due segnalazioni precedenti.",
          bcl2: "Accertato in laboratorio, non riferito dal paziente.",
          boneSuspected: "Ipotesi aperta: in attesa di conferma istologica.",
        },
        polarityGloss: {
          Asserted: "confermato",
          Reported: "riferito, non verificato",
          Negated: "esplicitamente negato nella fonte",
          RuledOut: "escluso; supera le valutazioni precedenti",
          Suspected: "ipotesi aperta",
        },
        questions: {
          allergy: {
            question: "È allergico alla penicillina?",
            answer:
              "Dipende da quando lo si chiede: riferita ma mai testata da febbraio ad aprile, poi esclusa (de-labellata) a settembre 2025.",
          },
          bcl2: {
            question: "BCL2?",
            answer: "Sì — positivo, accertato per immunoistochimica.",
          },
          bone: {
            question: "Localizzazione ossea?",
            answer: "Sospetta, non ancora confermata: in attesa dell'esame istologico.",
          },
        },
      },
    },
    persone: {
      eyebrow: "LE PERSONE DI ISAGOG",
      titleLine1: "Esperienza profonda.",
      titleEm: "Un confronto diretto.",
      lead: "Dalla ricerca all'impresa, fino al vostro prossimo progetto.",
      guido: {
        name: "Guido Vetere",
        role: "Fondatore e CEO — già Director of Center for Advanced Studies IBM Italy",
        bio: "Guido ha guidato per anni la ricerca IBM in Italia su linguaggio, logica e rappresentazione della conoscenza. Oggi insegna Intelligenza Artificiale all'Università Marconi, e porta in Isagog la stessa idea che ha guidato la sua ricerca: un'intelligenza artificiale che ragiona su basi esplicite, non solo su correlazioni statistiche.",
      },
      robert: {
        name: "Robert J. Alexander",
        role: "Co-fondatore — già Executive Health and Research IBM, Medical doctor",
        bio: "Bob applica l'intelligenza artificiale alla pratica clinica da quarant'anni. Un'esperienza maturata dove un errore ha conseguenze reali — ed è la ragione per cui, in Isagog, la tracciabilità delle risposte non è un dettaglio tecnico ma un requisito.",
      },
    },
  },
  approach: {
    visione: {
      eyebrow: "01 / VISIONE",
      titleLine1: "Un'IA che sa dire",
      titleEm: "come lo sa.",
      lead: "E che quando serve sa dire: non lo so",
      p1: "Quando una risposta entra nel lavoro di un'organizzazione, deve poter essere esaminata: quali informazioni usa, quali relazioni collega, quali elementi mancano. Un'intelligenza degna di fiducia sa mostrare da dove viene una risposta, e sa tacere quando la conoscenza a sua disposizione tace.",
      p2: "Per questo costruiamo una rappresentazione esplicita del vostro dominio: concetti e relazioni che i vostri esperti possono discutere e correggere. È ciò che chiamiamo un'[ontologia](onto:) — la descrizione di ciò che esiste nel vostro mondo, di come si chiama e di come si lega al resto.",
      p3: "Da questa idea discende una precisa divisione del lavoro. Ai modelli linguistici il mestiere che sanno fare meglio: comprendere il linguaggio, dialogare, formulare. I contenuti restano altrove, in una base di conoscenza consultabile e aggiornabile, su cui fondare le risposte e verificarne i passaggi.",
      p4a: "È un'idea antica. L'",
      p4Isagoge: "Isagoge",
      p4b: " di Porfirio, introduzione alle ",
      p4Categorie: "Categorie",
      p4c: " di Aristotele, è il primo tentativo di ordinare la conoscenza per poterla pensare. Il nostro nome viene da lì.",
      bonsaiAlt: "Illustrazione di un albero bonsai",
      caseEyebrow: "IL CASO DI UN MUSEO",
      caseTitleLine1: "Dalla scheda della mostra",
      caseTitleLine2: "alla domanda del visitatore.",
      caseBody: "Collegare mostre, opere, autori e testi aiuta a costruire un'assistenza che orienta il pubblico e rende consultabile il patrimonio informativo del museo.",
    },
    metodologia: {
      eyebrow: "02 / METODOLOGIA",
      titleLine1: "Agli agenti l'analisi.",
      titleEm: "Agli esperti il giudizio.",
      lead: "Dai vostri documenti e dai vostri dati, una conoscenza che ragiona. In giorni, sotto la vostra supervisione.",
      p1: "Isagog ha un metodo per costruire la base di conoscenza di un'organizzazione a partire da ciò che già possiede, e per ragionarci sopra. I nostri agenti, basati su modelli linguistici specializzati, leggono documenti e dati, riconoscono concetti e relazioni impliciti e ne propongono i [modelli](onto:layers), pronti per la revisione; altri agenti estraggono poi informazione strutturata, dato per dato, in modo tracciabile. Sono processi ripetibili: nuovi documenti, nuovi dati, stessi procedimenti.",
      p2: "Agli esperti di dominio resta il compito che solo loro possono svolgere: supervisionare. Leggono ciò che gli agenti hanno proposto, correggono, approvano — ciò che prima richiedeva mesi di analisi e colloqui si ottiene in giorni. È questo che rende il metodo scalabile e ne tiene i costi sotto controllo.",
      cap1: {
        title: "Rappresentare",
        body: "Individuiamo concetti e relazioni del vostro dominio. Gli agenti ne propongono il modello; i vostri esperti lo validano.",
        result: "Concetti condivisi prima dei contenuti",
      },
      cap2: {
        title: "Raccogliere",
        body: "Secondo il modello condiviso, gli agenti estraggono informazioni e le collegano alle fonti. Nuovi documenti alimentano la conoscenza attraverso procedimenti ripetibili.",
        result: "Nuovi dati, un metodo riutilizzabile",
      },
      cap3: {
        title: "Ragionare",
        body: "Il modello linguistico porta la comprensione del linguaggio, il [grafo di conoscenza](onto:reasoning) porta la struttura, la coerenza e la prova. È l'integrazione che chiamiamo neurosimbolica, ed è il cuore del nostro metodo.",
        result: "La conoscenza nei processi quotidiani",
      },
      closing: "Questa divisione del lavoro ha una conseguenza importante: quando i contenuti stanno nel grafo e il modello si occupa del linguaggio, anche un modello di piccole dimensioni è all'altezza del compito. Ragiona su ciò che è scritto, e ciò che è scritto si può leggere, correggere e approvare, senza addestrare né riaddestrare nulla.",
    },
  },
  platform: {
    tecnologia: {
      eyebrow: "LA PIATTAFORMA",
      titleLine1: "Una piattaforma",
      titleEm: "nelle vostre mani.",
      lead: "Sui vostri sistemi, con i vostri dati, ai vostri costi.",
      p1: "Isagog ha sviluppato una piattaforma che mette il metodo nelle mani di chi lo deve usare. Gli agenti leggono i vostri dati e propongono la conoscenza; i vostri esperti la supervisionano e la approvano; la piattaforma la interroga, la fa ragionare e la porta nei compiti quotidiani.",
      p2: "La conoscenza resta un bene dell'organizzazione, esplicito e modificabile, e con essa la trasparenza che le norme richiedono: ogni risposta risale alla sua fonte, ogni inferenza si può ripercorrere.",
      usecasesLabel: "LE ESIGENZE SONO DIVERSE QUANTO LE FORME DELLA CONOSCENZA",
      uc1: {
        title: "Un ufficio legale",
        body: "Ha bisogno di tracciabilità.",
      },
      uc2: {
        title: "Un servizio clienti",
        body: "Ha bisogno di velocità.",
      },
      uc3: {
        title: "Un oncologo",
        body: "Ha bisogno di un quadro completo del paziente, e di risposte di cui risalire alla fonte, dato per dato.",
      },
      uc4: {
        title: "Una guida museale",
        body: "Ha bisogno quasi dell'opposto: ampiezza, per collegare un'opera alla storia, ai luoghi e alle persone che la circondano.",
      },
      usecasesClose: "La stessa piattaforma serve entrambi gli estremi, perché consente di scegliere quale strumento usare e in quale misura.",
      ctrl1: {
        title: "Infrastruttura vostra.",
        body: "Si installa sulla vostra infrastruttura o sul Cloud e lavora con modelli aperti.",
      },
      ctrl2: {
        title: "Costi noti in anticipo.",
        body: "I dati restano in casa, e i costi sono noti in anticipo.",
      },
      ctrl3: {
        title: "Ogni dimensione.",
        body: "Anche una piccola organizzazione ha un mondo intero da rappresentare.",
      },
      badge: "La conoscenza resta un bene dell'organizzazione.",
    },
    explorerTitle: "Esplora la piattaforma Isagog",
    mobileNotice:
      "Il diagramma interattivo della piattaforma non è disponibile su schermi piccoli.",
    mobileCta: "Visita questa pagina da tablet o computer per esplorarlo",
  },
  textCarousel: {
    dotLabel: "Vai alla slide {n}",
    slide1: {
      title: "Knowledge Augmented Generation",
      subtitle: "Oltre la RAG: risposte fondate su fatti, non solo su testi",
      point1:
        "Gli agenti analitici leggono i tuoi documenti e li trasformano in un [grafo di conoscenza](onto:reasoning): entità, fatti, relazioni.",
      point2:
        "Il grafo lavora insieme alla ricerca vettoriale: la precisione del ragionamento più l'ampiezza della ricerca.",
      point3:
        "Le risposte sono generate dal modello linguistico, ma ancorate e verificate sui fatti del grafo.",
    },
    slide2: {
      title: "Agenti su misura, senza codice",
      subtitle: "Definisci e orchestri i tuoi agenti in modalità no-code",
      point1:
        "Agenti che analizzano i documenti e popolano la conoscenza, agenti che cercano, agenti che dialogano.",
      point2:
        "Li componi e li coordini dall'interfaccia, senza scrivere una riga di codice.",
      point3: "Ogni progetto ha i suoi agenti, i suoi strumenti, il suo spazio di lavoro.",
    },
    slide3: {
      title: "Il controllo resta a te",
      subtitle: "Trasparenza, sovranità e conformità fin dalla progettazione",
      point1:
        "Trasparenza: ogni risposta è verificabile — puoi ispezionare fonti, passaggi e strumenti usati dall'AI.",
      point2:
        "Sovranità dei dati: la piattaforma gira sulla tua infrastruttura, anche con modelli piccoli e aperti.",
      point3:
        "Conformità (EU AI Act, GDPR): accessi basati sui ruoli, autenticazione forte, dati isolati per ogni spazio di lavoro.",
      point4:
        "Costi sotto controllo: scegli i modelli, fissa i limiti d'uso, nessun vincolo con un fornitore.",
    },
  },
  project: {
    heading: "Progetti",
    notFound: "Progetto non trovato",
    backToProjects: "Torna ai progetti",
    loadError: "Non è stato possibile caricare i progetti. Riprova più tardi.",
  },
  blog: {
    heading: "Approfondimenti",
    technical: {
      heading: "Approfondimenti tecnici",
      ontology: {
        title: "Le ontologie Isagog",
        description:
          "Concetti intesi come prospettive che guidano il ragionamento dei modelli linguistici e del grafo di conoscenza: livelli, prospettive ed esploratore dei termini.",
      },
      llmSizing: {
        eyebrow: "Strumento interattivo · Ottobre 2026",
        title: "Matrice di dimensionamento on-prem degli LLM",
        description:
          "27 modelli open-weight a confronto con 14 configurazioni hardware, dalla GPU desktop al nodo Blackwell: cosa ci sta in memoria e a quanti token al secondo.",
      },
    },
    articles: {
      heading: "Articoli",
    },
    notFound: "Articolo non trovato",
    backToBlog: "Torna al blog",
    nextArticle: "Prossimo articolo",
    loadError: "Non è stato possibile caricare gli articoli. Riprova più tardi.",
  },
  contact: {
    contatto: {
      eyebrow: "DALLA DIMOSTRAZIONE AL LAVORO QUOTIDIANO",
      titleLine1: "Il valore comincia",
      titleLine2: "con",
      titleEm: "utenti veri.",
      p1: "Un proof of concept dimostra una possibilità. Portarla nel lavoro quotidiano richiede un obiettivo preciso, informazioni adeguate e criteri condivisi per valutare il risultato.",
      p2Strong: "Quale processo vorreste migliorare?",
      p2: "Nel primo confronto esaminiamo il vostro caso, i dati disponibili e i vincoli. Individuiamo dove la piattaforma può contribuire e quale verifica fare per prima.",
      step1: "Ci raccontate l'esigenza.",
      step2: "Individuiamo le informazioni e i vincoli.",
      step3: "Definiamo insieme la prima verifica utile.",
      mailLink: "Preferite scriverci? info@isagog.com ↗",
      formTitle: "Mettiamo a fuoco l'esigenza.",
      formSub: "Bastano poche righe per iniziare.",
      fieldName: "Nome e cognome",
      fieldNamePlaceholder: "Il vostro nome",
      fieldEmail: "Email di lavoro",
      fieldEmailPlaceholder: "nome@organizzazione.it",
      fieldOrg: "Organizzazione",
      fieldOrgPlaceholder: "La vostra organizzazione",
      fieldMessage: "Quale processo vorreste migliorare?",
      fieldMessagePlaceholder:
        "Ad esempio: collegare informazioni sui prodotti per aiutare il nostro servizio clienti…",
      formNote: "È sufficiente descrivere il caso, senza inserire dati riservati.",
      submit: "Preparate la richiesta ↗",
      disclosure:
        "Questo prototipo prepara una bozza email. Potrete rivederla e inviarla dal vostro programma di posta. Nessun dato viene inviato dal modulo.",
      mailSubject: "Isagog — richiesta di confronto",
      mailName: "Nome",
      mailEmail: "Email",
      mailOrg: "Organizzazione",
    },
  },
  careers: {
    invito: {
      eyebrow: "LAVORA CON NOI",
      titleLine1: "Sviluppa con noi",
      titleEm: "un'IA fondata sulla conoscenza.",
      lead: "Collaborazioni professionali in sviluppo software Python, IA e dati.",
      factRemote: "Full remote",
      whyLabel: "PERCHÉ ISAGOG",
      why1: "In Isagog Srl rendiamo la conoscenza delle organizzazioni accessibile a persone e applicazioni. Combiniamo modelli linguistici, [grafi di conoscenza](onto:reasoning) e ragionamento per costruire sistemi di IA le cui risposte siano fondate su informazioni verificabili e i cui limiti siano riconoscibili.",
      why2: "Il nostro lavoro parte dai problemi degli utenti e arriva al software che li aiuta ad affrontarli. La qualità di una soluzione si misura nella sua utilità, nella possibilità di comprenderne il comportamento e nella cura con cui viene mantenuta.",
      why3: "Siamo una PMI in cui ricerca e sviluppo lavorano a stretto contatto. Cerchiamo persone interessate a contribuire a progetti di IA avanzata, assumendosi la responsabilità di incarichi concreti e confrontandosi con professionisti di comprovata esperienza accademica e di ricerca.",
    },
    competenze: {
      eyebrow: "IL CONTRIBUTO CHE CERCHIAMO",
      titleLine1: "Dall'esigenza",
      titleEm: "alla consegna.",
      lead: "Backend e componenti che collegano dati, conoscenza e agenti IA.",
      p1: "Lavorerai soprattutto sul backend e sui componenti che collegano dati, conoscenza e agenti IA. In base alle tue competenze e al progetto, potrai sviluppare servizi e API, integrare fonti informative, costruire pipeline di elaborazione o migliorare l'affidabilità e la valutazione dei sistemi.",
      p2: "Ci aspettiamo che tu sappia seguire un'attività lungo il suo percorso: comprendere l'esigenza, chiarire i vincoli, proporre una soluzione, realizzarla, verificarla e documentarne la consegna. Le scelte architetturali devono avere una motivazione comprensibile e mantenere il software ordinato, modificabile e proporzionato al problema.",
      skillsLabel: "LE COMPETENZE",
      skillsIntroA: "Cerchiamo una base solida di ",
      skillsIntroStrong: "ingegneria software Python",
      skillsIntroB: ", accompagnata da esperienza concreta in una o più delle aree di IA e dati su cui lavoriamo:",
      skill1: {
        title: "Backend e integrazione",
        body: "Python moderno, programmazione asincrona, API e servizi web, modellazione dei dati e integrazione tra sistemi. Usiamo principalmente FastAPI e Pydantic.",
      },
      skill2: {
        title: "IA applicata e conoscenza",
        body: "Modelli linguistici e agenti, ricerca semantica e RAG, valutazione dei risultati. Grafi di conoscenza, [ontologie](onto:) e RDF/SPARQL sono una specializzazione particolarmente rilevante per noi.",
      },
      skill3: {
        title: "Dati e processi affidabili",
        body: "Database relazionali e vettoriali, pipeline e workflow, gestione degli errori e delle ripartenze. Nel nostro stack trovi PostgreSQL/pgvector, Redis e Temporal.",
      },
      skill4: {
        title: "Qualità e rilascio",
        body: "Git, test automatizzati, documentazione tecnica, Docker e familiarità con ambienti Linux e integrazione continua.",
      },
      optionalA: "È utile sapersi orientare in un'interfaccia TypeScript. Sono ",
      optionalStrong: "competenze opzionali apprezzate",
      optionalB: " l'esperienza con React, la conoscenza dell'inglese e la capacità di condurre presentazioni e demo, spiegando con chiarezza soluzioni e risultati anche a interlocutori non tecnici.",
      learning: "Non è necessario conoscere già ogni strumento: nella candidatura indica le aree in cui sei autonomo e quelle che vuoi approfondire. Valutiamo la qualità del lavoro e la capacità di apprendere attraverso esempi concreti.",
    },
    metodo: {
      eyebrow: "COME LAVORIAMO, ANCHE A DISTANZA",
      titleLine1: "Autonomia, responsabilità",
      titleEm: "e collaborazione.",
      intro: "Il lavoro è interamente da remoto e richiede autonomia, responsabilità e collaborazione. Per noi significa:",
      step1: {
        title: "Ascoltare e analizzare",
        body: "Comprendere il punto di vista dell'utente, fare domande pertinenti e tradurre esigenze e vincoli in requisiti e criteri di verifica condivisi.",
      },
      step2: {
        title: "Progettare con metodo",
        body: "Chiarire l'approccio prima di sviluppare, discutere alternative e compromessi, documentare le ragioni delle decisioni.",
      },
      step3: {
        title: "Portare a termine gli incarichi",
        body: "Concordare obiettivi e tempi, organizzare il lavoro, verificare il risultato e curare la consegna.",
      },
      step4: {
        title: "Rendere visibile l'avanzamento",
        body: "Comunicare con chiarezza, segnalare tempestivamente problemi e dipendenze e chiedere un confronto quando serve.",
      },
      aiEyebrow: "SVILUPPO ASSISTITO DALL'IA",
      aiTitleLine1: "Con gli assistenti di coding,",
      aiTitleEm: "con metodo.",
      aiP1a: "Cerchiamo capacità di usare professionalmente ",
      aiP1Strong: "assistenti di coding come Codex, Claude Code o strumenti equivalenti",
      aiP1b: ". Per noi significa saper fornire il contesto del repository, specifiche chiare e vincoli progettuali, e guidare il lavoro verso modifiche mirate, coerenti con l'architettura, la struttura e le convenzioni del software esistente.",
      aiP2: "Ci aspettiamo che tu sappia scegliere quali attività affidare agli assistenti, suddividere il lavoro in passaggi verificabili e valutare criticamente le proposte. Il codice generato va compreso, revisionato e verificato con test pertinenti, controllando anche che mantenga le responsabilità dei componenti e non introduca duplicazioni o complessità superflua.",
      aiClosing: "La responsabilità tecnica delle scelte e della consegna resta a chi sviluppa.",
    },
    candidatura: {
      eyebrow: "LA COLLABORAZIONE",
      titleLine1: "Progetti reali",
      titleEm: "di IA avanzata.",
      p1: "Offriamo incarichi su progetti reali di IA avanzata, con un contributo riconoscibile al prodotto e confronto diretto con figure di esperienza nella ricerca, nell'accademia e nello sviluppo di sistemi complessi.",
      termModeLabel: "Modalità",
      termMode: "Full remote. La forma contrattuale si concorda in base al profilo e all'impegno previsto.",
      termPayLabel: "Compenso",
      termPay: "Candidati esperti: 2.200 € mensili + IVA ed eventuali spese concordate.",
      termHoursLabel: "Disponibilità",
      termHours: "Via chat ed email, dal lunedì al venerdì, 9:00–13:00 e 14:00–17:00 (ora italiana), per il coordinamento e il confronto sulle attività.",
      p2: "Perimetro delle attività, risultati attesi e modalità di coordinamento saranno condivisi prima dell'avvio.",
      applyEyebrow: "COME CANDIDARTI",
      applyTitle: "Scrivi a work@isagog.com",
      applySubjectLabel: "Con oggetto",
      applySubject: "Collaborazione Python / IA – Nome Cognome",
      applyIntro: "Includi:",
      item1: "il tuo CV o un link al profilo professionale;",
      item2: "un breve racconto di un progetto significativo: problema, tuo contributo, scelte tecniche e risultato;",
      item3: "poche righe sugli assistenti di coding che usi, sulle attività a cui li applichi e su come controlli la qualità del risultato;",
      item4: "le competenze in cui sei autonomo e la tua disponibilità indicativa, compresa la possibile data di avvio.",
      extra: "Se hai codice, un portfolio o documentazione condivisibile, aggiungi i link. Puoi raccontare anche un progetto non pubblico, rispettandone la riservatezza.",
      mailLink: "Invia la candidatura ↗",
      interviewStrong: "Al colloquio approfondiremo anche il tuo uso degli assistenti di coding:",
      interview: " quali strumenti scegli, come li guidi e in quali fasi li impieghi, dall'analisi alla progettazione, allo sviluppo, ai test e alla revisione. Ti chiederemo esempi concreti, comprese le occasioni in cui hai corretto o scartato una proposta perché non rispettava i requisiti o l'architettura.",
      closing: "Ci interessa capire come affronti i problemi, come collabori e quale contributo puoi portare a Isagog.",
    },
  },
  discover: {
    hero: {
      titleLine1: "Una IA che risponde",
      titleEm: "con le vostre fonti.",
      titleLine2: "E sa dire «non lo so».",
      sub: "Isagog realizza assistenti di intelligenza artificiale per enti e organizzazioni che non possono permettersi risposte inventate. Rendiamo esplicita la conoscenza della vostra organizzazione e la facciamo ragionare con modelli linguistici aperti, che possono funzionare sulla vostra infrastruttura.",
      ctaPrimary: "Prenotate una call di 30 minuti ↓",
      ctaSecondary: "Guardate i progetti",
    },
    problema: {
      eyebrow: "COSA SERVE DAVVERO",
      titleLine1: "Usare l'IA dove",
      titleEm: "la qualità dell'informazione conta.",
      item1: {
        title: "Il controllo su ciò che l'IA sa",
        body: "La qualità di una risposta dipende dalle informazioni da cui nasce. Se sono strutturate, organizzate e modificabili, sapete da dove arriva ogni risposta e potete correggerla alla fonte, voce per voce. Un chatbot generico attinge invece a ciò che ha appreso altrove: non si sa da dove venga una risposta, né come correggerla.",
      },
      item2: {
        title: "I dati restano a voi",
        body: "Archivi, dati sanitari e atti amministrativi non possono finire sull'infrastruttura di un fornitore qualsiasi. Serve un'IA che lavori dove i vostri dati si trovano già, con regole di accesso decise da voi.",
      },
      item3: {
        title: "Una conformità dimostrabile",
        body: "Normative e linee guida chiedono sempre più spesso di sapere da dove arriva una risposta e chi ne è responsabile. Serve un sistema che renda visibili fonti e ragionamento, non una scatola nera.",
      },
    },
    approccio: {
      eyebrow: "COME LAVORA ISAGOG",
      titleLine1: "Conoscenza esplicita,",
      titleEm: "modelli aperti.",
      item1: {
        title: "Un grafo di conoscenza del vostro dominio",
        body: "Documenti, cataloghi, archivi e procedure diventano un [grafo di conoscenza](onto:reasoning) organizzato da un'[ontologia](onto:) del vostro dominio. I vostri esperti lo validano e possono aggiornarlo nel tempo.",
      },
      item2: {
        title: "Il modello propone, la conoscenza verifica",
        body: "Il modello linguistico interpreta la domanda e formula la risposta; il grafo fornisce i fatti e le regole per controllarla. Quando un'informazione manca, il sistema lo dichiara invece di inventarla.",
      },
      item3: {
        title: "Modelli aperti, sulla vostra infrastruttura",
        body: "Modelli linguistici open source, installabili anche on-premise: costi prevedibili e nessuna dipendenza da un unico fornitore.",
      },
    },
    casi: {
      eyebrow: "PROGETTI",
      titleLine1: "Già al lavoro",
      titleEm: "con utenti veri.",
      readCase: "Leggete il caso →",
      maxxi: {
        tag: "MUSEO · ROMA",
        title: "MAXXI",
        body: "MAXXIperTUTTI: un'IA conversazionale con agenti specializzati che orienta i visitatori, racconta le opere e riformula i contenuti in linguaggio facile da leggere. Validata con persone con disabilità cognitive, sordità e disabilità visive.",
      },
      manifesto: {
        tag: "EDITORIA · ARCHIVIO STORICO",
        title: "il manifesto",
        body: "MeMa – Memoria Manifesta: 800.000 articoli di un archivio riconosciuto bene di interesse culturale, consultabili per significato dalla redazione e collegati alle notizie di oggi.",
      },
      voicefirst: {
        tag: "SERVIZIO CLIENTI",
        title: "Teleperformance",
        body: "Voice First: un copilota che ascolta la conversazione, ragiona su procedure e normative e suggerisce all'operatore l'azione successiva.",
      },
    },
    settori: {
      eyebrow: "DOVE PUÒ SERVIRE",
      titleLine1: "Un metodo,",
      titleEm: "molti contesti.",
      cultura: {
        title: "Musei e cultura",
        body: "Assistenti per i visitatori, accessibilità dei contenuti, cataloghi e archivi interrogabili, ascolto del pubblico.",
      },
      pa: {
        title: "Pubblica amministrazione",
        body: "Norme, procedure e atti consultabili da uffici e cittadini, con la fonte di ogni risposta.",
      },
      sanita: {
        title: "Sanità",
        body: "Linee guida, protocolli e procedure amministrative interrogabili, distinguendo ciò che è documentato da ciò che manca.",
      },
      editoria: {
        title: "Editoria e media",
        body: "Archivi storici ricercabili per significato, collegamenti tra notizie e fonti, strumenti per le redazioni.",
      },
      enti: {
        title: "Imprese, casse ed enti",
        body: "Regolamenti, contratti e conoscenza interna a disposizione di chi lavora con clienti, iscritti e soci.",
      },
      altro: {
        title: "E molto altro",
        body: "Ovunque ci siano documenti, regole e conoscenza da rendere affidabili e consultabili.",
      },
    },
    call: {
      eyebrow: "30 MINUTI, SENZA IMPEGNO",
      titleLine1: "Parliamo del",
      titleEm: "vostro caso.",
      p1: "Una prima conversazione con il nostro team per capire se e dove l'IA può esservi utile, con quali dati e con quali garanzie.",
      stepsLabel: "Nella call",
      step1: "Ci raccontate l'esigenza e i vincoli della vostra organizzazione.",
      step2: "Vi mostriamo come abbiamo affrontato casi simili.",
      step3: "Individuiamo insieme il primo passo concreto.",
      mailLink: "Preferite scriverci? info@isagog.com ↗",
      formTitle: "Richiedete la call.",
      formSub: "Vi rispondiamo entro un giorno lavorativo per fissare giorno e ora.",
      fieldMessage: "Di che cosa vorreste parlare?",
      fieldMessagePlaceholder:
        "Ad esempio: rendere consultabile il nostro archivio, aiutare i visitatori a orientarsi…",
      mailSubject: "Isagog — richiesta di una call di 30 minuti",
    },
  },
  musei: {
    hero: {
      eyebrow: "PER I MUSEI E I LUOGHI DELLA CULTURA",
      titleLine1: "Ogni visitatore ha le sue domande.",
      titleEm: "Risponde il vostro museo.",
      sub: "Un assistente con cui il visitatore parla come con una persona, dal telefono e nella sua lingua. Risponde con i contenuti che i vostri curatori hanno controllato. E quando non sa una cosa, lo dice.",
      ctaPrimary: "Chiedete una dimostrazione ↓",
      ctaSecondary: "Guardate come risponde",
      q1: "Che opere di Ghirri posso vedere?",
      a1: "Nella mostra The Large Glass al MAXXI è esposta l'opera di Luigi Ghirri intitolata «Modena», realizzata nel 1978.",
      q2: "Sono in caffetteria, come raggiungo The Large Glass?",
      a2step1: "Dalla Caffetteria (Livello 0), passa nella Hall.",
      a2step2: "Prendi gli Ascensori della hall, vicino a EduLab 1 e Spazio espositivo.",
      a2step3: "Sali al Livello 1: arriverai direttamente nella Galleria 4, dove è allestita la mostra The Large Glass.",
      caption: "Risposte reali dell'assistente in funzione al MAXXI di Roma.",
    },
    conversazioni: {
      eyebrow: "COME RISPONDE",
      titleLine1: "Non vi raccontiamo come parla.",
      titleEm: "Ve lo facciamo leggere.",
      easy: {
        title: "La stessa domanda, per persone diverse",
        body: "Chi preferisce un linguaggio più semplice può chiederlo. La risposta cambia forma, il contenuto resta quello.",
        q: "Cosa rappresenta l'opera Modena?",
        labelStandard: "Risposta normale",
        standard1: "L'opera Modena, parte della serie Still Life di Luigi Ghirri, rappresenta una riflessione sulla fotografia stessa. In questa opera, Ghirri rifotografa un dagherrotipo, creando una composizione speculare in cui la «fotografia della fotografia» diventa, come lui stesso ha descritto, un momento magico di coincidenza temporale.",
        standard2: "L'immagine testimonia il suo interesse per gli oggetti e le tracce del passato, sfruttando il colore forte e contrastato tipico della tecnica Polaroid per giocare sull'alternanza dei piani, ritagliando e appiattendo la realtà nell'inquadratura.",
        labelEasy: "In linguaggio facile da leggere",
        simple1: "Questo testo parla di una foto chiamata Modena. È parte di una serie chiamata Still Life di Luigi Ghirri.",
        simple2: "In questa foto, Ghirri fotografa un'altra foto molto vecchia (un dagherrotipo). Così crea un effetto speciale: la foto di una foto. Ghirri dice che è un momento magico dove il tempo si incontra.",
        simple3: "La foto mostra che a Ghirri piacciono gli oggetti e le cose del passato. Usa colori forti e contrastati, tipici delle foto Polaroid. Gioca con i piani: taglia e appiattisce la realtà nella foto.",
      },
      route: {
        title: "Un percorso che tiene conto di chi chiede",
        body: "Alla stessa domanda, poco fa, aveva indicato gli ascensori. Il visitatore aggiunge di soffrire di claustrofobia, e il percorso cambia.",
        q: "Sono nella caffetteria, come arrivo alla mostra The Large Glass essendo claustrofobico?",
        step1: "Dalla Caffetteria (Livello 0), passa nella Hall e raggiungi la Galleria 1.",
        step2: "Nella Galleria 1, prendi la Scala principale 1.",
        step3: "Sali al Livello 1: arriverai nella Galleria 3.",
        step4: "Attraversa la Galleria 3 per raggiungere la Galleria 4, dove è allestita la mostra The Large Glass. Percorso senza ascensori, come richiesto.",
      },
      unknown: {
        title: "Quando non lo sa, lo dice",
        body: "Non rassicura a caso e non inventa. Dice cosa risulta, segnala il dubbio e indica a chi rivolgersi.",
        q: "Sono epilettico, ci sono opere pericolose?",
        a1: "Non ci sono avvertenze specifiche per fotosensibilità o epilessia nelle informazioni generali e nelle descrizioni delle mostre attualmente attive.",
        a2: "Alcune opere in programma includono installazioni video, come Songs and Cries, e rassegne cinematografiche, come il Flaminio Film Festival, che potrebbero prevedere variazioni di luce o proiezioni luminose.",
        a3: "Per ricevere informazioni dettagliate sulle condizioni di illuminazione e sulla sicurezza prima della visita, è possibile contattare l'ufficio Public Engagement del MAXXI. […]",
      },
      note: "Risposte reali dell'assistente del MAXXI, tratte dalla dimostrazione di settembre 2026. Alcune sono leggermente accorciate. Le mostre citate erano quelle di quel momento.",
    },
    agenti: {
      eyebrow: "COSA PUÒ FARE IL VISITATORE",
      titleLine1: "Tanti aiuti diversi,",
      titleEm: "una sola conversazione.",
      lead: "Dietro le quinte lavorano assistenti specializzati, ciascuno con un suo compito. Il visitatore non deve sceglierli né conoscerli: scrive la sua domanda, e questa arriva a chi sa rispondere. Attivate solo quelli che vi servono.",
      item1: {
        title: "Trovare la strada",
        body: "Accompagna da un punto all'altro del museo con i nomi di sale e spazi, senza «destra» e «sinistra», che cambiano a seconda di dove si guarda.",
        example: "«Sono in caffetteria, come raggiungo la mostra?»",
      },
      item2: {
        title: "Capire le opere",
        body: "Racconta opere, artisti e mostre a partire dai vostri cataloghi e dalle vostre schede.",
        example: "«Che artisti sono esposti in questa mostra?»",
      },
      item3: {
        title: "Organizzare la visita",
        body: "Dà le informazioni pratiche: orari, biglietti, eventi e servizi.",
        example: "«Che mostre ci sono oggi?»",
      },
      item4: {
        title: "Capire meglio, a modo proprio",
        body: "Su richiesta riscrive la risposta in un linguaggio facile da leggere, oppure descrittivo, con riferimenti tattili e fisici per chi non può vedere le opere.",
        example: "«Me lo spieghi in modo più semplice?»",
      },
      item5: {
        title: "Dire la propria",
        body: "Raccoglie opinioni e impressioni dei visitatori, così il museo sa cosa è piaciuto e cosa non ha funzionato.",
        example: "«La mostra è bella, ma le didascalie si leggono male.»",
      },
      item6: {
        title: "Parlare nella propria lingua",
        body: "Risponde nella lingua in cui gli si scrive. È stato provato in inglese, francese, spagnolo, tedesco, cinese, giapponese e russo.",
        example: "«Sind Assistenzhunde erlaubt?»",
      },
    },
    confronto: {
      eyebrow: "NON È UN GPT PER MUSEI",
      titleLine1: "Un chatbot non vale l'altro.",
      titleEm: "La differenza è da dove prende le risposte.",
      labelAsk: "Come si chiede",
      labelSource: "Da dove viene la risposta",
      labelUnknown: "Se non conosce la risposta",
      scripted: {
        name: "Chatbot a risposte predefinite",
        tagline: "Affidabile, ma rigido",
        ask: "Bisogna fare le domande «giuste», quelle previste.",
        source: "Testi scritti in anticipo dallo staff, uno per uno.",
        unknown: "Non sa adattarsi: la conversazione si ferma.",
      },
      generic: {
        name: "IA generica, tipo GPT",
        tagline: "Fluida, ma imprevedibile",
        ask: "Si può chiedere qualsiasi cosa, liberamente.",
        source: "Anche fonti esterne, che il museo non controlla.",
        unknown: "Può dare una risposta convincente e sbagliata.",
      },
      isagog: {
        name: "Isagog",
        tagline: "Conversazione libera, conoscenza controllata",
        ask: "Si parla liberamente, come con una persona.",
        source: "La conoscenza del museo, controllata dai vostri curatori.",
        unknown: "Lo dice, e indica a chi rivolgersi.",
      },
    },
    maxxi: {
      eyebrow: "GIÀ IN FUNZIONE",
      titleLine1: "Al MAXXI di Roma,",
      titleEm: "provato da chi vive le barriere.",
      body: "Con il progetto MAXXIperTUTTI, finanziato dal PNRR per rimuovere le barriere fisiche e cognitive, abbiamo portato l'assistente in un museo nazionale. Prima del lancio lo abbiamo messo alla prova con chi lo avrebbe usato davvero.",
      fact1: {
        title: "Tre gruppi di lavoro",
        body: "Persone con disabilità cognitive e neurodivergenza, persone sorde, persone con disabilità visive.",
      },
      fact2: {
        title: "Su mostre vere",
        body: "L'assistente risponde sui contenuti di mostre reali, non su un archivio di prova.",
      },
      fact3: {
        title: "Nelle mani del museo",
        body: "Il museo ha ricevuto gli strumenti per aggiornare i contenuti e seguire le conversazioni senza dipendere da noi.",
      },
      imageAlt: "Visitatori nell'atrio del MAXXI, attraversato dalle sue scale sospese nere",
    },
    staff: {
      eyebrow: "PER CHI LAVORA IN MUSEO",
      titleLine1: "Non serve un informatico.",
      titleEm: "Serve chi conosce il museo.",
      step1: {
        title: "Caricate i materiali",
        body: "Cataloghi, schede di mostra, brochure: quello che avete già. Il sistema ne ricava opere, autori e descrizioni.",
      },
      step2: {
        title: "Il curatore approva",
        body: "Niente arriva al visitatore senza il controllo di una persona del museo. Se una cosa è sbagliata, si corregge, e da lì in poi è corretta.",
      },
      step3: {
        title: "Il visitatore chiede",
        body: "Dal telefono, scrivendo una domanda. Non deve imparare nulla e nessuno gli chiede chi è.",
      },
      step4: {
        title: "Voi ascoltate",
        body: "Vedete cosa chiedono i visitatori e leggete le loro opinioni. Così scoprite cosa cercano davvero.",
      },
      support: "Alla parte tecnica pensiamo noi. Prepariamo il sistema sul vostro museo e formiamo il vostro personale, che poi può gestire i contenuti in autonomia.",
    },
    idee: {
      eyebrow: "IDEE DA SVILUPPARE INSIEME",
      titleLine1: "Da qui in poi,",
      titleEm: "decidete voi dove andare.",
      lead: "Queste non sono funzioni già pronte: sono possibilità che nascono da ciò che il sistema sa già fare e che possiamo costruire insieme a un museo, a partire dalle sue esigenze.",
      idea1: {
        title: "Preparare la visita da casa",
        body: "Prima di partire, il visitatore capisce cosa vedere, come arrivare e cosa aspettarsi.",
      },
      idea2: {
        title: "«Ho solo un'ora»",
        body: "Un percorso costruito sul tempo a disposizione e su ciò che interessa a quella persona.",
      },
      idea3: {
        title: "Scuole e famiglie",
        body: "Contenuti raccontati in modo adatto all'età, per preparare una gita o per farsi guidare dai più piccoli.",
      },
      idea4: {
        title: "Ciò che non è esposto",
        body: "Dare voce alle opere nei depositi e agli archivi, che oggi il pubblico non può incontrare.",
      },
      idea5: {
        title: "Le domande dei visitatori come bussola",
        body: "Un riepilogo periodico per curatori e direzione: cosa chiede il pubblico, cosa non trova, cosa non capisce.",
      },
      idea6: {
        title: "Una rete sul territorio",
        body: "Più musei di una città o di una regione, con un solo assistente che suggerisce anche la tappa successiva.",
      },
    },
    domande: {
      eyebrow: "DOMANDE FREQUENTI",
      title: "Quello che ci chiedono i musei.",
      faq1: {
        q: "Serve del personale tecnico?",
        a: "No. La messa a punto la seguiamo noi. Al museo serve chi conosce i contenuti: lo formiamo a caricarli e a correggerli.",
      },
      faq2: {
        q: "Può inventare delle risposte?",
        a: "È il rischio che abbiamo costruito il sistema per evitare. Le risposte partono dalla conoscenza controllata dal museo e, se un'informazione manca, l'assistente lo dice invece di completarla. Nessuna IA è infallibile: per questo lo staff può leggere le conversazioni e correggere alla fonte.",
      },
      faq3: {
        q: "Sostituisce guide e mediatori?",
        a: "No, li affianca. Risponde alle domande a cui nessuno può rispondere in quel momento, e restituisce allo staff un quadro di ciò che i visitatori cercano.",
      },
      faq4: {
        q: "Che cosa succede ai dati dei visitatori?",
        a: "Il visitatore non deve registrarsi e non viene profilato: l'assistente si adatta a ciò che chiede nella conversazione. Il sistema è progettato secondo GDPR e AI Act e può funzionare con modelli aperti, senza dipendere dai grandi fornitori di IA.",
      },
      faq5: {
        q: "Quanto costa?",
        a: "Dipende dalla dimensione del museo, dalle funzioni che attivate e da dove gira il servizio. Si può partire da una sola funzione. Ne parliamo al primo incontro, a partire dal vostro caso.",
      },
      faq6: {
        q: "Si può finanziare con un bando?",
        a: "Il progetto del MAXXI è stato finanziato con fondi PNRR. Se state preparando un bando, possiamo darvi una descrizione del progetto e dei costi da inserire nella domanda.",
      },
    },
    call: {
      eyebrow: "30 MINUTI, SENZA IMPEGNO",
      titleLine1: "Fatevi un'idea",
      titleEm: "con i vostri occhi.",
      p1: "Il modo migliore per capire cos'è, e cosa non è, è vederlo funzionare. Non servono competenze tecniche e non dovete preparare nulla.",
      stepsLabel: "Nell'incontro",
      step1: "Ci raccontate il vostro museo e i vostri visitatori.",
      step2: "Vi mostriamo l'assistente al lavoro, e potete fargli le vostre domande.",
      step3: "Vediamo insieme da dove avrebbe senso partire.",
      mailLink: "Preferite scriverci? info@isagog.com ↗",
      formTitle: "Chiedete una dimostrazione.",
      formSub: "Vi rispondiamo entro un giorno lavorativo per fissare giorno e ora.",
      fieldMessage: "Che cosa vorreste migliorare nella visita?",
      fieldMessagePlaceholder:
        "Ad esempio: aiutare i visitatori a orientarsi, rendere i contenuti più accessibili, stiamo preparando un bando…",
      mailSubject: "Isagog — richiesta di una dimostrazione per il museo",
    },
  },
  meta: {
    home: {
      title: "Isagog — Una IA che sa anche cosa non sa",
      description:
        "Isagog rende la conoscenza della vostra organizzazione esplicita, verificabile e utilizzabile da assistenti e applicazioni di intelligenza artificiale.",
    },
    approach: {
      title: "Il nostro approccio — Isagog",
      description:
        "Una rappresentazione esplicita del vostro dominio, costruita dagli agenti e supervisionata dai vostri esperti.",
    },
    platform: {
      title: "La piattaforma — Isagog",
      description:
        "La piattaforma Isagog: si installa sulla vostra infrastruttura, lavora con i vostri dati, ai vostri costi.",
    },
    project: {
      title: "Progetti — Isagog",
      description:
        "Musei, archivi giornalistici, servizio clienti: la conoscenza di Isagog al lavoro.",
    },
    blog: {
      title: "Approfondimenti — Isagog",
      description: "Il pensiero che sta dietro al metodo di Isagog.",
    },
    llmSizing: {
      title: "Matrice di dimensionamento on-prem degli LLM — Isagog",
      description:
        "Dove stanno gli LLM open-weight più recenti e a che velocità generano, da una scheda gaming da 16 GB a un nodo Blackwell da 8 GPU. Matrice interattiva, ottobre 2026.",
    },
    contact: {
      title: "Contatti — Isagog",
      description:
        "Raccontateci il processo che vorreste migliorare: valutiamo insieme il vostro caso.",
    },
    careers: {
      title: "Lavora con noi — Isagog",
      description:
        "Collaborazioni professionali in sviluppo software Python, IA e dati: lavora con Isagog su sistemi di IA fondati su conoscenza verificabile.",
    },
    discover: {
      title: "Una IA che risponde con le vostre fonti — Isagog",
      description:
        "Assistenti di IA con risposte fondate su fonti verificabili e modelli aperti sulla vostra infrastruttura. Prenotate una call di 30 minuti.",
    },
    musei: {
      title: "Isagog per i musei — Ogni visitatore chiede, risponde il vostro museo",
      description:
        "Un assistente che risponde ai visitatori con i contenuti controllati dai vostri curatori, in linguaggio semplice e nella loro lingua. Già in funzione al MAXXI di Roma.",
    },
  },
} as const;
