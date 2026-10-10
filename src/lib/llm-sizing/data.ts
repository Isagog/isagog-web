/**
 * Models and hardware behind the on-prem LLM sizing matrix
 * (/[locale]/blog/on-prem-llm-sizing/). Figures compiled on 10 October 2026;
 * see the page's Sources section. Notes are written in English here and
 * localised by `localizeModels` / `localizeHardware`.
 */

export interface LlmModel {
  /** Index into the copy's size groups. */
  g: number;
  name: string;
  maker: string;
  /** Total parameters, billions. */
  total: number;
  /** Active parameters per token, billions. */
  active: number;
  /** Bits per weight of the official checkpoint. */
  bits: number;
  /** Release precision label. */
  rel: string;
  layers: number;
  /** KV cache, GB per 1M tokens of context. */
  kv: number;
  moe: boolean;
  /** Maximum context, K tokens. */
  ctx: number;
  note: string;
}

export interface Hardware {
  id: string;
  /** Index into the copy's hardware groups. */
  g: number;
  name: string;
  short: string;
  /** Memory, GB. */
  mem: number;
  /** Usable memory, GB, when it isn't 93% of `mem`. */
  usable?: number;
  /** GPU count. */
  n: number;
  link?: "pcie" | "nvlink";
  /** Memory bandwidth per GPU, GB/s. */
  bw: number;
  /** Dense compute per GPU, TFLOPS. */
  tf: number;
  offload?: boolean;
  /** Per-layer overhead multiplier. */
  plat?: number;
  apple?: boolean;
  dc?: boolean;
  node?: boolean;
  price: string;
  note: string;
}

