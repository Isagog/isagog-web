export default {
  nav: {
    wordmark: "Isagog",
    home: "Home",
    approach: "Approach",
    platform: "Platform",
    ontologies: "Ontologies",
    project: "Projects",
    blog: "Insights",
    careers: "Work with us",
    cta: "Let's assess your case",
    menu: "Navigation menu",
  },
  footer: {
    home: "Home",
    approach: "Approach",
    platform: "The Platform",
    ontologies: "Ontologies",
    project: "Projects",
    blog: "Insights",
    careers: "Work with us",
    contact: "Contact",
    email: "info@isagog.com",
    copyright: "(c) {year} Isagog Srl",
    street: "Via Faà di Bruno 52",
    zip: "00195 Roma (IT)",
  },
  home: {
    hero: {
      imageAlt: "Illustration of a tree, Isagog",
      title: "An AI that also knows what it doesn't know",
      tagline: "And when needed can tell you so.",
    },
    apertura: {
      eyebrow: "ARTIFICIAL INTELLIGENCE · EXPLICIT KNOWLEDGE",
      titleLine1: "Give shape to",
      titleEm: "your knowledge.",
      titleLine2: "Then make it reason.",
      sub: "Your organization's knowledge lives in many forms: in documents and conversations, in tables and transactions, in data and in people's experience. Isagog makes it explicit, verifiable and usable by AI assistants and applications, with a vision, a method and a platform.",
      ctaPrimary: "Let's assess your case ↗",
      ctaSecondary: "See how it works",
    },
    knowledgeDemo: {
      eyebrow: "THREE DOMAINS, ONE PLATFORM",
      title: "From similarity to reasoning.",
      intro: "Text search, even by semantic similarity, only finds relevant passages. An RDF graph, instead, connects entities, facts, sources and relations; the ontology makes explicit the rules for deriving new knowledge.",
      traceLabel: "Explore the sources of the reasoning",
      proof: {
        label: "The reasoning, in focus",
        fact: "IN THE GRAPH",
        rule: "IN THE ONTOLOGY",
        conclusion: "BY INFERENCE",
      },
      negative: {
        eyebrow: "CLINIC · NEGATIVE KNOWLEDGE",
        title: "“No” is not the same as “I don't know”.",
        explanation: "“Not performed” is a negated fact, documented in a source. Without this information, we would not know whether the test had been performed: the absence of a piece of data does not prove the opposite.",
        explore: "From a negated fact to a revised diagnosis →",
      },
      tablistLabel: "Choose a domain",
      questionPickerLabel: "Choose a question",
      lineLabel: "line",
      refusalCaption: "The system does not generalize",
      ctaTitle: "One platform. Three domains.",
      ctaLink: "See how it works →",
      museo: {
        tabLabel: "MUSEUM",
        shortDisclosure: "Illustrative example based on the ontology of a contemporary art museum.",
        disclosure:
          "Illustrative instances on a real schema: the exhibition, the works and the halls are invented; the classes and properties traversed — Exhibition, Painting, Installation, VideoArtwork, Hall, exhibited_in, located_in, adjacent_to — are those of the MAXXI ontology (v2.8) and of the Isagog top ontology it imports.",
        resolutionLabel: "HOW IT WAS RESOLVED",
        resultsLabel: "ANSWER FROM THE GRAPH",
        axiomsLabel: "ON WHICH AXIOMS",
        graphStepLabel: "GRAPH QUERY",
        inferenceStepLabel: "INFERENCE",
        nodes: {
          rottaDiTerra: "Rotta di terra (2021)",
          attraverso: "Attraverso (2019)",
          veleDiSale: "Vele di sale (2022)",
          terraFerma: "Terra ferma (2020)",
          senzaTitolo: "Senza titolo (1998)",
          sala3: "Hall 3",
          gallerie: "Galleries",
        },
        questions: {
          conjunctive: {
            pickerLabel: "Visitor",
            proof: {
              fact: "“Rotta di terra” is a Painting; “Attraverso” is a VideoArtwork.",
              rule: "Painting → VisualArtwork → MaterialArtwork → Artwork. VideoArtwork → ImmaterialArtwork → Artwork. Each step denotes a subclass.",
              conclusion: "Both are therefore Artworks: the question about “works” includes them by inference, together with the filters on the exhibition and the authors.",
            },
            question:
              "Which works by Italian artists born after 1980 can I see in the exhibition “La luce della migrazione”?",
            steps: {
              findExhibition: "Find the exhibition from its title.",
              worksInExhibition: "Collect the works shown in that exhibition.",
              authors: "From each work, trace back to its author, when the author is an artist.",
              filterAuthors: "Keep the Italian authors born after 1980.",
              subsumption:
                "“Works” was not searched one class at a time: a painting and a video work are included because their classes are subclasses of Artwork.",
              collectiveOut:
                "The collective has no declared or derivable Artist type, so it does not satisfy the query's positive condition. This does not prove a negation.",
            },
            details: {
              rottaDiTerra: "Nadia Ferri — Italian, 1988",
              attraverso: "Marco Sabbatini — Italian, 1985",
              veleDiSale: "Collettivo Mareo — the Artist type is neither declared nor derivable from the available data",
              terraFerma: "Giulio Neri — Italian, 1979: excluded by date of birth",
              senzaTitolo: "Hélène Roux — French, 1962: excluded by nationality and date of birth",
            },
            axioms: {
              artworkUnion:
                "Painting and VideoArtwork are subclasses of Artwork: the question says “works”, and the system collects them by subsumption, without anyone having listed the classes to search for.",
              artistIsPerson:
                "Artist is a subclass of Person. The Collective type, on its own, does not allow Artist to be derived. The query does not include that result, but the absence of the type is not a negation: a further axiom would be needed.",
            },
            answer:
              "Two of the five works in the exhibition: “Rotta di terra” (2021) by Nadia Ferri and “Attraverso” (2019) by Marco Sabbatini.",
            note: "The question combines relations and filters on the graph with class subsumption. The collective does not satisfy the positive Artist condition; it is not derived to be a non-Person.",
          },
          allestimento: {
            pickerLabel: "Setup",
            proof: {
              fact: "“Attraverso” is a VideoArtwork; “Vele di sale” is an Installation.",
              rule: "VideoArtwork is a subclass of ImmaterialArtwork. The ontology's descriptions define a work without physical form and an installation that occupies a specific space.",
              conclusion: "The immaterial type is inferred. The projection and space needs are an interpretation of those definitions, to be verified during setup: not a constraint formalized in OWL.",
            },
            question:
              "Which works in this exhibition need a dedicated space or equipment?",
            steps: {
              worksInExhibition: "Collect the five works shown in the exhibition.",
              classes: "Read the class of each work.",
              noSuchProperty:
                "No property in the schema says “requires equipment”: there is no field to read.",
              fromClassDefinitions:
                "The ontology allows the ImmaterialArtwork type to be inferred. The indications about space and equipment interpret the class descriptions, not an OWL axiom on requirements.",
            },
            details: {
              veleDiSale: "Dedicated space to be assessed based on the description of Installation",
              attraverso: "Video equipment to be verified during setup",
              rottaDiTerra: "Material work; setup requirements not specified",
            },
            axioms: {
              installationOccupiesSpace:
                "The description of Installation suggests assessing a dedicated space. The sentence is an annotation in the ontology, not an axiom that requires a hall.",
              immaterialHasNoForm:
                "VideoArtwork is a subclass of ImmaterialArtwork: this type is derivable. The kind of equipment needed, however, requires a specific check.",
            },
            answer:
              "Two works to examine for space or equipment: the installation “Vele di sale” and the video “Attraverso”.",
            note: "The example distinguishes the formal subsumption of classes from the interpretation of their descriptions. The schema does not formalize equipment requirements; the proposal must be verified on the concrete case.",
          },
          orientamento: {
            pickerLabel: "Wayfinding",
            proof: {
              fact: "The work is shown in the exhibition, which is set up in Hall 3. The graph records Hall 2 adjacent_to Hall 3.",
              rule: "adjacent_to is declared an owl:SymmetricProperty in the Isagog top ontology.",
              conclusion: "Hall 3 adjacent_to Hall 2 also holds, without storing the inverse link. The work's hall is found by following the relations with the exhibition.",
            },
            question: "In which hall can I find “Rotta di terra”?",
            steps: {
              noLocationOnArtwork: "Look for a location on the work: no location edge leaves the work.",
              toExhibition: "Trace back to the exhibition that shows it.",
              toHall: "From the exhibition, to the space where it is set up.",
              hallInBuilding: "From the hall, to the exhibition space and the building it is part of.",
              symmetry:
                "The graph records “Hall 2 adjacent to Hall 3” only once: adjacent_to is symmetric, so it also holds the other way.",
            },
            details: {
              sala3: "Second floor, right after Hall 2",
              gallerie: "The exhibition space the hall is part of",
            },
            axioms: {
              hallIsAPlace:
                "A hall is part of a building, and therefore a Place: it satisfies the range of located_in without the museum ontology having to redeclare it.",
              adjacencyIsSymmetric:
                "In the top ontology adjacent_to is declared an owl:SymmetricProperty: an adjacency recorded only once answers in both directions.",
            },
            answer: "In Hall 3, on the second floor: from Hall 2, continue into the next hall.",
            note: "The graph does not record a location directly on the work. The answer goes back through the exhibition and the hall; the symmetry of adjacent_to also allows the inverse adjacency to be derived.",
          },
        },
      },
      giornale: {
        tabLabel: "NEWSPAPER",
        shortDisclosure: "Illustrative example based on the schema of a historical newspaper archive.",
        traceLabel: "Explore the sources of the reasoning",
        disclosure:
          "Illustrative instance on a real schema: the case is invented; the descriptor classes — HumanDescriptor, AIDescriptor, DBPediaDescriptor, WikipediaDescriptor, ContextualDescriptor — are those of a newspaper archive's ontology.",
        entity: "Parco Nord project",
        questions: {
          archive: {
            question: "What do we know about the Parco Nord project?",
            answer:
              "We retrieve five facts with explicit provenance: an editor, an AI model, DBpedia, Wikipedia and a description tied to the moment of the article.",
            facts: {
              human: "Coordinated by the city department for public green spaces",
              ai: "Launched in 2019",
              dbpedia: "Located in the Nord district",
              wikipedia: "Described in the district's Wikipedia entry",
              contextual: "Under construction (at the time of this article)",
            },
          },
          refusal: {
            question: "What is the project's budget?",
            answer:
              "Not confirmed: the only available figure comes from an AI descriptor, with no human or external corroboration.",
            facts: {
              aiOnly: "Estimated budget: €2 million",
            },
          },
        },
      },
      clinica: {
        tabLabel: "CLINIC",
        shortDisclosure: "Synthetic, pseudonymized case; statements and sources from the clinical graph.",
        traceLabel: "Explore the sources of the reasoning",
        revision: "The September statement explicitly supersedes the earlier ones through the supersedes relation: choosing the most similar or most recent text is not enough.",
        knowledgeBoundary: "Negated records an explicitly negated fact; RuledOut an excluded assessment. A missing fact remains unknown and a suspicion remains open: they do not become false for lack of confirmation.",
        disclosure:
          "Real data (synthetic, pseudonymized): the clinical case is synthetic by construction, but the statements, quotations and document-and-line references come from the knowledge graph.",
        notes: {
          reportedPediatric: "Reported by the patient; the episode is not documented.",
          neverTested: "No allergy test has ever been performed.",
          steeringTreatment: "The unverified label begins to steer treatment choices.",
          deLabelled: "The specialist assessment supersedes the two earlier reports.",
          bcl2: "Established in the laboratory, not reported by the patient.",
          boneSuspected: "Open hypothesis: awaiting histological confirmation.",
        },
        polarityGloss: {
          Asserted: "confirmed",
          Reported: "reported, not verified",
          Negated: "explicitly negated in the source",
          RuledOut: "ruled out; supersedes earlier assessments",
          Suspected: "open hypothesis",
        },
        questions: {
          allergy: {
            question: "Is the patient allergic to penicillin?",
            answer:
              "It depends on when you ask: reported but never tested from February to April, then ruled out (de-labelled) in September 2025.",
          },
          bcl2: {
            question: "BCL2?",
            answer: "Yes — positive, established by immunohistochemistry.",
          },
          bone: {
            question: "Bone involvement?",
            answer: "Suspected, not yet confirmed: awaiting histological examination.",
          },
        },
      },
    },
    persone: {
      eyebrow: "THE PEOPLE OF ISAGOG",
      titleLine1: "Deep experience.",
      titleEm: "A direct conversation.",
      lead: "From research to business, all the way to your next project.",
      guido: {
        name: "Guido Vetere",
        role: "Founder and CEO — formerly Director of the Center for Advanced Studies, IBM Italy",
        bio: "For years Guido led IBM's research in Italy on language, logic and knowledge representation. Today he teaches Artificial Intelligence at Università Marconi, and brings to Isagog the same idea that guided his research: an artificial intelligence that reasons on explicit foundations, not just on statistical correlations.",
      },
      robert: {
        name: "Robert J. Alexander",
        role: "Co-founder — formerly Health and Research Executive at IBM, medical doctor",
        bio: "Bob has been applying artificial intelligence to clinical practice for forty years. Experience gained where an error has real consequences — and the reason why, at Isagog, the traceability of answers is not a technical detail but a requirement.",
      },
    },
  },
  approach: {
    visione: {
      eyebrow: "01 / VISION",
      titleLine1: "An AI that can tell you",
      titleEm: "how it knows.",
      lead: "And that, when it matters, can say: I don't know",
      p1: "When an answer enters an organization's work, it must be open to examination: what information it uses, what relations it connects, what elements are missing. A trustworthy intelligence can show where an answer comes from, and knows to stay silent when the knowledge at its disposal is silent.",
      p2: "That is why we build an explicit representation of your domain: concepts and relations that your experts can discuss and correct. It is what we call an ontology — the description of what exists in your world, what it is called and how it connects to everything else.",
      p3: "From this idea follows a precise division of labor. Language models get the job they do best: understanding language, conversing, putting things into words. The content stays elsewhere, in a knowledge base that can be consulted and updated, on which answers are grounded and their steps verified.",
      p4a: "It is an ancient idea. Porphyry's ",
      p4Isagoge: "Isagoge",
      p4b: ", an introduction to Aristotle's ",
      p4Categorie: "Categories",
      p4c: ", is the first attempt to order knowledge so that it can be thought. Our name comes from there.",
      bonsaiAlt: "Illustration of a bonsai tree",
      caseEyebrow: "THE CASE OF A MUSEUM",
      caseTitleLine1: "From the exhibition record",
      caseTitleLine2: "to the visitor's question.",
      caseBody: "Connecting exhibitions, works, authors and texts helps build an assistant that guides the public and makes the museum's wealth of information searchable.",
    },
    metodologia: {
      eyebrow: "02 / METHOD",
      titleLine1: "Analysis to the agents.",
      titleEm: "Judgment to the experts.",
      lead: "From your documents and your data, knowledge that reasons. In days, under your supervision.",
      p1: "Isagog has a method for building an organization's knowledge base from what it already has, and for reasoning over it. Our agents, based on specialized language models, read documents and data, recognize implicit concepts and relations and propose models of them, ready for review; other agents then extract structured information, item by item, in a traceable way. These are repeatable processes: new documents, new data, same procedures.",
      p2: "Domain experts keep the task only they can perform: supervision. They read what the agents have proposed, correct, approve — what used to take months of analysis and interviews is achieved in days. This is what makes the method scalable and keeps its costs under control.",
      cap1: {
        title: "Represent",
        body: "We identify the concepts and relations of your domain. The agents propose the model; your experts validate it.",
        result: "Shared concepts before content",
      },
      cap2: {
        title: "Collect",
        body: "Following the shared model, the agents extract information and link it to its sources. New documents feed the knowledge through repeatable procedures.",
        result: "New data, a reusable method",
      },
      cap3: {
        title: "Reason",
        body: "The language model brings the understanding of language; the knowledge graph brings structure, consistency and proof. It is the integration we call neurosymbolic, and it is the heart of our method.",
        result: "Knowledge in everyday processes",
      },
      closing: "This division of labor has an important consequence: when the content lives in the graph and the model takes care of language, even a small model is up to the task. It reasons on what is written, and what is written can be read, corrected and approved, without training or retraining anything.",
    },
  },
  platform: {
    tecnologia: {
      eyebrow: "THE PLATFORM",
      titleLine1: "A platform",
      titleEm: "in your hands.",
      lead: "On your systems, with your data, at costs you control.",
      p1: "Isagog has developed a platform that puts the method in the hands of those who need to use it. The agents read your data and propose the knowledge; your experts supervise and approve it; the platform queries it, reasons over it and brings it into everyday tasks.",
      p2: "Knowledge remains an asset of the organization, explicit and modifiable, and with it the transparency that regulations require: every answer traces back to its source, every inference can be retraced.",
      usecasesLabel: "NEEDS ARE AS DIVERSE AS THE FORMS OF KNOWLEDGE",
      uc1: {
        title: "A legal department",
        body: "Needs traceability.",
      },
      uc2: {
        title: "A customer service team",
        body: "Needs speed.",
      },
      uc3: {
        title: "An oncologist",
        body: "Needs a complete picture of the patient, and answers that can be traced back to their source, item by item.",
      },
      uc4: {
        title: "A museum guide",
        body: "Needs almost the opposite: breadth, to connect a work to the history, places and people around it.",
      },
      usecasesClose: "The same platform serves both extremes, because it lets you choose which tool to use and to what extent.",
      ctrl1: {
        title: "Your infrastructure.",
        body: "It installs on your infrastructure or in the Cloud and works with open models.",
      },
      ctrl2: {
        title: "Costs known in advance.",
        body: "Data stays in-house, and costs are known in advance.",
      },
      ctrl3: {
        title: "Any size.",
        body: "Even a small organization has a whole world to represent.",
      },
      badge: "Knowledge remains an asset of the organization.",
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
    backToProjects: "Back to projects",
    loadError: "We couldn't load the projects. Please try again later.",
  },
  blog: {
    heading: "Insights",
    notFound: "Article not found",
    backToBlog: "Back to the blog",
    nextArticle: "Next article",
    loadError: "We couldn't load the articles. Please try again later.",
  },
  contact: {
    contatto: {
      eyebrow: "FROM DEMONSTRATION TO EVERYDAY WORK",
      titleLine1: "Value begins",
      titleLine2: "with",
      titleEm: "real users.",
      p1: "A proof of concept demonstrates a possibility. Bringing it into everyday work requires a precise goal, adequate information and shared criteria for evaluating the result.",
      p2Strong: "Which process would you like to improve?",
      p2: "In our first conversation we examine your case, the available data and the constraints. We identify where the platform can contribute and which check to run first.",
      step1: "You tell us what you need.",
      step2: "We identify the information and the constraints.",
      step3: "Together, we define the first useful check.",
      mailLink: "Prefer to write to us? info@isagog.com ↗",
      formTitle: "Let's bring your need into focus.",
      formSub: "A few lines are enough to get started.",
      fieldName: "Full name",
      fieldNamePlaceholder: "Your name",
      fieldEmail: "Work email",
      fieldEmailPlaceholder: "name@organization.com",
      fieldOrg: "Organization",
      fieldOrgPlaceholder: "Your organization",
      fieldMessage: "Which process would you like to improve?",
      fieldMessagePlaceholder:
        "For example: connecting product information to help our customer service team…",
      formNote: "Describing the case is enough; there is no need to include confidential data.",
      submit: "Prepare the request ↗",
      disclosure:
        "This prototype prepares a draft email. You can review it and send it from your own mail client. No data is sent by the form.",
      mailSubject: "Isagog — request for a conversation",
      mailName: "Name",
      mailEmail: "Email",
      mailOrg: "Organization",
    },
  },
  ontologies: {
    hero: {
      eyebrow: "ONTOLOGIES",
      titleLine1: "Integrating language models with an organization's knowledge",
      titleEm: "takes a new kind of conceptual model.",
      lead: "Isagog ontologies are built for this: they guide the reasoning of both language models and the knowledge graph.",
      p1: "Language models can talk about almost anything, but they don't know an organization's data, rules and vocabulary. Connecting them to that knowledge takes a conceptual model: a shared, precise vocabulary stating what is being talked about, how those things are related and what can be inferred from them.",
      p2: "Traditional ontologies were born for databases and logical systems: they file everything into a rigid hierarchy of categories. Natural language works differently: the same words change meaning with context, and the same object is described in different ways depending on what is needed. A model meant to work with language models has to take this into account.",
      p3: "This page explains how we have rethought our ontologies, what they are for and how we use them. At the bottom you can explore them yourself.",
    },
    prospettive: {
      eyebrow: "A NEW CONCEPTION",
      titleLine1: "Not categories,",
      titleEm: "but perspectives.",
      intro:
        "What is new is a change of viewpoint. In our ontologies a concept is not a category to lock things into, but a perspective to look at them from: the same entity can be seen in several ways, each with its own reasoning rules, and the context picks the relevant one. This way the model embraces the polysemy of language instead of fighting it. Four examples, taken straight from the models.",
      ex1: {
        title: "What lasts and what happens",
        body: "Continuant (what persists while keeping its identity) and occurrent (what happens and unfolds in time) are not declared disjoint. An exhibition can be described as something that fills three rooms and as something that runs from March to June, without splitting it into two different entities.",
      },
      ex2: {
        title: "A speech act is both an event and information",
        body: "When someone says “we open at nine tomorrow”, something happens (an event, with a speaker and a listener) and some content is passed on (information, about something). In the agents ontology the speech act is both, in the same entity, and it obeys the rules of each.",
      },
      ex3: {
        title: "Selling and buying: one event, different words",
        body: "In the frame ontology, perspective is a lexical fact, not an ontological one. A sale has all of its participants; “sell” and “buy” are words that bring different roles to the foreground. The model stays univocal, and the point of view lives in the choice of words.",
      },
      ex4: {
        title: "Knowing what you don't know",
        body: "The ontologies adopt the open world assumption: if an event has no start date, that does not mean it never began, only that we don't know when. This is what lets a system tell what it knows from what it doesn't, and say so.",
      },
      closing:
        "Multiple classification is not a compromise: each perspective keeps its own axioms, and reasoning applies them all.",
    },
    livelli: {
      eyebrow: "THREE ONTOLOGIES, ONE MODEL",
      titleLine1: "A minimal core",
      titleEm: "and two specialized layers.",
      intro:
        "Isagog ontologies are built in layers. The top level sets the most general distinctions; the other two import and extend it, for conversational agents and for text analysis.",
      versionLabel: "version",
      top: {
        name: "Top level ontology",
        tagline: "The most general categories, with modest commitments.",
        body: "A few fundamental categories (continuants and occurrents, tangibles and intangibles, agents, information, signs, situations, qualities) and the relations that connect them: participation, composition, causation, location, inherence. Every term has a short operational definition, in Italian and English, written to be read by a language model too, and mappings to DOLCE and schema.org.",
      },
      agents: {
        name: "Agents ontology",
        tagline: "Speech acts, conversations, memory.",
        body: "It describes how agents communicate. A speech act has exactly one author and one illocutionary type (inform, ask, confirm…), it may answer an earlier act and carry a salience weight; a conversation is an event whose phases are speech acts. Aspects (the user's needs, interests, constraints) are the qualities an agent remembers: they make up its semantic memory.",
      },
      frames: {
        name: "Frame ontology",
        tagline: "The recurring situations texts talk about.",
        body: "An inventory of roles: participants (patient, theme, instrument, beneficiary, experiencer…), each defined by seven yes/no questions such as “is there volition?” or “is there a change of state?”, and circumstances, organized on the four Aristotelian causes. A frame is at once a class of events and a catalog entry, with definitions, lexical units and corpus attestations: a frame with no attestations is a hypothesis, not an entry.",
      },
      cliente: {
        eyebrow: "YOUR ONTOLOGY",
        titleLine1: "Built on the Isagog ontologies,",
        titleEm: "extracted from your texts and your schemas.",
        p1: "Every organization that adopts the platform has its own ontology, describing its domain: a museum's works and exhibitions, a newspaper's articles and bylines, a company's products and procedures. It does not start from scratch: it extends the Isagog ontologies, and every new concept hooks into the perspectives of the core. An artwork is an artifact, a curator is a person, an exhibition can be seen both as a collection of works and as something that happens.",
        p2: "This way the organization's ontology inherits, from day one, the reasoning rules, the definitions written for language models and the platform's tools: natural-language questions, agent memory, text analysis.",
        p3: "It can be extracted, under supervision, from what the organization already has: its texts, such as documents, procedures and archives, and its schemas, such as databases and data models. Agents propose concepts and relations; domain experts discuss, correct and approve them.",
        cta: "How we work with your experts",
      },
      license: "The ontologies are written in OWL 2 and released under the CC BY 4.0 license.",
    },
    ragionamento: {
      eyebrow: "REASONING WITH ONTOLOGIES",
      titleLine1: "Two readers,",
      titleEm: "one vocabulary.",
      intro:
        "An Isagog ontology has two readers: language models, which read the words, and the knowledge graph, which applies the rules. The same concept guides both, which is why their answers can be compared and checked.",
      llm: {
        title: "In language models",
        p1: "Operational definitions state in a few lines what each term means, in the language required. We give models a compact view of the ontology, not the whole of it: they know which concepts they may talk about and in what sense, with a smaller context.",
        p2: "When an agent extracts facts from a conversation, it can only use concepts from the catalog: anything that does not fit is discarded. In the same way, text analysis only recognizes the expected frames, with their roles. The chosen perspective steers interpretation, instead of leaving it to the model's imagination.",
      },
      kg: {
        title: "In the knowledge graph",
        p1: "On the graph, the same concepts are axioms applied by an inference engine. Whoever brings an event about is, by definition, an agent; an event with at least two coparticipants is recognized as reciprocal; if a document yields a sign referring to something, the document is about that thing.",
        p2: "Natural-language questions become SPARQL queries over the ontology's vocabulary, and consistency checks flag data that violate the axioms. Every answer can be traced back to the data and rules it comes from.",
      },
      closing:
        "Words steer the model, rules constrain the graph: the same ontology holds the two together.",
    },
    esplora: {
      eyebrow: "EXPLORE THE ONTOLOGIES",
      titleLine1: "Browse concepts",
      titleEm: "and relations.",
      intro:
        "Select a concept to read its operational definition, the perspectives it combines and the relations it takes part in. Classes with more than one superclass appear under each of them: that is multiple classification at work.",
      classesTab: "Concepts",
      propertiesTab: "Relations and attributes",
      layerLabel: "Ontology",
      layerAll: "All",
      layerTop: "Top level",
      layerAgents: "Agents",
      layerFrame: "Frames",
      searchLabel: "Search",
      searchPlaceholder: "Search for a concept or relation…",
      noResults: "No results.",
      multiple: "several perspectives",
      classParents: "Perspectives it combines",
      propertyParents: "Specializes",
      children: "Specializations",
      domainOf: "Relations starting here",
      rangeOf: "Relations ending here",
      domain: "Applies to",
      range: "Points to",
      kindClass: "Concept",
      kindObject: "Relation between entities",
      kindData: "Attribute",
      profile: "Entailment profile",
      profileLegend: "+ yes · − no · ? undetermined",
      dim1: "volition",
      dim2: "sentience",
      dim3: "causation",
      dim4: "movement",
      dim5: "change of state",
      dim6: "independent existence",
      dim7: "incrementality",
      onlyEnglish: "Definition available in English only.",
      noDefinition: "No definition.",
    },
  },
  careers: {
    invito: {
      eyebrow: "WORK WITH US",
      titleLine1: "Build with us",
      titleEm: "an AI grounded in knowledge.",
      lead: "Professional collaborations in Python software development, AI and data.",
      factRemote: "Fully remote",
      whyLabel: "WHY ISAGOG",
      why1: "At Isagog Srl we make organizations' knowledge accessible to people and applications. We combine language models, knowledge graphs and reasoning to build AI systems whose answers are grounded in verifiable information and whose limits are recognizable.",
      why2: "Our work starts from users' problems and ends in software that helps them tackle those problems. We measure a solution's quality by its usefulness, by how well its behavior can be understood, and by the care with which it is maintained.",
      why3: "We are a small company where research and development work side by side. We are looking for people who want to contribute to advanced AI projects, take ownership of concrete assignments and work alongside professionals with proven academic and research experience.",
    },
    competenze: {
      eyebrow: "THE CONTRIBUTION WE'RE LOOKING FOR",
      titleLine1: "From the need",
      titleEm: "to the delivery.",
      lead: "Backend and the components that connect data, knowledge and AI agents.",
      p1: "You will work mainly on the backend and on the components that connect data, knowledge and AI agents. Depending on your skills and the project, you may build services and APIs, integrate information sources, build processing pipelines or improve the reliability and evaluation of our systems.",
      p2: "We expect you to follow a task all the way through: understand the need, clarify the constraints, propose a solution, build it, verify it and document its delivery. Architectural choices must have an understandable rationale and keep the software tidy, easy to change and proportionate to the problem.",
      skillsLabel: "THE SKILLS",
      skillsIntroA: "We are looking for a solid foundation in ",
      skillsIntroStrong: "Python software engineering",
      skillsIntroB: ", together with hands-on experience in one or more of the AI and data areas we work in:",
      skill1: {
        title: "Backend and integration",
        body: "Modern Python, asynchronous programming, APIs and web services, data modeling and systems integration. We mainly use FastAPI and Pydantic.",
      },
      skill2: {
        title: "Applied AI and knowledge",
        body: "Language models and agents, semantic search and RAG, evaluating results. Knowledge graphs, ontologies and RDF/SPARQL are a specialization that matters especially to us.",
      },
      skill3: {
        title: "Reliable data and processes",
        body: "Relational and vector databases, pipelines and workflows, error handling and restarts. Our stack includes PostgreSQL/pgvector, Redis and Temporal.",
      },
      skill4: {
        title: "Quality and release",
        body: "Git, automated tests, technical documentation, Docker and familiarity with Linux environments and continuous integration.",
      },
      optionalA: "Being able to find your way around a TypeScript front end is useful. ",
      optionalStrong: "Optional skills we value",
      optionalB: " include experience with React, English, and the ability to lead presentations and demos, explaining solutions and results clearly to non-technical audiences too.",
      learning: "You don't need to know every tool already: in your application, tell us where you work independently and what you'd like to learn more about. We assess the quality of your work and your ability to learn through concrete examples.",
    },
    metodo: {
      eyebrow: "HOW WE WORK, REMOTELY TOO",
      titleLine1: "Autonomy, responsibility",
      titleEm: "and collaboration.",
      intro: "The work is fully remote and calls for autonomy, responsibility and collaboration. For us, that means:",
      step1: {
        title: "Listening and analyzing",
        body: "Understanding the user's point of view, asking the right questions and turning needs and constraints into shared requirements and acceptance criteria.",
      },
      step2: {
        title: "Designing with method",
        body: "Clarifying the approach before building, discussing alternatives and trade-offs, and documenting the reasons behind decisions.",
      },
      step3: {
        title: "Seeing assignments through",
        body: "Agreeing on goals and timelines, organizing the work, verifying the result and taking care of the delivery.",
      },
      step4: {
        title: "Making progress visible",
        body: "Communicating clearly, flagging problems and dependencies early, and asking for a discussion when needed.",
      },
      aiEyebrow: "AI-ASSISTED DEVELOPMENT",
      aiTitleLine1: "With coding assistants,",
      aiTitleEm: "and with method.",
      aiP1a: "We are looking for the ability to use ",
      aiP1Strong: "coding assistants such as Codex, Claude Code or equivalent tools",
      aiP1b: " professionally. For us, that means providing the repository context, clear specifications and design constraints, and steering the work toward targeted changes that fit the architecture, structure and conventions of the existing software.",
      aiP2: "We expect you to choose which tasks to hand to assistants, split the work into verifiable steps and review proposals critically. Generated code must be understood, reviewed and verified with relevant tests, also checking that it preserves each component's responsibilities and adds no duplication or unnecessary complexity.",
      aiClosing: "Technical responsibility for the choices and the delivery stays with the developer.",
    },
    candidatura: {
      eyebrow: "THE COLLABORATION",
      titleLine1: "Real projects",
      titleEm: "in advanced AI.",
      p1: "We offer assignments on real advanced-AI projects, with a recognizable contribution to the product and direct exchange with experienced people from research, academia and complex-systems development.",
      termModeLabel: "Arrangement",
      termMode: "Fully remote. The type of contract is agreed on the basis of your profile and the expected commitment.",
      termPayLabel: "Compensation",
      termPay: "Experienced candidates: €2,200 per month + VAT and any agreed expenses.",
      termHoursLabel: "Availability",
      termHours: "By chat and email, Monday to Friday, 9:00–13:00 and 14:00–17:00 (Italian time), for coordination and discussion of the work.",
      p2: "The scope of the work, the expected results and how we coordinate will be agreed before you start.",
      applyEyebrow: "HOW TO APPLY",
      applyTitle: "Write to work@isagog.com",
      applySubjectLabel: "Subject line",
      applySubject: "Python / AI collaboration – First name Last name",
      applyIntro: "Include:",
      item1: "your CV or a link to your professional profile;",
      item2: "a short account of a significant project: the problem, your contribution, the technical choices and the result;",
      item3: "a few lines on the coding assistants you use, the tasks you apply them to and how you check the quality of the result;",
      item4: "the areas where you work independently and your approximate availability, including a possible start date.",
      extra: "If you have code, a portfolio or documentation you can share, add the links. You can also describe a non-public project, respecting its confidentiality.",
      mailLink: "Send your application ↗",
      interviewStrong: "In the interview we'll also dig into how you use coding assistants:",
      interview: " which tools you choose, how you steer them and at which stages you use them, from analysis to design, development, testing and review. We'll ask for concrete examples, including times you corrected or discarded a proposal because it didn't respect the requirements or the architecture.",
      closing: "We want to understand how you approach problems, how you collaborate and what you can bring to Isagog.",
    },
  },
  meta: {
    home: {
      title: "Isagog — An AI that also knows what it doesn't know",
      description:
        "Isagog makes your organization's knowledge explicit, verifiable and usable by AI assistants and applications.",
    },
    approach: {
      title: "Our approach — Isagog",
      description:
        "An explicit representation of your domain, built by agents and supervised by your experts.",
    },
    platform: {
      title: "The platform — Isagog",
      description:
        "The Isagog platform: installs on your infrastructure, works with your data, at costs you control.",
    },
    ontologies: {
      title: "Ontologies — Isagog",
      description:
        "Isagog ontologies: concepts as perspectives that guide the reasoning of language models and the knowledge graph.",
    },
    project: {
      title: "Projects — Isagog",
      description: "Museums, newspaper archives, customer service: Isagog's knowledge at work.",
    },
    blog: {
      title: "Insights — Isagog",
      description: "The thinking behind Isagog's method.",
    },
    contact: {
      title: "Contact — Isagog",
      description: "Tell us about the process you'd like to improve: let's assess your case together.",
    },
    careers: {
      title: "Work with us — Isagog",
      description:
        "Professional collaborations in Python software development, AI and data: work with Isagog on AI systems grounded in verifiable knowledge.",
    },
  },
} as const;
