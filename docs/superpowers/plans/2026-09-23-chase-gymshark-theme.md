# Chase Theme (estilo Gymshark) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tema Shopify OS 2.0 para chasebrasil.com, baseado no Dawn 16 limpo, com layout e comportamento próximos de row.gymshark.com.

**Architecture:** Copia do Dawn 16.0.0 oficial. Estilo global via `assets/chase.css` carregado depois do `base.css` + defaults em `config/settings_data.json`. Funcionalidades novas em seções/snippets/JS com prefixo `chase-`; alterações nos arquivos do Dawn (header, card-product, main-product, cart-drawer, grid de coleção) mínimas e marcadas com comentário `{%- comment -%} chase {%- endcomment -%}`.

**Tech Stack:** Liquid, CSS, JS vanilla (web components como no Dawn), Shopify CLI 3.88 (`theme check`, `theme dev`, `theme push`).

**Spec:** `docs/superpowers/specs/2026-09-23-chase-gymshark-theme-design.md`

## Global Constraints

- Base: Dawn oficial 16.0.0, limpo (não o tema atual da loja).
- Loja: `chasebrasil.myshopify.com`; idioma PT-BR, moeda BRL.
- Nenhum ativo da Gymshark (logo, imagens, textos).
- Arquivos novos com prefixo `chase-`; strings novas em `locales/pt-BR.json` e `locales/en.default.json` sob a chave `chase`.
- Deploy só como tema **não publicado** (`shopify theme push --unpublished`). Nunca publicar.
- JS sem dependências externas; carregar com `defer`.
- `shopify theme check` sem erros (warnings de Dawn pré-existentes são aceitos).

## Review Focus

1. Produto sem 2ª imagem / sem opção Cor → card sem hover-swap e sem swatches, sem erro.
2. Produto com variante única → quick add adiciona direto; produto esgotado → botão desabilitado.
3. Coleção vazia na aba do `chase-product-tabs` → aba mostra placeholders no editor e nada quebra na loja.
4. Metafield `custom.complete_the_look` vazio → seção inteira não renderiza.
5. Carrinho acima do limite de frete grátis → barra mostra "Você ganhou frete grátis" (sem valor negativo).

Verificação: cada task termina com `shopify theme check` (substitui testes unitários, pois Liquid não tem runner local) e, na Task 11, verificação visual em `shopify theme dev` para cada item acima.

---

### Task 1: Scaffold Dawn + estilo global

**Files:**
- Create: todo o Dawn 16 na raiz; `assets/chase.css`; `.gitignore`
- Modify: `layout/theme.liquid` (incluir `chase.css` após `base.css`), `config/settings_data.json`

**Produces:** classes utilitárias `.chase-heading` (caixa alta, peso 800), `.chase-btn`, variáveis CSS `--chase-accent`, `--chase-gap`.

- [ ] Copiar Dawn (sem `.git`) para a raiz do projeto; commit "chore: import Dawn 16.0.0".
- [ ] Criar `assets/chase.css` com tipografia (h1–h3 caixa alta, peso 800, letter-spacing .02em, line-height 1), botões pretos retangulares com hover invertido, links, inputs quadrados.
- [ ] Em `layout/theme.liquid`, logo após `{{ 'base.css' | asset_url | stylesheet_tag }}`: `{{ 'chase.css' | asset_url | stylesheet_tag }}`.
- [ ] Em `settings_data.json` (current): `type_header_font: "archivo_n8"`, `type_body_font: "inter_n4"`, `buttons_radius: 0`, `variant_pills_radius: 0`, `inputs_radius: 0`, `card_style: "standard"`, `page_width: 1600`, esquemas: scheme-1 branco/preto, scheme-2 cinza claro `#F2F2F2`, scheme-3 preto/branco, scheme-4 destaque.
- [ ] Adicionar em `settings_schema.json` grupo "Chase": `chase_accent` (color, default `#D0021B`), `chase_free_shipping_threshold` (number, default 999), `chase_new_tag` (text, default "novo"), `chase_wishlist_url` (url).
- [ ] `shopify theme check` → sem erros. Commit.

### Task 2: Barra de anúncios rotativa

**Files:** Modify: `sections/header-group.json`, `sections/announcement-bar.liquid` (só CSS/classe), `assets/chase.css`

