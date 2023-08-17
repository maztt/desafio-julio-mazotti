import cardapio from './cardapio.json'
import pagamento from './pagamento.json'

class CaixaDaLanchonete {
    validarItensNoCarrinho (itens) {
        if (itens.length === 0) return 'Não há itens no carrinho de compra!'

        let temCafe = false
        let temSanduiche = false

        for (const item of itens) {
            const [codigo, quantidade] = item.split(',')
            const itemNoCardapio = cardapio[codigo]

            if (!itemNoCardapio) return 'Item inválido!'
            if (quantidade === '0') return 'Quantidade inválida!'

            if (codigo === 'cafe') temCafe = true
            if (codigo === 'sanduiche') temSanduiche = true
        }

        for (const item of itens) {
            if (item.includes('chantily') && !temCafe) return 'Item extra não pode ser pedido sem o principal'
            if (item.includes('queijo') && !temSanduiche) return 'Item extra não pode ser pedido sem o principal'
        }
        
        return null
    }

    calcularValorDoPedido (itens) {
        let valorTotal = 0

        for (const item of itens) {
            const [codigo, quantidade] = item.split(',')
            const itemNoCardapio = cardapio[codigo]
            valorTotal +=
                parseFloat(
                    itemNoCardapio.valor.replace('R$ ', '').replace(',', '.')
                ) * parseInt(quantidade)
        }

        return valorTotal
    }

    formatarValorNoRecibo (valor) {
        return `R$ ${valor.toFixed(2).replace('.', ',')}`
    }

    calcularValorDaCompra (metodoDePagamento, itens) {
        const pedidoValidado = this.validarItensNoCarrinho(itens)
        if (pedidoValidado) return pedidoValidado

        if (!(metodoDePagamento in pagamento)) return 'Forma de pagamento inválida!'

        const valorTotal = this.calcularValorDoPedido(itens)
        
        if (metodoDePagamento === 'dinheiro') {
            const valorDesconto = parseFloat(pagamento.dinheiro.desconto) / 100
            return this.formatarValorNoRecibo(valorTotal - valorTotal * valorDesconto)
        }
        
        if (metodoDePagamento === 'credito') {
            const valorTaxa = parseFloat(pagamento.credito.taxa) / 100 + 1
            return this.formatarValorNoRecibo(valorTotal * valorTaxa)
        }

        return this.formatarValorNoRecibo(valorTotal)
    }
}

export { CaixaDaLanchonete }
