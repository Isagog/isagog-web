export default {
  nav: {
    wordmark: "Isagog",
    home: "Home",
    approach: "Approach",
    platform: "Platform",
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
    project: "Projects",
    blog: "Insights",
    careers: "Work with us",
    contact: "Contact",
    email: "info@isagog.com",
    privacyPreferences: "Privacy preferences",
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
      intro: "Text search, even by semantic similarity, only finds relevant passages. An [RDF graph](onto:reasoning), instead, connects entities, facts, sources and relations; the [ontology](onto:) makes explicit the rules for deriving new knowledge.",
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
      p2: "That is why we build an explicit representation of your domain: concepts and relations that your experts can discuss and correct. It is what we call an [ontology](onto:) — the description of what exists in your world, what it is called and how it connects to everything else.",
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
      p1: "Isagog has a method for building an organization's knowledge base from what it already has, and for reasoning over it. Our agents, based on specialized language models, read documents and data, recognize implicit concepts and relations and propose [models](onto:layers) of them, ready for review; other agents then extract structured information, item by item, in a traceable way. These are repeatable processes: new documents, new data, same procedures.",
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
        body: "The language model brings the understanding of language; the [knowledge graph](onto:reasoning) brings structure, consistency and proof. It is the integration we call neurosymbolic, and it is the heart of our method.",
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
        "Analytic agents read your documents and turn them into a [knowledge graph](onto:reasoning): entities, facts, relations.",
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
    technical: {
      heading: "Technical deep dives",
      ontology: {
        title: "Isagog ontologies",
        description:
          "Concepts as perspectives that guide the reasoning of language models and the knowledge graph: layers, perspectives and a term explorer.",
      },
      llmSizing: {
        eyebrow: "Interactive tool · October 2026",
        title: "On-Prem LLM Sizing Matrix",
        description:
          "27 open-weight models against 14 hardware configurations, from a desktop GPU to a Blackwell node: what fits in memory and how many tokens per second to expect.",
      },
    },
    articles: {
      heading: "Articles",
    },
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
  careers: {
    invito: {
      eyebrow: "WORK WITH US",
      titleLine1: "Build with us",
      titleEm: "an AI grounded in knowledge.",
      lead: "Professional collaborations in Python software development, AI and data.",
      factRemote: "Fully remote",
      whyLabel: "WHY ISAGOG",
      why1: "At Isagog Srl we make organizations' knowledge accessible to people and applications. We combine language models, [knowledge graphs](onto:reasoning) and reasoning to build AI systems whose answers are grounded in verifiable information and whose limits are recognizable.",
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
        body: "Language models and agents, semantic search and RAG, evaluating results. Knowledge graphs, [ontologies](onto:) and RDF/SPARQL are a specialization that matters especially to us.",
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
  discover: {
    hero: {
      titleLine1: "An AI that answers",
      titleEm: "from your sources.",
      titleLine2: "And can say “I don't know”.",
      sub: "Isagog builds AI assistants for institutions and organisations that cannot afford made-up answers. We make your organisation's knowledge explicit and let it reason with open language models that can run on your own infrastructure.",
      ctaPrimary: "Book a 30-minute call ↓",
      ctaSecondary: "See our projects",
    },
    problema: {
      eyebrow: "WHAT IT REALLY TAKES",
      titleLine1: "Using AI where",
      titleEm: "the quality of information matters.",
      item1: {
        title: "Control over what the AI knows",
        body: "The quality of an answer depends on the information it comes from. When that information is structured, organised and editable, you know where every answer comes from and can correct it at the source, item by item. A generic chatbot draws instead on what it learned elsewhere: nobody knows where an answer comes from, or how to correct it.",
      },
      item2: {
        title: "Your data stays with you",
        body: "Archives, health data and administrative records cannot end up on just any provider's infrastructure. You need an AI that works where your data already is, with access rules you decide.",
      },
      item3: {
        title: "Compliance you can demonstrate",
        body: "Regulations and guidelines increasingly ask you to know where an answer comes from and who is accountable for it. You need a system that makes sources and reasoning visible, not a black box.",
      },
    },
    approccio: {
      eyebrow: "HOW ISAGOG WORKS",
      titleLine1: "Explicit knowledge,",
      titleEm: "open models.",
      item1: {
        title: "A knowledge graph of your domain",
        body: "Documents, catalogues, archives and procedures become a [knowledge graph](onto:reasoning) organised by an [ontology](onto:) of your domain. Your experts validate it and can keep it up to date.",
      },
      item2: {
        title: "The model proposes, knowledge verifies",
        body: "The language model interprets the question and drafts the answer; the graph provides the facts and rules to check it. When a piece of information is missing, the system says so instead of inventing it.",
      },
      item3: {
        title: "Open models, on your infrastructure",
        body: "Open-source language models that can also run on-premise: predictable costs and no dependence on a single provider.",
      },
    },
    casi: {
      eyebrow: "PROJECTS",
      titleLine1: "Already at work",
      titleEm: "with real users.",
      readCase: "Read the case study →",
      maxxi: {
        tag: "MUSEUM · ROME",
        title: "MAXXI",
        body: "MAXXIperTUTTI: a conversational AI with specialised agents that guides visitors, tells the story of the works and rephrases content in easy-to-read language. Validated with people with cognitive disabilities, deaf people and people with visual disabilities.",
      },
      manifesto: {
        tag: "PUBLISHING · HISTORICAL ARCHIVE",
        title: "il manifesto",
        body: "MeMa – Memoria Manifesta: 800,000 articles from an archive recognised as cultural heritage, searchable by meaning for the newsroom and linked to today's news.",
      },
      voicefirst: {
        tag: "CUSTOMER SERVICE",
        title: "Teleperformance",
        body: "Voice First: a copilot that listens to the conversation, reasons over procedures and regulations and suggests the next action to the agent.",
      },
    },
    settori: {
      eyebrow: "WHERE IT HELPS",
      titleLine1: "One method,",
      titleEm: "many settings.",
      cultura: {
        title: "Museums and culture",
        body: "Visitor assistants, accessible content, searchable catalogues and archives, listening to audiences.",
      },
      pa: {
        title: "Public sector",
        body: "Rules, procedures and records that offices and citizens can query, with the source of every answer.",
      },
      sanita: {
        title: "Healthcare",
        body: "Searchable guidelines, protocols and administrative procedures that tell what is documented from what is missing.",
      },
      editoria: {
        title: "Publishing and media",
        body: "Historical archives searchable by meaning, links between news and sources, tools for newsrooms.",
      },
      enti: {
        title: "Companies, funds and institutions",
        body: "Regulations, contracts and internal knowledge available to the people who work with clients, members and partners.",
      },
      altro: {
        title: "And much more",
        body: "Wherever there are documents, rules and knowledge to make reliable and searchable.",
      },
    },
    call: {
      eyebrow: "30 MINUTES, NO COMMITMENT",
      titleLine1: "Let's talk about",
      titleEm: "your case.",
      p1: "A first conversation with our team to understand whether and where AI can help you, with which data and with which safeguards.",
      stepsLabel: "In the call",
      step1: "You tell us about your needs and your organisation's constraints.",
      step2: "We show you how we approached similar cases.",
      step3: "Together we identify the first concrete step.",
      mailLink: "Prefer to write to us? info@isagog.com ↗",
      formTitle: "Request the call.",
      formSub: "We reply within one working day to set a day and time.",
      fieldMessage: "What would you like to talk about?",
      fieldMessagePlaceholder:
        "For example: making our archive searchable, helping visitors find their way…",
      mailSubject: "Isagog — request for a 30-minute call",
    },
  },
  musei: {
    hero: {
      eyebrow: "FOR MUSEUMS AND CULTURAL SITES",
      titleLine1: "Every visitor has their own questions.",
      titleEm: "Your museum answers.",
      sub: "An assistant visitors can talk to as they would to a person, from their phone and in their own language. It answers with content your curators have checked. And when it doesn't know something, it says so.",
      ctaPrimary: "Ask for a demonstration ↓",
      ctaSecondary: "See how it answers",
      q1: "Which works by Ghirri can I see?",
      a1: "The exhibition The Large Glass at MAXXI includes Luigi Ghirri's work titled “Modena”, made in 1978.",
      q2: "I'm in the café, how do I get to The Large Glass?",
      a2step1: "From the Café (Level 0), go through to the Hall.",
      a2step2: "Take the Hall lifts, near EduLab 1 and the Exhibition Space.",
      a2step3: "Go up to Level 1: you will arrive directly in Gallery 4, where The Large Glass is on show.",
      caption: "Real answers from the assistant in use at MAXXI in Rome, translated from Italian.",
    },
    conversazioni: {
      eyebrow: "HOW IT ANSWERS",
      titleLine1: "We won't tell you how it talks.",
      titleEm: "We'll let you read it.",
      easy: {
        title: "The same question, for different people",
        body: "Anyone who prefers simpler language can ask for it. The answer changes form, the content stays the same.",
        q: "What does the work Modena represent?",
        labelStandard: "Standard answer",
        standard1: "The work Modena, part of Luigi Ghirri's Still Life series, is a reflection on photography itself. In this work, Ghirri rephotographs a daguerreotype, creating a mirrored composition in which the “photography of photography” becomes, as he himself described it, a magical moment of temporal coincidence.",
        standard2: "The image shows his interest in objects and traces of the past, using the strong, contrasting colour typical of the Polaroid technique to play with alternating planes, cropping and flattening reality within the frame.",
        labelEasy: "In easy-to-read language",
        simple1: "This text is about a photo called Modena. It is part of a series called Still Life by Luigi Ghirri.",
        simple2: "In this photo, Ghirri photographs another very old photo (a daguerreotype). This creates a special effect: a photo of a photo. Ghirri says it is a magical moment where time meets.",
        simple3: "The photo shows that Ghirri likes objects and things from the past. He uses strong, contrasting colours, typical of Polaroid photos. He plays with planes: he cuts and flattens reality in the photo.",
      },
      route: {
        title: "A route that takes account of who is asking",
        body: "To the same question, a moment earlier, it had pointed to the lifts. The visitor adds that they are claustrophobic, and the route changes.",
        q: "I'm in the café, how do I get to The Large Glass, given that I'm claustrophobic?",
        step1: "From the Café (Level 0), go through the Hall to Gallery 1.",
        step2: "In Gallery 1, take Main Staircase 1.",
        step3: "Go up to Level 1: you will arrive in Gallery 3.",
        step4: "Cross Gallery 3 to reach Gallery 4, where The Large Glass is on show. Route without lifts, as requested.",
      },
      unknown: {
        title: "When it doesn't know, it says so",
        body: "It doesn't reassure at random and it doesn't make things up. It says what is on record, flags the doubt and points to who can help.",
        q: "I have epilepsy, are there any dangerous works?",
        a1: "There are no specific warnings for photosensitivity or epilepsy in the general information and in the descriptions of the exhibitions currently on show.",
        a2: "Some works on the programme include video installations, such as Songs and Cries, and film programmes, such as the Flaminio Film Festival, which may involve changes of light or bright projections.",
        a3: "For detailed information on lighting conditions and safety before your visit, you can contact MAXXI's Public Engagement office. […]",
      },
      note: "Real answers from the MAXXI assistant, taken from the September 2026 demonstration and translated from Italian. Some are slightly shortened. The exhibitions mentioned were those on show at the time.",
    },
    agenti: {
      eyebrow: "WHAT VISITORS CAN DO",
      titleLine1: "Many kinds of help,",
      titleEm: "one conversation.",
      lead: "Behind the scenes, specialised assistants each have their own task. Visitors don't have to choose them or know about them: they write their question, and it reaches the one that can answer. You switch on only the ones you need.",
      item1: {
        title: "Finding the way",
        body: "It guides people from one point of the museum to another using the names of rooms and spaces, not “left” and “right”, which change depending on where you are looking.",
        example: "“I'm in the café, how do I get to the exhibition?”",
      },
      item2: {
        title: "Understanding the works",
        body: "It talks about works, artists and exhibitions, starting from your catalogues and your own texts.",
        example: "“Which artists are in this exhibition?”",
      },
      item3: {
        title: "Planning the visit",
        body: "It gives practical information: opening hours, tickets, events and services.",
        example: "“What exhibitions are on today?”",
      },
      item4: {
        title: "Understanding in your own way",
        body: "On request it rewrites the answer in easy-to-read language, or in descriptive language with tactile and physical references for people who cannot see the works.",
        example: "“Can you explain that more simply?”",
      },
      item5: {
        title: "Having your say",
        body: "It gathers visitors' opinions and impressions, so the museum knows what they liked and what didn't work.",
        example: "“Lovely exhibition, but the labels are hard to read.”",
      },
      item6: {
        title: "Speaking your own language",
        body: "It answers in the language it is written to. It has been tested in English, French, Spanish, German, Chinese, Japanese and Russian.",
        example: "“Sind Assistenzhunde erlaubt?”",
      },
    },
    confronto: {
      eyebrow: "NOT A GPT FOR MUSEUMS",
      titleLine1: "Not all chatbots are alike.",
      titleEm: "The difference is where the answers come from.",
      labelAsk: "How you ask",
      labelSource: "Where the answer comes from",
      labelUnknown: "If it doesn't know the answer",
      scripted: {
        name: "Scripted chatbot",
        tagline: "Reliable, but rigid",
        ask: "You have to ask the “right” questions, the ones it expects.",
        source: "Texts written in advance by staff, one by one.",
        unknown: "It can't adapt: the conversation stops.",
      },
      generic: {
        name: "Generic AI, such as GPT",
        tagline: "Fluent, but unpredictable",
        ask: "You can ask anything, freely.",
        source: "External sources too, which the museum doesn't control.",
        unknown: "It may give a convincing, wrong answer.",
      },
      isagog: {
        name: "Isagog",
        tagline: "Free conversation, controlled knowledge",
        ask: "You talk freely, as you would to a person.",
        source: "The museum's knowledge, checked by your curators.",
        unknown: "It says so, and points to who can help.",
      },
    },
    maxxi: {
      eyebrow: "ALREADY IN USE",
      titleLine1: "At MAXXI in Rome,",
      titleEm: "tested by people who face barriers.",
      body: "With the MAXXIperTUTTI project, funded by Italy's recovery plan (PNRR) to remove physical and cognitive barriers, we brought the assistant to a national museum. Before launch, we put it to the test with the people who would really use it.",
      fact1: {
        title: "Three working groups",
        body: "People with cognitive disabilities and neurodivergence, deaf people, people with visual impairments.",
      },
      fact2: {
        title: "On real exhibitions",
        body: "The assistant answers on the content of real exhibitions, not on a test archive.",
      },
      fact3: {
        title: "In the museum's hands",
        body: "The museum received the tools to update content and follow conversations without depending on us.",
      },
      imageAlt: "Visitors in the MAXXI atrium, crossed by its suspended black staircases",
    },
    staff: {
      eyebrow: "FOR MUSEUM STAFF",
      titleLine1: "You don't need an IT specialist.",
      titleEm: "You need someone who knows the museum.",
      step1: {
        title: "Upload your materials",
        body: "Catalogues, exhibition texts, brochures: what you already have. The system draws out works, authors and descriptions.",
      },
      step2: {
        title: "The curator approves",
        body: "Nothing reaches visitors without being checked by someone at the museum. If something is wrong, you fix it, and from then on it is right.",
      },
      step3: {
        title: "The visitor asks",
        body: "From their phone, by writing a question. There is nothing to learn, and nobody asks them who they are.",
      },
      step4: {
        title: "You listen",
        body: "You see what visitors ask and read their opinions. So you discover what they are really looking for.",
      },
      support: "We take care of the technical side. We set the system up on your museum and train your staff, who can then manage the content on their own.",
    },
    idee: {
      eyebrow: "IDEAS TO DEVELOP TOGETHER",
      titleLine1: "From here on,",
      titleEm: "you decide where to go.",
      lead: "These are not ready-made features: they are possibilities that grow out of what the system can already do, and that we can build together with a museum, starting from its needs.",
      idea1: {
        title: "Preparing the visit from home",
        body: "Before setting off, visitors find out what to see, how to get there and what to expect.",
      },
      idea2: {
        title: "“I only have an hour”",
        body: "A route built around the time available and what interests that person.",
      },
      idea3: {
        title: "Schools and families",
        body: "Content told in a way that suits each age, to prepare a school trip or let children lead the way.",
      },
      idea4: {
        title: "What isn't on display",
        body: "Giving a voice to works in storage and to archives the public can't encounter today.",
      },
      idea5: {
        title: "Visitors' questions as a compass",
        body: "A regular summary for curators and directors: what the public asks, can't find or doesn't understand.",
      },
      idea6: {
        title: "A local network",
        body: "Several museums in a city or region, with one assistant that also suggests the next stop.",
      },
    },
    domande: {
      eyebrow: "FREQUENT QUESTIONS",
      title: "What museums ask us.",
      faq1: {
        q: "Do we need technical staff?",
        a: "No. We handle the setup. The museum needs someone who knows the content: we train them to upload and correct it.",
      },
      faq2: {
        q: "Can it make up answers?",
        a: "That is the risk we built the system to avoid. Answers start from knowledge checked by the museum and, if some information is missing, the assistant says so instead of filling the gap. No AI is infallible: that's why staff can read the conversations and correct things at the source.",
      },
      faq3: {
        q: "Does it replace guides and educators?",
        a: "No, it works alongside them. It answers the questions nobody can answer at that moment, and gives staff a picture of what visitors are looking for.",
      },
      faq4: {
        q: "What happens to visitors' data?",
        a: "Visitors don't have to register and aren't profiled: the assistant adapts to what they ask in the conversation. The system is designed in line with GDPR and the AI Act and can run on open models, without depending on the big AI providers.",
      },
      faq5: {
        q: "How much does it cost?",
        a: "It depends on the size of the museum, the features you switch on and where the service runs. You can start with a single feature. We discuss it at the first meeting, starting from your case.",
      },
      faq6: {
        q: "Can it be funded through a grant?",
        a: "The MAXXI project was funded by Italy's recovery plan. If you are preparing a grant application, we can give you a description of the project and its costs to include.",
      },
    },
    call: {
      eyebrow: "30 MINUTES, NO COMMITMENT",
      titleLine1: "See it",
      titleEm: "for yourselves.",
      p1: "The best way to understand what it is, and what it isn't, is to see it working. You need no technical knowledge and nothing to prepare.",
      stepsLabel: "In the meeting",
      step1: "You tell us about your museum and your visitors.",
      step2: "We show you the assistant at work, and you can ask it your own questions.",
      step3: "Together we see where it would make sense to start.",
      mailLink: "Prefer to write? info@isagog.com ↗",
      formTitle: "Ask for a demonstration.",
      formSub: "We reply within one working day to set a date and time.",
      fieldMessage: "What would you like to improve in the visit?",
      fieldMessagePlaceholder:
        "For example: helping visitors find their way, making content more accessible, we're preparing a grant application…",
      mailSubject: "Isagog — demonstration request for a museum",
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
    project: {
      title: "Projects — Isagog",
      description: "Museums, newspaper archives, customer service: Isagog's knowledge at work.",
    },
    blog: {
      title: "Insights — Isagog",
      description: "The thinking behind Isagog's method.",
    },
    llmSizing: {
      title: "On-Prem LLM Sizing Matrix — Isagog",
      description:
        "Where the current open-weight LLMs fit and roughly how fast they generate, from a 16 GB gaming card to an 8-GPU Blackwell node. Interactive sizing matrix, October 2026.",
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
    discover: {
      title: "An AI that answers from your sources — Isagog",
      description:
        "AI assistants with answers grounded in verifiable sources and open models on your infrastructure. Book a 30-minute call.",
    },
    musei: {
      title: "Isagog for museums — Every visitor asks, your museum answers",
      description:
        "An assistant that answers visitors with content checked by your curators, in plain language and in their own language. Already in use at MAXXI in Rome.",
    },
  },
} as const;
