function criarCardProduto(produto) {
    return `
        <div class="card-wrapper">
            <div class="card product-card">
                <div class="img-box">
                    <img src="${produto.imagem}" alt="${produto.alt}">
                </div>
                <div class="info-box">
                    <h3>${produto.nome}</h3>
                    <h4>R$ ${produto.preco}</h4>
                </div>
            </div>
        </div>
    `;
}

function criarCardLogo(logo) {
    const widthAttr = logo.logoWidth ? `width="${logo.logoWidth}"` : '';
    return `
        <div class="card-wrapper">
            <div class="card brand-card ${logo.estilo}">
                <div class="brand-logo">
                    <img ${widthAttr} src="${logo.logo}" alt="logo ${logo.marca.toLowerCase()}">
                </div>
                <div class="brand-info">
                    <h3>${logo.marca}<br>${logo.linha}</h3>
                </div>
            </div>
        </div>
    `;
}

function criarCard(item) {
    if (item.tipo === 'logo') {
        return criarCardLogo(item);
    } else if (item.tipo === 'produto') {
        return criarCardProduto(item);
    }
    return '';
}

function gerarLinhaCards(dados) {
    return dados.map(item => criarCard(item)).join('');
}

function popularTrack(trackElement, dados) {
    if (!trackElement) return;
    trackElement.innerHTML = gerarLinhaCards(dados);
}
