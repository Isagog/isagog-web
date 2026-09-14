export default {
  nav: {
    wordmark: "Isagog",
    home: "Home",
    approach: "Approach",
    platform: "Platform",
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
      imageAlt: "Illustration of a tree, Isagog",
      title: "An AI that can tell you what it knows",
      tagline: "And that, when it matters, can say: no.",
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
  meta: {
    home: {
      title: "Isagog — An AI that can tell you what it knows",
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
  },
} as const;
