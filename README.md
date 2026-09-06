# Pontotech — Segurança Eletrônica & Tecnologia

Site institucional completo da Pontotech: controle de acesso facial, CFTV, interfonia, automação, cerca elétrica, alarmes, rede estruturada, dispensers de álcool gel, relógio de ponto em nuvem e catracas.

## Funcionalidades

- **Paleta azul-marinho + dourado**, no mesmo tom do material de divulgação da Pontotech (flyer "Condomínio Seguro")
- **Fotos reais dos serviços**, da galeria e dos logos de parceiros, carregadas diretamente do site oficial (`pontotechpe.lovable.app`) — se algum link cair, o card se ajusta sozinho sem quebrar o layout
- **Fundo animado** — rede de partículas conectadas em `<canvas>`, rodando por trás de todo o site (desliga sozinha se o usuário pede menos animação no sistema)
- **Identidade real da marca** — logo oficial da Pontotech no menu e no rodapé
- **Hero com painel HUD** — radar girando, scanline, contadores animados, "registro de atividade" ilustrativo em tempo real, e leve efeito de brilho/tilt que segue o mouse
- **Case real** — seção dedicada à instalação no Condomínio Reserva Alameda Figueira, com a foto real do poste de CFTV
- **Carrossel de produtos** — Henry (dispenser de álcool em gel), catracas, catraca com braço articulado e a instalação real, todas exibidas **sem cortes** (com fundo desfocado da própria imagem preenchendo o quadro). Suporta arraste no mouse, swipe no celular, setas, bolinhas e teclado
- **Menu fixo** com destaque automático da seção ativa e menu mobile em painel lateral
- **9 serviços** com ícones próprios em SVG
- **Produto em destaque** (Relógio de Ponto / Control iD) com card de terminal animado
- **Esteira de parceiros** com scroll infinito
- **Formulário de orçamento** que monta a mensagem e abre o WhatsApp automaticamente
- Botão flutuante com o **logo oficial do WhatsApp**, com legenda ao passar o mouse, barra de progresso de leitura e botão "voltar ao topo"
- Totalmente responsivo (mobile, tablet, desktop), com foco visível no teclado e suporte a `prefers-reduced-motion`
- Crédito de desenvolvimento no rodapé: **Powered by Criatech** ([criatech.online](https://criatech.online))

## Estrutura

```
pontotech-site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── logo-pontotech.jpg
│       ├── case-condominio-seguro.jpeg
│       ├── henry-dispenser-alcool-gel.jpeg
│       ├── catracas-controle-acesso.jpeg
│       └── braco-articulado.jpeg
└── README.md
```

**Importante:** os arquivos usam caminhos relativos (`css/style.css`, `js/script.js`, `assets/images/...`), então funcionam perfeitamente quando **servidos por um servidor** (GitHub Pages, Netlify, `python3 -m http.server`, Live Server do VS Code etc.) — testei localmente e a página carrega e fica responsiva normalmente.

Se você só clicar duas vezes no `index.html` e abrir direto como arquivo local (`file://`), alguns navegadores podem bloquear o carregamento do CSS/JS por política de segurança. Para testar localmente antes de subir, rode dentro da pasta:

```bash
python3 -m http.server 8000
```

e abra `http://localhost:8000` no navegador. Depois de publicado no GitHub Pages, funciona normalmente em qualquer dispositivo sem esse cuidado.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (ex: `pontotech-site`).
2. Envie **toda a pasta** (`index.html`, `css/`, `js/`, `assets/`, `README.md`) para a raiz do repositório:
   ```bash
   git init
   git add .
   git commit -m "Site institucional Pontotech"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/pontotech-site.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings → Pages**.
4. Em **Source**, selecione a branch `main` e a pasta `/ (root)`.
5. Salve. Em alguns minutos o site estará no ar em:
   `https://SEU-USUARIO.github.io/pontotech-site/`

## Personalização rápida

- **WhatsApp:** procure por `wa.me/5581986879234` nos arquivos e troque pelo número desejado.
- **Instagram:** procure por `instagram.com/pontotechoficial`.
- **Cores:** todas centralizadas no bloco `:root{...}` no topo de `css/style.css` (`--cyan`/`--amber` guardam o preto de destaque no tema claro, `--text-primary`/`--bg-void` os tons de base). O hero e o menu redefinem essas mesmas variáveis localmente para o modo escuro — procure por `.hero{` e `.nav{` no CSS.
- **Fotos dos serviços/parceiros:** apontam para `https://pontotechpe.lovable.app/...` (o site oficial). Se preferir hospedar localmente, baixe cada imagem, salve em `assets/images/` e troque o `src` correspondente em `index.html`.
- **Foto de fundo do topo (hero):** também vem do site oficial (`hero-bg-...jpg`); pode trocar por outra procurando por `hero-photo` em `index.html`.
- **Registro de atividade do HUD:** os textos são ilustrativos (não são dados reais). Edite o array `LOG_MESSAGES` em `js/script.js` se quiser mudar as mensagens.
