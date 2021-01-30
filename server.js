  
const express = require('express')


const app = express()


app.get('/', (req, res) => {

    res.json({
        message: "My Rule Validation API",
        status: 'success',
        data: {
            name: "Abdulrahman Habeeb",
            github: "@Abdulrahman88-c",
            email: "abdulrahmanbolaji88@gmail.com",
            mobile: "09074721412",
            twitter: "@Habeebola2"
        }
    })
})


//middleware functions
app.use(express.json({extended: false}))
const checkContentType = app.use((req, res, next) => {

    if(req.is('*/json') != 'application/json') {

        res.status(400)
        return res.json({ 
            message: 'Invalid JSON payload passed.',
            status: "error",
            data: null
        })
    } else {
        return next()
    }
})




//Helper methods
const equalTo = (a, b) => a == b;
const notEqualTo = (a, b) => a !== b;
const greaterThan = (a, b) => a > b;
const greaterThanOrEqualTo = (a, b) => a >= b;
const contains = (arr, value) => arr.includes(value)

const select = {
    eq: equalTo,
    neq: notEqualTo,
    gt: greaterThan,
    gte: greaterThanOrEqualTo,
    contains,
}


const controller = (req, res) => {

        const {rule , data } = req.body;
        let { field, condition, condition_value } = rule;
    
        if (!rule || !data) {
    
            res.status(400)
            return res.json({ 
                message: (!data && !rule) ? 'rule and data are required' : !rule ? 'rule is required.' : !data ? 'data is required.': null,
                status: "error",
                data: null
            })
        }

        if (typeof rule != 'object') {
            res.status(400)
            return res.json({ 
                message: 'rule should be an object.',
                status: "error",
                data: null
            })
        }
        
        if (!Object.keys(data).includes(field)) {
            res.status(400)
            return res.json({ 
                    message: `${field} is missing from data.`,
                    status: "error",
                    data: null
                })
        }
        const field_value = data[field]

        if(select[condition](field_value, condition_value)){
            res.status(200)
            return res.json({
                  message: `field ${field} successfully validated.`,
                  status: "success",
                  data: {
                    validation: {
                      error: false,
                      field,
                      field_value,
                      condition,
                      condition_value
                    }
                }
            })

        }else {
            res.status(400)
            return res.json({
                  message: `field ${field} failed validation.`,
                  status: "error",
                  data: {
                    validation: {
                      error: true,
                      field,
                      field_value,
                      condition,
                      condition_value
                }
            }
        })
    }
}




//routes
app.post('/validate-rule', checkContentType, controller)

// listen for requests :)

app.listen(3000, () => console.log('App running!'))
  
