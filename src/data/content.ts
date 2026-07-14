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

export interface UsesEntry {
  /** Tool or practice name, e.g. "Claude Code". */
  name: string;
  /** Optional external link rendered on the name. */
  url?: string;
  description: string;
}

export interface UsesSection {
  /** Stable id across languages — used for heading anchors. */
  id: string;
  heading: string;
  /** Optional one-line section intro. */
  intro?: string;
  entries: UsesEntry[];
}

export interface ColophonSection {
  /** Stable id across languages — used for heading anchors. */
  id: string;
  heading: string;
  body: string[];
  /** Optional reference link rendered after the body. */
  link?: LinkItem;
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
    /** aria-label of the discreet cross-page footer nav. */
    navAriaLabel: string;
    /** Footer nav — internal hrefs are language-agnostic paths (localize at
     *  render with localizeHref); absolute URLs pass through. */
    nav: CtaLink[];
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
  /** /uses — "what I use", in the spirit of uses.tech. */
  uses: {
    title: string;
    metaDescription: string;
    intro: string;
    updatedLabel: string;
    updatedDate: string;
    backHome: string;
    sections: UsesSection[];
  };
  /** /colophon — how this site was made. */
  colophon: {
    title: string;
    metaDescription: string;
    intro: string;
    backHome: string;
    sections: ColophonSection[];
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
    navAriaLabel: 'Site map',
    nav: [
      { label: 'now', href: '/now' },
      { label: 'uses', href: '/uses' },
      { label: 'colophon', href: '/colophon' },
      { label: 'GitHub', href: 'https://github.com/ZaMpAdAKiNg' },
      { label: 'X', href: 'https://x.com/ZaMpAdAKiNg' },
    ],
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
  uses: {
    title: 'Uses',
    metaDescription:
      'What ZaMpA works with — the AI agents, the orchestration setup, and the stack for building and shipping — in the spirit of uses.tech.',
    intro:
      "What I actually work with — in the spirit of uses.tech. The interesting part isn't the editor; it's the agents.",
    updatedLabel: 'Updated',
    updatedDate: 'July 13, 2026',
    backHome: 'Back home',
    sections: [
      {
        id: 'agents',
        heading: 'Agents & orchestration',
        intro:
          'The core of the setup. I work solo by directing teams of AI coding agents in parallel — everything else serves this part.',
        entries: [
          {
            name: 'Claude Code',
            url: 'https://claude.com/claude-code',
            description:
              'My primary agent. It plans, writes, refactors, and carries most of the day-to-day work across every project.',
          },
          {
            name: 'Codex CLI',
            url: 'https://github.com/openai/codex',
            description:
              'The second opinion. A different model reviews the same work adversarially — it catches what the first one rationalizes.',
          },
          {
            name: 'Playwright',
            url: 'https://playwright.dev',
            description:
              'Browser QA, driven by agents: real clicks on real pages, with screenshots and console logs as evidence.',
          },
          {
            name: 'MCP servers',
            url: 'https://modelcontextprotocol.io',
            description:
              "The agents' hands — deploys, browser control, and infrastructure exposed as tools they can call directly.",
          },
          {
            name: 'Skills',
            description:
              'A library of reusable skills — orchestration discipline, debate protocols, digest pipelines — that any agent can load on demand.',
          },
          {
            name: 'Workspace',
            description:
              'A multi-agent workspace that runs several CLI agents side by side — one screen, several workers, one director.',
          },
        ],
      },
      {
        id: 'shipping',
        heading: 'Building & shipping',
        entries: [
          {
            name: 'Astro',
            url: 'https://astro.build',
            description:
              'Static-first sites, this one included. Fast by default, and no client-side JavaScript unless a page earns it.',
          },
          {
            name: 'TypeScript',
            url: 'https://www.typescriptlang.org',
            description:
              'Everywhere. Types are the contract that keeps a fleet of agents honest inside the same codebase.',
          },
          {
            name: 'Vercel',
            url: 'https://vercel.com',
            description:
              'Push to master and production deploys itself. ISR keeps server-rendered signals fresh with no babysitting.',
          },
          {
            name: 'GitHub',
            url: 'https://github.com/ZaMpAdAKiNg',
            description:
              'The public identity. The authority of everything here is commits and time — GitHub is the audit trail.',
          },
        ],
      },
      {
        id: 'method',
        heading: 'Method',
        intro:
          'One person, the throughput of a team. The tools only work because the discipline does.',
        entries: [
          {
            name: 'Prompts as specs',
            description:
              'A task prompt reads like a spec: scope, constraints, authorization, and a definition of done.',
          },
          {
            name: 'Cross-model review',
            description:
              "Nothing merges on a single model's opinion. A different model reviews adversarially before I do.",
          },
          {
            name: 'Agent-run QA',
            description:
              'Agents click through the product in a real browser before anything ships. Screenshots are the receipts.',
          },
          {
            name: 'Privacy guards',
            description:
              'Git hooks enforce an identity contract on every commit — the repo stays clean by machine, not by memory.',
          },
        ],
      },
      {
        id: 'hardware',
        heading: 'Hardware',
        entries: [
          {
            name: 'One machine',
            description: 'An Apple Silicon Mac with too many terminal panes open.',
          },
        ],
      },
    ],
  },
  colophon: {
    title: 'Colophon',
    metaDescription:
      'How zampa.dev was made: drafted, reviewed, and QA-tested by orchestrated AI agents under human direction — Astro, system fonts, Vercel, open source on GitHub.',
    intro: 'How this site was made — and by whom.',
    backHome: 'Back home',
    sections: [
      {
        id: 'made',
        heading: 'Built by agents, directed by a human',
        body: [
          'This site was drafted, built, reviewed, and QA-tested by AI coding agents working in parallel — one wrote the layout, another reviewed it adversarially, another clicked through every page in a real browser — under my direction, from first commit to deploy.',
          'That is the same method the site describes. It is its own demo.',
        ],
      },
      {
        id: 'stack',
        heading: 'Stack',
        body: [
          'Astro 7, statically generated. The one exception is the GitHub signal on the homepage: fetched server-side and re-validated at most once every 24 hours (ISR) — zero client-side calls.',
          'System font stacks, no webfonts. English and Portuguese both render from a single typed content contract, so the two languages cannot silently drift apart.',
          'Hosted on Vercel — every push to master deploys production automatically. Cookie-free pageview analytics via Umami; no advertising trackers or custom events.',
        ],
        link: { label: 'Source on GitHub', href: 'https://github.com/ZaMpAdAKiNg/zampa.dev' },
      },
      {
        id: 'design',
        heading: 'Design',
        body: [
          '"Signal Instrument": a typographic instrument panel — monospaced indices, hairline rules, live readouts. Restraint over gimmick.',
          'Contrast holds WCAG AA in both dark and light themes, and every page works with JavaScript disabled — motion is an enhancement, never a dependency.',
        ],
      },
      {
        id: 'privacy',
        heading: 'Privacy',
        body: [
          'The repository is public and governed by a permanent identity contract: no real names, no employers, no client names, no personal data — audited retroactively across the full git history and enforced on every future commit by machine checks.',
          'Umami runs only on zampa.dev, respects Do Not Track, and receives neither query strings nor URL fragments. Referrer URLs are stripped of both before they are sent.',
        ],
        link: {
          label: 'The contract (CLAUDE.md)',
          href: 'https://github.com/ZaMpAdAKiNg/zampa.dev/blob/master/CLAUDE.md',
        },
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
    navAriaLabel: 'Mapa do site',
    nav: [
      { label: 'agora', href: '/now' },
      { label: 'o que uso', href: '/uses' },
      { label: 'colofão', href: '/colophon' },
      { label: 'GitHub', href: 'https://github.com/ZaMpAdAKiNg' },
      { label: 'X', href: 'https://x.com/ZaMpAdAKiNg' },
    ],
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
  uses: {
    title: 'O que eu uso',
    metaDescription:
      'Com o que o ZaMpA trabalha — os agentes de IA, o setup de orquestração e a stack de construir e entregar — no espírito do uses.tech.',
    intro:
      'Com o que eu trabalho de verdade — no espírito do uses.tech. A parte interessante não é o editor; são os agentes.',
    updatedLabel: 'Atualizado',
    updatedDate: '13 de julho de 2026',
    backHome: 'Voltar ao início',
    sections: [
      {
        id: 'agents',
        heading: 'Agentes & orquestração',
        intro:
          'O coração do setup. Trabalho sozinho dirigindo times de agentes de IA em paralelo — todo o resto serve a essa parte.',
        entries: [
          {
            name: 'Claude Code',
            url: 'https://claude.com/claude-code',
            description:
              'Meu agente principal. Ele planeja, escreve, refatora e carrega a maior parte do trabalho diário em todos os projetos.',
          },
          {
            name: 'Codex CLI',
            url: 'https://github.com/openai/codex',
            description:
              'A segunda opinião. Um modelo diferente revisa o mesmo trabalho de forma adversarial — pega o que o primeiro racionaliza.',
          },
          {
            name: 'Playwright',
            url: 'https://playwright.dev',
            description:
              'QA de navegador, dirigido por agentes: cliques reais em páginas reais, com screenshots e logs de console como evidência.',
          },
          {
            name: 'Servidores MCP',
            url: 'https://modelcontextprotocol.io',
            description:
              'As mãos dos agentes — deploy, controle de navegador e infraestrutura expostos como ferramentas que eles chamam diretamente.',
          },
          {
            name: 'Skills',
            description:
              'Uma biblioteca de skills reutilizáveis — disciplina de orquestração, protocolos de debate, pipelines de digest — que qualquer agente carrega sob demanda.',
          },
          {
            name: 'Workspace',
            description:
              'Um workspace multi-agente que roda vários agentes de CLI lado a lado — uma tela, vários workers, um diretor.',
          },
        ],
      },
      {
        id: 'shipping',
        heading: 'Construir & entregar',
        entries: [
          {
            name: 'Astro',
            url: 'https://astro.build',
            description:
              'Sites static-first, este incluído. Rápido por padrão, e sem JavaScript no cliente a menos que a página mereça.',
          },
          {
            name: 'TypeScript',
            url: 'https://www.typescriptlang.org',
            description:
              'Em tudo. Tipos são o contrato que mantém uma frota de agentes honesta dentro do mesmo código.',
          },
          {
            name: 'Vercel',
            url: 'https://vercel.com',
            description:
              'Push na master e a produção sobe sozinha. ISR mantém os sinais renderizados no servidor frescos, sem babá.',
          },
          {
            name: 'GitHub',
            url: 'https://github.com/ZaMpAdAKiNg',
            description:
              'A identidade pública. A autoridade de tudo aqui é commit e tempo — o GitHub é a trilha de auditoria.',
          },
        ],
      },
      {
        id: 'method',
        heading: 'Método',
        intro:
          'Uma pessoa, a produtividade de um time. As ferramentas só funcionam porque a disciplina funciona.',
        entries: [
          {
            name: 'Prompts como specs',
            description:
              'Um prompt de tarefa se lê como uma spec: escopo, restrições, autorização e uma definição de pronto.',
          },
          {
            name: 'Revisão entre modelos',
            description:
              'Nada sobe com a opinião de um modelo só. Um modelo diferente revisa de forma adversarial antes de mim.',
          },
          {
            name: 'QA por agente',
            description:
              'Agentes clicam pelo produto num navegador real antes de qualquer entrega. Screenshots são os recibos.',
          },
          {
            name: 'Guardas de privacidade',
            description:
              'Git hooks impõem um contrato de identidade em cada commit — o repositório fica limpo por máquina, não por memória.',
          },
        ],
      },
      {
        id: 'hardware',
        heading: 'Hardware',
        entries: [
          {
            name: 'Uma máquina',
            description: 'Um Mac com Apple Silicon e painéis de terminal demais abertos.',
          },
        ],
      },
    ],
  },
  colophon: {
    title: 'Colofão',
    metaDescription:
      'Como o zampa.dev foi feito: rascunhado, revisado e testado por agentes de IA orquestrados sob direção humana — Astro, fontes de sistema, Vercel, código aberto no GitHub.',
    intro: 'Como este site foi feito — e por quem.',
    backHome: 'Voltar ao início',
    sections: [
      {
        id: 'made',
        heading: 'Feito por agentes, dirigido por um humano',
        body: [
          'Este site foi rascunhado, construído, revisado e testado por agentes de IA trabalhando em paralelo — um escreveu o layout, outro revisou de forma adversarial, outro clicou por cada página num navegador real — sob a minha direção, do primeiro commit ao deploy.',
          'É o mesmo método que o site descreve. Ele é a própria demo.',
        ],
      },
      {
        id: 'stack',
        heading: 'Stack',
        body: [
          'Astro 7, gerado estaticamente. A única exceção é o sinal do GitHub na home: buscado no servidor e revalidado no máximo uma vez a cada 24 horas (ISR) — zero chamadas no cliente.',
          'Fontes de sistema, sem webfonts. Inglês e português renderizam de um único contrato de conteúdo tipado, então as duas línguas não conseguem divergir em silêncio.',
          'Hospedado na Vercel — cada push na master faz o deploy de produção automaticamente. Analytics de pageviews sem cookies via Umami; sem rastreadores de publicidade nem eventos personalizados.',
        ],
        link: { label: 'Código no GitHub', href: 'https://github.com/ZaMpAdAKiNg/zampa.dev' },
      },
      {
        id: 'design',
        heading: 'Design',
        body: [
          '"Signal Instrument": um painel de instrumentos tipográfico — índices monoespaçados, linhas finas, leituras ao vivo. Contenção em vez de firula.',
          'O contraste segura WCAG AA nos temas escuro e claro, e toda página funciona com JavaScript desligado — movimento é um bônus, nunca uma dependência.',
        ],
      },
      {
        id: 'privacy',
        heading: 'Privacidade',
        body: [
          'O repositório é público e regido por um contrato de identidade permanente: sem nomes reais, sem empregadores, sem nomes de clientes, sem dados pessoais — auditado retroativamente em todo o histórico do git e imposto em cada commit futuro por checagens de máquina.',
          'O Umami roda somente no zampa.dev, respeita o Do Not Track e não recebe parâmetros de busca nem fragmentos de URL. Ambos também são removidos das URLs de referência antes do envio.',
        ],
        link: {
          label: 'O contrato (CLAUDE.md)',
          href: 'https://github.com/ZaMpAdAKiNg/zampa.dev/blob/master/CLAUDE.md',
        },
      },
    ],
  },
};

export const content: Record<Lang, SiteContent> = { en, pt };
