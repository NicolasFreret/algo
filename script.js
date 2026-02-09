/**
 * 1/entre un mot
 * 2/récupérer chaque lettre du mot 
 * 3/alphabet en array
 * 4/associer chaque lettre à son index dans l'alphabet
 * 5/changer l'index
 * 6/afficher le message
 * 
 * 
 * 
 * 
 */


function trouveIndex(_array, _indice){
    for (let index = 0; index < _array.length; index++) {
        if(_array[index] === _indice) return index
    }
}


function cesar(_motAcrypter,_options = {}){

    const options = {
        mode:'crypt',
        key:1,
        ..._options
    }

    if( options.mode != "crypt" && options.mode != "decrypt") throw new Error("Choose crypt OR decrypt")
    
    const alphabet = [...'abcdefghijklmnopqrstuvwxyz']
    const key = options.key > alphabet.length - 1 ? alphabet.length - 1 : options.key 
    let crypted =''
    for (let i = 0; i < _motAcrypter.length; i++) {
       let index = trouveIndex(alphabet, _motAcrypter[i].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
       if(index !== undefined) {
        let newIndex = options.mode == "crypt" ? index + key : options.mode == "decrypt" ? index - key : ''
        if(newIndex > alphabet.length - 1) newIndex = newIndex - alphabet.length
        if(newIndex < 0) newIndex = alphabet.length + newIndex

        crypted += alphabet[newIndex]
       }else{
        crypted += _motAcrypter[i]
       } 
    }

    return crypted
}

let f = cesar("zorro",{
    key:-27
})

let u = cesar("etwwt",{
    key:-27,
    mode:'decrypt'
})

console.log(f,u)


class Cesar{

     static #options = {
        mode:'crypt',
        key:1,
        alphabet : [...'abcdefghijklmnopqrstuvwxyz']
    }


    key = (_key) =>{
        if(typeof(_key) != 'number'){
            throw new Error('need a number')
        }
        Cesar.#options.key = _key
        return this

    }

    crypt = _mot =>{
        let crypted = ""
        for (let i = 0; i < _mot.length; i++) {
        let index = Cesar.#options.alphabet.findIndex(l => l == _mot[i].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

       if(index !== -1) {
        let newIndex = Cesar.#options.mode == "crypt" ? index + Cesar.#options.key : Cesar.#options.mode == "decrypt" ? index - Cesar.#options.key : ''
        if(newIndex > Cesar.#options.alphabet.length - 1) newIndex = newIndex - Cesar.#options.alphabet.length
        if(newIndex < 0) newIndex = Cesar.#options.alphabet.length + newIndex

        crypted += Cesar.#options.alphabet[newIndex]
       }else{
        crypted += _mot[i]
       } 

    }

    return crypted
}


}

console.log(new Cesar().key(5).crypt('coucou'))



// cesar('coucou', 'decrypt',5)


// cesar('coucou', {
//     mode:'decrypt',
//     key:5
// })


// new cesar().decrypt('lsekhgsie').key(5)

