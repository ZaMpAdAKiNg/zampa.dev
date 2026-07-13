// =============================================================================
// zampa.dev — CONTENT CONTRACT (Single Source of Truth)
// -----------------------------------------------------------------------------
// This file is the ONLY place the site's copy lives. Both visual variants
// (/a and /b) import `content` and render `content[lang]` — they MUST NOT
// hardcode strings. Everything here ships to the browser bundle, so NOTHING
// confidential may be added: the only permitted mentions of the confidential
// product are the "800+ commits" framing and the CTO role (never its name /
// what it is / where it's incorporated / any fundraising).
//
// Consume it via the i18n helper:
//   import { useContent } from '../lib/i18n';
//   const { lang, t } = useContent(Astro);   // t: SiteContent
// or directly: import { content } from '../data/content'; content[lang]
// =============================================================================

export type Lang = 'en' | 'pt';

export interface CtaLink {
  label: string;
  /** Language-agnostic path or absolute URL. Localize internal paths with
   *  localizeHref(path, lang) from ../lib/i18n. */
  href: string;
}

export interface LinkItem {
  label: string;
  href: string;
  /** Optional display handle, e.g. "@ZaMpAdAKiNg" or "rektcheck.xyz". */
  handle?: string;
}

export interface Project {
  name: string;
  url: string;
  tagline: string;
  description: string;
  tags: string[];
  /** Short status chip, e.g. "Live · closed-source". */
  status: string;
}

export interface OssItem {
  name: string;
  url: string;
  description: string;
}

export interface NowEntry {
  /** Short mono label, e.g. "Building". */
  label: string;
  text: string;
}

export interface NowTier {
  heading: string;
  /** Access level id — stable across languages for gating logic. */
  level: 'public' | 'premium' | 'confidential';
  entries: NowEntry[];
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
    ogTitle: string;
  };
  nav: {
    work: string;
    method: string;
    now: string;
    contact: string;
    /** Label of the OTHER language, for the toggle (EN shows "PT"). */
    langLabel: string;
    langSwitchAria: string;
    skipToContent: string;
  };
  /** Terminal-style section index tags (rendered uppercased via CSS). */
  sections: {
    signal: string;
    work: string;
    method: string;
    /** Kept as "open source" in both languages by design. */
    oss: string;
    bio: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    /** The brand motto. EN: "orchestrating agents". */
    motto: string;
    /** Headline rendered as separate lines. */
    headline: string[];
    /** Method statement — the "solo, orchestrating agents" support line. */
    support: string;
    ctaPrimary: CtaLink;
    ctaSecondary: CtaLink;
  };
  authority: {
    heading: string;
    /** The ONLY permitted confidential-product references (commits + time +
     *  CTO role, never the name / what it is / where incorporated / fundraising). */
    trackRecordLine: string;
    /** Labels for GitHub-derived stats (numbers come from github.ts). */
    yearsLabel: string;
    reposLabel: string;
    activeLabel: string;
    note: string;
  };
  work: {
    heading: string;
    intro: string;
    projects: Project[];
  };
  method: {
    heading: string;
    body: string[];
    points: string[];
  };
  oss: {
    heading: string;
    intro: string;
    items: OssItem[];
  };
  bio: {
    heading: string;
    body: string[];
  };
  contact: {
    heading: string;
    text: string;
    links: LinkItem[];
  };
  footer: {
    tagline: string;
    rights: string;
  };
  now: {
    title: string;
    intro: string;
    /** Dedicated meta/social description for the /now route (F505). */
    metaDescription: string;
    /** "Updated" label + a human date string. */
    updatedLabel: string;
    updatedDate: string;
    backHome: string;
    /** Ordered public → premium → confidential. */
    tiers: NowTier[];
    /** Caption explaining the visibility-level mechanic. */
    accessNote: string;
  };
}

