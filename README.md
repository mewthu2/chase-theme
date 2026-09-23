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
| `sections/chase-complete-look.liquid` | "Complete o look" na página de produto |
| `snippets/chase-installments.liquid` | "ou 6x de R$ X sem juros" |
| `snippets/chase-sticky-atc.liquid` | Barra fixa "Adicionar ao carrinho" no mobile |
| `snippets/chase-load-more.liquid` | "Carregar mais" na coleção |
| `snippets/chase-free-shipping.liquid` | Barra de frete grátis no carrinho |

Os arquivos do Dawn alterados são: `header.liquid`, `header-mega-menu.liquid`, `card-product.liquid`, `main-product.liquid`, `main-collection-product-grid.liquid`, `main-collection-banner.liquid`, `cart-drawer.liquid`, `main-cart-items.liquid` e `layout/theme.liquid`.

## Configuração na loja

1. **Configurações do tema → Chase**: cor de destaque, valor para frete grátis (R$), tag que marca um produto como "NOVO" (padrão `novo`) e link da página de favoritos.
2. **Mega-menu**: monte o menu principal em 3 níveis (item → coluna → links). Para colocar imagens: no editor, vá em Header → *Adicionar bloco* → **Imagem do mega-menu** e preencha "Item do menu" com o título exato do item (ex.: `Roupas`). São no máximo 2 imagens por item.
3. **Complete o look**: em Configurações → Dados personalizados → Produtos, crie a definição `custom.complete_the_look` do tipo **Produto (lista)**. Depois escolha os produtos em cada produto.
4. **Swatches de cor**: aparecem quando o produto tem uma opção chamada `Cor`/`Color`. Os swatches nativos do Shopify (cor ou imagem) são usados automaticamente. Sem eles, o tema tenta deduzir a cor pelo nome (preto, branco, vinho etc.) ou usa a imagem da variante.
5. **Guia de tamanhos**: na página de produto, selecione a página no bloco "Guia de tamanhos".
6. **Rodapé**: escolha os menus dos blocos Ajuda, Minha conta e Institucional.
