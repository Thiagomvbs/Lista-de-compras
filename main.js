let listaDeItens = [];
let itemAEditar

const form = document.getElementById('forms-itens');
const inputItem = document.getElementById('receber-item');
const inputQuantidade = document.getElementById('receber-quantidade');
const inputValor = document.getElementById('receber-valor');
const ulItens = document.getElementById('lista-itens');
const ulItensComprados = document.getElementById('itens-comprados');
const ulItensValores = document.getElementById('itens-valores');
const listaRecuperada = localStorage.getItem('listaDeItens');

function atualizaLocalStorage() {
    localStorage.setItem('listaDeItens', JSON.stringify(listaDeItens))
}

if(listaRecuperada){
    listaDeItens= JSON.parse(listaRecuperada);
    mostraItem()
} else {
    listaDeItens= []
}

form.addEventListener('submit', (evento) => {
    evento.preventDefault()
    salvarItem()
    mostraItem()
})

function salvarItem() {
    const quantidadeItem = parseInt(inputQuantidade.value);
    const removeCifrao = inputValor.value.replace(/[^\d,]+/g, '').replace(',','.');
    const valorItem = parseFloat(removeCifrao) 

    const comprasItem = inputItem.value;
    const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase())

    if(checarDuplicado){
        alert('Este item já existe na lista')
    } else {
    listaDeItens.push({
            valor : comprasItem,
            checar : false,
            quantidade : quantidadeItem,
            preco : valorItem
        })
    }
    console.log(valorItem)
    inputQuantidade.value = '';
    inputItem.value = '';
    inputValor.value = '';
}

function mostraItem(){
    ulItens.innerHTML = '';
    ulItensComprados.innerHTML = '';
    ulItensValores.innerHTML = '';
    listaDeItens.forEach((item, index) => {

        if(item.checar){
            ulItensComprados.innerHTML += `
            <li class="item-compra" data-value="${index}"> 
                <div>
                    <input type="checkbox" checked class="is-clickable" />
                     <span class="itens-comprados">${item.quantidade}</span>  
                     <span class="itens-comprados-lista is-size-5">${item.valor}</span>
                     <span class="itens-comprados-lista is-size-5">${item.preco}</span>
                </div>
                <div>
                    <i class="fa-solid fa-trash is-clickable deletar"></i>
                </div>
            </li> 
            `
            ulItensValores.innerHTML += `
            <li class="item-compra" data-value="${index}"> 
            <div>
                <input type="checkbox" checked class="is-clickable" /> 
                 <span class="itens-comprados-resultado is-size-5">${item.valor}</span>
                 <span class="itens-comprados is-size-5">Valor total é ${item.preco * item.quantidade}</span>
            </div>
            <div>
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li> 
            `
        } else {
            ulItens.innerHTML += `
            <li class="item-compra" data-value="${index}"> 
            <div>
                <input type="checkbox" class="is-clickable" />
                <span class="itens-comprados">${item.quantidade}</span>  
                <input type="text" class="itens-comprados" value="${item.valor}" ${index !== Number(itemAEditar) ? 'disabled' : ''}></input>
                <span class="itens-comprados">${item.preco}</span>
                
            </div>
            <div>
            ${ index === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                <i class="fa-solid fa-trash is-clickable deletar"></i>
            </div>
        </li> 
            `
        }
    })

    const inputCheck = document.querySelectorAll('input[type="checkbox"]');
    
    inputCheck.forEach(i => {
        i.addEventListener('click', (evento) => {
            const valorElemento =  evento.target.parentElement.parentElement.getAttribute('data-value')
            listaDeItens[valorElemento].checar = evento.target.checked
            mostraItem()
        })
    })

    const deletarObjetos = document.querySelectorAll('.deletar');

    deletarObjetos.forEach(i => {
        i.addEventListener('click', (evento) => {
            const valorElemento = evento.target.parentElement.parentElement.getAttribute('data-value');
            listaDeItens.splice(valorElemento, 1);
            mostraItem()
        })
    })

    const editarObjetos = document.querySelectorAll('.editar');

    editarObjetos.forEach(i => {
        i.addEventListener('click', (evento) => {
           itemAEditar =  evento.target.parentElement.parentElement.getAttribute('data-value')
           mostraItem() 
        })
    })
    atualizaLocalStorage()
}

function salvarEdicao(){
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    listaDeItens[itemAEditar].valor = itemEditado.value;
    itemAEditar = -1;
    mostraItem()
}