# Chase Theme — Design Spec (estilo Gymshark)

Data: 2026-09-23

## Objetivo

Criar um novo tema Shopify para a loja CHASE (https://chasebrasil.com — roupas fitness,
PT-BR, BRL, ~1.250 produtos) com layout, comportamento e estética muito próximos de
https://row.gymshark.com, usando a identidade própria da Chase (logo, fotos e textos
da Chase; nenhum ativo da Gymshark).

**Sucesso:** o tema roda como tema não publicado na loja atual, com produtos/coleções
reais, e a navegação/visual é reconhecidamente "estilo Gymshark"; tudo configurável no
editor de temas; apps atuais (Judge.me, WhatsApp) continuam funcionando.

## Decisões

- **Base:** Dawn oficial mais recente, limpo (`shopify theme init`), não o tema atual.
- **Customização:** seções/snippets/CSS novos com prefixo `chase-` sempre que possível,
  deixando o núcleo do Dawn intacto para facilitar manutenção. Onde for necessário
  alterar arquivos do Dawn (header, card de produto, main-product), as alterações
  ficam concentradas e documentadas.
- **Idioma:** textos padrão em PT-BR (`locales/pt-BR.json` do Dawn + chaves novas).
- **Deploy:** `shopify theme push --unpublished` para a loja chasebrasil. O usuário
  publica manualmente.

## Estilo global

- Paleta: preto `#000`, branco `#fff`, cinzas neutros; cor de destaque (sale) configurável.
- Tipografia: títulos em fonte condensada/pesada da biblioteca Shopify (padrão
  sugerido: Archivo / Barlow Condensed), caixa alta, tracking leve; corpo em sans limpa.
  Ambas configuráveis em Theme settings.
- Botões: preto sólido, texto branco caixa alta; hover invertido. Raio configurável.
- Grid/espaçamento generoso, imagens de borda a borda.

## Componentes

### 1. Barra de anúncios (`chase-announcement-bar`)
- Blocos de mensagem (texto + link opcional); rotação automática com fade/slide;
  setas opcionais; cores configuráveis.

### 2. Header (`header` customizado)
- Desktop: menu principal à esquerda, logo centralizado, ícones à direita
  (busca, conta, favoritos com link configurável, carrinho com contador).
- Mega-menu full-width no hover/focus: colunas vindas do menu Shopify (nível 2 = título
  da coluna, nível 3 = links) + até 2 blocos de imagem promocional por item de menu
  (bloco `promo` associado ao título do item).
- Sticky inteligente: esconde ao rolar para baixo, reaparece ao rolar para cima.
- Mobile: hamburger → drawer com navegação por níveis (slide), ícones busca/carrinho.
- Busca: overlay com predictive search do Dawn.

### 3. Home — seções novas
1. `chase-hero`: imagem ou vídeo (desktop + mobile), overlay configurável, título
   gigante, subtítulo, até 2 botões, alinhamento configurável.
2. `chase-product-tabs`: carrossel de produtos com abas; cada bloco = aba
   (título + coleção). Setas no desktop, swipe/scroll-snap no mobile.
3. `chase-category-tiles`: blocos com imagem, título sobreposto, texto
   ("A partir de R$X"), link. 2–4 por linha desktop, carrossel no mobile.
4. `chase-editorial-split`: 2 imagens lado a lado com título/CTA sobrepostos.
5. `chase-newsletter`: fundo escuro, título, texto, formulário de cliente Shopify.
6. `chase-benefits`: faixa com ícones/textos (frete, trocas, parcelamento).

### 4. Card de produto (`card-product` customizado)
- Imagem retrato (proporção configurável), troca para 2ª imagem no hover.
- Badges: NOVO (tag configurável), % desconto, ESGOTADO.
- Título, cor/variante, preço + preço riscado.
- Swatches de cor (a partir da opção "Cor"/"Color"; usa swatches nativos do Shopify
  quando existirem, senão cor por nome/fallback) — clique troca imagem/link.
- Quick add: botão sobre a imagem abre seleção de tamanhos inline; adiciona via
  Cart API e abre o cart drawer.

### 5. Coleção
- Cabeçalho com título, descrição curta e contador de produtos.
- Filtros nativos (Search & Discovery) em drawer lateral em todas as larguras;
  ordenação em dropdown.
- Grid 2 col mobile / 4 col desktop; "Carregar mais" (fetch da próxima página).

### 6. Produto (`main-product` customizado)
- Desktop: galeria em grade de 2 colunas à esquerda; coluna de info sticky à direita.
  Mobile: carrossel com scroll-snap e indicadores.
- Info: título, preço, parcelamento (texto configurável, ex. "ou 6x de R$X sem juros"),
  swatches de cor, tamanhos em botões (esgotados riscados), link do guia de tamanhos
  (abre modal com conteúdo de página), botão "ADICIONAR AO CARRINHO".
- Acordeões (blocos collapsible do Dawn restilizados).
- Área para app block (Judge.me estrelas/reviews).
- "Complete o look" (produtos de um metafield `custom.complete_the_look`, lista de
  produtos; se vazio, seção oculta) + produtos recomendados do Dawn.
- Barra sticky de add-to-cart no mobile quando o botão principal sai da tela.

### 7. Carrinho
- Cart drawer do Dawn restilizado + barra de progresso para frete grátis
  (valor configurável em Theme settings, em BRL).

### 8. Rodapé
- Colunas de menus (blocos), newsletter opcional, redes sociais, seletor de
  país/moeda, ícones de pagamento, copyright. Fundo claro/escuro configurável.

## Fora de escopo
- Wishlist funcional (apenas ícone com link configurável para app).
- Blog/página de lojas estilizados além do Dawn padrão.
- Migração de conteúdo/imagens do tema atual.

## Testes / verificação
- `shopify theme check` sem erros.
- `shopify theme dev` na loja: verificar home, coleção, produto, carrinho, busca,
  em desktop e mobile (390px), incluindo quick add, filtros, carregar mais,
  mega-menu e drawer mobile.
- Verificar que app blocks (Judge.me) podem ser adicionados na página de produto.