// -----------------------------------------------------------------------------
// EN — default
// -----------------------------------------------------------------------------
const en: SiteContent = {
  meta: {
    title: 'ZaMpA — solo developer, orchestrating agents',
    description:
      'ZaMpA (zampa.dev) — a solo developer shipping production DeFi and AI tooling by orchestrating teams of AI coding agents.',
    ogTitle: 'ZaMpA — orchestrating agents',
  },
  nav: {
    work: 'Work',
    method: 'Method',
    now: 'Now',
    contact: 'Contact',
    langLabel: 'PT',
    langSwitchAria: 'Mudar para português',
    skipToContent: 'Skip to content',
  },
  sections: {
    signal: 'signal',
    work: 'work',
    method: 'method',
    oss: 'open source',
    bio: 'before the agents',
    contact: 'contact',
  },
  hero: {
    eyebrow: 'ZaMpA — solo developer',
    motto: 'orchestrating agents',
    headline: ['Shipping real products,', 'orchestrating agents.'],
    support:
      'I build and run production software on my own — directing teams of AI coding agents to go from idea to shipped at a pace that used to need a whole team.',
    ctaPrimary: { label: 'See the work', href: '#work' },
    ctaSecondary: { label: "What I'm doing now", href: '/now' },
  },
  authority: {
    heading: 'Signal, not noise',
    trackRecordLine:
      '800+ commits in ~4 months — solo, orchestrating agents — as CTO of a confidential product.',
    yearsLabel: 'years on GitHub',
    reposLabel: 'public repositories',
    activeLabel: 'recent public events',
    note: 'Public metrics pulled at build time from GitHub. The authority here is commits and time — no badges, no logos.',
  },
  work: {
    heading: 'Selected work',
    intro: 'Products I design, build, and operate end to end.',
    projects: [
      {
        name: 'RektCheck',
        url: 'https://rektcheck.xyz',
        tagline: 'Know your liquidation before the market does.',
        description:
          'A DeFi risk dashboard that tracks your health factor across positions and estimates the price at which you would get liquidated — so you can act before it happens.',
        tags: ['DeFi', 'Risk', 'Dashboard'],
        status: 'Live · closed-source',
      },
      {
        name: 'pix2qr',
        url: 'https://pix2qr.xyz',
        tagline: 'Pix to QR, entirely on your device.',
        description:
          'A privacy-first PWA that turns Pix keys into payment QR codes with zero server round-trips — everything runs 100% locally in the browser.',
        tags: ['PWA', 'Privacy', 'Pix'],
        status: 'Live · open-sourcing soon',
      },
    ],
  },
  method: {
    heading: 'How I work',
    body: [
      'I do not write every line — I direct. My leverage is orchestration: decomposing a product into work an ensemble of AI coding agents can execute in parallel, then reviewing, integrating, and shipping it.',
      'It means one person operating with the throughput of a small team, without losing the coherence of a single mind holding the whole system in its head.',
    ],
    points: [
      'Decompose scope into parallelizable agent tasks',
      'Adversarial review before anything merges',
      'Ship to production, then iterate on real signal',
      'Keep one coherent mental model of the whole stack',
    ],
  },
  oss: {
    heading: 'Open source',
    intro: "Tooling I've extracted from my own workflow and released.",
    items: [
      {
        name: 'orchestrate-skill',
        url: 'https://github.com/ZaMpAdAKiNg/orchestrate-skill',
        description:
          'A control-plane discipline for running parallel AI coding sessions — scoped worker prompts, exit gates, and a coordination ledger.',
      },
      {
        name: 'MAD — Multi-Agent Debate',
        url: 'https://github.com/ZaMpAdAKiNg/MAD-Multi-Agent-Debate-Skill',
        description:
          'Makes two strong models debate a hard architecture decision adversarially, surfacing trade-offs a single model would miss.',
      },
      {
        name: 'meeting-digest-skill',
        url: 'https://github.com/ZaMpAdAKiNg/meeting-digest-skill',
        description:
          'Turns a meeting recording into a structured digest — summary, decisions, and action items — end to end.',
      },
    ],
  },
  bio: {
    heading: 'Before the agents',
    body: [
      'I spent a decade as a professional Counter-Strike player (2008–2018, INTZ and CNB) and later coached the Santos e-Sports roster — years of reading systems under pressure and getting a team to execute.',
      'In early 2021 I went from Bitcoin down the DeFi rabbit hole and started building the tools I wished existed. Same instinct as competing: understand the system deeply, then move faster than everyone else.',
    ],
  },
  contact: {
    heading: 'Get in touch',
    text: 'Open to collaborations, hard problems, and the right opportunities.',
    links: [
      { label: 'GitHub', href: 'https://github.com/ZaMpAdAKiNg', handle: '@ZaMpAdAKiNg' },
      { label: 'RektCheck', href: 'https://rektcheck.xyz', handle: 'rektcheck.xyz' },
      { label: 'pix2qr', href: 'https://pix2qr.xyz', handle: 'pix2qr.xyz' },
    ],
  },
  footer: {
    tagline: 'Built solo, orchestrating agents.',
    rights: '© 2026 ZaMpA · zampa.dev',
  },
  now: {
    title: 'Now',
    intro:
      "What I'm focused on right now — a living page in the spirit of nownownow.com. Detail deepens by access level.",
    metaDescription:
      "What ZaMpA is focused on right now — a living /now page: building, shipping, and open-sourcing, with detail that deepens by access level.",
    updatedLabel: 'Updated',
    updatedDate: 'July 2026',
    backHome: 'Back home',
    accessNote:
      'Three visibility levels. The public layer is open; the deeper layers are shared with stakeholders and, under agreement, clients.',
    tiers: [
      {
        heading: 'Public',
        level: 'public',
        entries: [
          {
            label: 'Building',
            text: "Pushing RektCheck's liquidation engine further — more protocols, sharper estimates.",
          },
          {
            label: 'Shipping',
            text: 'Getting pix2qr open-sourced and its offline PWA polished.',
          },
          {
            label: 'Releasing',
            text: 'Publishing more of my orchestration tooling as open-source skills.',
          },
          {
            label: 'Learning',
            text: 'Going deeper on multi-agent orchestration patterns for real production work.',
          },
        ],
      },
      {
        heading: 'For stakeholders',
        level: 'premium',
        entries: [
          {
            label: 'Track record',
            text: '800+ commits in ~4 months, solo, orchestrating agents, as CTO of a confidential product.',
          },
          {
            label: 'Method',
            text: 'Running a one-person studio at small-team throughput — happy to walk through how, live.',
          },
          {
            label: 'Availability',
            text: 'Selectively open to advisory and build engagements. Ask.',
          },
        ],
      },
      {
        heading: 'Under NDA',
        level: 'confidential',
        entries: [
          {
            label: 'Confidential',
            text: 'CTO of a confidential product, under NDA. Details shared on request, under agreement.',
          },
        ],
      },
    ],
  },
};

