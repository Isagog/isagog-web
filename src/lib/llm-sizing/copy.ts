import type { Locale } from "@/lib/locale-href";
import type { Precision } from "./estimate";

/**
 * Copy for the on-prem LLM sizing matrix, carried over verbatim from the
 * delivered static pages. Kept out of the site-wide locale files because it
 * is the tool's own content (labels, templates, sources), not shared UI.
 *
 * Prose fields may contain <b> and <code> spans, rendered by RichText.
 * `tool` strings are templates: `{name}` placeholders are filled by `fill`.
 */

export interface SourceLink {
  href: string;
  label: string;
}

/** A source line: one or more links, or plain text. */
export type SourceItem = readonly SourceLink[] | string;

export interface ToolStrings {
  groups: readonly string[];
  hwg: readonly string[];
  onQuote: string;
  model: string;
  model_sub: string;
  moe: string;
  dense: string;
  of: string;
  nodes: string;
  cap_multi: string;
  cap_single: string;
  on: string;
  d_none: string;
  d_nodes: string;
  d_multi: string;
  d_single: string;
  d_off: string;
  d_tight: string;
  d_fit: string;
  d_join: string;
  st_fit: string;
  st_tight: string;
  st_off: string;
  st_nodes: string;
  st_none: string;
  st_hint: string;
  st_cap: string;
  sp_agg: string;
  sp_multi: string;
  sp_one: string;
  b_bw: string;
  b_cp: string;
  sp_ram: string;
  sp_bwd: string;
  sp_spec: string;
  sp_none: string;
  mt: string;
  mt_across: string;
  mt_ram: string;
  lab_m: string;
  user1: string;
  userN: string;
  ch_best: string;
  ch_other: string;
  cal_h: readonly string[];
  agg_abbr: string;
  in_range: string;
  out_range: string;
  cal_labels: readonly string[];
  cal_src: readonly string[];
  q2: string;
}

export interface SizingCopy {
  eyebrow: string;
  title: string;
  lede: string;
  stamp: { month: string; lines: readonly string[] };
  controls: {
    ariaLabel: string;
    precision: string;
    context: string;
    users: string;
    precisionOptions: Readonly<Record<Precision, { label: string; title?: string }>>;
    offload: { label: string; hint: string };
    spec: { label: string; hint: string };
  };
  legend: {
    ariaLabel: string;
    rampLabel: string;
    unit: string;
    tight: string;
    offload: string;
    q2: string;
    none: string;
    nodesSample: string;
    nodes: string;
  };
  chart: { heading: string; ariaLabel: string };
  calibration: { heading: string; intro: string };
  method: { heading: string; items: readonly { title: string; body: string }[] };
  sources: {
    heading: string;
    groups: readonly { title: string; items: readonly SourceItem[] }[];
  };
  footnote: string;
  cta: { title: string; body: string; link: string };
  tool: ToolStrings;
}

