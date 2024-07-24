const request = require('supertest')
const app = require('../index')

describe('API Testings',()=>{

// ***************************** USER TESTS ***************************** \\
    // testing registration
    it('POST /api/users/register | Response with valid json', async()=>{
        const response = await request(app).post('/api/users/register').send({
            firstName : 'test',
            lastName : "test",
            email : 'test@gmail.com',
            password : 'test123'
        })
        if(response.body.success){
            expect(response.body.success).toBe(true)
            expect(response.body.message).toBe("User created successfully.")
        }else{
            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe("User already exists.")
        }
    })
    
    // testing user login route
    it('POST /api/users/login | Response with valid json', async()=>{
        const response = await request(app).post('/api/users/login').send({
            email: 'test@gmail.com',
            password: 'test123'
        })
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("User logged in successfully.")
        // token exists
        expect(response.body.token).toBeDefined()
    })

   // testing create vehicles
    it('POST/api/admin/add_vehicles | Response with valid json', async()=>{
        const response = await request(app).post('/api/admin/add_vehicles').send({
            vehicleName : 'test',
            from : "testFrom",
            to : 'testTo',
        })
        if(response.body.success){
            expect(response.body.success).toBe(true)
            expect(response.body.message).toBe("Vehicle added successfully")
        }else{
            expect(response.body.success).toBe(false)
            expect(response.body.success).toBe("Please enter all fields")

        }
    })

    // testing favourites
    it('POST/api/users/create_favourite | Response with valid json', async()=>{
        const response = await request(app).post('/api/users/create_favourite').send({
            userId : '65e02f4e51b7a0134ad41863',
            vehicleId : "65e0344e3adcbae4caea45c0",
        })
        if(response.body.success){
            expect(response.body.success).toBe(true)
            expect(response.body.message).toBe("Added Favourite successfully")
        }else{
            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe("You've already added it")
        }
    })

    // testing get favourite vehicles 
    it('GET/api/users/get_favourite/65e034ad20a93f994699fe6c | Response with valid json', async()=>{
        const response = await request(app).get('/api/users/get_favourite/65e034ad20a93f994699fe6c')
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Favourites Fetched successfully")
    })

    it('POST/api/users/notification | Response with valid json', async()=>{
        const response = await request(app).post('/api/admin/notification/65d31088f6037950004986e6').send({
    
            vehicleId : "65d31088f6037950004986e6",
        })
        console.log(response.body)
        if(response.body.success){
            expect(response.body.success).toBe(true)
            expect(response.body.message).toBe("Notification created successfully")
        }else{
            expect(response.body.success).toBe(false)
            expect(response.body.message).toBe("Server Error")
        }
    })

    // testing get favourite vehicles 
    it('GET/api/users/get_notification | Response with valid json', async()=>{
        const response = await request(app).get('/api/admin/get_notification')
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Notifications Fetched successfully")
    })
    it('GET/api/users/getAdctivatedVehicles | Response with valid json', async()=>{
        const response = await request(app).get('/api/admin/getActivatedVehicles')
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("All vehicles fetched")
    })



// // ***************************** ADMIN TESTS ***************************** \\


//      // testing get all vehicles route  /api/product/get_products
     it('GET/api/admin/get_vehicles | Response with valid json', async()=>{
        const response = await request(app).get('/api/admin/get_vehicles')
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("All vehicles fetched")
    })

    // testing api delet_vehicle
    it('DELETE/api/admin/delete_vehicle/65e0366533b0ba3347b416e9 | Response with valid json', async()=>{
        // console.log(response);
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1ZTAyZjRlNTFiN2EwMTM0YWQ0MTg2MyIsImlhdCI6MTcwOTE5NDg4Mn0.z4zS3nIaL6LhcXsLT0SLRGR1rrwtGPR-gKM5EFrxHH8"
        const response = await request(app).delete('/api/admin/delete_vehicle/65e4686a27f05618d760ab1c').set('Authorization', `Bearer ${token}`);
        expect(response.statusCode).toBe(200)
        expect(response.body).toBeDefined()
        expect(response.body.success).toBe(true)
        expect(response.body.message).toBe("Vehicle deleted successfully")
    })






    

})