- [ ] Configurar announcement-bar em `header-group.json`: `auto_rotate: true`, `change_slides_speed: 4`, scheme-3, 3 blocos pt-BR ("FRETE EXPRESSO GRÁTIS ACIMA DE R$999", "PARCELE EM ATÉ 6X SEM JUROS", "TROCA FÁCIL EM ATÉ 30 DIAS").
- [ ] CSS: texto 12px, caixa alta, peso 600, altura 36px, setas ocultas no mobile.
- [ ] theme check; commit.

### Task 3: Header + mega-menu com imagens

**Files:** Modify: `sections/header.liquid`, `snippets/header-mega-menu.liquid`, `sections/header-group.json`; Create: `assets/chase-header.css`

**Produces:** bloco de header `promo` com settings `menu_item` (text — título do item do menu), `image`, `heading`, `link`.

- [ ] `header-group.json`: `logo_position: "middle-center"`, `menu_type_desktop: "mega"`, `sticky_header_type: "on-scroll-up"`, `show_line_separator: true`, scheme-1.
- [ ] Em `header.liquid` schema, adicionar `"blocks": [{"type":"promo", ... ,"limit": 12}]`; ícone de favoritos (coração `icon-heart.svg`) antes do ícone de conta quando `settings.chase_wishlist_url != blank`.
- [ ] Em `header-mega-menu.liquid`, dentro de cada `.mega-menu__content`, após a lista: renderizar os blocos `promo` cujo `menu_item` (downcase, strip) == `link.title` (downcase, strip) como `<a class="chase-mega-promo">` com imagem `image_url: width: 600`, `loading: lazy`, e heading em caixa alta. A seção passa `section.blocks` ao snippet.
- [ ] `chase-header.css`: itens do menu em caixa alta 13px peso 700; mega-menu full-width com grid `repeat(auto-fit,minmax(160px,1fr))` para colunas + promos à direita (max 2, 280px); títulos de coluna (nível 2) em negrito.
- [ ] theme check; commit.

### Task 4: Card de produto estilo Gymshark

**Files:** Modify: `snippets/card-product.liquid`; Create: `snippets/chase-card-badges.liquid`, `snippets/chase-card-swatches.liquid`, `assets/chase-card.css`; Modify `sections/main-collection-product-grid.liquid` e `featured-collection.liquid` defaults (`show_secondary_image: true`, `quick_add: standard`, `image_ratio: portrait`).

**Interfaces:**
- `{% render 'chase-card-badges', product: card_product %}` → NOVO se `product.tags` contém `settings.chase_new_tag` (case-insensitive); `-X%` se `compare_at_price > price` (X = `(compare_at_price - price) * 100 / compare_at_price | round`); ESGOTADO se `product.available == false` (tem prioridade, oculta %).
- `{% render 'chase-card-swatches', product: card_product, max: 5 %}` → procura opção com nome em `cor,color,colour` (downcase); se não houver, não renderiza nada. Para cada valor: `value.swatch.color` ou `value.swatch.image` se existir, senão cor derivada do nome (`value | downcase` como CSS color, fallback `#ccc`); link para `value.variant.url` (ou `product_url?variant=` do primeiro variant com aquele valor). Excedente vira "+N".

- [ ] Criar os dois snippets; substituir badges nativos do Dawn em `card-product.liquid` pelo `chase-card-badges`; renderizar swatches abaixo do título e a cor da variante (`card_product.selected_or_first_available_variant.option1` quando a opção 1 for cor) em cinza.
- [ ] Quick add: manter `quick-add` do Dawn (modal) mas estilizar botão como `+` quadrado no canto inferior direito da imagem; no hover (desktop) ele aparece; no mobile fica sempre visível.
- [ ] `chase-card.css`: sem bordas, título 14px peso 600, preço 14px, preço sale na cor `--chase-accent`, badge preto retangular 11px caixa alta no topo-esquerda.
- [ ] theme check; commit.

### Task 5: Seções da home — hero, tiles, editorial, benefícios, newsletter

**Files:** Create: `sections/chase-hero.liquid`, `sections/chase-category-tiles.liquid`, `sections/chase-editorial-split.liquid`, `sections/chase-benefits.liquid`, `sections/chase-newsletter.liquid`, `assets/chase-sections.css`

