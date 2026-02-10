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

    #stopUnindexAlphabet = () =>{
        if(this.newIndex > Cesar.#options.alphabet.length - 1) this.newIndex = this.newIndex - Cesar.#options.alphabet.length
        if(this.newIndex < 0) this.newIndex = Cesar.#options.alphabet.length + this.newIndex
    }

    crypt = _mot =>{
        let crypted = ""
        for (let i = 0; i < _mot.length; i++) {
        let index = Cesar.#options.alphabet.findIndex(l => l == _mot[i].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))

       if(index !== -1) {
        this.newIndex = index + Cesar.#options.key
        this.#stopUnindexAlphabet()
        crypted += Cesar.#options.alphabet[this.newIndex]
       }else{
        crypted += _mot[i]
       } 

    }

        return crypted
    }   

    decrypt = _mot =>{

        let crypted = ""
        for (let i = 0; i < _mot.length; i++) {
        let index = Cesar.#options.alphabet.findIndex(l => l == _mot[i].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
   
       if(index !== -1) {
        this.newIndex = index - Cesar.#options.key
        
        this.#stopUnindexAlphabet()

        crypted += Cesar.#options.alphabet[this.newIndex]
       }else{
        crypted += _mot[i]
       } 
        
    }

    return crypted
}


}





function formatDate(_date,_options={}){
    const d = new Date(),
    weekDays = new Map([
        [0,'dimanche'],
        [1,'lundi'],
        [2,'mardi'],
        [3,'mercredi'],
        [4,'jeudi'],
        [5,'vendredi'],
        [6,'samedi']
    ]),
    months = new Map([
        [0,'janvier'], 
        [1,'février'], 
        [2,'mars'], 
        [3,'avril'], 
        [4,'mai'], 
        [5,'juin'], 
        [6,'juillet'], 
        [7,'août'], 
        [8,'septembre'], 
        [9,'octobre'], 
        [10,'novembre'], 
        [11,'décembre']
    ])


    function addZero(_number){
        return _number < 10 ? '0'+ _number : _number
    }

    const mappingVariables = new Map([
        ['{L}', weekDays.get(d.getDay())],
        ['{D}', addZero(d.getDay())],
        ['{d}', addZero(d.getDate())],
        ['{M}', months.get(d.getMonth())],
        ['{m}', addZero(d.getMonth() + 1)],
        ['{Y}', d.getFullYear()],
        ['{y}', d.getYear() - 100],
        ['{h}', addZero(d.getHours())],
        ['{i}', addZero(d.getMinutes())],
        ['{s}', addZero(d.getSeconds())] 
    ])

    let y = _date

    mappingVariables.forEach( (v,k)=>{
        y = y.replaceAll(k,v)
    })
 
    return y
}





(async function(){

    ////////////////////////////////PARAMS////////////////////////////////////
    /**
     * Format vacances jour mois année (ex: 2 avril 2027 => 20427, 23 aout 2025 => 230825)
     */
    const holidays = new Map([
        ['avril',[30426, 220426]],
        ['juin',[10626, 50626]],
        ['juillet', [20726, 300726]]
    ])
    const daysOff = ['dimanche','lundi']
    const openingTime = new Map([ ['morning', [85959, 123000]], ['afternoon', [132959, 180000]] ])
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Retourn true si la date actuelle est un jour férié français (Source API gouvernenment)
     * @returns {boolean}
     */
    const bankHolidays = async () =>{
        let res = await fetch('https://etalab.github.io/jours-feries-france-data/json/metropole/'+formatDate('{Y}')+'.json')
        res = await res.json()
        res = Object.keys(res)
        
        return res.includes(formatDate('{Y}-{m}-{d}'))  
    }


    /**
     * Nous informe si la date actuelle tombe pendant une période de vacances
     * NOTE : Dates à paramétrer dans le MAP 'holidays' plus haut
     * @returns {boolean}
     */
    const isHoliday = () => {
        const dayMonthYear = Number(formatDate("{d}{m}{y}"))
        if( holidays.has(formatDate("{M}")) ){
            return holidays.get(formatDate("{M}"))[0] <= dayMonthYear && dayMonthYear <= holidays.get(formatDate("{M}"))[1]
        }
        return false
    }
    const time = formatDate("{h}{i}{s}")
    const isDayOff = daysOff.includes(formatDate("{L}"))
    const isOpeningTime = (time > openingTime.get('morning')[0]  && time < openingTime.get('morning')[1]) || (time > openingTime.get('afternoon')[0] && time < openingTime.get('afternoon')[1])
    const isLunchTime = openingTime.get('morning')[1] < time > openingTime.get('afternoon')[0]
    const isBankHoliday = await bankHolidays()


        if(isBankHoliday){
            console.log(`férié`)
        }else if(isHoliday()){
            console.log(`Nous sommes en vacances`)
        }else if(isDayOff){
            console.log(`Nous sommes ${formatDate("{L}")}, nous sommes fermés`)
        }else if(isOpeningTime){
            console.log('OUVERT')
        }else if(isLunchTime){
            console.log("C'est midi, bon appétit")
        }else{
            console.log('FERME')
        }

    

})()






    
    










// cesar('coucou', 'decrypt',5)


// cesar('coucou', {
//     mode:'decrypt',
//     key:5
// })


// new cesar().decrypt('lsekhgsie').key(5)