export const MODELS: readonly LlmModel[] = [
  {g:0,name:"Kimi K3",maker:"Moonshot",total:2800,active:104,bits:4.45,rel:"MXFP4",layers:72,kv:40,moe:true,ctx:1000,note:"Largest open release (July 2026). 16 of 896 experts active per token; ships quantization-aware in MXFP4, repo about 1.56 TB; 1M context, native vision."},
  {g:0,name:"Qwen3.8-2.4T-A95B",maker:"Alibaba",total:2446,active:95,bits:8.2,rel:"FP8",layers:92,kv:60,moe:true,ctx:262,note:"First open Qwen-Max-class model. The open checkpoint is text-only and thinking-only, with 262K native context. FP8 ≈ 2.4 TB; NVFP4 builds fit one B300 node."},
  {g:0,name:"DeepSeek V4 Pro",maker:"DeepSeek",total:1600,active:49,bits:4.47,rel:"FP4/FP8",layers:61,kv:25,moe:true,ctx:1000,note:"MIT license. GA weights about 893 GB in mixed FP4/FP8; compressed sparse attention keeps the KV cache small; 1M context."},
  {g:0,name:"Kimi K2.6",maker:"Moonshot",total:1059,active:32,bits:4.49,rel:"INT4",layers:61,kv:70,moe:true,ctx:262,note:"Trained with native INT4 expert weights (about 594 GB), so 4-bit costs no quality. Modified MIT license."},
  {g:1,name:"GLM-5.2",maker:"Z.ai",total:744,active:40,bits:8.13,rel:"FP8",layers:79,kv:90,moe:true,ctx:1000,note:"MIT license, coding-first, 1M context. FP8 checkpoint about 704 GiB; NVFP4 builds about 451 GB."},
  {g:1,name:"DeepSeek V4.1 Flash",maker:"DeepSeek",total:749,active:16,bits:5.45,rel:"FP4/FP8",layers:48,kv:20,moe:true,ctx:1000,note:"552B backbone plus about 197B of Engram memory tables; about 510 GB on disk. Unlike V4 Flash, it needs a whole node."},
  {g:1,name:"Mistral Large 3",maker:"Mistral",total:675,active:41,bits:8.2,rel:"FP8",layers:61,kv:70,moe:true,ctx:256,note:"Apache 2.0, 41B active. An NVFP4 build is available. Release precision assumed FP8."},
  {g:1,name:"Nemotron 3 Ultra",maker:"NVIDIA",total:550,active:55,bits:8.2,rel:"FP8",layers:80,kv:20,moe:true,ctx:262,note:"Built for Blackwell clusters; hybrid Mamba-Transformer keeps the KV cache small. Release precision assumed FP8."},
  {g:1,name:"MiniMax M3",maker:"MiniMax",total:428,active:23,bits:8.2,rel:"MXFP8",layers:62,kv:60,moe:true,ctx:1000,note:"1M context with sparse attention; native image and video input; official MXFP8 weights. MiniMax Community License."},
  {g:1,name:"Qwen3.5-397B-A17B",maker:"Alibaba",total:397,active:17,bits:16,rel:"BF16",layers:60,kv:30,moe:true,ctx:262,note:"Apache 2.0. Ships in BF16 with an official FP8 version; hybrid linear attention keeps the KV cache small."},
  {g:1,name:"DeepSeek V4 Flash",maker:"DeepSeek",total:284,active:13,bits:4.5,rel:"FP4/FP8",layers:43,kv:15,moe:true,ctx:1000,note:"MIT license, about 160 GB in native FP4/FP8. Runs on two H200s, or a 256 GB+ Mac."},
  {g:2,name:"Mistral Small 4",maker:"Mistral",total:119,active:6.5,bits:16,rel:"BF16",layers:36,kv:45,moe:true,ctx:256,note:"Apache 2.0, 6.5B active, 256K context, vision input. BF16 upload about 242 GB; FP8 and NVFP4 builds exist."},
  {g:2,name:"Nemotron 3 Super",maker:"NVIDIA",total:120,active:12,bits:16,rel:"BF16",layers:80,kv:15,moe:true,ctx:1000,note:"12B active, 1M context, hybrid Mamba-Transformer."},
  {g:2,name:"gpt-oss-120b",maker:"OpenAI",total:117,active:5.1,bits:4.44,rel:"MXFP4",layers:36,kv:36,moe:true,ctx:131,note:"Apache 2.0. Native MXFP4, about 65 GB: the classic model for 128 GB boxes and single 80–96 GB cards."},
  {g:2,name:"Llama 4 Scout",maker:"Meta",total:109,active:17,bits:16,rel:"BF16",layers:48,kv:50,moe:true,ctx:10000,note:"10M-token context window. Llama community license has EU-specific restrictions; check before use in Europe."},
  {g:3,name:"Qwen3.6-35B-A3B",maker:"Alibaba",total:35,active:3,bits:16,rel:"BF16",layers:40,kv:20,moe:true,ctx:262,note:"Apache 2.0, only 3B active, so very fast. Unsloth reports about 240 tok/s on an RTX PRO 6000 with MTP."},
  {g:3,name:"Gemma 4 31B",maker:"Google",total:31,active:31,bits:16,rel:"BF16",layers:60,kv:90,moe:false,ctx:256,note:"Dense. About 18–21 GB at 4-bit, 35–39 GB at 8-bit, 63 GB in BF16. Its KV cache is large, so long context on 24 GB takes tuning."},
  {g:3,name:"Qwen3.8-27B",maker:"Alibaba",total:27,active:27,bits:16,rel:"BF16",layers:64,kv:64,moe:false,ctx:262,note:"Apache 2.0 dense multimodal model, 262K native context, thinking mode on by default."},
  {g:3,name:"Gemma 4 26B-A4B",maker:"Google",total:26,active:4,bits:16,rel:"BF16",layers:30,kv:60,moe:true,ctx:256,note:"MoE with about 4B active; 256K context."},
  {g:3,name:"gpt-oss-20b",maker:"OpenAI",total:21,active:3.6,bits:4.95,rel:"MXFP4",layers:24,kv:24,moe:true,ctx:131,note:"Apache 2.0, about 13 GB in MXFP4: fits a 16 GB card."},
  {g:3,name:"Gemma 4 12B",maker:"Google",total:12,active:12,bits:16,rel:"BF16",layers:48,kv:50,moe:false,ctx:128,note:"Dense; the small end of this lineup."}
];

/** Hardware price placeholder replaced by the localised "on quote" label. */
export const ON_QUOTE = "on quote";