Cada seção: schema com `presets` (nome em pt-BR), `color_scheme`, `padding_top/bottom`; placeholders `placeholder_svg_tag` quando sem imagem.

- [ ] `chase-hero`: settings `image`, `image_mobile`, `video` (video type), `overlay_opacity` (0–80), `height` (`small|medium|full`), `heading`, `subheading`, `button_label_1/link_1`, `button_label_2/link_2`, `text_position` (`bottom-left|center|bottom-center`). Título `clamp(40px, 7vw, 96px)` caixa alta peso 900. `<picture>` com `media="(max-width:749px)"` para mobile. Primeira imagem `loading: eager`, `fetchpriority: high`.
- [ ] `chase-category-tiles`: heading + link "Ver tudo"; blocos `tile` (`image`, `title`, `subtitle`, `link`); `columns_desktop` 2–4; mobile carrossel horizontal com `scroll-snap-type: x mandatory`, tiles 75vw. Título sobreposto no canto inferior esquerdo, gradiente escuro.
- [ ] `chase-editorial-split`: 2 blocos `panel` (image, heading, text, button_label, link); lado a lado desktop, empilhado mobile; proporção 4/5.
- [ ] `chase-benefits`: blocos `benefit` (icon select: truck/return/lock/price-tag, text); linha com 3–4 itens, scheme-2.
- [ ] `chase-newsletter`: form `{% form 'customer' %}` com `contact[tags]=newsletter`, heading, text, sucesso/erro via `form.posted_successfully?`/`form.errors`; scheme-3 default.
- [ ] theme check; commit.

### Task 6: Carrossel de produtos com abas

**Files:** Create: `sections/chase-product-tabs.liquid`, `assets/chase-product-tabs.js`, `assets/chase-carousel.css`

**Interfaces:** custom element `<chase-tabs>`: botões `[role=tab][aria-controls]` alternam painéis `[role=tabpanel]` (`hidden`); `<chase-carousel>`: contém `.chase-carousel__track` (scroll-snap) e botões `[data-dir="prev|next"]` que rolam `track.clientWidth * 0.9`; desabilita botão nas extremidades.

- [ ] Seção: `heading`, `products_to_show` (4–16, default 12), `columns_desktop` (3–5, default 4), blocos `tab` (`title`, `collection`). Cada painel renderiza `card-product` com `show_secondary_image: true`, `quick_add: 'standard'`, `section_id`. Coleção vazia/nula → 4 cards placeholder só em `request.design_mode`, nada fora dele.
- [ ] JS: teclado ←/→ entre abas (ARIA tabs), `aria-selected`.
- [ ] Abas: texto caixa alta, aba ativa sublinhada 2px.
- [ ] theme check; commit.

### Task 7: Template da home

**Files:** Modify: `templates/index.json`

- [ ] Ordem: `chase-hero` → `chase-product-tabs` (Mais vendidos / Novidades) → `chase-category-tiles` (Leggings/Tops/Shorts/Casual) → `chase-editorial-split` → `chase-product-tabs` ("Popular agora") → `chase-newsletter` → `chase-benefits`. Textos pt-BR. Coleções apontando para handles da loja: `mais-vendidos`, `novidades`, `leggings`, `tops`, `casual-shorts`, `casual` (lojista ajusta no editor).
- [ ] theme check; commit.

### Task 8: Coleção — filtros em drawer + carregar mais

**Files:** Modify: `templates/collection.json`, `templates/search.json`, `sections/main-collection-product-grid.liquid`; Create: `snippets/chase-load-more.liquid`, `assets/chase-load-more.js`, `assets/chase-collection.css`

**Interfaces:** `{% render 'chase-load-more', paginate: paginate %}` → botão `<chase-load-more data-next-url="{{ paginate.next.url }}">` só se `paginate.next`; JS faz `fetch(nextUrl + '&section_id=' + sectionId)`, extrai `#product-grid > li`, anexa ao grid, atualiza `data-next-url` (ou remove botão), e mostra "Mostrando X de Y".

- [ ] `collection.json`: `filter_type: "drawer"`, `columns_desktop: 4`, `columns_mobile: "2"`, `products_per_page: 24`, `image_ratio: "portrait"`, `show_secondary_image: true`, `quick_add: "standard"`.
- [ ] No grid, trocar `{% render 'pagination' %}` pelo `chase-load-more` (manter pagination em `<noscript>`).
- [ ] Banner da coleção: título caixa alta grande à esquerda + contador `collection.products_count` produtos.
- [ ] theme check; commit.