// -----------------------------------------------------------------------------
// PT-BR
// -----------------------------------------------------------------------------
const pt: SiteContent = {
  meta: {
    title: 'ZaMpA — desenvolvedor solo, orquestrando agentes',
    description:
      'ZaMpA (zampa.dev) — desenvolvedor solo entregando ferramentas de DeFi e IA em produção orquestrando times de agentes de IA que escrevem código.',
    ogTitle: 'ZaMpA — orquestrando agentes',
  },
  nav: {
    work: 'Trabalho',
    method: 'Método',
    now: 'Agora',
    contact: 'Contato',
    langLabel: 'EN',
    langSwitchAria: 'Switch to English',
    skipToContent: 'Pular para o conteúdo',
  },
  sections: {
    signal: 'sinal',
    work: 'trabalho',
    method: 'método',
    oss: 'open source',
    bio: 'antes dos agentes',
    contact: 'contato',
  },
  hero: {
    eyebrow: 'ZaMpA — desenvolvedor solo',
    motto: 'orquestrando agentes',
    headline: ['Entregando produtos reais,', 'orquestrando agentes.'],
    support:
      'Construo e opero software em produção sozinho — dirigindo times de agentes de IA que escrevem código, do conceito ao deploy num ritmo que antes exigia um time inteiro.',
    ctaPrimary: { label: 'Ver o trabalho', href: '#work' },
    ctaSecondary: { label: 'No que estou agora', href: '/now' },
  },
  authority: {
    heading: 'Sinal, não ruído',
    trackRecordLine:
      '800+ commits em ~4 meses — solo, orquestrando agentes — como CTO de um produto confidencial.',
    yearsLabel: 'anos no GitHub',
    reposLabel: 'repositórios públicos',
    activeLabel: 'eventos públicos recentes',
    note: 'Métricas públicas puxadas em build time do GitHub. A autoridade aqui é commit e tempo — sem selo, sem logo.',
  },
  work: {
    heading: 'Trabalho selecionado',
    intro: 'Produtos que eu desenho, construo e opero de ponta a ponta.',
    projects: [
      {
        name: 'RektCheck',
        url: 'https://rektcheck.xyz',
        tagline: 'Saiba da sua liquidação antes do mercado.',
        description:
          'Um dashboard de risco em DeFi que acompanha seu health factor entre posições e estima o preço em que você seria liquidado — pra você agir antes que aconteça.',
        tags: ['DeFi', 'Risco', 'Dashboard'],
        status: 'No ar · closed-source',
      },
      {
        name: 'pix2qr',
        url: 'https://pix2qr.xyz',
        tagline: 'Pix em QR, inteiro no seu dispositivo.',
        description:
          'Um PWA privacy-first que transforma chaves Pix em QR Codes de pagamento sem nenhuma ida ao servidor — tudo roda 100% local no navegador.',
        tags: ['PWA', 'Privacidade', 'Pix'],
        status: 'No ar · código abrindo em breve',
      },
    ],
  },
  method: {
    heading: 'Como eu trabalho',
    body: [
      'Eu não escrevo cada linha — eu dirijo. Minha alavanca é a orquestração: decompor um produto em trabalho que um conjunto de agentes de IA executa em paralelo, e então revisar, integrar e entregar.',
      'É uma pessoa operando com a produtividade de um time pequeno, sem perder a coerência de uma única cabeça segurando o sistema inteiro.',
    ],
    points: [
      'Decompor o escopo em tarefas paralelizáveis de agentes',
      'Revisão adversarial antes de qualquer merge',
      'Subir pra produção e iterar no sinal real',
      'Manter um modelo mental coerente de toda a stack',
    ],
  },
  oss: {
    heading: 'Código aberto',
    intro: 'Ferramentas que extraí do meu próprio fluxo e publiquei.',
    items: [
      {
        name: 'orchestrate-skill',
        url: 'https://github.com/ZaMpAdAKiNg/orchestrate-skill',
        description:
          'Uma disciplina de control-plane pra rodar sessões paralelas de agentes — prompts de worker escopados, gates de saída e um ledger de coordenação.',
      },
      {
        name: 'MAD — Multi-Agent Debate',
        url: 'https://github.com/ZaMpAdAKiNg/MAD-Multi-Agent-Debate-Skill',
        description:
          'Faz dois modelos fortes debaterem uma decisão de arquitetura difícil de forma adversarial, expondo trade-offs que um modelo só não veria.',
      },
      {
        name: 'meeting-digest-skill',
        url: 'https://github.com/ZaMpAdAKiNg/meeting-digest-skill',
        description:
          'Transforma a gravação de uma reunião num digest estruturado — resumo, decisões e action items — de ponta a ponta.',
      },
    ],
  },
  bio: {
    heading: 'Antes dos agentes',
    body: [
      'Passei uma década como jogador profissional de Counter-Strike (2008–2018, INTZ e CNB) e depois fui técnico do elenco da Santos e-Sports — anos lendo sistemas sob pressão e fazendo um time executar.',
      'No início de 2021 mergulhei do Bitcoin de cabeça no DeFi e comecei a construir as ferramentas que eu queria que existissem. O mesmo instinto de competir: entender o sistema a fundo e agir mais rápido que todo mundo.',
    ],
  },
  contact: {
    heading: 'Fala comigo',
    text: 'Aberto a colaborações, problemas difíceis e às oportunidades certas.',
    links: [
      { label: 'GitHub', href: 'https://github.com/ZaMpAdAKiNg', handle: '@ZaMpAdAKiNg' },
      { label: 'RektCheck', href: 'https://rektcheck.xyz', handle: 'rektcheck.xyz' },
      { label: 'pix2qr', href: 'https://pix2qr.xyz', handle: 'pix2qr.xyz' },
    ],
  },
  footer: {
    tagline: 'Feito solo, orquestrando agentes.',
    rights: '© 2026 ZaMpA · zampa.dev',
  },
  now: {
    title: 'Agora',
    intro:
      'No que estou focado agora — uma página viva, no espírito do nownownow.com. O detalhe se aprofunda conforme o nível de acesso.',
    metaDescription:
      'No que o ZaMpA está focado agora — uma página /now viva: construindo, entregando e abrindo código, com o detalhe se aprofundando conforme o nível de acesso.',
    updatedLabel: 'Atualizado',
    updatedDate: 'Julho de 2026',
    backHome: 'Voltar ao início',
    accessNote:
      'Três níveis de visibilidade. A camada pública é aberta; as camadas mais profundas são compartilhadas com stakeholders e, sob acordo, com clientes.',
    tiers: [
      {
        heading: 'Público',
        level: 'public',
        entries: [
          {
            label: 'Construindo',
            text: 'Levando o motor de liquidação da RektCheck mais longe — mais protocolos, estimativas mais afiadas.',
          },
          {
            label: 'Entregando',
            text: 'Abrindo o código do pix2qr e polindo o PWA offline.',
          },
          {
            label: 'Publicando',
            text: 'Publicando mais das minhas ferramentas de orquestração como skills open-source.',
          },
          {
            label: 'Estudando',
            text: 'Indo mais fundo em padrões de orquestração multi-agente pra trabalho real em produção.',
          },
        ],
      },
      {
        heading: 'Para stakeholders',
        level: 'premium',
        entries: [
          {
            label: 'Histórico',
            text: '800+ commits em ~4 meses, solo, orquestrando agentes, como CTO de um produto confidencial.',
          },
          {
            label: 'Método',
            text: 'Operando um estúdio de uma pessoa com a produtividade de um time pequeno — feliz em mostrar como, ao vivo.',
          },
          {
            label: 'Disponibilidade',
            text: 'Seletivamente aberto a advisory e projetos. Pergunte.',
          },
        ],
      },
      {
        heading: 'Sob NDA',
        level: 'confidential',
        entries: [
          {
            label: 'Confidencial',
            text: 'CTO de um produto confidencial, sob NDA. Detalhes compartilhados sob acordo, a pedido.',
          },
        ],
      },
    ],
  },
};

export const content: Record<Lang, SiteContent> = { en, pt };