export const HARDWARE: readonly Hardware[] = [
  {id:"5060ti",g:0,name:"RTX 5060 Ti",short:"5060 Ti",mem:16,n:1,bw:448,tf:47,offload:true,price:"~$450",note:"Entry card: 16 GB GDDR7 at 448 GB/s."},
  {id:"4090",g:0,name:"RTX 3090 / 4090",short:"4090",mem:24,n:1,bw:1008,tf:165,offload:true,price:"$0.8–2k",note:"A used 3090 is the cheapest route to 24 GB; a 4090 is about 10% faster at decode."},
  {id:"5090",g:0,name:"RTX 5090",short:"5090",mem:32,n:1,bw:1792,tf:210,offload:true,price:"$2.5–4k",note:"Fastest consumer card: 32 GB GDDR7 at 1.79 TB/s."},
  {id:"2x4090",g:0,name:"2× RTX 3090/4090",short:"2× 4090",mem:48,n:2,link:"pcie",bw:1008,tf:165,offload:true,price:"$1.6–4k",note:"Two cards over PCIe. Speed gains need tensor parallelism (vLLM, SGLang); a llama.cpp layer split adds capacity, not speed."},
  {id:"spark",g:1,name:"DGX Spark / Strix Halo",short:"Spark",mem:128,usable:110,n:1,bw:273,tf:125,plat:1.2,price:"$2.5–4k",note:"128 GB unified memory at 256–273 GB/s: good for MoE models, very slow for large dense ones."},
  {id:"pro6000",g:1,name:"RTX PRO 6000",short:"PRO 6000",mem:96,n:1,bw:1792,tf:250,offload:true,price:"~$8–9k",note:"Workstation Blackwell card: 96 GB at 1.79 TB/s."},
  {id:"mac",g:1,name:"Mac Studio M3 Ultra",short:"Mac 512",mem:512,usable:470,n:1,bw:819,tf:30,plat:1.5,apple:true,price:"~$10k",note:"Up to 512 GB at 819 GB/s (usable figure assumes the wired-memory limit is raised). Prompt processing and batching are weak."},
  {id:"4xpro",g:1,name:"4× RTX PRO 6000",short:"4× PRO",mem:384,n:4,link:"pcie",bw:1792,tf:250,price:"~$45k",note:"384 GB in one server over PCIe, without NVLink."},
  {id:"h100",g:2,name:"1× H100 80GB",short:"H100",mem:80,n:1,bw:3350,tf:990,dc:true,price:"$25–31k",note:"80 GB HBM3 at 3.35 TB/s. Price is the card alone; the server is extra."},
  {id:"h200",g:2,name:"1× H200",short:"H200",mem:141,n:1,bw:4800,tf:990,dc:true,price:"$30–40k",note:"141 GB HBM3e at 4.8 TB/s. Price is the module alone."},
  {id:"8h100",g:2,name:"8× H100 node",short:"8× H100",mem:640,n:8,link:"nvlink",node:true,dc:true,bw:3350,tf:990,price:"$250–320k",note:"640 GB over NVLink/NVSwitch."},
  {id:"8h200",g:2,name:"8× H200 node",short:"8× H200",mem:1128,n:8,link:"nvlink",node:true,dc:true,bw:4800,tf:990,price:"$320–420k",note:"1.1 TB over NVLink; about 7–8 kW per server."},
  {id:"8b200",g:2,name:"8× B200 node",short:"8× B200",mem:1440,n:8,link:"nvlink",node:true,dc:true,bw:8000,tf:2250,price:"$400–500k",note:"About 1.4 TB at 8 TB/s per GPU."},
  {id:"8b300",g:2,name:"8× B300 node",short:"8× B300",mem:2304,n:8,link:"nvlink",node:true,dc:true,bw:8000,tf:2250,price:"on quote",note:"About 2.3 TB of HBM3e: the only single node that holds the 2T+ models, and then only at 4-bit."}
];

