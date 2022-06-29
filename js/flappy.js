//function que cria novo elemento e adiciona um classe passada como paramentro
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

//function que ira criar uma barreira de acordo com a logica
//caso seja false, cria primeiro o corpo
//caso seja true, cria primeiro a borda
function Barreira(reversa = false) {
    this.elemento = novoElemento('div', 'barreira');

    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');
    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);

    this.setAltura = altura => corpo.style.height = `${altura}px`;
}

//fcuntion que cria o par de barreiras do jogo
//as aberturas terão tamanho padrao/
//o que ira mudar serao o tamanho das barreiras
function ParDeBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras');

    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);


    //function que ira sortar as aberturas para que o tamanho das barreiras não sejam iguais sempre
    //Math.random() garante o sorteio, mas que fique dentro do tamanho da div
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.getLargura = () => this.elemento.clientWidth;

    this.sortearAbertura();
    this.setX(x);
}

// const b = new ParDeBarreiras(700, 200, 800)
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

//function que cria as barreiras recebendo os parametros de espaco entre elas
//as barreiras sao criadas em um array
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    //velocidade das barreiras
    //quanto maior, mais rapido
    const deslocamento = 3

    //function que anima as barreiras
    //faz elas se movimentarem
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento);

            // quando o elemento sair da área do jogo aparece novamente 
            //mas com uma altura sorteada pela sortearAbertura()
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length);
                par.sortearAbertura();
            }

            const meio = largura / 2;
            const cruzouOMeio = par.getX() + deslocamento >= meio &&
                par.getX() < meio;
            if (cruzouOMeio) notificarPonto();
        })
    }
}

//function que cria o passaro
function Passaro(alturaJogo) {
    let voando = false

    //instanciando o passaro
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    //movimentacao do passaro
    //qualquer tecla
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    //function que anima o passaro
    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    //instanciando o passaro no meio da tela
    this.setY(alturaJogo / 2)
}

//function que contabiliza os pontos quando o passaro chega ao meio do jogo
function Progresso() {
    this.elemento = novoElemento('span', 'progresso');
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos;
    }

    this.atualizarPontos(0);
}

//function que irá checar se o passaro e as barreiras se sobpoem
function estaoSobrepostos(elementoA, elementoB) {
    const a = elementoA.getBoundingClientRect();
    const b = elementoB.getBoundingClientRect();

    const horizontal = a.left + a.width >= b.left &&
        b.left + b.width >= a.left;
    const vertical = a.top + a.height >= b.top &&
        b.top + b.height >= a.top;
    return horizontal && vertical;
}

//function que checa se o passaro colide com as barreiras
function colidiu(passaro, barreiras) {
    let colidiu = false
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            const superior = parDeBarreiras.superior.elemento;
            const inferior = parDeBarreiras.inferior.elemento;
            colidiu = estaoSobrepostos(passaro.elemento, superior) ||
                estaoSobrepostos(passaro.elemento, inferior);
        }
    })

    return colidiu;
}

//function para criar o jogo
function FlappyBird() {
    let pontos = 0;

    const areaDoJogo = document.querySelector('[wm-flappy]');
    const altura = areaDoJogo.clientHeight;
    const largura = areaDoJogo.clientWidth;

    //instanciando progresso e barreiras
    const progresso = new Progresso();
    const barreiras = new Barreiras(altura, largura, 200, 400,
        () => progresso.atualizarPontos(++pontos));

    //instanciando passaro
    const passaro = new Passaro(altura);

    //inserindo elementos na tela
    areaDoJogo.appendChild(progresso.elemento);
    areaDoJogo.appendChild(passaro.elemento);
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));

    this.start = () => {
        //loop do jogo
        const temporizador = setInterval(() => {
            barreiras.animar();
            passaro.animar();

            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador);
            }
        }, 20)
    }

}

new FlappyBird().start();