export const SIZING_COPY: Readonly<Record<Locale, SizingCopy>> = {
  it: {
    eyebrow: "LLM open-weight · dimensionamento on-prem",
    title: "Matrice di dimensionamento on-prem degli LLM",
    lede: "Dove stanno i modelli open-weight più recenti e a che velocità generano, da una scheda gaming da 16 GB a un nodo Blackwell da 8 GPU. <b>La capacità di memoria decide se un modello ci sta.</b> <b>La banda di memoria decide quanto velocemente scrive.</b> I modelli Mixture-of-Experts separano le due cose: i parametri totali fissano la memoria, quelli attivi fissano la velocità.",
    stamp: {
      month: "Ottobre 2026",
      lines: ["Stime, non benchmark", "Margine di errore ±30–50%"],
    },
    controls: {
      ariaLabel: "Scenario",
      precision: "Precisione",
      context: "Contesto per utente",
      users: "Utenti concorrenti",
      precisionOptions: {
        "2": {
          label: "~2,5 bit",
        },
        "4": {
          label: "4-bit",
        },
        "8": {
          label: "8-bit",
        },
        best: {
          label: "Miglior adattamento",
          title: "La precisione più alta, fino a 8 bit, che ci sta; poi 4 bit; poi ~2,5 bit (solo desktop)",
        },
        rel: {
          label: "Come rilasciato",
          title: "La precisione in cui è distribuito il checkpoint ufficiale",
        },
      },
      offload: {
        label: "Offload su 128 GB di RAM di sistema",
        hint: "(GPU desktop e workstation)",
      },
      spec: {
        label: "Speculative decoding / MTP",
        hint: "(≈1,6× con 1 utente)",
      },
    },
    legend: {
      ariaLabel: "Legenda",
      rampLabel: "Fasce di velocità di decodifica",
      unit: "token/s",
      tight: "adattamento stretto (<10% di margine)",
      offload: "funziona con offload su RAM",
      q2: "solo a ~2,5 bit (perdita di qualità)",
      none: "non ci sta",
      nodesSample: "2 nodi",
      nodes: "servono tanti nodi",
    },
    chart: {
      heading: "Ingombro di memoria rispetto alla capacità hardware",
      ariaLabel: "Ingombro di memoria di ciascun modello a confronto con la capacità di memoria dell'hardware",
    },
    calibration: {
      heading: "Taratura su misure reali",
      intro: "Le stesse formule, applicate a configurazioni con misure pubblicate su singola macchina. Stime entro circa ±30% dalle misure sono la precisione da attendersi su tutta la matrice.",
    },
    method: {
      heading: "Come funzionano le stime",
      items: [
        {
          title: "Memoria necessaria",
          body: "<code>parametri totali × bit ÷ 8</code> per i pesi, più la cache KV (stima per modello × contesto × utenti), più il 3% di overhead di runtime e 1 GB per GPU. La memoria utilizzabile è il 93% di quella della GPU, 110 GB sui box a memoria unificata da 128 GB e 470 GB su un Mac da 512 GB con il limite di memoria wired alzato.",
        },
        {
          title: "Velocità di decodifica",
          body: "Ogni passo legge una volta i pesi attivi (per i MoE con più utenti, l'unione degli esperti coinvolti) più la cache KV. Il tempo di passo è <code>byte ÷ banda effettiva</code> oppure <code>FLOP ÷ calcolo effettivo</code>, il maggiore dei due, più un overhead per layer. La banda effettiva è il 75% del picco (70% su Apple).",
        },
        {
          title: "Perché 8 GPU non rendono un utente 8× più veloce",
          body: "Ogni layer paga un costo fisso per il lancio dei kernel, il routing MoE e, tra più GPU, un all-reduce: circa 0,03 ms (denso) o 0,1 ms (MoE) per layer, più 0,06–0,15 ms su multi-GPU. Su un nodo questo pavimento domina, quindi un singolo utente vede decine di token al secondo. Il nodo si giustifica con la concorrenza e con la capacità.",
        },
        {
          title: "Multi-GPU e offload",
          body: "Lo scaling tensor-parallel è assunto al 60% su due GPU PCIe, al 50% su quattro e al 75% su un nodo NVLink. Con l’offload attivo, i pesi che non entrano in VRAM stanno nella RAM di sistema, letta a circa 60 GB/s: è così che i modelli MoE girano su una sola scheda desktop.",
        },
        {
          title: "Concorrenza",
          body: "Il throughput aggregato è utenti ÷ tempo di passo, scontato per scheduling e interferenza del prefill (circa il 2% per ogni utente in più). La memoria della cache KV cresce con gli utenti, quindi con contesti lunghi e molti utenti è la memoria a esaurirsi per prima.",
        },
        {
          title: "Cosa ignora",
          body: "Il tempo di elaborazione del prompt (time to first token), la quantizzazione della cache KV (la KV in FP8 dimezza quella memoria), la perdita di qualità dovuta alla quantizzazione e i kernel specifici del runtime. Il miglior adattamento non supera mai gli 8 bit perché il serving in FP8 è quasi senza perdite. Numero di layer e dimensioni della KV di diversi modelli 2026 sono stimati dalla famiglia architetturale; si assume che Mistral Large 3 e Nemotron 3 Ultra siano distribuiti in FP8.",
        },
      ],
    },
    sources: {
      heading: "Fonti",
      groups: [
        {
          title: "Specifiche dei modelli",
          items: [
            [
              {
                href: "https://vast.ai/article/kimi-k3-inside-first-3-trillion-class-open-weight-ai-model",
                label: "Kimi K3 (Vast.ai)",
              },
              {
                href: "https://www.yottalabs.ai/post/kimi-k3-hardware-requirements-gpu-memory-2026",
                label: "K3 hardware (Yotta Labs)",
              },
            ],
            [
              {
                href: "https://recipes.vllm.ai/Qwen/Qwen3.8-2.4T-A95B",
                label: "Qwen3.8-2.4T-A95B (vLLM recipes)",
              },
              {
                href: "https://the-decoder.com/alibabas-qwen-team-releases-qwen-3-8-models-with-open-weights-under-the-apache-2-0-license/",
                label: "Qwen3.8-27B (The Decoder)",
              },
            ],
            [
              {
                href: "https://rits.shanghai.nyu.edu/ai/deepseek-releases-v4-open-source-1-6t-moe-with-1m-context",
                label: "DeepSeek V4 Pro / Flash (NYU Shanghai RITS)",
              },
              {
                href: "https://aiweekly.co/alerts/deepseek-v4-pro-exits-preview-with-mit-licensed-17t-weights",
                label: "V4 Pro GA weights (AI Weekly)",
              },
            ],
            [
              {
                href: "https://www.yottalabs.ai/post/deepseek-v4-1-flash-hardware-requirements-gpu-memory-2026",
                label: "DeepSeek V4.1 Flash (Yotta Labs)",
              },
              {
                href: "https://localaimaster.com/blog/deepseek-v4-hardware-requirements",
                label: "V4 Flash sizes (LocalAIMaster)",
              },
            ],
            [
              {
                href: "https://www.aimadetools.com/blog/how-to-run-kimi-k2-6-locally",
                label: "Kimi K2.6, guida all’uso in locale",
              },
              {
                href: "https://codersera.com/blog/glm-5-2-complete-guide-2026/amp/",
                label: "GLM-5.2 guide (Codersera)",
              },
            ],
            [
              {
                href: "https://artificialanalysis.ai/models/releases/minimax-m3",
                label: "MiniMax M3 (Artificial Analysis)",
              },
              {
                href: "https://decrypt.co/369689/nvidia-open-ai-model-nemotron-3-ultra",
                label: "Nemotron 3 Ultra (Decrypt)",
              },
            ],
            [
              {
                href: "https://docs.sglang.io/cookbook/autoregressive/Mistral/Mistral-Small-4",
                label: "Mistral Small 4 (SGLang)",
              },
              {
                href: "https://aiweekly.co/alerts/mistral-posts-nvfp4-build-of-small-4-119b-with-vllm-red-hat",
                label: "Mistral Large 3 (AI Weekly)",
              },
            ],
            [
              {
                href: "https://unsloth.ai/docs/models/mtp.md",
                label: "Gemma 4 / Qwen3.6 (Unsloth)",
              },
            ],
          ],
        },
        {
          title: "Velocità misurate",
          items: [
            [
              {
                href: "https://www.hardware-corner.net/gpu-llm-benchmarks/rtx-5090/",
                label: "RTX 5090 benchmarks (Hardware Corner)",
              },
            ],
            [
              {
                href: "https://kunalganglani.com/llm-benchmarks",
                label: "Tabella GPU consumer (Kunal Ganglani)",
              },
            ],
            [
              {
                href: "https://www.localaimaster.com/blog/dgx-spark-local-ai-review",
                label: "DGX Spark review (LocalAIMaster)",
              },
            ],
            [
              {
                href: "https://www.morphllm.com/vllm-benchmarks",
                label: "vLLM on H100 (Morph)",
              },
            ],
            [
              {
                href: "https://www.premai.io/blog/gpu-buying-guide-for-llms-rtx-5090-vs-h100-vs-h200-complete-comparison-2026/",
                label: "GPU buying guide (Prem AI)",
              },
            ],
          ],
        },
        {
          title: "Prezzi",
          items: [
            [
              {
                href: "https://akash.network/the-bid/nvidia-h200-gpu-guide-2026-specs-benchmarks-pricing/",
                label: "H200 pricing (Akash)",
              },
            ],
            [
              {
                href: "https://intuitionlabs.ai/articles/data-center-gpu-prices",
                label: "Data center GPU prices (IntuitionLabs)",
              },
            ],
            [
              {
                href: "https://localaimaster.com/blog/dgx-spark-vs-strix-halo-vs-mac-studio",
                label: "Spark vs Strix Halo vs Mac (LocalAIMaster)",
              },
            ],
            "Prezzi consumer e workstation: stime indicative di mercato, in USD.",
          ],
        },
      ],
    },
    footnote: "Compilato il 10 ottobre 2026. I rilasci di modelli open-weight cambiano ogni mese: considerate ogni cifra un punto di partenza e fate un benchmark sul vostro stack prima di acquistare.",
    cta: {
      title: "Dovete dimensionare un’infrastruttura on-prem per un progetto reale?",
      body: "Aiutiamo le organizzazioni a scegliere modello, hardware e architettura per i loro sistemi di IA basati su conoscenza e agenti.",
      link: "Valutiamo il vostro caso ↗",
    },
    tool: {
      groups: [
        "1T+ parametri",
        "250–800B parametri",
        "100–130B parametri",
        "Fino a 35B parametri",
      ],
      hwg: ["GPU desktop", "Workstation e memoria unificata", "Datacenter"],
      onQuote: "su preventivo",
      model: "Modello",
      model_sub: "attivi su totali · richiede",
      moe: "MoE",
      dense: "denso",
      of: "su",
      nodes: "{n} nodi",
      cap_multi: "Le celle mostrano il throughput aggregato stimato in decodifica (token/s sommati su {users} utenti) con la velocità per utente (/u) sotto; la sfumatura segue la velocità per utente. Contesto: {ctx}K token per utente. Cliccate una cella per il dettaglio.",
      cap_single: "Le celle mostrano la velocità di decodifica stimata per un utente, in token/s, con la precisione usata sotto. Contesto: {ctx}K token. Cliccate una cella per il dettaglio.",
      on: "su",
      d_none: "non ci sta (servono circa {gb})",
      d_nodes: "servono {n} nodi",
      d_multi: "{agg} tok/s aggregati, {per} per utente",
      d_single: "circa {x} tok/s",
      d_off: "con offload su RAM",
      d_tight: "adattamento stretto",
      d_fit: "ci sta",
      d_join: "{s} a {label}, {v}",
      st_fit: "Ci sta in memoria a <b>{label}</b>.",
      st_tight: "Ci sta a <b>{label}</b> con meno del 10% di margine. Contesti più lunghi o più utenti non ci starebbero.",
      st_off: "Non ci sta in VRAM. Funziona a <b>{label}</b> con circa il {pct}% dei pesi in 128 GB di RAM di sistema.",
      st_nodes: "Non ci sta in un nodo. Servono <b>{n} nodi</b> a {label} (circa {gb} in totale).",
      st_none: "Non ci sta: servono circa <b>{gb}</b> a {label}, contro {usable} utilizzabili{hint}.",
      st_hint: ". Provate ad attivare l’offload su RAM",
      st_cap: " Contesto limitato al massimo del modello ({k}K).",
      sp_agg: "tok/s aggregati",
      sp_multi: "{per} tok/s per utente · {users} utenti · {bound}",
      sp_one: "tok/s, un utente",
      b_bw: "limitato dalla banda",
      b_cp: "limitato dal calcolo",
      sp_ram: "limitato dalla banda della RAM di sistema",
      sp_bwd: "decodifica limitata dalla banda",
      sp_spec: " · speculative decoding attivo",
      sp_none: "Nessuna stima di velocità su singola macchina.",
      mt: "Pesi <b>{w}</b> + cache KV <b>{kv}</b> ({ctx}K × {users}) + runtime <b>{o}</b> = <b>{tot}</b> · utilizzabili {cap}{across}{ram}",
      mt_across: " su {n} nodi",
      mt_ram: ", più {gb} GB di RAM di sistema",
      lab_m: "{maker} · {total} totali, {active} attivi · rilasciato in {rel}",
      user1: "utente",
      userN: "utenti",
      ch_best: "Ogni barra va dall’ingombro a 4 bit a quello alla precisione di servizio (fino a 8 bit), inclusa la cache KV per un contesto di {ctx}K × {users} {u}. L’anello indica ~2,5 bit. Le linee tratteggiate sono la memoria utilizzabile di ciascuna fascia hardware. Scala logaritmica.",
      ch_other: "Ingombro alla precisione selezionata, inclusa la cache KV per un contesto di {ctx}K × {users} {u}. Le linee tratteggiate sono la memoria utilizzabile di ciascuna fascia hardware. Scala logaritmica.",
      cal_h: ["Configurazione", "Hardware", "Misurato", "Questo modello", "Concordanza", "Fonte"],
      agg_abbr: " agg.",
      in_range: "nel range",
      out_range: "fuori range",
      cal_labels: [
        "Qwen3 32B · Q4_K_M",
        "Qwen2.5 32B · Q4_K_M",
        "Llama 3.1 8B · Q4_K_M",
        "gpt-oss-120b · MXFP4",
        "Llama 3.1 70B · FP8 (denso)",
        "Llama 3.1 70B · FP8 · 64 utenti",
      ],
      cal_src: [
        "Hardware Corner (llama.cpp)",
        "Kunal Ganglani (llama.cpp)",
        "Kunal Ganglani (llama.cpp)",
        "maintainer di llama.cpp, via LocalAIMaster",
        "LMSYS, via LocalAIMaster",
        "vLLM: Morph (460) e Prem AI (984)",
      ],
      q2: "Q2",
    },
  },
  en: {
    eyebrow: "Open-weight LLMs · on-prem sizing",
    title: "On-Prem LLM Sizing Matrix",
    lede: "Where the current open-weight models fit and roughly how fast they generate, from a 16 GB gaming card to an 8-GPU Blackwell node. <b>Memory capacity decides whether a model fits.</b> <b>Memory bandwidth decides how fast it writes.</b> Mixture-of-experts models split the two: total parameters set the memory, active parameters set the speed.",
    stamp: {
      month: "October 2026",
      lines: ["Estimates, not benchmarks", "Expect ±30–50%"],
    },
    controls: {
      ariaLabel: "Scenario",
      precision: "Precision",
      context: "Context per user",
      users: "Concurrent users",
      precisionOptions: {
        "2": {
          label: "~2.5-bit",
        },
        "4": {
          label: "4-bit",
        },
        "8": {
          label: "8-bit",
        },
        best: {
          label: "Best fit",
          title: "Highest precision up to 8-bit that fits, then 4-bit, then ~2.5-bit (desktop only)",
        },
        rel: {
          label: "As released",
          title: "The precision the official checkpoint ships in",
        },
      },
      offload: {
        label: "Offload to 128 GB system RAM",
        hint: "(desktop & workstation GPUs)",
      },
      spec: {
        label: "Speculative decoding / MTP",
        hint: "(≈1.6× at 1 user)",
      },
    },
    legend: {
      ariaLabel: "Legend",
      rampLabel: "Decode speed buckets",
      unit: "tokens/s",
      tight: "tight fit (<10% headroom)",
      offload: "runs with RAM offload",
      q2: "only at ~2.5-bit (quality loss)",
      none: "doesn't fit",
      nodesSample: "2 nodes",
      nodes: "needs that many nodes",
    },
    chart: {
      heading: "Memory footprint against hardware capacity",
      ariaLabel: "Memory footprint of each model compared with hardware memory capacity",
    },
    calibration: {
      heading: "Calibration against measured numbers",
      intro: "The same formulas, run on configurations with published single-machine measurements. Estimates landing within roughly ±30% of measurements is the accuracy to expect across the matrix.",
    },
    method: {
      heading: "How the estimates work",
      items: [
        {
          title: "Memory needed",
          body: "<code>total params × bits ÷ 8</code> for weights, plus KV cache (per-model estimate × context × users), plus 3% runtime overhead and 1 GB per GPU. Usable memory is 93% of GPU memory, 110 GB on 128 GB unified boxes, and 470 GB on a 512 GB Mac with the wired-memory limit raised.",
        },
        {
          title: "Decode speed",
          body: "Each step reads the active weights once (for MoE with several users, the union of experts they touch) plus the KV cache. Step time is <code>bytes ÷ effective bandwidth</code> or <code>FLOPs ÷ effective compute</code>, whichever is larger, plus a per-layer overhead. Effective bandwidth is 75% of peak (70% on Apple).",
        },
        {
          title: "Why 8 GPUs don't make one user 8× faster",
          body: "Every layer pays a fixed cost for kernel launches, MoE routing and, across GPUs, an all-reduce: about 0.03 ms (dense) or 0.1 ms (MoE) per layer, plus 0.06–0.15 ms on multi-GPU. On a node this floor dominates, so a single user sees tens of tokens per second. The node earns its price on concurrency and on capacity.",
        },
        {
          title: "Multi-GPU and offload",
          body: "Tensor-parallel scaling is taken as 60% on two PCIe GPUs, 50% on four, and 75% on an NVLink node. With offload on, weights that don't fit in VRAM sit in system RAM read at about 60 GB/s; this is how MoE models run on a single desktop card.",
        },
        {
          title: "Concurrency",
          body: "Aggregate throughput is users ÷ step time, discounted for scheduling and prefill interference (about 2% per extra user). KV cache memory scales with users, so long contexts for many users run out of memory first.",
        },
        {
          title: "What it ignores",
          body: "Prompt processing time (time to first token), KV-cache quantization (FP8 KV halves that memory), quality loss from quantization, and runtime-specific kernels. Best fit never goes above 8-bit because FP8 serving is close to lossless. Layer counts and KV sizes for several 2026 models are estimated from their architecture families; Mistral Large 3 and Nemotron 3 Ultra are assumed to ship FP8.",
        },
      ],
    },
    sources: {
      heading: "Sources",
      groups: [
        {
          title: "Model specs",
          items: [
            [
              {
                href: "https://vast.ai/article/kimi-k3-inside-first-3-trillion-class-open-weight-ai-model",
                label: "Kimi K3 (Vast.ai)",
              },
              {
                href: "https://www.yottalabs.ai/post/kimi-k3-hardware-requirements-gpu-memory-2026",
                label: "K3 hardware (Yotta Labs)",
              },
            ],
            [
              {
                href: "https://recipes.vllm.ai/Qwen/Qwen3.8-2.4T-A95B",
                label: "Qwen3.8-2.4T-A95B (vLLM recipes)",
              },
              {
                href: "https://the-decoder.com/alibabas-qwen-team-releases-qwen-3-8-models-with-open-weights-under-the-apache-2-0-license/",
                label: "Qwen3.8-27B (The Decoder)",
              },
            ],
            [
              {
                href: "https://rits.shanghai.nyu.edu/ai/deepseek-releases-v4-open-source-1-6t-moe-with-1m-context",
                label: "DeepSeek V4 Pro / Flash (NYU Shanghai RITS)",
              },
              {
                href: "https://aiweekly.co/alerts/deepseek-v4-pro-exits-preview-with-mit-licensed-17t-weights",
                label: "V4 Pro GA weights (AI Weekly)",
              },
            ],
            [
              {
                href: "https://www.yottalabs.ai/post/deepseek-v4-1-flash-hardware-requirements-gpu-memory-2026",
                label: "DeepSeek V4.1 Flash (Yotta Labs)",
              },
              {
                href: "https://localaimaster.com/blog/deepseek-v4-hardware-requirements",
                label: "V4 Flash sizes (LocalAIMaster)",
              },
            ],
            [
              {
                href: "https://www.aimadetools.com/blog/how-to-run-kimi-k2-6-locally",
                label: "Kimi K2.6 local guide",
              },
              {
                href: "https://codersera.com/blog/glm-5-2-complete-guide-2026/amp/",
                label: "GLM-5.2 guide (Codersera)",
              },
            ],
            [
              {
                href: "https://artificialanalysis.ai/models/releases/minimax-m3",
                label: "MiniMax M3 (Artificial Analysis)",
              },
              {
                href: "https://decrypt.co/369689/nvidia-open-ai-model-nemotron-3-ultra",
                label: "Nemotron 3 Ultra (Decrypt)",
              },
            ],
            [
              {
                href: "https://docs.sglang.io/cookbook/autoregressive/Mistral/Mistral-Small-4",
                label: "Mistral Small 4 (SGLang)",
              },
              {
                href: "https://aiweekly.co/alerts/mistral-posts-nvfp4-build-of-small-4-119b-with-vllm-red-hat",
                label: "Mistral Large 3 (AI Weekly)",
              },
            ],
            [
              {
                href: "https://unsloth.ai/docs/models/mtp.md",
                label: "Gemma 4 / Qwen3.6 (Unsloth)",
              },
            ],
          ],
        },
        {
          title: "Measured speeds",
          items: [
            [
              {
                href: "https://www.hardware-corner.net/gpu-llm-benchmarks/rtx-5090/",
                label: "RTX 5090 benchmarks (Hardware Corner)",
              },
            ],
            [
              {
                href: "https://kunalganglani.com/llm-benchmarks",
                label: "Consumer GPU table (Kunal Ganglani)",
              },
            ],
            [
              {
                href: "https://www.localaimaster.com/blog/dgx-spark-local-ai-review",
                label: "DGX Spark review (LocalAIMaster)",
              },
            ],
            [
              {
                href: "https://www.morphllm.com/vllm-benchmarks",
                label: "vLLM on H100 (Morph)",
              },
            ],
            [
              {
                href: "https://www.premai.io/blog/gpu-buying-guide-for-llms-rtx-5090-vs-h100-vs-h200-complete-comparison-2026/",
                label: "GPU buying guide (Prem AI)",
              },
            ],
          ],
        },
        {
          title: "Prices",
          items: [
            [
              {
                href: "https://akash.network/the-bid/nvidia-h200-gpu-guide-2026-specs-benchmarks-pricing/",
                label: "H200 pricing (Akash)",
              },
            ],
            [
              {
                href: "https://intuitionlabs.ai/articles/data-center-gpu-prices",
                label: "Data center GPU prices (IntuitionLabs)",
              },
            ],
            [
              {
                href: "https://localaimaster.com/blog/dgx-spark-vs-strix-halo-vs-mac-studio",
                label: "Spark vs Strix Halo vs Mac (LocalAIMaster)",
              },
            ],
            "Consumer and workstation prices: rough street estimates, USD.",
          ],
        },
      ],
    },
    footnote: "Compiled 10 October 2026. Open-weight model releases move monthly; treat every figure as a starting point and benchmark on your own stack before buying.",
    cta: {
      title: "Sizing an on-prem deployment for a real project?",
      body: "We help organizations choose the right model, hardware and architecture for their knowledge and agentic AI systems.",
      link: "Let's assess your case ↗",
    },
    tool: {
      groups: [
        "1T+ parameters",
        "250–800B parameters",
        "100–130B parameters",
        "Up to 35B parameters",
      ],
      hwg: ["Desktop GPU", "Workstation & unified memory", "Datacenter"],
      onQuote: "on quote",
      model: "Model",
      model_sub: "active of total · needs",
      moe: "MoE",
      dense: "dense",
      of: "of",
      nodes: "{n} nodes",
      cap_multi: "Cells show estimated aggregate decode throughput (tokens/s summed over {users} users) with per-user speed (/u) below; shading follows per-user speed. Context: {ctx}K tokens per user. Click any cell for the breakdown.",
      cap_single: "Cells show estimated decode speed for one user in tokens/s, with the precision used below. Context: {ctx}K tokens. Click any cell for the breakdown.",
      on: "on",
      d_none: "does not fit (needs about {gb})",
      d_nodes: "needs {n} nodes",
      d_multi: "{agg} tok/s aggregate, {per} per user",
      d_single: "about {x} tok/s",
      d_off: "with RAM offload",
      d_tight: "tight fit",
      d_fit: "fits",
      d_join: "{s} at {label}, {v}",
      st_fit: "Fits in memory at <b>{label}</b>.",
      st_tight: "Fits at <b>{label}</b> with less than 10% headroom. Longer contexts or more users won't fit.",
      st_off: "Doesn't fit in VRAM. Runs at <b>{label}</b> with about {pct}% of the weights in 128 GB of system RAM.",
      st_nodes: "Doesn't fit one node. Needs <b>{n} nodes</b> at {label} (about {gb} in total).",
      st_none: "Doesn't fit: needs about <b>{gb}</b> at {label}, against {usable} usable{hint}.",
      st_hint: ". Try turning on RAM offload",
      st_cap: " Context capped at the model's {k}K maximum.",
      sp_agg: "tok/s aggregate",
      sp_multi: "{per} tok/s per user · {users} users · {bound}",
      sp_one: "tok/s, one user",
      b_bw: "bandwidth-bound",
      b_cp: "compute-bound",
      sp_ram: "limited by system-RAM bandwidth",
      sp_bwd: "bandwidth-bound decode",
      sp_spec: " · speculative decoding on",
      sp_none: "No single-machine speed estimate.",
      mt: "Weights <b>{w}</b> + KV cache <b>{kv}</b> ({ctx}K × {users}) + runtime <b>{o}</b> = <b>{tot}</b> · usable {cap}{across}{ram}",
      mt_across: " across {n} nodes",
      mt_ram: ", plus {gb} GB system RAM",
      lab_m: "{maker} · {total} total, {active} active · ships {rel}",
      user1: "user",
      userN: "users",
      ch_best: "Each bar runs from the 4-bit footprint to the serving-precision footprint (up to 8-bit), including KV cache for {ctx}K context × {users} {u}. The ring marks ~2.5-bit. Dashed lines are usable memory per hardware tier. Log scale.",
      ch_other: "Footprint at the selected precision, including KV cache for {ctx}K context × {users} {u}. Dashed lines are usable memory per hardware tier. Log scale.",
      cal_h: ["Configuration", "Hardware", "Measured", "This model", "Agreement", "Source"],
      agg_abbr: " agg.",
      in_range: "within range",
      out_range: "outside range",
      cal_labels: [
        "Qwen3 32B · Q4_K_M",
        "Qwen2.5 32B · Q4_K_M",
        "Llama 3.1 8B · Q4_K_M",
        "gpt-oss-120b · MXFP4",
        "Llama 3.1 70B · FP8 (dense)",
        "Llama 3.1 70B · FP8 · 64 users",
      ],
      cal_src: [
        "Hardware Corner (llama.cpp)",
        "Kunal Ganglani (llama.cpp)",
        "Kunal Ganglani (llama.cpp)",
        "llama.cpp maintainer, via LocalAIMaster",
        "LMSYS, via LocalAIMaster",
        "vLLM: Morph (460) and Prem AI (984)",
      ],
      q2: "Q2",
    },
  },
};

/** Fills `{name}` placeholders in a tool template. */
export const fill = (template: string, values: Readonly<Record<string, string | number>>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key]));
