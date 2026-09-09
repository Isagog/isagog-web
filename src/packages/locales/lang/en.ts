export default {
  nav: {
    wordmark: "Isagog",
    home: "Home",
    approach: "Approach",
    platform: "The Platform",
    project: "Projects",
    blog: "Insights",
    cta: "Let's assess your case",
    menu: "Navigation menu",
  },
  footer: {
    home: "Home",
    approach: "Approach",
    platform: "The Platform",
    project: "Projects",
    blog: "Insights",
    contact: "Contact",
    email: "info@isagog.com",
    copyright: "(c) {year} Isagog Srl",
    street: "Via Faà di Bruno 52",
    zip: "00195 Roma (IT)",
  },
  home: {
    hero: {
      imageAlt: "Illustrazione di un albero, Isagog",
      title: "Un'IA che sa dire cosa sa",
      tagline: "E che quando serve sa dire: non lo so",
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
      tablistLabel: "Scegli un dominio",
      questionPickerLabel: "Scegli una domanda",
      lineLabel: "riga",
      refusalCaption: "Il sistema non generalizza",
      ctaTitle: "Una piattaforma. Tre domini.",
      ctaLink: "Scoprite come funziona →",
      museo: {
        tabLabel: "MUSEO",
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
                "L'opera firmata da un collettivo esce dal risultato senza una regola scritta a mano: la domanda chiede artisti, e Artist è dichiarata sottoclasse di Person.",
            },
            details: {
              rottaDiTerra: "Nadia Ferri — italiana, 1988",
              attraverso: "Marco Sabbatini — italiano, 1985",
              veleDiSale: "Collettivo Mareo — un Collective, non una Person: la domanda chiedeva artisti",
              terraFerma: "Giulio Neri — italiano, 1979: fuori per data di nascita",
              senzaTitolo: "Hélène Roux — francese, 1962: fuori per nazionalità e data di nascita",
            },
            axioms: {
              artworkUnion:
                "Painting e VideoArtwork sono sottoclassi di Artwork: la domanda dice «opere», e il sistema le raccoglie per sussunzione, senza che nessuno abbia elencato le classi da cercare.",
              artistIsPerson:
                "Artist è dichiarata sottoclasse di Person; Collective no, pur essendo anch'esso un autore. A escludere il collettivo è l'ontologia, non un caso particolare nel codice.",
            },
            answer:
              "Due opere sulle cinque in mostra: «Rotta di terra» (2021) di Nadia Ferri e «Attraverso» (2019) di Marco Sabbatini.",
            note: "Una domanda in italiano è diventata quattro condizioni congiunte sul grafo — la mostra, le opere esposte, il loro autore, nazionalità e data di nascita — più due passaggi che nessun fatto memorizzato contiene: la sussunzione delle classi e l'esclusione del collettivo.",
          },
          allestimento: {
            pickerLabel: "Allestimento",
            question:
              "Quali opere di questa mostra hanno bisogno di uno spazio dedicato o di attrezzatura?",
            steps: {
              worksInExhibition: "Raccogli le cinque opere esposte nella mostra.",
              classes: "Leggi la classe di ciascuna opera.",
              noSuchProperty:
                "Nessuna proprietà dello schema dice «richiede attrezzatura»: non c'è un campo da leggere.",
              fromClassDefinitions:
                "La risposta viene da come l'ontologia definisce quelle classi: una occupa uno spazio proprio, l'altra non ha forma fisica.",
            },
            details: {
              veleDiSale: "Sala dedicata: l'opera occupa uno spazio suo",
              attraverso: "Proiezione e sorgente video: senza attrezzatura l'opera non è in mostra",
              rottaDiTerra: "Parete: nessuna attrezzatura",
            },
            axioms: {
              installationOccupiesSpace:
                "È così che l'ontologia definisce Installation. La sala dedicata discende da questa frase, non da un campo compilato a mano opera per opera.",
              immaterialHasNoForm:
                "VideoArtwork è sottoclasse di ImmaterialArtwork: senza forma fisica, l'opera esiste in mostra solo attraverso l'attrezzatura che la riproduce.",
            },
            answer:
              "Due opere sulle cinque in mostra: l'installazione «Vele di sale» e il video «Attraverso».",
            note: "Nessun fatto memorizzato dice che un'opera richiede attrezzatura. Il sistema lo deriva dalle classi delle opere e dalle definizioni che l'ontologia dà di quelle classi — e quelle definizioni può mostrarle.",
          },
          orientamento: {
            pickerLabel: "Orientamento",
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
            note: "L'opera non ha un luogo proprio. Il sistema lo compone risalendo alla mostra che la espone e alla sala in cui è allestita — e sa che la Sala 3 confina con la Sala 2 anche se il grafo registra l'adiacenza nel verso opposto.",
          },
        },
      },
      giornale: {
        tabLabel: "GIORNALE",
        disclosure:
          "Istanza illustrativa su schema reale: il caso è inventato; le classi dei descrittori — HumanDescriptor, AIDescriptor, DBPediaDescriptor, WikipediaDescriptor, ContextualDescriptor — sono quelle della piattaforma MeMa / il manifesto.",
        entity: "Progetto Parco Nord",
        questions: {
          archive: {
            question: "Cosa sappiamo di questo progetto?",
            answer:
              "Quattro fatti, quattro provenienze diverse: un redattore, un modello di IA, una risorsa esterna e una descrizione valida solo al momento dell'articolo.",
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
          Negated: "escluso da verifica diretta",
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
      p2: "Per questo costruiamo una rappresentazione esplicita del vostro dominio: concetti e relazioni che i vostri esperti possono discutere e correggere. È ciò che chiamiamo un'ontologia — la descrizione di ciò che esiste nel vostro mondo, di come si chiama e di come si lega al resto.",
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
      p1: "Isagog ha un metodo per costruire la base di conoscenza di un'organizzazione a partire da ciò che già possiede, e per ragionarci sopra. I nostri agenti, basati su modelli linguistici specializzati, leggono documenti e dati, riconoscono concetti e relazioni impliciti e ne propongono i modelli, pronti per la revisione; altri agenti estraggono poi informazione strutturata, dato per dato, in modo tracciabile. Sono processi ripetibili: nuovi documenti, nuovi dati, stessi procedimenti.",
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
        body: "Il modello linguistico porta la comprensione del linguaggio, il grafo di conoscenza porta la struttura, la coerenza e la prova. È l'integrazione che chiamiamo neurosimbolica, ed è il cuore del nostro metodo.",
        result: "La conoscenza nei processi quotidiani",
      },
      closing: "Questa divisione del lavoro ha una conseguenza importante: quando i contenuti stanno nel grafo e il modello si occupa del linguaggio, anche un modello di piccole dimensioni è all'altezza del compito. Ragiona su ciò che è scritto, e ciò che è scritto si può leggere, correggere e approvare, senza addestrare né riaddestrare nulla.",
    },
  },
  platform: {
    tecnologia: {
      eyebrow: "THE PLATFORM",
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
    explorerTitle: "Explore the Isagog platform",
    mobileNotice: "The interactive platform diagram isn't available on small screens.",
    mobileCta: "Visit this page from a tablet or computer to explore it",
  },
  textCarousel: {
    dotLabel: "Go to slide {n}",
    slide1: {
      title: "Knowledge Augmented Generation",
      subtitle: "Beyond RAG: answers grounded in facts, not just text",
      point1:
        "Analytic agents read your documents and turn them into a knowledge graph: entities, facts, relations.",
      point2:
        "The graph works together with vector search: the precision of reasoning plus the breadth of retrieval.",
      point3:
        "Answers are generated by the language model, but anchored to and verified against the facts in the graph.",
    },
    slide2: {
      title: "Custom agents, no code",
      subtitle: "Define and orchestrate your agents in no-code mode",
      point1:
        "Agents that analyze documents and populate the knowledge, agents that search, agents that converse.",
      point2: "You compose and coordinate them from the interface, without writing a line of code.",
      point3: "Each project has its own agents, its own tools, its own workspace.",
    },
    slide3: {
      title: "You stay in control",
      subtitle: "Transparency, sovereignty and compliance by design",
      point1:
        "Transparency: every answer is verifiable — you can inspect the sources, steps and tools the AI used.",
      point2:
        "Data sovereignty: the platform runs on your infrastructure, even with small, open models.",
      point3:
        "Compliance (EU AI Act, GDPR): role-based access, strong authentication, isolated data for every workspace.",
      point4: "Cost control: choose your models, set usage limits, no vendor lock-in.",
    },
  },
  project: {
    heading: "Projects",
    notFound: "Project not found",
    backToProjects: "Go back to projects",
    loadError: "We couldn't load the projects. Please try again later.",
  },
  blog: {
    heading: "Insights",
    notFound: "Article not found",
    backToBlog: "Go back to blog",
    nextArticle: "Next article",
    loadError: "We couldn't load the articles. Please try again later.",
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
    },
  },
  meta: {
    home: {
      title: "Isagog — An AI that knows what it knows",
      description:
        "Isagog makes your organization's knowledge explicit, verifiable, and usable by AI assistants and applications.",
    },
    approach: {
      title: "Our approach — Isagog",
      description:
        "An explicit representation of your domain, built by agents and supervised by your experts.",
    },
    platform: {
      title: "The platform — Isagog",
      description:
        "The Isagog platform: runs on your infrastructure, works with your data, at costs you control.",
    },
    project: {
      title: "Projects — Isagog",
      description: "Museums, news archives, customer service: Isagog's knowledge at work.",
    },
    blog: {
      title: "Insights — Isagog",
      description: "The thinking behind the method.",
    },
    contact: {
      title: "Contact — Isagog",
      description: "Tell us about the process you'd like to improve: let's assess your case together.",
    },
  },
} as const;
