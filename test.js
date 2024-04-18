// const text = "wristwatches less than 20000"
// console.log(arrayText)




function checkInput(text){
    let keyArray = []
    let keyString= ""
    const arrayText = text.split(" ")
    for (element of arrayText) {
         if (element.match(/\d+/g)) element = (+element)
        keyArray.push(element)
        keyString = keyString + element + " "
      }
      console.log(keyString)
}

// checkInput("wristwatches less than 20000")

const operatorMap = {
    '>': '$gt',
    '>=': '$gte',
    '=': '$eq',
    '<': '$lt',
    '<=': '$lte',
}
let text = "price > 2000"
const regEx = /\b(<|>|>=|=|<=)\b/g
const regex = /\B>|<\B/g
let filters = text.replace(regex, (match) => {
    return `-${operatorMap[match]}-`
})
// console.log(filters)
const options = ['price', 'rating'];
console.log(text.match(regEx))

if (operatorMap['&&']) console.log(true)

// filters = filters.split(',').forEach(item => {
//     // price-$gt-40 rating-$gte-4
//     const [field, operator, value] = item.split('-');
//     // price $gt 40
//     if(options.includes(field)){
//         queryObject[field] = {[operator] : Number(value)}
//     }
// })


