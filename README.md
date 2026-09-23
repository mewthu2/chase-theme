# Chase Theme

Tema Shopify da CHASE (chasebrasil.com). É baseado no **Dawn 16.0.0** e segue o estilo das grandes lojas fitness: preto e branco, títulos pesados em caixa alta, mega-menu, hero em tela cheia e carrosséis com abas.

## Desenvolvimento

```bash
# preview local conectado à loja (faz login no navegador)
shopify theme dev --store chasebrasil.myshopify.com

# validar
shopify theme check

# enviar como tema NÃO publicado
shopify theme push --unpublished --store chasebrasil.myshopify.com
```

## O que é da Chase (prefixo `chase-`)

| Arquivo | O que faz |
|---|---|
| `assets/chase.css` | Estilo global (tipografia, botões) |
| `assets/chase-header.css/js` | Header, mega-menu que abre ao passar o mouse, barra de anúncios |
| `assets/chase-card.css`, `snippets/chase-card-*.liquid` | Card de produto: selos NOVO/-%/ESGOTADO, swatches de cor, compra rápida |
| `sections/chase-hero.liquid` | Hero em tela cheia (imagem, vídeo ou imagem mobile) |
| `sections/chase-product-tabs.liquid` | Carrossel de produtos com abas |
| `sections/chase-category-tiles.liquid` | Tiles de categoria |
| `sections/chase-editorial-split.liquid` | Banner duplo |
| `sections/chase-newsletter.liquid` | Newsletter com fundo escuro |
| `sections/chase-benefits.liquid` | Faixa de benefícios |
| `snippets/chase-complete-look.liquid` | Bloco "Complete o look" nas informações do produto |
| `snippets/chase-installments.liquid` | "ou 6x de R$ X sem juros" |
| `snippets/chase-sticky-atc.liquid` | Barra fixa "Adicionar ao carrinho" no mobile |
| `snippets/chase-load-more.liquid` | "Carregar mais" na coleção |
| `snippets/chase-free-shipping.liquid` | Barra de frete grátis no carrinho |

Os arquivos do Dawn alterados são: `header.liquid`, `header-mega-menu.liquid`, `card-product.liquid`, `main-product.liquid`, `main-collection-product-grid.liquid`, `main-collection-banner.liquid`, `cart-drawer.liquid`, `main-cart-items.liquid` e `layout/theme.liquid`.

## Configuração na loja

- **Header**: o padrão agora é logo em cima e menu embaixo (Header → Posição do logo → "Superior centralizado"). Se quiser voltar ao menu com logo no meio da mesma linha, escolha "Centro, meio". O header fica **transparente no topo da home** quando a primeira seção é o *Chase: Hero* e ganha fundo branco ao rolar, passar o mouse ou abrir o menu. Isso se configura em Header → "Chase: header transparente".
- **Compra rápida**: produtos com a opção `Tamanho`/`Size` mostram os tamanhos ao passar o mouse no card (desktop), e um clique já adiciona ao carrinho. No celular aparece um ícone de sacola que abre os tamanhos. Produtos sem opção de tamanho usam a compra rápida padrão do Dawn.
- **Preço**: o código da moeda (BRL) está desligado em Configurações do tema → Formato de moeda.

1. **Configurações do tema → Chase**: cor de destaque, valor para frete grátis (R$), tag que marca um produto como "NOVO" (padrão `novo`) e link da página de favoritos.
2. **Mega-menu**: monte o menu principal em 3 níveis (item → coluna → links). Para colocar imagens: no editor, vá em Header → *Adicionar bloco* → **Imagem do mega-menu** e preencha "Item do menu" com o título exato do item (ex.: `Roupas`). São no máximo 2 imagens por item.
3. **Complete o look**: é um bloco dentro das informações do produto (*Chase: Complete o look*). Em Configurações → Dados personalizados → Produtos, crie a definição `custom.complete_the_look` do tipo **Produto (lista)**. Depois escolha os produtos em cada produto.
4. **Swatches de cor**: aparecem quando o produto tem uma opção chamada `Cor`/`Color`. Os swatches nativos do Shopify (cor ou imagem) são usados automaticamente. Sem eles, o tema tenta deduzir a cor pelo nome (preto, branco, vinho etc.) ou usa a imagem da variante.
5. **Guia de tamanhos**: na página de produto, selecione a página no bloco "Guia de tamanhos".
6. **Rodapé**: escolha os menus dos blocos Ajuda, Minha conta e Institucional.