### Task 9: Página de produto

**Files:** Modify: `sections/main-product.liquid`, `templates/product.json`; Create: `snippets/chase-installments.liquid`, `snippets/chase-sticky-atc.liquid`, `assets/chase-sticky-atc.js`, `sections/chase-complete-look.liquid`, `assets/chase-product.css`

**Interfaces:**
- bloco `chase_installments` em main-product (settings `max_installments` 1–12 default 6, `min_installment` default 50): n = min(max, floor(price / (min*100))), n≥2 → "ou {n}x de {price/n | money} sem juros".
- `<chase-sticky-atc>`: observa `.product-form__submit` via IntersectionObserver; quando fora da tela (só `max-width: 749px`) mostra barra fixa inferior com título, preço e botão que dispara `click()` no submit real; esgotado → botão desabilitado com "Esgotado".
- `chase-complete-look`: `product.metafields.custom.complete_the_look.value` (lista de produtos); se `blank`, `{%- liquid ... -%}` sai sem markup; senão carrossel `chase-carousel` com `card-product`.

- [ ] `product.json`: `gallery_layout: "stacked"`, `media_size: "large"`, `mobile_thumbnails: "hide"`, blocks: title, price, chase_installments, variant_picker (`picker_type: "button"`, `swatch_shape: "square"`), popup "Guia de tamanhos", buy_buttons (`show_dynamic_checkout: false`), collapsible_tab ×3 (Descrição / Composição e cuidados / Trocas e devoluções), share; seções depois: `chase-complete-look`, `related-products`.
- [ ] CSS: galeria stacked em grid 2 colunas no desktop (`.product__media-list { display:grid; grid-template-columns:1fr 1fr; gap:4px }`, primeira imagem ocupa 2 colunas opcional off); coluna de info sticky `top: calc(var(--header-height,80px) + 16px)`; tamanhos em botões quadrados 48px; esgotados com risco diagonal; botão ATC 56px full-width preto.
- [ ] Criar metafield? Não — documentar no README que o lojista cria a definição `custom.complete_the_look` (lista de produtos).
- [ ] theme check; commit.

### Task 10: Carrinho (frete grátis) + rodapé + locales

**Files:** Modify: `snippets/cart-drawer.liquid`, `sections/main-cart-items.liquid`, `sections/footer-group.json`, `locales/pt-BR.json`, `locales/en.default.json`; Create: `snippets/chase-free-shipping.liquid`, `assets/chase-footer.css`

**Interfaces:** `{% render 'chase-free-shipping', cart: cart %}` → threshold_cents = `settings.chase_free_shipping_threshold | times: 100`; se `threshold <= 0` não renderiza; restante = threshold - `cart.total_price`; restante ≤ 0 → "Você ganhou frete grátis!" com barra 100%; senão "Faltam {money} para frete grátis" com barra `total*100/threshold`%. Renderizado no topo do drawer; como o drawer é re-renderizado pelas section rendering APIs do Dawn, atualiza sozinho.

- [ ] Snippet + inclusão no drawer e na página do carrinho.
- [ ] Footer: 4 blocos link_list (Ajuda, Minha conta, Institucional, Lojas), newsletter off, social on, country selector on, payment icons on, scheme-2; CSS títulos caixa alta 13px peso 700.
- [ ] Strings `chase.*` em pt-BR e en.
- [ ] `README.md` do projeto: como rodar `theme dev`, push não publicado, criar menus/metafield.
- [ ] theme check; commit.

### Task 11: Verificação e deploy não publicado

- [ ] `shopify theme check` final → 0 erros.
- [ ] Usuário autentica: `shopify theme dev --store chasebrasil.myshopify.com` (login interativo).
- [ ] Verificar em 1440px e 390px: home (hero, abas, tiles), mega-menu, drawer mobile, coleção (filtros, carregar mais), produto (swatches, tamanhos, sticky ATC, parcelamento), carrinho (barra frete) e os 5 itens do Review Focus.
- [ ] `shopify theme push --unpublished --theme "Chase Gymshark"` e passar o link de preview ao usuário.
