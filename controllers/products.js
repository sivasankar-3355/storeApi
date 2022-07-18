const Product = require('../models/product')


const getAllProductsStatic = async(req,res) => {
       throw new Error('testing async errors')
       res.status(200).json({msg: 'get products static'})
}

const getAllProducts = async(req,res) => {
      const queryObject = {}
      const {featured, company, name, sort, fields, numericFilters} = req.query
      if(featured){
              queryObject.featured = featured==='true'?true:false
      }
      if(company){
             queryObject.company = company
      }
      if(name){
             queryObject.name = {$regex: name, $options: 'i'}
      }
      if(numericFilters){
       const operatorMap = {
              '<': '$lt',
              '<=': '$lte',
              '=': '$e',
              '>=': '$gte',
              '>': '$gt'
       }
       const regEx = /\b(<|>|>=|<=|=)\b/g
       let filters = numericFilters.replace(regEx, (match) => `-${operatorMap[match]}-`)
       console.log(filters)
       const options = ['price','rating']
       filters = filters.split(',').forEach((item) => {
             const [field, operator, value] =  item.split('-')
             if(options.includes(field)){
                     queryObject[field] = {[operator]: Number(value)}
             }
       })
       console.log(queryObject)
       
  }
         let result = Product.find(queryObject)
         if(sort){
              let sortList = sort.split(',').join(' ')
              result = result.sort(sortList)
         }else{
             result = result.sort('createdAt')
         }
         if(fields){
             let fieldsList = fields.split(',').join(' ')
             result = result.select(fieldsList)
         }
        
          const page  = Number(req.query.page)
          const limit = Number(req.query.limit)
          const skip  = (page-1)*limit
          result = result.skip(skip).limit(limit)

          

       const products = await result
       res.status(200).json({products, nbHits: products.length})
}

module.exports = {getAllProducts, getAllProductsStatic}

// {price: {$gt: 30}}
//{name: {$regex: searchValue, $options: 'i'}}