export const MODEL_NOTES_IT: Readonly<Record<string, string>> = {
  "Kimi K3": "Il più grande rilascio open (luglio 2026). 16 esperti su 896 attivi per token; distribuito con quantizzazione nativa MXFP4, repository di circa 1,56 TB; contesto da 1M, visione nativa.",
  "Qwen3.8-2.4T-A95B": "Primo modello open di classe Qwen-Max. Il checkpoint aperto è solo testo e solo thinking, con 262K di contesto nativo. In FP8 ≈ 2,4 TB; le build NVFP4 stanno in un nodo B300.",
  "DeepSeek V4 Pro": "Licenza MIT. Pesi GA di circa 893 GB in FP4/FP8 misto; l’attenzione sparsa compressa mantiene piccola la cache KV; contesto da 1M.",
  "Kimi K2.6": "Addestrato con pesi INT4 nativi per gli esperti (circa 594 GB), quindi il 4 bit non costa qualità. Licenza MIT modificata.",
  "GLM-5.2": "Licenza MIT, orientato al codice, contesto da 1M. Checkpoint FP8 di circa 704 GiB; le build NVFP4 circa 451 GB.",
  "DeepSeek V4.1 Flash": "Backbone da 552B più circa 197B di tabelle di memoria Engram; circa 510 GB su disco. A differenza di V4 Flash, richiede un nodo intero.",
  "Mistral Large 3": "Apache 2.0, 41B attivi. Disponibile una build NVFP4. Precisione di rilascio assunta: FP8.",
  "Nemotron 3 Ultra": "Pensato per cluster Blackwell; l’architettura ibrida Mamba-Transformer mantiene piccola la cache KV. Precisione di rilascio assunta: FP8.",
  "MiniMax M3": "Contesto da 1M con attenzione sparsa; input nativo di immagini e video; pesi MXFP8 ufficiali. MiniMax Community License.",
  "Qwen3.5-397B-A17B": "Apache 2.0. Distribuito in BF16 con una versione FP8 ufficiale; l’attenzione lineare ibrida mantiene piccola la cache KV.",
  "DeepSeek V4 Flash": "Licenza MIT, circa 160 GB in FP4/FP8 nativo. Gira su due H200 o su un Mac da 256 GB o più.",
  "Mistral Small 4": "Apache 2.0, 6,5B attivi, contesto da 256K, input visivo. Upload BF16 di circa 242 GB; esistono build FP8 e NVFP4.",
  "Nemotron 3 Super": "12B attivi, contesto da 1M, architettura ibrida Mamba-Transformer.",
  "gpt-oss-120b": "Apache 2.0. MXFP4 nativo, circa 65 GB: il modello classico per le macchine da 128 GB e per le singole schede da 80–96 GB.",
  "Llama 4 Scout": "Finestra di contesto da 10M token. La licenza community di Llama ha restrizioni specifiche per l’UE: verificatela prima dell’uso in Europa.",
  "Qwen3.6-35B-A3B": "Apache 2.0, solo 3B attivi, quindi molto veloce. Unsloth riporta circa 240 tok/s su una RTX PRO 6000 con MTP.",
  "Gemma 4 31B": "Denso. Circa 18–21 GB a 4 bit, 35–39 GB a 8 bit, 63 GB in BF16. La cache KV è grande: il contesto lungo su 24 GB richiede messa a punto.",
  "Qwen3.8-27B": "Modello multimodale denso Apache 2.0, contesto nativo da 262K, modalità thinking attiva di default.",
  "Gemma 4 26B-A4B": "MoE con circa 4B attivi; contesto da 256K.",
  "gpt-oss-20b": "Apache 2.0, circa 13 GB in MXFP4: sta in una scheda da 16 GB.",
  "Gemma 4 12B": "Denso; l’estremità piccola di questa selezione.",
};

export const HARDWARE_NOTES_IT: Readonly<Record<string, string>> = {
  "4090": "Una 3090 usata è la via più economica ai 24 GB; una 4090 è circa il 10% più veloce in decodifica.",
  "5090": "La scheda consumer più veloce: 32 GB GDDR7 a 1,79 TB/s.",
  "5060ti": "Scheda entry-level: 16 GB GDDR7 a 448 GB/s.",
  "2x4090": "Due schede su PCIe. Per guadagnare velocità serve il tensor parallelism (vLLM, SGLang); lo split per layer di llama.cpp aumenta la capacità, non la velocità.",
  spark: "128 GB di memoria unificata a 256–273 GB/s: ottima per i modelli MoE, lentissima per i grandi modelli densi.",
  pro6000: "Scheda Blackwell da workstation: 96 GB a 1,79 TB/s.",
  mac: "Fino a 512 GB a 819 GB/s (il valore utilizzabile presuppone di alzare il limite di memoria wired). Elaborazione del prompt e batching sono deboli.",
  "4xpro": "384 GB in un unico server su PCIe, senza NVLink.",
  h100: "80 GB HBM3 a 3,35 TB/s. Il prezzo è della sola scheda; il server è a parte.",
  h200: "141 GB HBM3e a 4,8 TB/s. Il prezzo è del solo modulo.",
  "8h100": "640 GB su NVLink/NVSwitch.",
  "8h200": "1,1 TB su NVLink; circa 7–8 kW per server.",
  "8b200": "Circa 1,4 TB a 8 TB/s per GPU.",
  "8b300": "Circa 2,3 TB di HBM3e: l’unico nodo singolo che contiene i modelli oltre i 2T, e solo a 4 bit.",
};
